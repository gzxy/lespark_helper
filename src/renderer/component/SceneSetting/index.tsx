import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './sceneSetting.scss'
import { getResourcePath } from '../../utils/index'
import { RootState } from '../../store/index'
import { setLiveScreenDirection } from '../../store/live'
const checkScene = getResourcePath('checkScene.png')

const SceneSetting: React.FC = () => {
   const {
    live: {
      isHorizontalScreen
    },
  } = useSelector((s: RootState) => s)
   const dispatch = useDispatch()
   const handleChangeScreen = useCallback(()=>{
      dispatch(setLiveScreenDirection(!isHorizontalScreen))
   },[isHorizontalScreen])
   
  return (
    <div className={styles.sceneSetting}>
      <div className={styles.settingItem}>场景设置</div>
      <div className={styles.settingItem}>
         横屏场景
         <div className={styles.checkBtn} onClick={handleChangeScreen}>
          <img src={ `file://${checkScene}` }  />  切换
         </div>
      </div>
    </div>
  )
}

export default SceneSetting