import { createAction, handleActions } from 'redux-actions'
import { Dispatch } from 'redux'
import { RootState } from './index'

interface IConfirm {
	content: string
	okText?: string
	cancelText?: string
	wrapClassName?: string
   isSingleBtn?: boolean
   isRightDefault?: boolean
	onOk?: () => void
	onCancel?: () => void
}

interface ILiveSetting {
	liveTitle: string
	liveDec: string
	beginToLiveFn?: (data: any) => void 
}

interface IAppConfig {
	agora_appid?: string,  //声网appid
	im_appid?: string     //腾讯im appid
}

export interface GlobalReducer {
	confirmOptions: IConfirm
	isConfirmShow: boolean
	isLiveSettingModalShow: boolean
	liveSettingOptions: ILiveSetting
	isLiveStatisticsModalShow: boolean
	appConfig: IAppConfig,
	agoraInit: boolean
   titleBarText: string
   isFullWindow: boolean
}


const initState = (): GlobalReducer =>({
	isConfirmShow: false,
	confirmOptions: {
		content: ''
	},
	isLiveSettingModalShow: false,
	liveSettingOptions: {
		liveTitle: '',
		liveDec: ''
	},
	isLiveStatisticsModalShow: false,
	appConfig: {
		agora_appid: '',  //声网appid
		im_appid: ''    //腾讯IM appid
	},
	agoraInit: false,
   titleBarText: 'LesPark直播伴侣',
   isFullWindow: false
})

export const setIsFullApp = createAction(
	'设置当前是否处于全屏',
	(isFullWindow: boolean)=>{
		return {
         isFullWindow
		}
	}
)

export const setConfirmShow = createAction(
	'设置Confirm弹窗信息',
	(confirmOptions: IConfirm)=>{
		return {
				confirmOptions,
				isConfirmShow: true
		}
	}
)

export const closeConfirmShow = createAction(
	'关闭Confirm弹窗',
	()=>{
		return {
				confirmOptions: {
					content: ''
				},
				isConfirmShow: false
		}
	}
)

export const setLiveSettingModalFn = createAction(
	'显示直播 开播回调',
	(liveSettingOptions: ILiveSetting)=>{
		return {
				liveSettingOptions,
				isLiveSettingModalShow: true
		}
	}
)

export const closeLiveSettingModal = createAction(
	'显示直播设置弹窗',
	(isShow: boolean)=>{
		return {
				isLiveSettingModalShow: isShow
		}
	}
)

export const setLiveStatisticsModal = createAction(
	'显示直播数据统计弹窗',
	(isShow: boolean)=>{
		return {
				isLiveStatisticsModalShow: isShow
		}
	}
)

export const setAppConfig = createAction(
	'设置应用配置信息',
	(appConfig: IAppConfig) => {
		console.log('------appConfig: ', appConfig)
		return  {
			...appConfig
		}
	}
)

export const setAgoraInit = createAction(
	'设置声网SDK初始化状态',
	(isInit: boolean) => {
		console.log('------isInit: ', isInit)
		return  {
			agoraInit: isInit
		}
	}
)

const reducer = handleActions({
	[setConfirmShow.toString()]: (state, { payload }) => {
		return { ...state, ...payload }
	},
	[closeConfirmShow.toString()]: (state, { payload }) => {
		return { ...state, ...payload }
	},
	[setLiveSettingModalFn.toString()]: (state, { payload }) => {
			return { ...state, ...payload }
	},
	[closeLiveSettingModal.toString()]: (state, { payload }) => {
			return { ...state, ...payload }
	},
	[setLiveStatisticsModal.toString()]: (state, { payload }) => {
			return { ...state, ...payload }
	},
	[setAppConfig.toString()]: (state, { payload }) => {
		return {
			...state,
			appConfig: {
				...state.appConfig,
				...payload
			}
		}
	},
	[setAgoraInit.toString()]: (state, { payload }) => {
		return { ...state, ...payload }
	},
	[setIsFullApp.toString()]: (state, { payload }) => {
		return { ...state, ...payload }
	},
}, initState())

export default reducer
