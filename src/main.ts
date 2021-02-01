import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { initGsap } from '@/logics/initGsap'

initGsap()

createApp(App)
  .use(router)
  .mount('#app')
