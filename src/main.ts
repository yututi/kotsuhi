import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@/styles/normalize.css'
import '@/styles/index.scss'
// import "paper-css/0.3.0/paper.css"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faTimesCircle, faTrashAlt, faFileUpload, faLongArrowAltRight, faLongArrowAltLeft, faArrowsAltH, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCog, faTimesCircle, faTrashAlt, faFileUpload, faLongArrowAltRight, faLongArrowAltLeft, faArrowsAltH, faPlusCircle)

Vue.config.productionTip = false
Vue.component("fa-icon", FontAwesomeIcon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
