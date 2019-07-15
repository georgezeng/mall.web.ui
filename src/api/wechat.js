import axios from '../libs/api.request'

export default {
    sendCode(mobile) {
        return axios.get('/client/wechat/code/' + mobile)
    },
    loginInfo(loginInfo) {
        return axios.post('/client/wechat/loginInfo', loginInfo)
    },
    register(user) {
        return axios.post('/client/wechat/register', user)
    },
    authorize(uri) {
        return axios.get('/client/wechat/authorize?uri=' + encodeURIComponent(uri))
    },
    jsConfig(url) {
        return axios.get('/client/wechat/jsconfig?url=' + encodeURIComponent(url))
    },
    uploadFile(serverId, filePath) {
        return axios.get('/client/wechat/fetchFile/' + serverId + '?filePath=' + encodeURIComponent(filePath))
    },
    preparePay(params) {
        return axios.post('/client/wechat/unifiedOrder', params)
    }
}
