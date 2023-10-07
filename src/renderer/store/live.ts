import { createAction, handleActions } from 'redux-actions'
import { Dispatch } from 'redux'
import { RootState } from './index'
import api from '../services/live'

interface ILiveInfo {
   anchor_star_v3: number
   live_obj_id: string  // 直播间号
}

interface IStatistics {
   view_total: number  // 总观看人数
   num_of_new_fans: number // 本场直播新增粉丝数
   lmoney_total: number  // 直播总爱豆数
   num_of_gift_givers: number // 直播间送礼人数
   duration: number // 直播时长
   live_likes: number // 点赞总数
   family_members_count: number // 家族人数
}

export interface ILiveViewer {
   user_id: string
   avatar: string
   nickname: string
   is_following: boolean
   is_family_manager: boolean
   guard_type?: number
   isSilence: boolean
}

export interface IGift {
   gift_type: number
   gift_num: number
   gift_pic: string
}

export interface ILiveGift {
   user_id: string
   avatar: string
   nickname: string
   gift_list: IGift[]
   lmoney_total: number
}

export interface ITemplateItem {
   name: string,
	 type: string,
   info: any,
   isHide?: boolean,
	 extraInfo? : any
}

export interface LiveReducer {
   liveRoomInfo: ILiveInfo
   liveRoomStatistics: IStatistics
   isLiving: boolean
   isHorizontalScreen: boolean
   liveViewers: ILiveViewer[]
   liveGifts: ILiveGift[]
   templateList: ITemplateItem[]
   template: ITemplateItem | null
 }

 const initState = (): LiveReducer =>({
   liveRoomInfo: {
      live_obj_id: '',
      anchor_star_v3: 0
   },
   isLiving: false, // 是否正在直播
   liveRoomStatistics: { // 直播结束统计数据
      view_total: 0,
      num_of_new_fans:0,
      lmoney_total: 0,
      num_of_gift_givers: 0,
      duration: 0, 
      live_likes: 0,
      family_members_count: 0,
   },
   isHorizontalScreen: true, //横屏
   liveViewers: [],
   liveGifts: [],
   templateList: JSON.parse(localStorage.getItem('template')!) || [],
   template: null
 })

 export const requestLiveGifts: ()=> any = ()=>{
   return async (dispatch: Dispatch, getState: () => RootState) =>{
      const {
         live: { liveRoomInfo },
       } = getState()

      const { error, data} = await api.getLiveGifts({
         live_obj_id: liveRoomInfo.live_obj_id,
         count: 50,
         gift_history_type: 1
      })
      console.log('requestLiveGifts======>', data);
      if(error === 0) {
         dispatch(setLiveGifts(data.git_history_list))
      }
   }
 }


  export const requestLiveViewers: ()=> any = ()=>{
   return async (dispatch: Dispatch, getState: () => RootState) =>{
      const {
         live: { liveRoomInfo },
       } = getState()

      const { error, data} = await api.getLiveViewers({
         live_obj_id: liveRoomInfo.live_obj_id,
         count: 30
      })
      console.log('requestLiveViewers======>', data);
      if(error === 0) {
         dispatch(setLiveViewers(data.invite_list))
      }
   }
 }

 export const setLiveGifts = createAction(
   '设置直播间礼物列表',
   (gifts: ILiveGift[])=>{
      return {
         liveGifts: gifts
      }
   }
 )

 export const setLiveViewers = createAction(
   '设置直播间观众列表',
   (viewers: ILiveViewer[])=>{
      return {
         liveViewers: viewers
      }
   }
 )

 export const setLiveScreenDirection = createAction(
   '设置直播间横竖屏',
   (isHorizontal: boolean)=>{
      return {
         isHorizontalScreen: isHorizontal
      }
   }
 )

 export const setLiveRoomStatistics = createAction(
   '设置直播间关播统计数据',
   (liveRoomStatistics: IStatistics)=>{
      return {
         liveRoomStatistics
      }
   }
 )

 export const resetLiveRoomStatistics = createAction(
   '重置直播间关播统计数据',
   ()=>{
      return {
         liveRoomStatistics: {
            view_total: 0,
            num_of_new_fans:0,
            lmoney_total: 0,
            num_of_gift_givers: 0,
            duration: 0,
            live_likes: 0,
            family_members_count: 0
         }
      }
   }
 )

 export const setLiveRoomInfo = createAction(
   '设置直播间信息',
   (liveRoomInfo: ILiveInfo)=>{
      return {
         liveRoomInfo,
         isLiving: true
      }
   }
 )

  export const createLive: (liveRoomInfo: ILiveInfo)=> any = (liveRoomInfo: ILiveInfo)=>{
   return async (dispatch: Dispatch, getState: () => RootState) =>{
      dispatch(resetLiveRoomStatistics())
      dispatch(setLiveRoomInfo(liveRoomInfo))
      dispatch(requestLiveViewers())
      dispatch(requestLiveGifts())
   }
 }

 export const reseLiveRoomInfo = createAction(
   '重置直播间信息',
   ()=>{
     const liveRoomInfo ={
      live_obj_id: '',
      anchor_star_v3: 0
      }
      return {
         liveRoomInfo,
         liveViewers: [],
         liveGifts: [],
         isLiving: false
      }
   }
 )

 export const setTemplate = createAction(
	'设置模版素材',
	(template: ITemplateItem) => {
		console.log('-----------setTemplate: ', template)
      const temp = { ...template, isHide: false}
		return  temp
	}
)

export const setTemplatePreview = createAction(
	'设置模版预览',
	(template: ITemplateItem) => {
		console.log('------setTemplatePreview: ', template)
		return  template
	}
)

export const updateTemplate = createAction(
	'修改模版素材列表',
	(templateList: ITemplateItem[]) => {
		console.log('------isUpdate templateList: ', templateList)

      localStorage.removeItem('template')
      localStorage.setItem('template', JSON.stringify(templateList))
		return { templateList }
	}
)

 const reducer = handleActions({
   [setLiveRoomInfo.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [reseLiveRoomInfo.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [setLiveRoomStatistics.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [resetLiveRoomStatistics.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [setLiveScreenDirection.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [setLiveViewers.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [setLiveGifts.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [setTemplate.toString()]: (state, { payload }) => {
			const existingTemplateIndex = state.templateList.findIndex(
				(template) => template.name === payload.name
			)
			if (existingTemplateIndex === -1) {
				const data = {
					...state,
					templateList: [...state.templateList, payload],
				}
				
				localStorage.removeItem('template');
				localStorage.setItem('template', JSON.stringify(data.templateList));
				
				return data
			} else {
				// If the template with the same name exists, don't update anything
				return state
			}
    },
    [updateTemplate.toString()]: (state, { payload }) => {
      return { ...state, ...payload }
    },
    [setTemplatePreview.toString()]: (state, { payload }) => {
      return { 
        ...state,
				template: {
					...payload
				}
      }
    },
 }, initState())

 export default reducer