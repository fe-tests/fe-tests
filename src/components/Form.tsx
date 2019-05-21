import { h, Component } from "preact";
import { Question } from "../interface";
import questions from '../questions';
import Item from './Item'
declare var run_result: (answers: number[][]) => Promise<boolean[]>;

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
        results: store.results
    }
    onSubmit = (e: Event) => {
        e.preventDefault()
        if (this.state.results) {
            alert(`你的得分为: ${this.state.results.filter(n => n).length * 100 / questions.length}`)
            return;
        }
        run_result(store.answers).then((results) => {
            store.results = results
            this.setState({results})
        })
    }
    onAnswer = (index: number) => (value: number[]) => {
        store.answers[index] = value
        this.setState({answers: store.answers})
    }
    render () {
        const { questions, results } = this.state;
        const answoer_len = store.answers.filter(a => a.length > 0).length
        if (results) {
            alert(`你的得分为: ${results.filter(n => n).length * 100 / questions.length}`)
        }
        return <form onSubmit={this.onSubmit}>
            {questions.map((q, i) => <Item answers={store.answers[i]} index={i} {...q} result={results && results[i]} onAnswer={this.onAnswer(i)} />)}
            <div className="text-center">
                <input type="submit" value="提交" disabled={questions.length != answoer_len}/>
            </div>
        </form>
    }
}