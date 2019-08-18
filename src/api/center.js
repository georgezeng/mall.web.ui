import axios from '../libs/api.request'

export default {
    logout() {
        return axios.post('/logout')
    },
    totalUnUseCouponAmount() {
        return axios.get('/client/totalUnUseCouponAmount')
    }
}
