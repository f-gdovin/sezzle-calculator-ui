import { Expression } from './Expression';
import { Operator } from './Operator';

test('should print every operand and operator correctly', () => {
    const expression = new Expression();

    expression.append(9);
    expression.append(Operator.PLUS);
    expression.append(8);
    expression.append(Operator.MINUS);
    expression.append(7);
    expression.append(Operator.MULTIPLY);
    expression.append(6);
    expression.append(Operator.DIVIDE);
    expression.append(5);
    expression.append(Operator.DECIMAL_POINT);
    expression.append(4);
    expression.append(Operator.EQUALS);
    expression.append(3);
    expression.append(2);
    expression.append(1);
    expression.append(0);

    expect(expression.toString()).toEqual('9 + 8 - 7 * 6 / 5.4 = 3210');
});

test('should print correctly-formatted output after adding a mixture of minus operators', () => {
    const expression = new Expression();

    expression.append(Operator.MINUS);
    expression.append(1);
    expression.append(Operator.DECIMAL_POINT);
    expression.append(1);
    expression.append(Operator.MINUS);
    expression.append(Operator.MINUS);
    expression.append(2);
    expression.append(Operator.DECIMAL_POINT);
    expression.append(2);
    expression.append(Operator.MINUS);
    expression.append(3);

    expect(expression.toString()).toEqual('-1.1 - -2.2 - 3');

});

test('should correctly clear input and then continue adding', () => {
    const expression = new Expression();

    expect(expression.toString()).toEqual('');

    expression.clear();

    expect(expression.toString()).toEqual('');

    expression.append(3);
    expression.append(Operator.PLUS);
    expression.append(7);

    expect(expression.toString()).toEqual('3 + 7');

    expression.clear();

    expect(expression.toString()).toEqual('');

    expression.append(Operator.MINUS);
    expression.append(3);
    expression.append(Operator.PLUS);
    expression.append(7);

    expect(expression.toString()).toEqual('-3 + 7');
});