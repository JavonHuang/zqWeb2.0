
import Vue from 'vue'
import Vuex from 'vuex'
import menuStoreModule from './menuStoreModule'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    ...menuStoreModule
  }
})

export default store
