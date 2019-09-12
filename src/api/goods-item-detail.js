import axios from '../libs/api.request'

export default {
    load(id) {
        return axios.get('/goods/item/load/params/' + id)
    },
}
