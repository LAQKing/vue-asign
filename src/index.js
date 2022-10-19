import vueAsign from './lib/vue-asign.vue'
vueAsign.install = function (Vue) {
  if (this.installed) {
    return
  }
  this.installed = true
  Vue.component('vueAsign', vueAsign)
}
export default vueAsign