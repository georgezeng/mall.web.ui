import internalConfig from './config'

const config = {
    env: internalConfig.env,
    tokenKey: 'token'
}

switch (internalConfig.env) {
    case 'development':
        config.baseUrl = 'http://localhost:9001'
        // config.baseUrl = 'http://uat.mall-server.bsxkj.com'
        config.debug = false
        config.publicBucketDomain = 'https://mall-public-uat.oss-cn-zhangjiakou.aliyuncs.com/'
        break

    case 'uat':
        config.baseUrl = 'https://uat-mall-server.dobaishop.com'
        config.debug = true
        config.publicBucketDomain = 'https://mall-public-uat.oss-cn-zhangjiakou.aliyuncs.com/'
        break

    default:
        config.baseUrl = 'https://mall-server.dbjiaju.cn'
        config.debug = false
        config.publicBucketDomain = 'https://mall-public-prod.oss-cn-zhangjiakou.aliyuncs.com/'
}

export default config
