import Cookies from 'js-cookie'
import config from '../config/index'
import router from '../router/index'

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

export default util;