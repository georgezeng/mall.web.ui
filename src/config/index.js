import internalConfig from './config'

const config = {
    tokenKey: 'token'
}

switch (internalConfig.env) {
    case 'development':
        config.baseUrl = 'http://localhost:9002'
        config.debug = false
        config.publicBucketDomain = 'https://mall-public-local.oss-cn-zhangjiakou.aliyuncs.com/'
        break

    case 'uat':
        config.baseUrl = 'https://uat.mall-server.bsxkj.com'
        config.debug = false
        config.publicBucketDomain = 'https://mall-public-uat.oss-cn-zhangjiakou.aliyuncs.com/'
        break

    default:
        config.baseUrl = 'https://mall-server.bsxkj.com'
        config.debug = false
        config.publicBucketDomain = 'https://mall-public-prod.oss-cn-zhangjiakou.aliyuncs.com/'
}

export default config
