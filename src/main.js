// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import './common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'
import store from '@/store/index.js'

// import vConsole from 'vconsole'
// new vConsole();
// console.log("test");
// 接下来注册组件
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})


fastclick.attach(document.body);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
