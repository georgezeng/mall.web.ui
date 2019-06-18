import axios from '../libs/api.request'

export default {
    list(ids) {
        return axios.post('/client/cart/list', {ids})
    },
    save(cart) {
        return axios.post('/client/cart/save', cart)
    },
    total() {
        return axios.get('/client/cart/total')
    }
}
