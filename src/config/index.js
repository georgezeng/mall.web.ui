import internalConfig from './config'

const config = {}

switch (internalConfig.env) {
  case 'development':
    config.baseUrl = 'http://localhost:9002'
    config.publicBucketDomain = 'https://malls-admin-public-local.oss-cn-shenzhen.aliyuncs.com/'
    break

  case 'uat':
    config.baseUrl = 'http://mall.bsxkj.com:9002'
    config.publicBucketDomain = 'https://malls-admin-public-uat.oss-cn-shenzhen.aliyuncs.com/'
    break

  default:
    config.baseUrl = ''
    // config.publicBucketDomain = 'https://malls-admin-public-live.oss-cn-shenzhen.aliyuncs.com/'
    config.publicBucketDomain = 'https://malls-admin-public-local.oss-cn-shenzhen.aliyuncs.com/'
}

export default config
