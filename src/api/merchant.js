import axios from '../libs/api.request'

export default {
    loadSiteInfo() {
        return axios.get('/merchant/siteInfo')
    }
}
