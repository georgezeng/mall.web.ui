import axios from '../libs/api.request'

export default {
    list(page) {
        return axios.post('/client/list/sub', page)
    }
}
