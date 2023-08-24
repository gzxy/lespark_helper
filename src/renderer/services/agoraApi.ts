import createAgoraRtcEngine from 'agora-electron-sdk'
import { 
  IRtcEngineEventHandler, 
  ChannelProfileType,
  AudioProfileType,
  AudioScenarioType,
  ClientRoleType,
  IMediaPlayerSourceObserver,
  IMediaPlayer
} from 'agora-electron-sdk'
import Config from '../config/agora.config'


export interface IConfig {
  agora_id: string,
  eventHandler: IRtcEngineEventHandler
}

export interface IDeviceCapacity {
  width: number,
  height: number,
  fps: number,
  modifyFps: number
}

export interface  IDevice {
  deviceId: string,
  deviceName: string
  capacity: IDeviceCapacity[]
}

export const rtcEngine = createAgoraRtcEngine() 

export const rtcEngineInit = (config: IConfig) => {
  let ret = rtcEngine.initialize({
    appId: config.agora_id,
    logConfig: { filePath: Config.SDKLogPath },
    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
  })
  let result = rtcEngine.enableExtension(
    'agora_video_filters_segmentation',
    'portrait_segmentation',
    true
  )
  console.log('init extension result: ',result)
  rtcEngine.registerEventHandler(config.eventHandler)
  return ret
}

export const rtcEngineRelease = () => {
  console.log('----rtcEngineRelease ')
  rtcEngine.release()
}

export const joinChannel = (token: string, channleId: string, uid: number) => {
  rtcEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting)
  rtcEngine.setAudioProfile(AudioProfileType.AudioProfileDefault, AudioScenarioType.AudioScenarioGameStreaming)
  const ret = rtcEngine.joinChannel(token, channleId, uid, {
    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    publishMicrophoneTrack: true,
    publishCameraTrack: false,
    publishTrancodedVideoTrack: true,
    autoSubscribeAudio: true,
    autoSubscribeVideo: true,
  })
  return ret
}

export const leaveChannle = () => {
  const ret = rtcEngine.leaveChannel()
  return ret
}

export const getVideoDevices = () => {
  let newDevices: IDevice[] = []
  const videoDevices = rtcEngine.getVideoDeviceManager().enumerateVideoDevices()
  if (videoDevices&&videoDevices.length > 0) {
    newDevices = videoDevices.map((item) => {
      let nums = rtcEngine?.getVideoDeviceManager().numberOfCapabilities(item.deviceId!)
      let capacities: IDeviceCapacity[] = []
      if (nums&&nums>0) {
        for (let i = 0; i < nums; i++) {
          let cap = rtcEngine?.getVideoDeviceManager().getCapability(item.deviceId!, i)
          console.log('---------cap: ',cap)
          if (cap !== undefined) {
            capacities.push({
              width: cap.width!,
              height: cap.height!,
              fps: cap.fps!,
              modifyFps: cap.fps!
            });
          }
        }
      }
      return {
        deviceId: item.deviceId || '',
        deviceName: item.deviceName || '',
        capacity: capacities,
      }
    })
  }
  return newDevices
}

export const createAgoraMediaPlayer = (listener: IMediaPlayerSourceObserver) => {
  const mediaPlayer = rtcEngine.createMediaPlayer()
  if (mediaPlayer) {
    mediaPlayer.registerPlayerSourceObserver(listener)
  }
  return mediaPlayer
}

export const destroyAgoraMediaPlayer = (mediaPlayer: IMediaPlayer, listener: IMediaPlayerSourceObserver) => {
  mediaPlayer.unregisterPlayerSourceObserver(listener)
  const ret = rtcEngine?.destroyMediaPlayer(mediaPlayer)
  return ret
}