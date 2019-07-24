import axios from '../libs/api.request'

export default {
    list(categoryId, type, queryInfo) {
        return axios.post('/goods/item/list/params/' + categoryId + '/' + type, queryInfo)
    }
}
