import axios from '../libs/api.request'

export default {
    totalUnUseCouponNums() {
        return axios.get('/client/totalUnUseCouponNums')
    },
    registrationBonus() {
        return axios.get('/client/registrationBonus')
    },
    currentLevel() {
        return axios.get('/client/currentLevel')
    }
}
