import axios from '../libs/api.request'

export default {
    load() {
        return axios.get('/client/identity/load')
    },
    save(data) {
        return axios.post('/client/identity/save', data)
    }
}
