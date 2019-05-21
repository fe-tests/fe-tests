import { Question } from '../interface'
import { h, Component } from "preact";

export interface ItemProps extends Question {
    index: number
    result?: boolean
    answers?: number[]
    onAnswer?: (value: number[]) => void
}

interface State {
    answers: Set<number>
}
export default class extends Component<ItemProps, State> {
    state: State = {
        answers: new Set()
    }
    constructor (props: ItemProps) {
        super(props)
        this.state = {
            answers: new Set(props.answers || [])
        }
    }
    onCheck = (v: number) => {
        const { muti, onAnswer } = this.props
        let { answers } = this.state
        if (muti) {
            answers.has(v) ? answers.delete(v) : answers.add(v)
            this.setState({answers})
            onAnswer([...answers].sort())
        } else {
            if (!answers.has(v)) {
                answers = new Set([v])
                this.setState({answers})
                onAnswer([...answers].sort())
            }
        }
    }
    render () {
        const { answers } = this.state
        const { index, question, radios, muti, result } = this.props
        const type = muti ? 'checkbox' : 'radio'
        const _result = result === undefined ? '' : (result ? 'right' : 'wrong')
        return <table>
            <tr>
                <td colSpan={radios.length}>{index + 1}. {question} <span class="ans-holder">(
                    <em class={`result-${_result}`}>{[...answers].sort().map(t => 'ABCDEFG'.charAt(t)).join('')}</em>
                )</span></td>
            </tr>
            <tr>
                {radios.map((r, i) => <td>
                    <label><input type={type} name={`r-${index}`} value={i} checked={answers.has(i)} disabled={!!_result} onClick={() => this.onCheck(i)}/> <span>{r}</span></label>
                </td>)}
            </tr>
        </table>
    }
}
