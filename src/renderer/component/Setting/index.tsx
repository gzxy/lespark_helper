import React, { useState, useRef, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import styles from './setting.scss'
import { Slider } from 'antd'
import { getResourcePath } from '../../utils/index'
import VideoConfigModal from '../VideoConfigModal'
import { message } from 'antd'
import { setLiveSettingModalFn, setConfirmShow, setLiveStatisticsModal } from '../../store/global'
import { reseLiveRoomInfo, setLiveRoomStatistics } from '../../store/live'
import { RootState } from '../../store/index'
import apis from '../../services/live'
import { rtcEngine, joinChannel, leaveChannle } from '../../services/agoraApi'
import formatDuration from '../../utils/formatDuration'

const voiceIcon = getResourcePath('voice.png')
const voiceDisableIcon = getResourcePath('voiceDisable.png')
const microIcon = getResourcePath('microphone.png')
const microDisableIcon = getResourcePath('microDisable.png')
const settingIcon = getResourcePath('appSetting.png')
const finishLiveIcon = getResourcePath('finishLive.png')
const localUid = 100566

const Setting: React.FC = () => {
  const {
   live: {
      isLiving,
      liveRoomInfo,
   },
  } = useSelector((s: RootState) => s)
  const dispatch = useDispatch()
  const [disableVoice,setDisableVoice] = useState(false)
  const [disableMicro,setDisableMicro] = useState(false)
  const [voiceVolume, setVoiceNum] = useState(50)
  const [microVolume, setMicroVolume] = useState(50)
  const [liveDuringTimeStr, setLiveDuringTimeStr] = useState('00:00:00')
  const timeout = useRef<NodeJS.Timeout>()
  const [isOpen, setIsOpen] = useState(false)
  const voiceVolumeRef = useRef(voiceVolume)
  const microVolumeRef = useRef(microVolume)


   useEffect(()=>{
      if(timeout.current) {
         clearTimeout(timeout.current)
      }
      if(isLiving) {
         setLiveTime(0)
      }else{
         setLiveDuringTimeStr('00:00:00')
      }
   },[isLiving])

   const setLiveTime = useCallback((liveDuringTime)=>{
      timeout.current = setTimeout(()=>{
         const time = liveDuringTime + 1
         const duringTime = formatDuration(time)
         setLiveDuringTimeStr(duringTime)

         if(isLiving) {
            setLiveTime(time)
         }
      },1000)
   },[isLiving])

  const handleVoiceStatus = (e) => {
    if (!disableVoice) {
      voiceVolumeRef.current = voiceVolume
      setVoiceNum(0)
      setDisableVoice(true)
    } else {
      setDisableVoice(false)
      setVoiceNum(voiceVolumeRef.current)
      rtcEngine?.adjustPlaybackSignalVolume(voiceVolumeRef.current);
    }
  }

  const handleMicroStatus = (e) => {
    if (!disableMicro) {
      microVolumeRef.current = microVolume
      setMicroVolume(0)
      setDisableMicro(true)
    } else {
      setDisableMicro(false)
      setMicroVolume(microVolumeRef.current)
      rtcEngine?.adjustRecordingSignalVolume(microVolumeRef.current);
    }
  }

  const onVoiceAfterChange =(v)=>{
    setVoiceNum(v)
    rtcEngine?.adjustPlaybackSignalVolume(v);
    console.log('onVoiceAfterChange: ',v)
  }

  const onMicAfterChange =(v)=>{
    setMicroVolume(v)
    rtcEngine?.adjustRecordingSignalVolume(v);
    console.log('onMicAfterChange: ',v)
    }

  const handleJoinChannel = (channelId, uid)=>{
    console.log('-----handleJoinChannel channleId: ', channelId, 'uid: ',uid)
    const ret = joinChannel('',channelId, uid)
    if (ret < 0) {
      message.error('开通直播间失败，请重新开通！')
    }
  }

  const handleLeaveChannle = () => {
    const ret = leaveChannle()
    console.log('leave channel result: ', ret)
  }


  const onVideoConfigChangeCb = () => {
    setIsOpen(false)
  }

  const onSettingClick = () => {
    setIsOpen(true)
  }

  const handleLive = useCallback(()=>{
    console.log('---------')
   if(!isLiving) {
      //开启直播设置
      dispatch(setLiveSettingModalFn({
         liveTitle: '',
         liveDec: '',
         beginToLiveFn(data){
            handleJoinChannel(data.live_obj_id, data.live_user_lgid)
         } 
      }))
   }else{
      dispatch(setConfirmShow({
         content: '确定要关闭直播吗？',
         okText: '确认关闭',
         cancelText: '继续直播',
         onOk() {
            console.log('OK');
            return  apis.closeLive({
               live_obj_id: liveRoomInfo.live_obj_id
            }).then((res)=>{
               console.log('获取直播间结束数据', res);
               dispatch(setLiveRoomStatistics(res.data))
               dispatch(reseLiveRoomInfo())
               dispatch(setLiveStatisticsModal(true))
               handleLeaveChannle()
            })
         },
         onCancel() {
             console.log('Cancel');
         },
   }))
   }
  },[isLiving, liveRoomInfo,handleJoinChannel])


  return (
    <div className={styles.setting}>
      <div className={styles.tool}>
        <img className={styles.liveSetting} onClick={onSettingClick} src={`file://${settingIcon}`} alt="" />
        <div className={styles.voice}>
          <img onClick={handleVoiceStatus} src={ disableVoice? `file://${voiceDisableIcon}`:`file://${voiceIcon}`} alt="" />
          <Slider
            className={styles.customerSlider} 
            disabled={disableVoice}
            tooltip={{open: false}}
            min={0}
            max={100}
            value={voiceVolume}
            onAfterChange={onVoiceAfterChange}
          />
          <span>{voiceVolume}%</span>
        </div>
        <div className={styles.microphone}>
          <img onClick={handleMicroStatus} src={disableMicro ? `file://${microDisableIcon}`:`file://${microIcon}`} alt="" />
          <Slider 
            className={styles.customerSlider}
            disabled ={disableMicro}
            tooltip={{open: false}}
            min={0}
            max={100}
            value={microVolume}
            onAfterChange={onMicAfterChange}
          />
          <span>{microVolume}%</span>
        </div>
        {!isLiving && (<div className={styles.liveBtn} onClick={handleLive}> 开始直播 </div>)} 
        {isLiving && (
         <div className={styles.liveBtn} onClick={handleLive}> 
            <img src={`file://${finishLiveIcon}`} alt="" />
            <div className={styles.line}></div>
            <span>{liveDuringTimeStr}</span>
         </div>
        )} 
      </div>
      {isOpen&&(<VideoConfigModal isOpen={isOpen} onChange={onVideoConfigChangeCb}/>)}
    </div>
  )
}

export default Setting