import axios from '../libs/api.request'

export default {
    list(ids) {
        return axios.post('/client/cart/list', {ids})
    },
    save(cart) {
        return axios.post('/client/cart/save', cart)
    },
    itemInfo(id) {
        return axios.get('/client/cart/item/params/' + id)
    }
}
