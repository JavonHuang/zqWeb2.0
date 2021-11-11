/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'

import router from './router/index'
import store from './store/appStore'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

import 'handsontable/dist/handsontable.full.css'
Vue.use(ElementUI)
const { registerLanguageDictionary, zhCN } = require('handsontable/i18n')
registerLanguageDictionary(zhCN)

// eslint-disable-next-line import/first
import appServer from './services/appServer'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
