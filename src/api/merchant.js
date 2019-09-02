import axios from '../libs/api.request'

export default {
    loadSiteInfo() {
        return axios.get('/merchant/siteInfo')
    },
    loadHomeBanner() {
        return axios.post('/advertisement/list', {
            data: 'HomeBanner',
            page: {
                num: 1,
                size: 5,
                property: 'orderNum',
                order: 'DESC'
            }
        })
    },
    loadHomeRecommend() {
        return axios.post('/advertisement/list', {
            data: 'HomeRecommend',
            page: {
                num: 1,
                size: 4,
                property: 'orderNum',
                order: 'DESC'
            }
        })
    },
    loadCategoryBanner() {
        return axios.post('/advertisement/list', {
            data: 'CategoryBanner',
            page: {
                num: 1,
                size: 5,
                property: 'orderNum',
                order: 'DESC'
            }
        })
    },
    loadCategoryBrand() {
        return axios.post('/advertisement/list', {
            data: 'CategoryBrand',
            page: {
                num: 1,
                size: 3,
                property: 'orderNum',
                order: 'DESC'
            }
        })
    }
}
