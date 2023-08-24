import { FC, useCallback, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Popover } from 'antd';
import VirtualList from 'rc-virtual-list';
import cx from 'classnames'
import styles from './audienceInfo.scss'
import { RootState } from '../../store/index'
import { getResourcePath } from '../../utils/index'
import { ILiveViewer, ILiveGift } from '../../store/live'


const settingIcon = getResourcePath('settingIcon.png')
const AudienceInfo: FC = () => {
  console.log('----render LiveTool')
  const {
   live: {
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
   
   const settingPopover = useMemo(()=>{
      return (
         <div className={styles.settingPopover}>
            <div className={styles.settingItem}>邀请连麦</div>
            <div className={styles.settingItem}>设为家族管理员</div>
            <div className={styles.settingItem}>举报</div>
            <div className={styles.settingItem}>禁言</div>
            <div className={styles.settingItem}>踢出</div>
         </div>
      )
   }, [])

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
                        <Popover placement="bottomRight" content={settingPopover} trigger="click" onOpenChange={(e)=>{handleSettingChange(e, item.user_id)}}>
                           <img src={`file://${settingIcon}`} className={styles.settingIcon}  />
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