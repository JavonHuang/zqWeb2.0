/*!
 * name:apiRequest.js
 * version:v1.0.0
 * author:Javon Huang
 * release:2019-08-15
 * company:jianxun
 */
import axios from 'axios'
import Loading from './loading'

const apiInstance = axios.create({
  baseURL: 'http://localhost:8070'
})

apiInstance.interceptors.request.use(request => {
  return request
},
error => {
  return Promise.reject(error)
}
)

apiInstance.interceptors.response.use(response => {
  return response
},
err => {
  return Promise.resolve({
    data: {
      data: null,
      code: -1,
      message: err.message
    }
  })
}
)

/**
 * 系统api调用
 * @param {string} url 系统API
 * @param {object} param 参数
 * @param {boolean} showcode msg提示
 * @param {boolean} layout 加载层
 */
const apiPost = (url, param, showcode = false, layout = false) => {
  const load = new Loading(1000)
  load.openLoading(layout)

  return new Promise((resolve, reject) => {
    apiInstance({
      method: 'post',
      url: url,
      data: param
    }).then(res => {
      load.closeLoading()
      load.showcode(res.data.code, res.data.message, showcode)
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
/**
 * 获取二进制文件流
 * @param {string} url 系统API
 * @param {object} param 参数
 * @param {boolean} showcode msg提示
 * @param {boolean} layout 加载层
 */
const buffer = (url, param, showcode = false, layout = false) => {
  const load = new Loading(1000)
  load.openLoading(layout)

  return new Promise((resolve, reject) => {
    apiInstance({
      method: 'post',
      url: url,
      data: param,
      responseType: 'arraybuffer'
    }).then(res => {
      if (res.headers['content-type'] === 'application/json;charset=UTF-8') {
        const uint8 = new Uint8Array(res.data) // 提取uint8Array
        const resToString = JSON.parse(
          decodeURIComponent(escape(String.fromCharCode(...uint8)))
        ) // 解决乱码
        load.closeLoading()
        load.showcode(resToString.code, resToString.message, showcode)
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export {
  apiPost,
  buffer
}
