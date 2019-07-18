import axios from '../libs/api.request'

export default {
    load() {
        return axios.get('/client/current')
    },
    save(user) {
        return axios.post('/client/save', user)
    },
    uploadAvatar(form) {
        return axios.post('/client/avatar/upload', form)
    }
}
