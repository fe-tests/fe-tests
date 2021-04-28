import { h, Component } from "preact";
import { Question } from "../interface";
import questions from '../questions';
import Item from './Item'

const LEN = questions.length
let enabled = Array(LEN).fill(0).map((a, i) => i)
const is_random = location.search.match(/random=?(\d+)?/)
if (is_random) {
    let [a, _count] = is_random
    let count = Number(_count) || 10
    let new_enabled = []
    while (count-- > 0) {
        let r = Math.floor(Math.random() * enabled.length)
        new_enabled = new_enabled.concat(enabled.splice(r, 1))
    }
    enabled = new_enabled
}

const run_result = async (answers: number[][]) => {
    var ens = [11, 17, 17, 3, 4, 5, 1, 16, 17, 18, 17, 18, 7, 7, 6, 17, 17, 7, 6, 5, 15, 4, 17, 2, 9]
    var keys = document.title.split('').reduce(function(a, c) {
        return a.concat([c.charCodeAt(0) % 16, c.charCodeAt(0) % 10])
    }, [])
    var result = ''
    for (var i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var my_answer = 0
        for (var j = 0; j < answer.length; j++) {
            my_answer += 1 << answer[j];
        }
        result = (my_answer === keys[ens[i]] ? '1' : '0') + result
    }
    return parseInt(result, 2)
}

const STORE_KEY = 'STORE_KEY_FOR_EXAM'
let storeStr = localStorage.getItem(STORE_KEY)
let store = {
    results: undefined,
    answers: []
}
function loop () {
    localStorage.setItem(STORE_KEY, btoa(JSON.stringify(store)))
    window['__STORE_LOCKER__'] = requestAnimationFrame(loop)
}
loop()
if (storeStr) {
    store = JSON.parse(atob(storeStr))
}

interface State {
    questions: Question[]
    answers?: number[][]
    results?: boolean[]
}
export default class extends Component<{}, State> {
    state: State = {
        questions: questions.filter((q, i) => enabled.includes(i)),
        answers: is_random ? [] : store.answers,
        results: is_random ? [] : store.results,
    }
    onSubmit = (e: Event) => {
        e.preventDefault()
        if (this.state.results) {
            alert(`你的得分为: ${this.state.results.filter(n => n).length * 100 / questions.length}`)
            return;
        }
        run_result(store.answers).then((res) => {
            const results = ('0'.repeat(LEN) + res.toString(2)).slice(-LEN).split('').map(c => c === '1').reverse()
            store.results = results
            this.setState({results})
            alert(`你的得分为: ${results.filter(n => n).length * 100 / questions.length}`)
        })
    }
    onAnswer = (index: number) => (value: number[]) => {
        store.answers[index] = value
        this.setState({answers: store.answers})
    }
    render () {
        const { questions, results } = this.state;
        const answoer_len = store.answers.filter(a => a.length > 0).length
        return <form onSubmit={this.onSubmit}>
            {questions.map((q, i) => <Item answers={store.answers[i]} index={i} {...q} result={results && results[i]} onAnswer={this.onAnswer(i)} />)}
            {!is_random && <div className="text-center">
                <input type="submit" value="提交" disabled={questions.length != answoer_len}/>
            </div>}
        </form>
    }
}