import axios from '../libs/api.request'

export default {
    sendCode(mobile) {
        return axios.get('/client/forgetPassword/code/' + mobile)
    },
    next(user) {
        return axios.get('/client/forgetPassword/check/' + user.username + '/' + user.password)
    },
    reset(user, code) {
        return axios.post('/client/forgetPassword/reset/' + code, user)
    },
    test() {
        return axios.get('/client/test')
    }
}
