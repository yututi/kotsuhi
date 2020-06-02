import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@/styles/normalize.css'
import '@/styles/index.scss'
import '@/styles/theme.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimesCircle,
  faFileUpload,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faPlusCircle,
  faExchangeAlt,
  faEdit,
  faCaretLeft,
  faCaretRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faTimesCircle,
  faFileUpload,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faPlusCircle,
  faExchangeAlt,
  faEdit,
  faCaretLeft,
  faCaretRight
)

Vue.config.productionTip = false
Vue.component("fa-icon", FontAwesomeIcon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
