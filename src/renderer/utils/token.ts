const key = 'token'
const key2 = 'userInfo'
const key3 = 'uid'
const key4 = 'device_id'
export function getToken() {
  const storge = localStorage.getItem(key)
  if (!storge || ['undefined', 'null'].includes(storge)) {
    return ''
  }
  return storge
}
export const setToken = value => localStorage.setItem(key, value)
export const removeToken = () => localStorage.removeItem(key)

export function getUserInfo() {
   const storge = localStorage.getItem(key2)
   if (!storge || ['undefined', 'null'].includes(storge)) {
     return {
      token:'',
      user_id: ''
     }
   }
   const userInfo = JSON.parse(storge)
   return userInfo
 }
 export const setUserInfo = value => localStorage.setItem(key2, JSON.stringify(value))
 export const removeUserInfo = () => localStorage.removeItem(key2)


export function getUserId() {
   const storge = localStorage.getItem(key3)
   if (!storge || ['undefined', 'null'].includes(storge)) {
     return ''
   }
   return storge
 }
 export const setUserId = value => localStorage.setItem(key3, value)
 export const removeUserId = () => localStorage.removeItem(key3)


 export function getDeviceId() {
   const storge = localStorage.getItem(key4)
   if (!storge || ['undefined', 'null'].includes(storge)) {
     return ''
   }
   return storge
 }
 export const setDeviceId = value => localStorage.setItem(key4, value)
 export const removeDeviceId = () => localStorage.removeItem(key4)

export function generateUUID() {
   var d = new Date().getTime();
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = (d + Math.random()*16)%16 | 0;
       d = Math.floor(d/16);
       return (c=='x' ? r : (r&0x3|0x8)).toString(16);
   });
   return uuid;
}
