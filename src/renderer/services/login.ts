import apiRequest from './request'

const apis = {
   // 登录获取验证码
   getCode: (params) =>
     apiRequest(`GET /v2/verify_code`)({ ...params }),
   // 手机号密码登录
   passwordLogin: (params) =>
      apiRequest(`POST /phone_login`)({ ...params }),
   // 验证码登录
   codeLogin: (params) =>
      apiRequest(`POST /phone_code_login`)({ ...params }),
   // 退出登录
   loginOut: (params) =>
      apiRequest(`POST /setting/logout`)({ ...params }),
   // token刷新
   refreshToken: (params) =>
      apiRequest(`POST /token_refresh`)({ ...params }),
}


export default apis