import axios from '../libs/api.request'

export default {
    load(id) {
        return axios.get('/client/invoice/load/params/' + id)
    },
    list(pageInfo) {
        return axios.post('/client/invoice/list', pageInfo)
    },
    contentList() {
        return axios.get('/client/invoice/content/list')
    },
    save(address) {
        return axios.post('/client/invoice/save', address)
    },
    delete(id) {
        return axios.get('/client/invoice/delete/params/' + id)
    }
}
