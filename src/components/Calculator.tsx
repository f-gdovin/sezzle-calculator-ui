import { FunctionComponent, useReducer } from 'react';
import { Alert, Button, Grid, Paper, Snackbar, TextField } from '@mui/material';
import Header from './Header';
import { evaluate } from '../service/BackendService';
import { ApiErrorSeverity, hasResult, IApiError, ICalculationRequest } from '../types/Api';
import { InputCharacter } from '../types/Expression';
import { Operator } from '../types/Operator';
import { ApiResponse, ApplicationState, initialApplicationState, ReducerAction, ReducerActionType } from '../state/types';
import applicationState from '../state/reducers/applicationState';
import styles from '../styles.module.css';

const Calculator: FunctionComponent = () => {

    const [state, dispatch] = useReducer<(state: ApplicationState, action: ReducerAction) => ApplicationState>(applicationState, initialApplicationState);

    const handleExpressionAppend = (toAppend: InputCharacter) => {
        dispatch({type: ReducerActionType.EXPRESSION_APPEND, payload: toAppend});
    }

    const handleExpressionClear = () => {
        dispatch({type: ReducerActionType.EXPRESSION_CLEAR, payload: undefined});
    }

    const handleApiResponse = (result: ApiResponse) => {
        const actionToDispatch = hasResult(result)
            ? ReducerActionType.RESULT_SUCCESS
            : ReducerActionType.RESULT_FAILURE;
        dispatch({type: actionToDispatch, payload: result})
    };

    const handleDismissError = () => {
        dispatch({type: ReducerActionType.ERROR_DISMISS, payload: undefined})
    };

    const doEvaluate = () => {
        const request: ICalculationRequest = state.expression.wrapAsRequest();
        console.log(`Sending '${JSON.stringify(request)}' to the backend`);

        evaluate(request)
            .then(handleApiResponse)
            .catch(handleApiResponse);
    }

    const createAlert = () => {
        if (state.error) {
            const error: IApiError = state.error;
            const errorMsg = error.error ?? 'Unknown error, please check the server is running.';

            return <Snackbar open={!!state.error} autoHideDuration={6000} onClose={() => handleDismissError()}>
                <Alert
                    severity={error.severity === ApiErrorSeverity.LOW ? 'warning' : 'error'}
                    onClose={() => handleDismissError()}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        } else {
            return null;
        }
    }

    const createOperandButton = (value: number) => {
        return <Button
            className={styles['full-width']}
            variant='outlined'
            onClick={() => handleExpressionAppend(value)}
            disabled={!!state.error}>
            {value}
        </Button>
    }

    const createOperatorButton = (value: Operator) => {
        const renderAsDisabled = state.expression.renderOperatorButtonAsDisabled(value);
        const renderAsHeld = state.expression.renderOperatorButtonAsHeld(value);

        return <Button
            className={styles['full-width']}
            focusRipple={renderAsHeld}
            sx={(renderAsHeld ? {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                border: '1px solid #1976d2 !important'
            } : {})}
            variant='outlined'
            disabled={!!state.error || renderAsDisabled}
            onClick={() => (value === Operator.EQUALS ? doEvaluate() : handleExpressionAppend(value))}>
            {value}
        </Button>
    }

    return (
        <div className='box'>
            {createAlert()}
            <Paper variant='outlined'>
                <Grid container spacing={1} columns={12}>
                    {/*header logo A.K.A. CLEAR button*/}
                    <Grid item xs={12} sm={12} md={12} key={'header-logo'}>
                        <Header onClick={() => handleExpressionClear()}/>
                    </Grid>

                    {/*text area*/}
                    <Grid item xs={12} sm={12} md={12} key={'expression-box'}>
                        <TextField className={`${styles['full-width']} ${styles['full-height']}`}
                                   id='expression-input'
                                   variant='outlined'
                                   disabled={true}
                                   value={state.expression.toString()}
                                   multiline={true}
                                   rows={3}
                                   inputProps={{style: {fontSize: '4em', lineHeight: '1em'}}}
                        />
                    </Grid>

                    {/*numeric block, decimal point and equals*/}
                    <Grid item xs={9} sm={9} md={9} key={'numpad-1-9-box'}>
                        <Grid container spacing={1}>
                            {/*numeric block 1-9*/}
                            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(value => (
                                <Grid item xs={4} sm={4} md={4} key={value}>
                                    {createOperandButton(value)}
                                </Grid>
                            ))}
                            {/*decimal point*/}
                            <Grid item xs={4} sm={4} md={4} key={'operator-dec-point-box'}>
                                {createOperatorButton(Operator.DECIMAL_POINT)}
                            </Grid>
                            {/*zero*/}
                            <Grid item xs={4} sm={4} md={4} key={'numpad-0-box'}>
                                {createOperandButton(0)}
                            </Grid>
                            {/*equals*/}
                            <Grid item xs={4} sm={4} md={4} key={'operator-equals-box'}>
                                {createOperatorButton(Operator.EQUALS)}
                            </Grid>
                        </Grid>
                    </Grid>

                    {/*operators block*/}
                    <Grid item xs={3} sm={3} md={3} key={'operators-box'}>
                        <Grid container spacing={1}>
                            {[Operator.PLUS, Operator.MINUS, Operator.MULTIPLY, Operator.DIVIDE].map(operator => (
                                <Grid item xs={12} sm={12} md={12} key={operator}>
                                    {createOperatorButton(operator)}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
};
export default Calculator;