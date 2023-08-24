import { createAction, handleActions } from 'redux-actions'
import { Dispatch } from 'redux'
import { RootState } from './index'
import { setToken,setUserId, getUserInfo, setUserInfo as setLocalUserInfo,
   removeUserInfo as removeLocalUserInfo,removeToken, removeUserInfo,removeUserId,setDeviceId,removeDeviceId } from '../utils/token'

interface IToken {
   access_token: string
   refresh_token_expire_in: number
   token_type: string
   access_token_expire_in: number
   scope: string
   refresh_token: string
}
interface UserInfo {
   token: IToken
   user_id: string
   avatar: string
   device_id: string
   nickname: string
 }

 export interface LoginReducer {
   token: string
   user_id: string
   userInfo: UserInfo
 }

 const initState = (): LoginReducer =>({
   token:'',
   user_id: '',
   userInfo: getUserInfo()
 })

 export const setUserInfo = createAction(
   '设置用户信息',
   (userInfo: UserInfo)=>{
      setLocalUserInfo(userInfo)
      setToken(userInfo.token.access_token)
      localStorage.setItem('refresh_token', userInfo.token.refresh_token);
      setUserId(userInfo.user_id)
      setDeviceId(userInfo.device_id)
      return {userInfo}
   }
 )

 export const resetUserInfo = createAction(
   '重置用户信息',
   ()=>{
     const userInfo ={
         token: {},
         user_id: '',
         avatar: '',
         device_id: '',
         nickname: ''
      }
      removeToken()
      removeUserInfo()
      removeUserId()
      removeDeviceId()
      return {
         userInfo,
         token:'',
         user_id: '' 
      }
   }
 )

//  export const getUserInfo: ()=> any = ()=>{
//    return async (dispatch: Dispatch, getState: () => RootState) =>{
//       // 发送请求
//       const data = {
//          uName:'test',
//          uId: 123
//       }
//       dispatch(setUserInfo(data))
//    }
//  }

 const reducer = handleActions({
   [setUserInfo.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [resetUserInfo.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
 }, initState())

 export default reducer