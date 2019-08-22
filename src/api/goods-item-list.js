import axios from '../libs/api.request'

export default {
    list(queryType, categoryId, sortType, queryInfo) {
        return axios.post('/goods/item/list/params/' + queryType + '/' + categoryId + '/' + sortType, queryInfo)
    }
}
