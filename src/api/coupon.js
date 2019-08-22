import axios from '../libs/api.request'

export default {
    list(queryInfo) {
        return axios.post('/client/coupon/list', queryInfo)
    },
    count(queryInfo) {
        return axios.post('/client/coupon/count', queryInfo)
    },
    availableList(key) {
        return axios.get('/order/coupon/available/params/' + key)
    }
}
