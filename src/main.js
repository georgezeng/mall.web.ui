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
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { XButton } from 'vux'
import { XSwitch } from 'vux'
import { Badge } from 'vux'
import { LoadMore } from 'vux'
import  { LoadingPlugin } from 'vux'
import { Swiper, SwiperItem } from 'vux'

Vue.component('swiper-item', SwiperItem)
Vue.component('swiper', Swiper)
Vue.use(LoadingPlugin)
Vue.component('load-more', LoadMore)
Vue.component('badge', Badge)
Vue.component('x-switch', XSwitch)
Vue.component('x-button', XButton)
Vue.component('swipeout', Swipeout)
Vue.component('swipeout-item', SwipeoutItem)
Vue.component('swipeout-button', SwipeoutButton)
Vue.component('checklist', Checklist)
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
Vue.use(WeVue)

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
/*
 * 重写时间的toJSON方法，因为在调用JSON.stringify的时候，时间转换就调用的toJSON，这样会导致少8个小时，所以重写它的toJSON方法
 */
Date.prototype.toJSON = function () {
    return this.format("yyyy-MM-dd hh:mm:ss"); // util.formatDate是自定义的个时间格式化函数
}

new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
});


