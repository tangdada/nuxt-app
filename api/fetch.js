/*
 * @Author: LT
 * @Date: 2018-03-26 18:12:07
 * @Last Modified by: chu
 * @Last Modified time: 2018-06-22 10:10:19
 */
/**
* 基于 iView + Axios 的异步请求封装
*   以提供 日志打印、错误处理、方法判断、统一请求参数类型、设置Loading状态 等功能
* 调用示例：
*   import Api from '../api'
*   Api.getWxConfig(config).then(res => {}).catch(e => {})
*
* 参数说明：
* config [Object]:
*  config.data [Object] 请求的数据，统一为 JSON 对象
*  config.logger [Boolean] 是否打印日志 默认 true
*  config.catchError [Boolean] 是否捕捉错误并显示错误消息
*  config.loading [Boolean] 全屏的 loading 状态，默认 true, 配置 stateName 后将失效
*  config.urlData [Array] 请求地址中要拼接的参数对象，拼接顺序为数组顺序 例 xx/user/${id}/${name}
*  config.stateName [String] 请求过程中需要更新的 loadding 状态名称 （需要 context 配置）
*  config.context [Object] 当前页面实例 this （当配置了 stateName 时，context 必填）
*  config.contentType [String] post 提交的数据格式 multipart/form-data | application/x-www-form-urlencoded | application/json (默认)
*  config.urlParams [Object] 当使用post请求，有post数据，并且有url params数据时使用
*/
import axios from 'axios'
import qs from 'qs'

// 全局设置
axios.defaults.baseURL = 'http://crm-qatest4.mytijian.cn/crm/action/'
axios.defaults.timeout = 60 * 60 * 1000
axios.defaults.responseType = 'json'
axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = 'unique-submit-token'
axios.defaults.xsrfHeaderName = 'unique-submit-token'

// 防重复提交token
var UNIQUE_SUBMIT_TOKEN = 'unique-submit-token'

// 请求拦截处理
axios.interceptors.request.use(function (config) {
  const contentType = config.contentType
  if (config.method === 'post') {
    if (contentType === 'application/x-www-form-urlencoded') {
      // 使用该arrayFormat选项来指定输出数组的格式  https://github.com/ljharb/qs  例如 要使用 arr[]=b的形式来传递参数
      /*  qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'indices' })
          // 'a[0]=b&a[1]=c'
          qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })
          // 'a[]=b&a[]=c'
          qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })
          // 'a=b&a=c'
       */
      config.data = qs.stringify(config.data, {
        arrayFormat: 'brackets'
      })
    } else if (contentType === 'multipart/form-data') {
      var formData = new FormData()
      formData.append('file', config.data)
      config.data = formData
    }
    config.headers['Content-Type'] = (contentType || 'application/json')
  }
  if (global['UNIQUE_SUBMIT_TOKEN']) {
    config.headers[UNIQUE_SUBMIT_TOKEN] = global['UNIQUE_SUBMIT_TOKEN']
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截处理
axios.interceptors.response.use(function (config) {
  if (config.headers[UNIQUE_SUBMIT_TOKEN]) {
    global['UNIQUE_SUBMIT_TOKEN'] = config.headers[UNIQUE_SUBMIT_TOKEN]
  }
  return config
}, function (error) {
  let res = error.response;
  if (res && res.headers[UNIQUE_SUBMIT_TOKEN]) {
    global['UNIQUE_SUBMIT_TOKEN'] = res.headers[UNIQUE_SUBMIT_TOKEN]
  }
  return Promise.reject(error)
})

export default {
  isLogin() {
    console.log('before islogin')
    return axios.get('/islogin')
  },

  getReportDetailIgnoreLogin(query) {
    console.log(query)
    return axios.get(`/reportByTemplateIgnoreLogin`, { params: query })
  }
}

