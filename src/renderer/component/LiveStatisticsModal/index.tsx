import { FC, useCallback, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'antd'
import styles from './liveStatisticsModal.scss'
import { setLiveStatisticsModal } from '../../store/global'
import { RootState } from '../../store/index'
import formatDuration from '../../utils/formatDuration'


const LiveStatisticsModal: FC = () => {
   const {
    global: {
      isLiveStatisticsModalShow
    },
    live: {
      liveRoomStatistics
    }
  } = useSelector((s: RootState) => s)
  const dispatch = useDispatch()


   const handleCancel = useCallback(()=>{
      dispatch(setLiveStatisticsModal(false))
   },[])
   return (
      <Modal title="" centered={true} footer={null} wrapClassName={styles.LiveStatisticsModal} destroyOnClose={true} open={isLiveStatisticsModalShow} onCancel={handleCancel}>
         <div className={styles.liveTip}>
            <div className={styles.title}>直播已结束</div>
            <div className={styles.time}>
               直播时长 {formatDuration(liveRoomStatistics.duration)}
            </div>
         </div>
         <div className={styles.liveContent}>
            <div className={styles.dataItem}>
               <div className={styles.dataCount}>{liveRoomStatistics.lmoney_total}</div>
               <div className={styles.dataName}>收获爱豆</div>
            </div>
            <div className={styles.dataItem}>
               <div className={styles.dataCount}>{liveRoomStatistics.view_total}</div>
               <div className={styles.dataName}>观看人数</div>
            </div>
            <div className={styles.dataItem}>
               <div className={styles.dataCount}>{liveRoomStatistics.live_likes}</div>
               <div className={styles.dataName}>点赞总数</div>
            </div>
            <div className={styles.dataItem}>
               <div className={styles.dataCount}>{liveRoomStatistics.family_members_count}</div>
               <div className={styles.dataName}>家族人数</div>
            </div>
            <div className={styles.dataItem}>
               <div className={styles.dataCount}>{liveRoomStatistics.num_of_new_fans}</div>
               <div className={styles.dataName}>新增粉丝</div>
            </div>
            <div className={styles.dataItem}>
               <div className={styles.dataCount}>{liveRoomStatistics.num_of_gift_givers}</div>
               <div className={styles.dataName}>送礼人数</div>
            </div>
         </div>
      </Modal>
   )
}


export default LiveStatisticsModal