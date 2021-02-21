import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { initGsap } from '@/logics/initGsap'
import AuthApi from './api/AuthApi'

initGsap()

AuthApi.loginAnonimouse()

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
