import { ICalculationRequest } from './Api';
import { Operator } from './Operator';

export type InputCharacter = (number|Operator);

export interface IExpression {
    append(toAppend: InputCharacter): IExpression;

    clear(): IExpression;

    evaluateTo(result: number): IExpression;

    renderOperatorButtonAsDisabled(operator: Operator): boolean;

    renderOperatorButtonAsHeld(operator: Operator): boolean;

    toString(): string;

    wrapAsRequest(): ICalculationRequest;
}

export class Expression implements IExpression {
    private input: InputCharacter[] = [];

    private hangingMinus: boolean = false;
    private hangingDecPt: boolean = false;
    private alrUsedDecPt: boolean = false;

    private wasEvaluated: boolean = false;

    constructor() {
        this.init();
    }

    public clear = (): IExpression => {
        this.init();
        return this;
    }

    public evaluateTo = (result: number): IExpression => {
        this.append(Operator.EQUALS);
        this.append(result);
        this.wasEvaluated = true;
        return this;
    }

    public append = (toAppend: InputCharacter): IExpression => {
        if (this.wasEvaluated) {
            this.clear();
        }
        if (typeof toAppend === 'number') {
            return this.appendOperand(toAppend);
        }
        else {
            return this.appendOperator(toAppend);
        }
    }

    public renderOperatorButtonAsDisabled = (operator: Operator): boolean => {
        let renderButtonAsDisabled: boolean = this.hangingDecPt || this.hangingMinus;

        if (operator === Operator.DECIMAL_POINT) {
            renderButtonAsDisabled = renderButtonAsDisabled || this.alrUsedDecPt;
        }
        return renderButtonAsDisabled;
    }

    public renderOperatorButtonAsHeld = (operator: Operator): boolean => {
        let renderButtonAsHeld: boolean = false;
        if (operator === Operator.MINUS) {
            renderButtonAsHeld = this.hangingMinus;
        } else if (operator === Operator.DECIMAL_POINT) {
            renderButtonAsHeld = this.hangingDecPt;
        }
        return renderButtonAsHeld;
    }

    public wrapAsRequest = (): ICalculationRequest => {
        return { input: this.toString() };
    }

    public toString = (): string => {
        let output: string = '';

        for (let index: number = 0; index < this.input.length; index++) {
            const character: InputCharacter = this.input[index];

            // write numbers and '.' directly
            if (typeof character === 'number' || character === Operator.DECIMAL_POINT) {
                output += character;
            }
            // check whether to write 'minus' separately from following number
            else if (character === Operator.MINUS && this.input.length > index) {
                let writeMinusWithoutRightSpace = false;
                const nextCharacter = this.input[index+1];
                if (typeof nextCharacter === 'number' && nextCharacter as number > 0) {
                    if (index === 0) {
                        writeMinusWithoutRightSpace = true;
                    } else {
                        const prevCharacter = this.input[index-1];
                        writeMinusWithoutRightSpace = typeof prevCharacter !== 'number'
                    }
                }
                output += ` -${writeMinusWithoutRightSpace ? '' : ' '}`;
            }
            else {
                output += ` ${character} `;
            }

        }
        console.log(`Turned '${this.input}' into the following string: '${output}'`)
        return output;
    }

    private init = () => {
        this.input = [];
        this.hangingMinus = false;
        this.hangingDecPt = false;
        this.alrUsedDecPt = false;

        this.wasEvaluated = false;
    }

    private appendOperand = (toAppend: number): IExpression => {
        let value = toAppend;
        if (this.hangingMinus) {
            this.hangingMinus = false;
            value = -value;
        }

        if (this.hangingDecPt) {
            this.doAppend(Operator.DECIMAL_POINT);
            this.hangingDecPt = false;
            this.alrUsedDecPt = true;
        }
        this.doAppend(value);
        return this;
    }

    private appendOperator = (toAppend: Operator): IExpression => {
        this.alrUsedDecPt = false;

        if (toAppend === Operator.DECIMAL_POINT) {
            this.hangingDecPt = this.canStartDecimalPoint();
        }
        else if (toAppend === Operator.MINUS) {
            if (this.willBeHangingMinus()) {
                this.hangingMinus = true;
            } else {
                this.hangingMinus = false;
                this.doAppend(toAppend);
            }
        }
        else {
            this.doAppend(toAppend);
        }
        return this;
    }

    private willBeHangingMinus = (): boolean => {
        return this.input.length === 0 || (this.input.length > 0 && this.input[this.input.length-1] === Operator.MINUS);
    }

    private canStartDecimalPoint = (): boolean => {
        return this.input.length > 0 && typeof this.input[this.input.length-1] === 'number';
    }

    private doAppend = (toAppend: InputCharacter): void => {
        this.input.push(toAppend);
    }
}