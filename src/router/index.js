import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [{
  path: '/',
  name: 'login',
  component: resolve => require(['./../views/login.vue'], resolve),
  meta: {
    title: '登录'
  }
},
{
  path: '/portal',
  name: 'portal',
  component: resolve => require(['./../views/portal'], resolve),
  meta: {
    title: '主页'
  },
  children: [
    {
      path: '/gzList/list',
      name: 'gzList_list',
      component: resolve => require(['./../views/gzList/gzList.vue'], resolve),
      meta: {
        title: '港资列表'
      }
    },
    {
      path: '/zList/list',
      name: 'zList_list',
      component: resolve => require(['./../views/zqList/zqList.vue'], resolve),
      meta: {
        title: '证券列表'
      }
    },
    {
      path: '/test/handsontable',
      name: 'handsontable',
      component: resolve => require(['./../views/handsontable.vue'], resolve),
      meta: {
        title: 'handsontable'
      }
    }
  ]
}
]

export default new VueRouter({
  routes
})
