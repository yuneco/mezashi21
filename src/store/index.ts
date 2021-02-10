import { createStore } from 'vuex'

export default createStore({
  state: {
    stageSetting: {
      width: 0,
      height: 0,
      vw: 0,
      vh: 0,
      scale: 1
    }
  },
  mutations: {
    setStageSetting(
      state,
      payload: { width: number; height: number; scale: number; vw: number; vh: number }
    ) {
      state.stageSetting.width = payload.width
      state.stageSetting.height = payload.height
      state.stageSetting.scale = payload.scale
      state.stageSetting.vw = payload.vw
      state.stageSetting.vh = payload.vh
    }
  },
  actions: {},
  modules: {}
})
