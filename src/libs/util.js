import Cookies from 'js-cookie'
import config from '../config/index'

let util = {

};
util.title = function (title) {
    // title = title ? title + '商城' : '商城';
    window.document.title = title;
};

util.setToken = function(token) {
    Cookies.set(config.tokenKey, token, {expires: 14})
}

util.getToken = function() {
    const token = Cookies.get(config.tokenKey)
    if (token) return token
    else return false
}

export default util;