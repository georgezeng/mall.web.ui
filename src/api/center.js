import axios from '../libs/api.request'

export default {
    logout() {
        return axios.post('/logout')
    },
    totalUnUseCouponNums() {
        return axios.get('/client/totalUnUseCouponNums')
    },
    registrationBonus() {
        return axios.get('/client/registrationBonus')
    }
}
