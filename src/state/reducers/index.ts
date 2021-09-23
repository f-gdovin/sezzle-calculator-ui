import applicationState from './applicationState'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({expressionValue: applicationState})

export default rootReducer