// import HttpRequest from '@/libs/axios'
import axios from 'axios'
import config from '../config/index'
import Util from '../libs/util'
import router from '../router/index'
import {Message} from 'iview'
import Vue from 'vue'

const LOGIN_PAGE_NAME = 'Login'

// const ajax = new HttpRequest(baseUrl)
const ajax = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
})

ajax.interceptors.response.use(function (response) {
    if (response.data.code == -1) {
        Util.clear()
        if(router.currentRoute.meta.needLogin) {
            router.push({
                name: LOGIN_PAGE_NAME
            })
        }
        return Promise.reject(response.data)
    } else if (response.data.code == 1) {
        alertError(response.data)
        return Promise.reject(response.data)
    }
    return response.data.datas || response.data.data
}, function (ex) {
    alertError(ex)
    return Promise.reject(ex)
})

function alertError(error) {
    let errors = null
    if (error && error.msgs) {
        errors = ''
        if (error.msgs.length > 1) {
            errors += '<br/>'
        }
        for (let i in error.msgs) {
            errors += error.msgs[i] + '<br />'
        }
        console.log(error)
    } else {
        errors = '服务请求失败,请稍后重试'
    }
    Vue.$vux.toast.text(errors)
    // Message.error({
    //     content: message,
    //     duration: 5,
    //     closable: true
    // })
}

export default ajax
