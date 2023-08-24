import React, { useEffect, useRef, useState } from 'react'
import { IRtcEngineEventHandler } from 'agora-electron-sdk'
import { useSelector, useDispatch } from 'react-redux'
import styles from './home.scss'
import { Layout, message } from 'antd'
import { RootState } from '../../store/index'
import { setAgoraInit, setAppConfig } from '../../store/global'
import Template from '../../component/Template'
import LiveTool from '../../component/LiveTool'
import SceneSetting from '../../component/SceneSetting'
import AudienceInfo from '../../component/AudienceInfo'
import InteractiveMsg from '../../component/InteractiveMsg'
import LivePreview from '../../component/LivePreview'
import Setting from '../../component/Setting'
import apis from '../../services/live'
import { rtcEngineInit, rtcEngineRelease, IConfig} from '../../services/agoraApi'
const { Sider, Content } = Layout

const Home: React.FC = () => {
  const userInfo = useSelector((s: RootState) => s.login.userInfo)
  const appConfig = useSelector((s: RootState) => s.global.appConfig)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('----home userInfo: ', userInfo)
    getAppConfig()
    return () => {
      rtcEngineRelease()
    }
  }, [])

  useEffect(() => {
    if (appConfig.agora_appid && appConfig.agora_appid.length  > 0) {
      const config: IConfig = {
        agora_id: appConfig.agora_appid,
        eventHandler: EventHandles
      }
      console.log('----agora init config: ',config)
      const ret = rtcEngineInit(config)
      if (ret < 0) {
        message.error('应用配置初始化失败，请重启应用')
        dispatch(setAgoraInit(false))
      } else {
        console.log('agora init success!')
        dispatch(setAgoraInit(true))
      }
    }

  }, [appConfig])
  

  const EventHandles: IRtcEngineEventHandler = {
    // 监听本地用户加入频道事件
    onJoinChannelSuccess: ({ channelId, localUid }, elapsed) => {
        console.log('成功加入频道：' + channelId + '用户:' + localUid);
    },

    onLeaveChannel: ({ channelId, localUid }, stats) => {
        console.log('成功退出频道：' + channelId + '用户:',localUid);
    },

    // 监听远端用户加入频道事件
    onUserJoined: ({ channelId, localUid }, remoteUid, elapsed) => {
        console.log('远端用户 ' + remoteUid + ' 已加入');
    },

    onUserOffline( { channelId, localUid }, remoteUid,  reason) {
      console.log('远端用户 ' + remoteUid + '离开' + reason)
    },

    onAudioDeviceStateChanged: (deviceId, deviceType, deviceState) => {
      console.log(`audio device changed:  ${deviceId} ${deviceType} ${deviceState}`)
    },

    onVideoDeviceStateChanged:(deviceId, deviceType, deviceState) => {
      console.log(`video device changed: ${deviceId} ${deviceType} ${deviceState}`)
    },

    onLocalVideoStats:(connection, stats)=>{
      console.log(`onLocalVideoStats: ${stats.sentBitrate},${stats.sentFrameRate}`)
    },
  }

  const getAppConfig = () => {
   apis.getLiveInfo({}).then(res =>{
      console.log('getLiveInfo===>', res);
      if (res.error ===  0) {
        dispatch(setAppConfig({
          agora_appid: res.data.agora_appid,  //声网appid
	        im_appid: res.data.im_appid
        }))
      }
   }) 
  }

  return (
    <Layout className={ styles.home }>
      <Sider width={314} className={ styles.siderLeft }>
        <SceneSetting />
        <Template />
        <LiveTool />
      </Sider>
      <Content className={styles.main}>
        <LivePreview />
        <Setting />
      </Content>
      <Sider width={386} className={ styles.siderRight }>
        <AudienceInfo />
        <InteractiveMsg />
      </Sider>
    </Layout>
  )
}

export default Home