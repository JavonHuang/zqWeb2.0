/*!
 * name:loading.js
 * version:v1.0.0
 * author:Javon Huang
 * release:2019-08-15
 * company:jianxun
 */
import { Message, Loading } from 'element-ui'

class loading {
  /**
   * 加载持续时间
   * @param {number} time 加载持续时间
   */
  constructor (time) {
    this.time = time
    this.timer = null
    this.loading = null
    this.openLoading = (d = true) => {
      if (d) {
        this.loading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.timer = setTimeout(() => {
          this.loading.close()
        }, time)
      }
    }
    this.closeLoading = () => {
      if (this.loading !== null) {
        this.loading.close()
        clearTimeout(this.timer)
      }
    }
    this.showcode = (code, message, showMsg) => {
      if (code !== '200') {
        Message({
          showClose: true,
          message: message,
          type: 'warning'
        })
      } else if (showMsg) {
        Message({
          showClose: true,
          message: message,
          type: 'success'
        })
      }
    }
  }
}

export default loading
