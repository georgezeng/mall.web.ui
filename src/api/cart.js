import axios from '../libs/api.request'

export default {
    list() {
        return axios.post('/client/cart/list')
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
    delete(ids) {
        return axios.post('/client/cart/delete', {ids})
    }
}
