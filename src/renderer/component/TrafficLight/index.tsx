import { FC, useCallback, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMount } from 'ahooks'
import { CloseOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { hideApp, fullApp, minApp, maxApp, isFullApp, isCheckFullApp } from '../../../main/bridge'
import { isMac } from '../../../main/constants'
import { RootState } from '../../store/index'
import styles from './trafficLight.scss'
import { setIsFullApp } from '../../store/global'

const TrafficLight: FC = () => {
   const {
    global: {
      titleBarText,
      isFullWindow
    },
  } = useSelector((s: RootState) => s)
  const dispatch = useDispatch()

  const handleClose = useCallback(()=>{
   hideApp()
  }, [])

  const handleFullApp = useCallback(()=>{
   // console.log('isMac====>', isMac);
   
   if(isMac) {
      fullApp()
   }else {
      maxApp()
   }
   isCheckFullApp()
  },[isMac])

  const handleHide = useCallback(()=>{
   minApp()
  },[])

  const buttons = useMemo(()=>{
   return (
      <div className={styles.btnGroup}>
         <div className={styles.btnItem} onClick={handleHide}>
            <div className={styles.hideIcon}></div>
         </div>
        {!isFullWindow && (<div className={styles.btnItem} onClick={handleFullApp}>
            <div className={styles.fullIcon}></div>
         </div>)}
         { isFullWindow && (
            <div className={styles.btnItem} onClick={handleFullApp}>
             <FullscreenExitOutlined />
          </div>
         )}
         <div className={styles.btnItem} onClick={handleClose}>
            <CloseOutlined />
         </div>
      </div>
   )
  },[handleClose, handleFullApp, handleHide, isFullWindow])

  useMount(()=>{
   isFullApp(isFullScreen => {
      dispatch(setIsFullApp(isFullScreen))
   })
   isCheckFullApp()
  })
   return (
      <div className={styles.trafficLigth}>
         <span className={styles.titleBarText}>{titleBarText}</span>
         <div className={styles.menuHeader}>
            {buttons}
         </div>
      </div>
   )
}

export default TrafficLight