// import HttpRequest from '@/libs/axios'
import axios from 'axios'
import config from '../config/index'
import router from '../router'
import {Message} from 'iview'

const LOGIN_PAGE_NAME = 'Login'

// const ajax = new HttpRequest(baseUrl)
const ajax = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
})

axios.interceptors.request.use(function (config) {
    for(let x in config)
    alert(x + ':' + config[x])
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

ajax.interceptors.response.use(function (response) {
    if (response.data.code == -1) {
        router.push({
            name: LOGIN_PAGE_NAME
        })
        return Promise.reject(response.data)
    } else if (response.data.code == 1) {
        alertError(response.data)
        return Promise.reject(response.data)
    }
    return response.data.data || response.data.datas
}, function (ex) {
    return Promise.reject(ex)
})

function alertError(error) {
    let errors = null
    if (error && error.msgs) {
        errors = '[' + error.traceId + '] '
        if (error.msgs.length > 1) {
            errors += '<br/>'
        }
        for (let i in error.msgs) {
            errors += error.msgs[i] + '<br />'
        }
    }
    var message = errors || '服务请求失败,请稍后重试'
    Message.error({
        content: message,
        duration: 5,
        closable: true
    })
}

export default ajax
