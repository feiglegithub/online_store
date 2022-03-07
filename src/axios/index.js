import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = '/online_store'

Vue.use(VueAxios, axios)