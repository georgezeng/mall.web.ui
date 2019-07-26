import axios from '../libs/api.request'

export default {
    prepare(id) {
        return axios.post('/client/alipay/prepare/params/' + id)
    }
}
