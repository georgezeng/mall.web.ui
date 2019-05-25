import Cookies from 'js-cookie'
import config from '../config/index'
import router from '../router/index'
import WechatAPI from '../api/wechat.js'
import wx from 'weixin-js-sdk'

let util = {};
util.title = function (title) {
    // title = title ? title + '商城' : '商城';
    window.document.title = title;
};

util.setToken = function (token) {
    Cookies.set(config.tokenKey, token, {expires: 14})
}

util.getToken = function () {
    const token = Cookies.get(config.tokenKey)
    if (token) return token
    else return false
}

util.go = function (name, params) {
    router.push({
        name,
        params
    })
    if (router.history.current.matched.length == 0) {
        router.replace({
            name: 'NotFound'
        });
    }
}

util.isInWechat = function() {
    var ua = navigator.userAgent.toLowerCase()
    return ua.indexOf('micromessenger') != -1
}

util.wxConfig = function (jsApiList) {
    WechatAPI.jsConfig(window.location.href.split('#')[0]).then(data => {
        wx.config({
            debug: config.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonce, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名
            jsApiList: jsApiList // 必填，需要使用的JS接口列表
        });
    })
}

export default util;