import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import login, { LoginReducer } from './login'
import global, { GlobalReducer } from './global'
import live, { LiveReducer } from './live'


export interface RootState {
   login: LoginReducer
   global: GlobalReducer
   live: LiveReducer
 }

 const reducer = combineReducers({
   login,
   global,
   live
 })


const store = createStore(reducer, applyMiddleware(thunk))


export default store