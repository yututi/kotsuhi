import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@/styles/normalize.css'
import '@/styles/index.scss'
import '@/styles/theme.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCog,
  faTimesCircle,
  faTrashAlt,
  faFileUpload,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faArrowsAltH,
  faPlusCircle,
  faExchangeAlt,
  faCheckSquare,
  faSquare
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faCog,
  faTimesCircle,
  faTrashAlt,
  faFileUpload,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faArrowsAltH,
  faPlusCircle,
  faExchangeAlt,
  faCheckSquare,
  faSquare
)

Vue.config.productionTip = false
Vue.component("fa-icon", FontAwesomeIcon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
