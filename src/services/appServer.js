
/*!
 * name:appServer.js
 * version:v1.0.0
 * author:Javon Huang
 * release:2019-08-15
 * company:jianxun
 */
import Vue from 'vue'
import { apiPost, buffer } from './apiRequest'
const api = {
  /**
   * 系统api调用
   * @param {string} url 系统API
   * @param {object} param 参数
   * @param {boolean} showcode msg提示
   * @param {boolean} layout 加载层
   */
  post (url, param, showcode = false, layout = false) {
    return apiPost(url, param, showcode, layout)
  },
  /**
   * 获取二进制文件流
   * @param {string} url 系统API
   * @param {object} param 参数
   * @param {boolean} showcode msg提示
   * @param {boolean} layout 加载层
   */
  buffer (url, param, showcode = false, layout = false) {
    return buffer(url, param, showcode, layout)
  }
}
Vue.prototype.$axios = api
