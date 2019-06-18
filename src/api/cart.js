import axios from '../libs/api.request'

export default {
    list(ids) {
        return axios.post('/client/cart/list', {ids})
    }
}
