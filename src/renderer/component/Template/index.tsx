import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './template.scss'
import { updateTemplate, setTemplatePreview } from '../../store/live'
import { RootState } from '../../store/index'
import { getResourcePath } from '../../utils/index'
import { message } from 'antd'


const hideIcon = getResourcePath('hideIcon.png')
const showIcon = getResourcePath('showIcon.png')
const deleteIcon = getResourcePath('deleteIcon.png')

const Template: React.FC = () => {
  console.log('----render Template')
  const {
   live: {
      templateList,
      isLiving
   }
 } = useSelector((s: RootState) => s)
 const dispatch = useDispatch()

  const handleTempShow = useCallback((id)=>{
   console.log('templateList====>', templateList);
   // const temp = templateList.find(e => e.info.id === id)
   // if(temp) {
   //    temp.isHide = !temp.isHide
   // }
   const list = templateList.map( e => {
      const item = { ...e }
      if(e.info.id === id) {
         item.isHide = !item.isHide
      }
      return item
   })
   dispatch(updateTemplate(list))
  },[templateList])

  const handleTempDeleted = useCallback((id) => {
      const list = templateList.filter( e => e.info.id !== id)
      dispatch(updateTemplate(list))
  }, [templateList])

  const handleTempClick = useCallback((temp) => {
   console.log('-------选择素材:', temp);
   if (temp.isHide) {
      message.info('模版素材已隐藏，请重新打开该素材')
      return
   }
   dispatch(setTemplatePreview(temp))
  }, [])

  const templates = useMemo(()=>{
   return (
      templateList.map(item => {
         return (
            <div className={styles.tempItem}  key={item.info.id} onClick={()=>handleTempClick(item)}>
               <div className={styles.tempName}>{ item.name }</div>
               <div className={styles.operationBox}>
                  <img onClick={(e)=>{e.stopPropagation();handleTempShow(item.info.id)}} src={ item.isHide? `file://${hideIcon}`:`file://${showIcon}`} className={styles.operationIcon} />
                  <img onClick={(e)=>{e.stopPropagation();handleTempDeleted(item.info.id)}} src={ `file://${deleteIcon}`} className={styles.operationIcon} />
               </div>
            </div>
         )
      })
   )
  }, [templateList, handleTempShow, handleTempDeleted])
  return (
    <div className={styles.temp}>
      <div className={styles.tempContent}>
         <div className={styles.tempTitle}>素材管理</div>
         <div className={styles.tempBody}>
            { templates }
         </div>
      </div>
    </div>
  )
}

export default Template