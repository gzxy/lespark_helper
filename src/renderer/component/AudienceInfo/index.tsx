import { FC, useCallback, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Popover, message } from 'antd';
import VirtualList from 'rc-virtual-list';
import cx from 'classnames'
import styles from './audienceInfo.scss'
import { RootState } from '../../store/index'
import { getResourcePath } from '../../utils/index'
import { ILiveViewer, ILiveGift, setLiveViewers } from '../../store/live'
import { setConfirmShow } from '../../store/global'
import apis from '../../services/live'


const settingIcon = getResourcePath('settingIcon.png')
const AudienceInfo: FC = () => {
  console.log('----render LiveTool')
  const {
   live: {
      liveRoomInfo,
      liveViewers,
      liveGifts
   }
 } = useSelector((s: RootState) => s)
 const dispatch = useDispatch()
  const [activedType, setActivedType] = useState(1)
  const [settingShowId, setSettingShowId] = useState('')
  const [giftList1, setgiftLis1t] = useState([])
  const [giftLists, setgiftList] = useState([100,1,1000,22,44,77])

  const handleSelectType = useCallback((type)=>{
   setActivedType(type)
   // if(type === 2) {
   //    dispatch(requestLiveGifts())
   // }
   },[])

   const handleSettingChange = useCallback((e:boolean, id:string)=>{
      setSettingShowId(e ? id : '')
      console.log('handleSettingChange===>', e);
      
   },[])
   const viewerListScroll = useCallback((e)=>{
      console.log('viewerListScroll====>', e);
      
   },[])

   const giftListScroll = useCallback((e)=>{
      console.log('giftListScroll====>', e);
      
   },[])

   const handleConnectViewer = useCallback((viewer:ILiveViewer)=>{
      setSettingShowId('')
      apis.checkVerify({
         user_id: viewer.user_id,
         live_obj_id: liveRoomInfo.live_obj_id
      }).then(res=>{
         if(res.error === 0) {
            if(res.data.is_real_verify && res.data.is_verify) {
               // 此处邀请用户上麦，需要客户端发送 im 消息
            }else{
               message.info('该用户未通过认证')
            }
         }else{
            message.error(res.msg)
         }
         
      })
   }, [settingShowId, liveRoomInfo])

   const handleSetManager = useCallback((viewer:ILiveViewer)=>{
      setSettingShowId('')
      apis.managerFamily({
         user_id: viewer.user_id,
         live_obj_id: liveRoomInfo.live_obj_id,
         action: 0
      }).then(res=>{
         console.log('handleSetManager====<', res);
         if(res.error === 0) {
            const obj = {...viewer, is_family_manager: true }
            updateViewers(obj, liveViewers)
            dispatch(setConfirmShow({
               content: `${viewer.nickname}已被设置为家族管理员`,
               isSingleBtn: true,
               okText: '知道了',
               onOk() {
               },
               onCancel() {
                  console.log('Cancel');
               },
            }))
         } else if(res.error === 23501){
            dispatch(setConfirmShow({
               content: `${viewer.nickname}当前还不是家族成员,无法设置为家族管理员`,
               okText: '邀请加入',
               isSingleBtn: true,
               onOk() {
                  
                  dispatch(setConfirmShow({
                     content: '已发送邀请',
                     isSingleBtn: true,
                     okText: '知道了',
                     onOk() {
                     },
                     onCancel() {
                        console.log('Cancel');
                     },
                  }))
               },
               onCancel() {
                  console.log('Cancel');
               },
             }))
         } else{
            let msg = res.msg
            if(res.data && res.data.toast) {
               msg = res.data.toast
            }
            message.error(msg)
         }
      })
   },[settingShowId, liveRoomInfo, liveViewers])

   const updateViewers = (viewer:ILiveViewer, viewers:ILiveViewer[])=>{
      const list = viewers.map(e=>e)
      const index = list.findIndex(e=>e.user_id === viewer.user_id)
      if(index > -1) {
         list.splice(index, 1, viewer)
         dispatch(setLiveViewers(list)) 
      }
   }

   const cancelSetManager = useCallback((viewer:ILiveViewer)=>{
      setSettingShowId('')
      apis.cancelManagerFamily({
         user_id: viewer.user_id,
         live_obj_id: liveRoomInfo.live_obj_id
      }).then(res=>{
         if(res.error === 0) {
            const obj = {...viewer, is_family_manager: false }
            updateViewers(obj, liveViewers)
            message.info(`已取消${viewer.nickname}的家族管理员身份`)
         }else{
            message.error(res.msg)
         }
      })
   }, [settingShowId, liveRoomInfo, liveViewers])

   const handleReportAudience = useCallback((viewer:ILiveViewer)=>{
      setSettingShowId('')
      dispatch(setConfirmShow({
         content: `确定要举报${viewer.nickname}吗？`,
         okText: '确定',
         cancelText: '取消',
         onOk() {
            apis.reportAudience({
               exposed_id: viewer.user_id,
               room_id: liveRoomInfo.live_obj_id
            }).then(res=>{
               if(res.error === 0) {
                  dispatch(setConfirmShow({
                     content: `已成功举报${viewer.nickname}`,
                     isSingleBtn: true,
                     okText: '知道了',
                     onOk() {
                     },
                     onCancel() {
                        console.log('Cancel');
                     },
                  }))
                  
               }else{
                  let msg = res.msg
                  if(res.data && res.data.toast) {
                     msg = res.data.toast
                  }
                  message.error(msg)
               }
            })
            
         },
         onCancel() {
            console.log('Cancel');
         },
       }))
   },[settingShowId, liveRoomInfo])

   const handleKickingUser = useCallback((viewer:ILiveViewer)=>{
      setSettingShowId('')
      dispatch(setConfirmShow({
         content: `确定要踢出${viewer.nickname}吗？`,
         okText: '确定',
         cancelText: '取消',
         onOk() {
            apis.kickingUser({
               user_id: viewer.user_id,
               live_obj_id: liveRoomInfo.live_obj_id
            }).then(res=>{
               if(res.error === 0) {
                  const list = liveViewers.map(e=>e)
                  const index = list.findIndex(e=>e.user_id === viewer.user_id)
                  if(index > -1) {
                     list.splice(index, 1)
                     dispatch(setLiveViewers(list)) 
                  }
                  dispatch(setConfirmShow({
                     content: `已踢出${viewer.nickname}`,
                     isSingleBtn: true,
                     okText: '知道了',
                     onOk() {
                     },
                     onCancel() {
                        console.log('Cancel');
                     },
                  }))
                  
               }else{
                  let msg = res.msg
                  if(res.data && res.data.toast) {
                     msg = res.data.toast
                  }
                  message.error(msg)
               }
            })
            
         },
         onCancel() {
            console.log('Cancel');
         },
       }))
   },[settingShowId, liveRoomInfo, liveViewers])

   const handleSilence = useCallback((viewer:ILiveViewer)=>{
      setSettingShowId('')
      apis.silenceUser({
         user_id: viewer.user_id,
         live_obj_id: liveRoomInfo.live_obj_id,
         cancel: viewer.isSilence? 1 : 0
      }).then(res=>{
         if(res.error === 0) {
            const obj = {...viewer, isSilence: !viewer.isSilence }
            updateViewers(obj, liveViewers)
         } else{
            let msg = res.msg
            if(res.data && res.data.toast) {
               msg = res.data.toast
            }
            message.error(msg)
         }
      })

   }, [settingShowId, liveRoomInfo, liveViewers])
   
   const settingPopover = useMemo(()=>{
      const viewer = liveViewers.find(e=>e.user_id === settingShowId)
      return (
         <div className={styles.settingPopover}>
            <div className={styles.settingItem} onClick={()=>viewer && handleConnectViewer(viewer)}>邀请连麦</div>
            <div className={styles.settingItem} onClick={()=>{
               viewer && (viewer.is_family_manager? cancelSetManager(viewer) : handleSetManager(viewer))
            }}>{ viewer && viewer.is_family_manager? '取消家族管理员' : '设为家族管理员' } </div>
            <div className={styles.settingItem} onClick={()=>viewer && handleReportAudience(viewer)}>举报</div>
            <div className={styles.settingItem} onClick={()=>viewer && handleSilence(viewer)}>{ viewer && (viewer.isSilence? '取消禁言' : '禁言') || '禁言'} </div>
            <div className={styles.settingItem} onClick={()=>viewer && handleKickingUser(viewer)}>踢出</div>
         </div>
      )
   }, [settingShowId, liveViewers, handleConnectViewer, handleSetManager, handleReportAudience, handleKickingUser, handleSilence])

   const viewerList = useMemo(()=>{

      return (
         <List>
            <VirtualList
               data={liveViewers}
               height={265}
               itemHeight={48}
               itemKey="user_id"
               onScroll={viewerListScroll}
               >
               {(item: ILiveViewer) => (
                  <List.Item key={item.user_id}>
                    <div className={ cx({
                     [styles.viewerItem]: true,
                     [styles.actived]: settingShowId === item.user_id,
                    })}>
                        <div className={styles.viewerInfo}>
                           <img src={ item.avatar }  />
                           <span className={styles.viewerName}>{ item.nickname }</span>
                        </div>
                        <Popover open={ settingShowId === item.user_id } placement="bottomRight" content={settingPopover} trigger="click" onOpenChange={(e)=>{handleSettingChange(e, item.user_id)}}>
                           <img src={`file://${settingIcon}`} className={styles.settingIcon} />
                        </Popover>
                        
                    </div>
                  </List.Item>
               )}
            </VirtualList>
         </List>
      )
   }, [liveViewers, viewerListScroll, handleSettingChange, settingShowId])

   const giftList = useMemo(()=>{
      return (
         <List>
         <VirtualList
            data={liveGifts}
            height={265}
            itemHeight={57}
            itemKey="user_id"
            onScroll={giftListScroll}
            >
            {(item: ILiveGift) => (
               <List.Item key={item.user_id}>
                  <div className={styles.giftItem}>
                     <img className={styles.viewerAvatar} src={ item.avatar }  />
                     <div className={styles.giftInfo}>
                        <div className={styles.viewerName}>
                           {item.nickname}
                        </div>
                        <div className={styles.pointInfo}>
                           贡献<span>{item.lmoney_total}</span>爱豆
                        </div>
                        <div className={styles.giftList}>
                           { item.gift_list.map(items =>{
                              return (
                                 <div className={styles.gift}>
                                    <img className={styles.giftIcon} src={ items.gift_pic }  />
                                    <span className={styles.giftCount}>*{ items.gift_num }</span>
                                 </div>
                              )
                           }) }
                        </div>
                     </div>
                  </div>
               </List.Item>
            )}
         </VirtualList>
      </List>
      )
   },[liveGifts, giftListScroll])

  return (
    <div className={styles.audienceInfo}>
      <div className={styles.tabBox}>
         <div className={cx({
            [styles.tabTypeItem]: true,
            [styles.actived]: activedType === 1,
            })} onClick={()=>handleSelectType(1)}>在线观众{ liveViewers.length > 0 && (<span>{liveViewers.length}</span>)}</div>
         <div className={cx({
            [styles.tabTypeItem]: true,
            [styles.tabTypeGift]: true,
            [styles.actived]: activedType === 2,
            })} onClick={()=>handleSelectType(2)}>礼物记录</div>
      </div>
      <div className={styles.content}>
         { activedType === 1 && viewerList }
         { activedType === 2 && giftList }
      </div>
    </div>
  )
}

export default AudienceInfo