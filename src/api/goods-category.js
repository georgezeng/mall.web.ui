import axios from '../libs/api.request'

export default {
    level1() {
        return axios.get('/goods/category/list/level1')
    },
    level2(id) {
        return axios.get('/goods/category/list/level2/params/' + id)
    },
    recommends(id){
        return axios.get('/goods/category/recommend/list/params/'+id)
    }
}
