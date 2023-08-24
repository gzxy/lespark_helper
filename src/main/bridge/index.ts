import path from 'path'
import { ipcRenderer, shell } from 'electron'
import { systemCommand } from '../constants/messageCommand'

export const getUserLocale = (cb: (d: string) => void) => {
   ipcRenderer.on('user-locale', (_e, locale) => {
     cb && cb(locale)
   })
   // const locale = 'app.getLocale()';
   // return locale
 }


 export const toGetUserLocale = () => {
   ipcRenderer.send('getLocale')
 }

// 隐藏
export const hideApp = () => {
   ipcRenderer.send(systemCommand.HIDE_APP)
 }

// 最小化
export const minApp = () => {
  ipcRenderer.send(systemCommand.MIN_APP)
}


// 最大化
export const maxApp = () => {
  ipcRenderer.send(systemCommand.MAX_APP)
}

// 全屏
export const fullApp = () => {
  ipcRenderer.send(systemCommand.FULL_APP)
}

export const isCheckFullApp = () => {
  ipcRenderer.send(systemCommand.IS_FULL_APP)
}

export const isFullApp = (cb?: (status: boolean) => void) => {
   ipcRenderer.on(systemCommand.WINDOWS_IS_FULL, (_e, status: boolean) => {
     cb && cb(status)
   })
 }