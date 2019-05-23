import axios from '../libs/api.request'
import qs from 'qs'

export default {
    sendCode(mobile) {
        return axios.get('/client/login/code/' + mobile)
    },
    login(user) {
        let payload = qs.stringify(user)
        alert(payload)
        return axios.post('/login', payload)
    }
}
