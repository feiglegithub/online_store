// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './axios'
import './js/vux'
import './js/vant'
import './js/cube-ui'
import './js/element-ui'
import SearchButton from './components/SearchButton'
import SearchHeader from './components/SearchHeader'

Vue.component('search-button', SearchButton)
Vue.component('search-header', SearchHeader)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
