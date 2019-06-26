import Vue from 'vue';
import store from './store';
import router from './router/index';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import 'mint-ui/lib/style.css'
import { WechatPlugin } from 'vux'
import Mint from 'mint-ui'
import { PopupPicker } from 'vux'
import { Group } from 'vux'
import { Cell } from 'vux'
import { CellBox } from 'vux'
import { Datetime } from 'vux'
import { XInput } from 'vux'
import { Checker, CheckerItem } from 'vux'
import { CheckIcon } from 'vux'
import { XAddress } from 'vux'
import { XTextarea } from 'vux'
import { Popup } from 'vux'
import { TransferDom } from 'vux'
import { XNumber } from 'vux'
import  { ToastPlugin } from 'vux'
import { InlineXNumber } from 'vux'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
import { Checklist } from 'vux'

Vue.component('checklist', Checklist)
Vue.use(WeVue)
Vue.component('inline-x-number', InlineXNumber)
Vue.use(ToastPlugin)
Vue.component('x-number', XNumber)
Vue.directive('transfer-dom', TransferDom)
Vue.component('popup', Popup)
Vue.component('x-textarea', XTextarea)
Vue.component('x-address', XAddress)
Vue.component('check-icon', CheckIcon)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('x-input', XInput)
Vue.component('datetime', Datetime)
Vue.component('popup-picker', PopupPicker)
Vue.component('group', Group)
Vue.component('cell', Cell)
Vue.component('cell-box', CellBox)
Vue.use(WechatPlugin)
Vue.use(Mint)

new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
});


