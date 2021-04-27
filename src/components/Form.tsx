import { h, Component } from "preact";
import { Question } from "../interface";
import questions from '../questions';
import Item from './Item'

const run_result = async (answers: number[][]) => {
    let keys = [1, 4, 4, 1, 12, 8, 9, 8, 4, 14, 4, 14, 2, 2, 8, 4, 4, 2, 8, 8, 7, 12, 4, 15, 6];
    let result = ''
    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        let my_answer = 0
        for (let j = 0; j < answer.length; j++) {
            my_answer += 1 << answer[j];
        }
        result = (my_answer === keys[i] ? '1' : '0') + result
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
        questions,
        answers: store.answers,
        results: null,
    }
    onSubmit = (e: Event) => {
        e.preventDefault()
        if (this.state.results) {
            alert(`你的得分为: ${this.state.results.filter(n => n).length * 100 / questions.length}`)
            return;
        }
        run_result(store.answers).then((res) => {
            const results = ('0'.repeat(25) + res.toString(2)).slice(-25).split('').map(c => c === '1').reverse()
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
            <div className="text-center">
                <input type="submit" value="提交" disabled={questions.length != answoer_len}/>
            </div>
        </form>
    }
}