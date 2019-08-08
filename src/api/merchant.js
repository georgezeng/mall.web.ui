import axios from '../libs/api.request'

export default {
    loadShopName() {
        return axios.get('/merchant/shopName')
    }
}
