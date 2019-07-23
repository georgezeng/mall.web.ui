import axios from '../libs/api.request'

export default {
    listUnComment(queryInfo) {
        return axios.post('/evaluation/list/uncomment', queryInfo)
    },
    countUnComment(queryInfo) {
        return axios.post('/evaluation/count/uncomment', queryInfo)
    },
    listComment(queryInfo) {
        return axios.post('/evaluation/list/comment', queryInfo)
    },
    countComment(queryInfo) {
        return axios.post('/evaluation/count/comment', queryInfo)
    },
    listCommentForGoodsItem(queryInfo) {
        return axios.post('/evaluation/list/goodsItem', queryInfo)
    },
    save(data) {
        return axios.post('/evaluation/save', data)
    },
    saveAdditional(data) {
        return axios.post('/evaluation/save/additional', data)
    },
    loadOrder(id) {
        return axios.get('/evaluation/load/subOrder/params/' + id)
    },
    load(id) {
        return axios.get('/evaluation/load/params/' + id)
    },
    upload(form) {
        return axios.post('/evaluation/upload', form)
    },
    countForGoodsItem(queryInfo) {
        return axios.post('/evaluation/count/goodsItem', queryInfo)
    }
}
