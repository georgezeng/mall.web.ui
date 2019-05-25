import internalConfig from './config'

const config = {
    tokenKey: 'token'
}

switch (internalConfig.env) {
    case 'development':
        config.baseUrl = 'http://localhost:9002'
        config.debug = true
        config.publicBucketDomain = 'https://malls-admin-public-local.oss-cn-shenzhen.aliyuncs.com/'
        break

    case 'uat':
        config.baseUrl = 'https://mall-server.bsxkj.com'
        config.debug = false
        config.publicBucketDomain = 'https://malls-admin-public-uat.oss-cn-shenzhen.aliyuncs.com/'
        break

    default:
        config.baseUrl = ''
        config.debug = false
        config.publicBucketDomain = 'https://malls-admin-public-live.oss-cn-shenzhen.aliyuncs.com/'
}

export default config
