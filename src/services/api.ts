import Taro from '@tarojs/taro'
import { HTTP_STATUS } from '../constants/status'
import { baseUrl } from '../config'
import { logError } from '../utils/error'

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    type OptionType = {
      url: string,
      data?: object | string,
      method?: any,
      header: object,
      // mode: string,
      success: any,
      error: any,
      xhrFields: object,
    }
    const setCookie = (res: {
      cookies: Array<{
        name: string,
        value: string
      }>
    }) => {
      if (res.cookies && res.cookies.length > 0) {
        let cookies = ''
        res.cookies.forEach(cookie => {
          cookies += `${cookie.name}=${cookie.value};`
        });
        Taro.setStorageSync('cookies', cookies)
      }
    }
    const option: OptionType = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        cookie: Taro.getStorageSync('cookies')
      },
      // mode: 'cors',
      xhrFields: { withCredentials: true },
      success(res) {
        setCookie(res)
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
          // Taro.clearStorage()
          // Taro.navigateTo({
          //   url: '/pages/login/index'
          // })
          return logError('api', '请先登录')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    // eslint-disable-next-line
    return Taro.request(option)
  },
  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data?: object, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  },
  put(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}


