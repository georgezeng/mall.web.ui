import axios from '../libs/api.request'
import qs from 'qs'

export default {
    sendCode(mobile) {
        return axios.get('/client/wechat/code/' + mobile)
    },
    info(loginInfo) {
        return axios.post('/client/wechat/info', loginInfo)
    },
    register(user) {
        return axios.post('/client/wechat/register', user)
    },
    loginUrl() {
        return axios.get('/client/wechat/loginUrl')
    },
    jsConfig(url) {
        return axios.get('/client/wechat/jsconfig?url=' + encodeURIComponent(url))
    },
    uploadFile(serverId, filePath) {
        return axios.get('/client/wechat/fetchFile/' + serverId + '?filePath=' + encodeURIComponent(filePath))
    }
}
