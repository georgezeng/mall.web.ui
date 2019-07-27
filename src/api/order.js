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
    },
    list(queryInfo) {
        return axios.post('/order/list', queryInfo)
    },
    count(status) {
        return axios.post('/order/count', {
            data: status,
            page: {
                num: 1,
                size: 1
            }
        })
    },
    cancel(id) {
        return axios.get('/order/cancel/params/' + id)
    },
    delete(id) {
        return axios.get('/order/delete/params/' + id)
    },
    pickup(id) {
        return axios.get('/order/pickup/params/' + id)
    },
    countUncomment() {
        return axios.get('/order/count/uncomment')
    },
    load(id) {
        return axios.get('/order/load/params/' + id)
    },
    checkPaid(id) {
        return axios.get('/order/checkPaid/params/' + id)
    },
}
