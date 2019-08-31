import axios from '../libs/api.request'

export default {
    logout() {
        return axios.post('/logout')
    },
}
