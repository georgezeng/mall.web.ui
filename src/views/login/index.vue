<style scoped lang="less">
    .gradient {
        display: inline-block;
        margin: 0 auto;
        height: 2px;
        width: 30%;
        background: radial-gradient(gray 10%, white 80%);
    }


</style>
<template>
    <Layout v-if="show" :style="commonStyles.layout">
        <Content :style="commonStyles.content">
            <div align="center" style="height: 40px;">
                <Icon type="ios-arrow-back" size="30" :style="commonStyles.backArrow" @click="back"/>
            </div>
            <div align="center" style="padding-top: 30px;">
                <img :src="logo"/>
            </div>
            <Tabs v-model="tab" ref="tabs" style="margin-top: 10px;">
                <TabPane label="验证码登录" name="verify">
                    <PhoneVerifyPanel/>
                </TabPane>
                <TabPane label="密码登录" name="password">
                    <UsernamePasswordPanel/>
                </TabPane>
            </Tabs>

            <div v-if="isWechat" style="padding: 0 20px; margin-top: 20px;">
                <div style="margin-bottom: 20px;" align="center">
                    <div class="gradient"></div>
                    <div style="display: inline-block; color: gray; width: 30%; text-align: center;">快捷登录</div>
                    <div class="gradient"></div>
                    <div @click="goWechatLogin"
                         style="margin-top: 20px; background-color: #B69C7D; border-radius: 50px; height: 50px; width: 50px;">
                        <Icon size="30" type="ios-chatbubbles" style="color: #fff; position: relative; top: 10px;"/>
                    </div>
                </div>
                <!--
                <x-button action-type="button" :disabled="loading" style="background-color: #B69C7D; width: 100%;"
                          :show-loading="loading" @click.native="goWechatLogin">
                    <Icon type="ios-chatbubbles" style="color: #fff;"/>
                    <span style="font-size: 11pt;">微信登录</span>
                </x-button>
                -->

            </div>
        </Content>
    </Layout>
</template>
<script>
    import WechatAPI from '../../api/wechat.js'
    import commonStyles from '../../styles/common.js'
    import UsernamePasswordPanel from './username-password'
    import PhoneVerifyPanel from './phone-verify'
    import Util from '../../libs/util'
    import config from '../../config/index'
    import UrlParams from 'get-url-param'
    import MerchantAPI from '../../api/merchant'

    export default {
        components: {
            UsernamePasswordPanel,
            PhoneVerifyPanel
        },
        data() {
            return {
                logo: null,
                commonStyles,
                loading: false,
                wechatLoginInfo: null,
                show: false,
                tab: null
            }
        },
        methods: {
            back() {
                window.location.href = '/#/MyCenter'
            },
            loadWechatInfo({code, state}) {
                this.loading = true
                WechatAPI.loginInfo({
                    username: state,
                    password: code,
                }).then(info => {
                    this.loading = false
                    this.wechatLoginInfo = info
                    this.show = true
                }).catch(e => {
                    this.loading = false
                })
            },
            authorize() {
                this.loading = true
                WechatAPI.authorize(window.location.href).then(url => {
                    this.loading = false
                    window.location.href = url
                    alert(url)
                }).catch(e => {
                    this.loading = false
                })
            },
            goWechatLogin() {
                Util.go('WechatLogin', {
                    info: this.wechatLoginInfo
                })
            }
        },
        computed: {
            isWechat() {
                return Util.isInWechat()
            }
        },
        created() {
            MerchantAPI.loadSiteInfo().then(data => {
                this.logo = config.publicBucketDomain + data.loginLogo
            })
        },
        mounted() {
            this.tab = this.$router.currentRoute.params.tab
            this.tab = this.tab ? this.tab : 'verify'
            if (this.isWechat) {
                let uid = UrlParams(window.location.href, 'uid')
                if (uid) {
                    uid = uid.replace(/#.+/, '')
                }
                const from = UrlParams(window.location.href, 'from')
                if (from) {
                    window.location.href = config.baseUrl + '/index?url='
                        + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/" + (uid ? "?uid=" + uid : '') + "#/Login")
                    return
                }
                let auth = Util.getJson('wechat_authorize')
                if (!auth) {
                    const code = UrlParams(window.location.href, "code")
                    if (!code) {
                        this.authorize()
                    } else {
                        auth = {code}
                        auth.state = UrlParams(window.location.href, "state").replace('/Login', '')
                        Util.putJson('wechat_authorize', auth)
                        let query = uid ? '?uid=' + uid : ''
                        if (config.env == 'uat' && config.debug) {
                            query += '&eruda=true'
                        }
                        window.location.href = window.location.protocol + "//" + window.location.host + "/" + query + "#/Login"
                    }
                } else {
                    Util.putJson('wechat_authorize', null)
                    this.loadWechatInfo(auth)
                }
            } else {
                this.show = true
            }
        }
    }
</script>
