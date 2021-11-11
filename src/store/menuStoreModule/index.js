
import mutationType from './mutationType'
const menuStoreModule = {
  state: {
    menuList: [],
    cacheList: []
  },
  mutations: {
    [mutationType.SAVE_CACHE_LIST] (state, n = []) {
      state.cacheList = n
    },
    [mutationType.SET_MENU_LIST] (state, n = []) {
      state.menuList = n
    }
  }
}

export default { menuStoreModule }
