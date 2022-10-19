import vueSsign from './lib/vue-ssign.vue'
vueSsign.install = function (Vue) {
  if (this.installed) {
    return
  }
  this.installed = true
  Vue.component('vueSsign', vueSsign)
}
export default vueSsign