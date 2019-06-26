import axios from '../libs/api.request'

export default {
    settleAccount(settleInfo) {
        return axios.post('/order/settleAccount', settleInfo)
    },
    getPreview(key) {
        return axios.get('/order/preview/params/' + key)
    },
    create(data) {
        return axios.post('/order/create', data)
    }
}
