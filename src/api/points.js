import axios from '../libs/api.request'

export default {
    current() {
        return axios.get('/client/points/current')
    },
    accInAmount() {
        return axios.get('/client/points/accInAmount')
    },
    journals(queryInfo) {
        return axios.post('/client/points/journals', queryInfo)
    }
}
