import { ApplicationState, initialApplicationState, ReducerAction, ReducerActionType } from '../types';
import { IApiError, ICalculationResult } from '../../types/Api';
import { InputCharacter } from '../../types/Expression';

const applicationState = (state: ApplicationState = initialApplicationState, action: ReducerAction): ApplicationState => {
    switch (action.type) {
        case ReducerActionType.EXPRESSION_APPEND:
            return {
                ...state,
                expression: state.expression.append(action.payload as InputCharacter)
            }

        case ReducerActionType.EXPRESSION_CLEAR:
            return {
                ...state,
                expression: state.expression.clear()
            }

        case ReducerActionType.RESULT_SUCCESS:
            const result: ICalculationResult = action.payload as ICalculationResult;
            return {
                ...state,
                expression: state.expression.evaluateTo(result.result),
            }

        case ReducerActionType.RESULT_FAILURE: {
            const error: IApiError = action.payload as IApiError;
            return {
                ...state,
                error: error
            }
        }

        case ReducerActionType.ERROR_DISMISS: {
            return {
                ...state,
                expression: state.expression.clear(),
                error: undefined
            }
        }

        default:
            return state
    }
}

export default applicationState;