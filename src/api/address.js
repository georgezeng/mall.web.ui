import axios from '../libs/api.request'

export default {
    load(id) {
        return axios.get('/client/address/load/params/' + id)
    },
    list(pageInfo) {
        return axios.post('/client/address/list', pageInfo)
    },
    save(address) {
        return axios.post('/client/address/save', address)
    },
    delete(id) {
        return axios.get('/client/address/delete/params/' + id)
    },
    loadDefault() {
        return axios.get('/client/address/load/default')
    },
}
