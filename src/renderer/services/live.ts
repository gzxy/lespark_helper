import apiRequest from './request'

const apis = {
   // 关闭直播
   closeLive: (params) =>
     apiRequest(`PUT /impromptu_management`)({ ...params }),
   // 开启直播
   openLive: (params) =>
      apiRequest(`POST /live_management`)({ ...params }),
   // 项目配置信息
   getLiveInfo: (params) =>
      apiRequest(`GET /v2/pc_live_config`)({ ...params }),
   // 直播间在线观众列表
   getLiveViewers: (params) =>
      apiRequest(`GET /rtc/invite/users`)({ ...params }),
   // 礼物记录/贡献榜列表
   getLiveGifts: (params) =>
      apiRequest(`POST /live_gift_history`)({ ...params }),
}


export default apis