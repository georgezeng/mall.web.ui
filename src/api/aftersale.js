import axios from '../libs/api.request'

export default {
    loadReasons(type) {
        return axios.get('/afterSale/reason/list/params/' + type)
    },
    list(id, status, pageInfo) {
        return axios.post('/afterSale/list/params/' + id + '/' + status, pageInfo)
    },
    upload(id, form) {
        return axios.post('/afterSale/upload/params/' + id, form)
    },
    load(id) {
        return axios.get('/afterSale/load/params/' + id)
    },
    save(data) {
        if (data.type != 'RefundOnly') {
            return axios.post('/afterSale/apply', data)
        } else {
            return axios.post('/afterSale/apply/refund', data)
        }
    },
    pickup(id) {
        return axios.get('/afterSale/pickup/params/' + id)
    },
    returnAddress(id) {
        return axios.get('/afterSale/returnAddress/load/params/' + id)
    },
    fillExpress(dto) {
        return axios.post('/afterSale/fillExpress', dto)
    },
    countUnFinished() {
        return axios.get('/afterSale/count/unFinished')
    }
}
