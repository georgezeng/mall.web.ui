import axios from '../libs/api.request'

export default {
    list(categoryId, type, pageInfo) {
        return axios.post('/goods/item/list/params/' + categoryId + '/' + type, pageInfo)
    }
}
