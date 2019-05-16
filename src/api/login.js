import axios from '../libs/api.request'
import qs from 'qs'

export default {
  sendCode (mobile) {
    return axios.get('/client/login/code/' + mobile)
  },
  login (user) {
    return axios.post('/login', qs.stringify(user))
  }
}
