import axios from 'axios'
import { getToken, generateUUID,getDeviceId, getUserId } from '../utils/token'
import urlConfig from './urlConfig'
// const os = require('os');
// console.log('os===>',os.locale());
//import { message } from 'antd';

// const [messageApi, contextHolder] = message.useMessage();
const applicableDataMethod = ['put', 'post', 'patch', 'delete']
const createRequest = ({
  baseURL,
  timeout,
  ignoreError,
}: {
  baseURL: string
  timeout?: number
  ignoreError?: boolean
}) => {
  const instance = axios.create({
    // withCredentials: true,
    baseURL,
    validateStatus: status => status >= 200 && status < 400,
    timeout: timeout || 1000 * 20,
    responseType: 'json',
  })
  instance.interceptors.response.use(
    response => {
      console.log('response====>', response);
      return response.data
    },
    error => {
      if (ignoreError) {
        //return Promise.reject((error.response && error.response.data) || error)
        console.error('request error: ',error.response)
      }

      const originalRequest = error.config;
      console.error('请求出错！1', error.response.status, error.config)
        //刷新token
      if (error.response.status === 411 && !originalRequest._retry) {
        originalRequest._retry = true; 
        const refresh_token = localStorage.getItem('refresh_token')
        const uuid = generateUUID()
        const deviceId = getDeviceId() || ''
        const token = getToken()
        const uid = getUserId()
        const locale = localStorage.getItem('locale') || 'zh-hans'
        const requestHeaders =  {
            lang: locale,
            'lang-app': locale,
            locale: locale,
            'bundle-id': 'co.cc.pclive',
            version: '7.9.6.1002',
            'device-id': deviceId,
            'device-os': '12',
            'device-model': 'PCLM10',
            'request-id': uuid,
            'user-id': uid,
            token,
          }
        return axios.post(`${urlConfig.REQUEST_DOMAIN}/token_refresh`, {
          refresh_token,
          device_id: deviceId,
          user_id: uid,
          luid: uid,
          ltoken: token,
          "request-id": uuid
        },{
          headers: {
            ...requestHeaders
          }
        })
          .then(response => {
            console.log('response=====>', response);
            if (response.data.error === 410) {
              console.log('------登录过期！！')
              window.location.hash = '#Login'
            } else {
              const { access_token, refresh_token } = response.data;
              localStorage.setItem('token', access_token);
              localStorage.setItem('refresh_token', refresh_token);
              axios.defaults.headers.common['token'] = access_token;
              originalRequest.headers.token = access_token;
              return axios(originalRequest).then(res => {return res.data}).catch((err) => {
                console.error(err)
              });
            }
          });
      }
     
      console.error('request error: ',error.response)
    },
  )
  return (apisRecord: any, headers?: { [key: string]: string }) =>
    (data?: any) => {
      console.log('data====>', data);
      const uuid = generateUUID()
      const deviceId = getDeviceId() || ''
      const token = getToken()
      const uid = getUserId()
      const locale = localStorage.getItem('locale') || 'zh-hans'
      const time = Math.floor(Date.now() / 1000)
      const requestHeaders =  {
      //   Authorization: getToken(),
        timestamp: time,
        lang: locale,
        'lang-app': locale,
        locale: locale,
        'bundle-id': 'co.cc.pclive',
        version: '7.9.6.1002',
        'device-id': deviceId,
        'device-os': '12',
        'device-model': 'PCLM10',
        'request-id': uuid,
        'user-id': uid,
        token,
        ...headers,
      }

      const apisRecords = apisRecord.split(' ')

      const method = apisRecords[0].toLowerCase()
      const url = apisRecords[1]

      let params = { ...data,
         'request-id': uuid,
         luid: uid
       }
      if(token){
         params.ltoken = token
      }
      if (!applicableDataMethod.includes(method) && data) {
        params = {
          params: {
            ...data,
          },
        }
      } else if (method === 'delete') {
        params = {
          data: { ...params },
        }
      }
      Object.keys(requestHeaders).forEach(
        // eslint-disable-next-line no-return-assign
        key => (instance.defaults.headers[key] = requestHeaders[key]),
      )
      return instance[method](url, params)
    }
}

const apiRequest = createRequest({
  baseURL: urlConfig.REQUEST_DOMAIN,
})

export default apiRequest
