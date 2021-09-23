import { IApiError, ICalculationResult } from '../types/Api';
import { Expression, IExpression, InputCharacter } from '../types/Expression';

export type ApiResponse = IApiError | ICalculationResult;

export type ReducerAction = {
    type: ReducerActionType;
    payload: InputCharacter | ICalculationResult | IApiError | undefined;
}

export enum ReducerActionType {
    EXPRESSION_APPEND,
    EXPRESSION_CLEAR,
    RESULT_SUCCESS,
    RESULT_FAILURE,
    ERROR_DISMISS
}

export type ApplicationState = {
    expression: IExpression;
    error?: IApiError;
}

export const initialApplicationState: ApplicationState = {
    expression: new Expression(),
    error: undefined
}