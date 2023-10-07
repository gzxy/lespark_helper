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
   // 获取上麦用户认证状态
   checkVerify: (params) =>
      apiRequest(`POST /v2/check_verify`)({ ...params }),
   // 设置家族管理员
   managerFamily: (params) =>
      apiRequest(`POST /v3/family/managers`)({ ...params }),
   // 取消家族管理员
   cancelManagerFamily: (params) =>
      apiRequest(`DELETE /v3/family/managers/${params.user_id}/${params.live_obj_id}`)({ ...params }),
   // 举报观众
   reportAudience: (params) =>
      apiRequest(`POST /report_audience`)({ ...params }),
   // 禁言观众/取消禁言
   silenceUser: (params) =>
      apiRequest(`POST /live_silence_user`)({ ...params }),
   // 踢出观众
   kickingUser: (params) =>
      apiRequest(`POST /kicking_user`)({ ...params }),
}


export default apis