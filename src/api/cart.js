import axios from '../libs/api.request'

export default {
    list(ids) {
        return axios.post('/client/cart/list', {ids})
    },
    save(cart) {
        return axios.post('/client/cart/save', cart)
    },
    updateNums(id, nums) {
        return axios.get('/client/cart/updateNums/params/' + id + '/' + nums)
    },
    itemInfo(id) {
        return axios.get('/client/cart/item/params/' + id)
    },
    delete(id) {
        return axios.get('/client/cart/delete/params/' + id)
    }
}
