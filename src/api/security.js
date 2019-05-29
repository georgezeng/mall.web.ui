import axios from '../libs/api.request'

export default {
    sendCode() {
        return axios.get('/client/resetPassword/code')
    },
    resetPassword(passwordInfo) {
        return axios.post('/client/resetPassword', passwordInfo)
    },
    updatePassword(passwordInfo) {
        return axios.post('/client/updatePassword', passwordInfo)
    }
}
