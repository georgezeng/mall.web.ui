import axios from '../libs/api.request'

export default {
    load() {
        return axios.get('/client/current')
    },
    save(user) {
        console.log(user)
        return axios.post('/client/save', user)
    }
}
