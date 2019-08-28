import axios from '../libs/api.request'

export default {
    current() {
        return axios.get('/client/points/current')
    },
    baseInfo() {
        return axios.get('/client/points')
    },
    journals(queryInfo) {
        return axios.post('/client/points/journals', queryInfo)
    }
}
