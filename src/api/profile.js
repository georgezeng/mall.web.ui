import axios from '../libs/api.request'

export default {
    load() {
        return axios.get('/client/current')
    },
}
