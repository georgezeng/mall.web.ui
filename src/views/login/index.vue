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
        <Header :style="commonStyles.header">
            <Icon type="ios-arrow-back" size="30" :style="commonStyles.backArrow" @click="back"/>
            <div>登录商城</div>
        </Header>
        <Content :style="commonStyles.content">
            <Tabs ref="tabs" style="margin-top: 100px;" value="verify">
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
                </div>
                <x-button action-type="button" :disabled="loading" type="primary" style="width: 100%;"
                          :show-loading="loading" @click.native="goWechatLogin">
                    <Icon type="ios-chatbubbles" style="color: #fff;"/>
                    <span style="font-size: 11pt;">微信登录</span>
                </x-button>
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
    import UrlParams from 'get-url-param'

    export default {
        components: {
            UsernamePasswordPanel,
            PhoneVerifyPanel
        },
        data() {
            return {
                commonStyles,
                loading: false,
                wechatLoginInfo: null,
                show: false
            }
        },
        methods: {
            back() {
                window.location.href = '/#/MyCenter'
            },
            loadWechatInfo() {
                this.loading = true
                let code = UrlParams(window.location.href, "code").replace(/#.+/, '')
                this.token = UrlParams(window.location.href, "state").replace(/#.+/, '')
                WechatAPI.loginInfo({
                    username: this.token,
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
        mounted() {
            if (this.isWechat) {
                const code = UrlParams(window.location.href, "code")
                if (!code) {
                    this.authorize()
                } else {
                    this.loadWechatInfo()
                }
            } else {
                this.show = true
            }
        }
    }
</script>
