import Cookies from 'js-cookie'
import config from '../config/index'
import router from '../router/index'
import WechatAPI from '../api/wechat.js'
import wx from 'weixin-js-sdk'
import {Message} from 'iview'
import Vue from 'vue'
import UrlParams from 'get-url-param'

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

util.loginSuccess = (data, target) => {
    util.clear()
    util.setToken(data.token)
    const link = window.location.href
    if (link.indexOf('?') == -1) {
        window.location.href = link.replace(/#.+/, '?uid=' + data.userId + '#' + target)
    } else {
        window.location.href = link.replace(/\?.+/, '?uid=' + data.userId).replace(/#.+/,  '') + '#' + target
    }
}

util.isInWechat = function () {
    var ua = navigator.userAgent.toLowerCase()
    return ua.indexOf('micromessenger') != -1
}

util.uploadImageFromWechat = function (filePath, callback) {
    if (!util.isInWechat()) {
        return
    }
    wx.ready(function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        let serverId = res.serverId; // 返回图片的服务器端ID
                        WechatAPI.uploadFile(serverId, filePath).then(url => {
                            this.$vux.toast.show({text: "上传成功"})
                            if (callback) {
                                callback(url)
                            }
                        })
                    }
                });
            }
        })
    })
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

util.get = function (key) {
    return window.localStorage.getItem(key)
}

util.getJson = function (key) {
    let value = window.localStorage.getItem(key)
    if (value != null) {
        value = JSON.parse(value)
    }
    return value
}

util.put = function (key, value) {
    if (value != null) {
        window.localStorage.setItem(key, value)
    } else {
        window.localStorage.setItem(key, null)
    }
}

util.putJson = function (key, value) {
    if (value != null) {
        window.localStorage.setItem(key, JSON.stringify(value))
    } else {
        window.localStorage.setItem(key, null)
    }
}

util.putForNav = function (navObj) {
    let obj = util.getJson('NavigateArrObj')
    if (!obj || !obj.list) {
        obj = {
            list: []
        }
    }
    obj.list.push(navObj)
    util.putJson('NavigateArrObj', obj)
}

util.clear = function() {
    util.putJson('NavigateArrObj', null)
    util.putJson('settleAccountData', null)
    util.putJson('settleAccountKey', null)
}

util.getForNav = function () {
    const navList = util.getJson('NavigateArrObj')
    let nav = navList.list.pop()
    if (!nav) {
        nav = {
            from: 'Home'
        }
    }
    util.putJson('NavigateArrObj', navList)
    return nav
}

util.alipay = (orderId, from) => {
    const uid = UrlParams(window.location.href, 'uid').replace(/#.+/, '')
    window.location.href = config.baseUrl + '/client/alipay/prepare/params/' + uid + '/' + orderId + '/' + from
}

util.wepayForJsApi = (orderId, callback) => {
    Vue.$vux.loading.show({
        text: '加载中...'
    })
    WechatAPI.preparePay({
        id: orderId,
        type: 'JSAPI'
    }).then(data => {
        wx.chooseWXPay({
            timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.nonce_str, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            success: function (res) {
                if (typeof(callback) === 'function') {
                    callback()
                }
            }
        });
        Vue.$vux.loading.hide()
    }).catch(e => {
        Vue.$vux.loading.hide()
    })
}

util.wepayForMweb = (orderId, callback) => {
    Vue.$vux.loading.show({
        text: '加载中...'
    })
    WechatAPI.preparePay({
        id: orderId,
        type: 'MWEB'
    }).then(data => {
        window.location.href = data.mweb_url + '&redirect_url=' + encodeURIComponent(window.location.href + '?paid=true')
        Vue.$vux.loading.hide()
    }).catch(e => {
        Vue.$vux.loading.hide()
    })
}

export default util;