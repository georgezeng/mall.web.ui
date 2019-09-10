<template>
    <Layout v-if="showRegister" :style="commonStyles.layout">
        <Header :style="commonStyles.header">
            <Icon type="ios-arrow-back" size="30" :style="commonStyles.backArrow" @click="back"/>
            <div>绑定手机</div>
        </Header>
        <Content :style="commonStyles.content">
            <Form ref="form" :model="form" :rules="rules" :label-width="0" style="margin-top: 80px; padding: 20px;">
                <FormItem prop="username">
                    <Input clearable size="large" prefix="ios-phone-portrait" v-model="form.username"
                           placeholder="输入手机号"></Input>
                </FormItem>
                <FormItem prop="password">
                    <Input ref="verifyCode" clearable size="large" v-model="form.password" @on-search="sendCode" search
                           :enter-button="codeBtnText"
                           placeholder="输入验证码"></Input>
                </FormItem>
                <x-button action-type="button" :disabled="loading" style="width: 100%; background-color: #FF992D;"
                          :show-loading="loading" @click.native="register">
                    <span style="font-size: 11pt; color: #fff;">绑定</span>
                </x-button>
            </Form>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/wechat.js'
    import LoginAPI from '../../api/login.js'
    import commonStyles from '../../styles/common.js'
    import {Message} from 'iview'
    import UrlParams from 'get-url-param'
    import Util from '../../libs/util'
    import $ from 'jquery'

    export default {
        data() {
            return {
                commonStyles,
                loginInfo: null,
                showRegister: false,
                codeLoading: false,
                codeBtnText: '获取验证码',
                loading: false,
                token: null,
                form: {
                    username: null,
                    password: null,
                    pid: null
                },
                rules: {
                    username: [
                        {required: true, message: '手机号不能为空', trigger: 'change'},
                        {
                            type: 'string',
                            pattern: /^\d{11}$/,
                            message: '手机号必须是11位数字',
                            trigger: 'change'
                        },
                    ],
                    password: [
                        {required: true, message: '验证码不能为空', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            back() {
                Util.goLogin()
            },
            load() {
                if (this.loginInfo.username) {
                    this.login()
                } else {
                    this.showRegister = true
                }
            },
            login() {
                this.loading = true
                LoginAPI.login({
                    ...this.loginInfo,
                    type: 'Wechat'
                }).then(data => {
                    this.loading = false
                    Util.loginSuccess(data, '/Home')
                }).catch(ex => {
                    this.loading = false
                })
            },
            disableVerifyCodeBtn(second) {
                if (second > 0) {
                    this.codeLoading = true
                    this.codeBtnText = second + '秒后重试'
                    let self = this
                    setTimeout(function () {
                        self.disableVerifyCodeBtn(second - 1)
                    }, 1000)
                    return
                }
                this.codeLoading = false
                this.codeBtnText = '获取验证码'
            },
            sendCode() {
                if (!this.form.username) {
                    this.$refs.form.validateField('username')
                    return
                }
                if (this.codeLoading) {
                    return
                }
                this.disableVerifyCodeBtn(30)
                API.sendCode(this.form.username).then(res => {
                    this.$vux.toast.show({text: "发送成功"})
                })
            },
            register() {
                this.$refs.form.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        API.register({
                            ...this.form,
                            token: this.token
                        }).then(res => {
                            this.loading = false
                            this.loginInfo = {
                                username: this.form.username,
                                password: this.token
                            }
                            this.login()
                        }).catch(ex => {
                            this.loading = false
                        })
                    }
                })
            }
        },
        created() {
            this.loginInfo = this.$router.currentRoute.params.info
            this.token = this.loginInfo.password
            const uid = UrlParams(window.location.href, 'uid')
            if (uid) {
                this.form.pid = uid.replace(/#?\/[^\/]+/, '')
                Util.log('pid: ' + uid)
            }
            this.load()
        },
        mounted() {
            setTimeout(() => {
                $(this.$refs.verifyCode.$el).find('.ivu-input-search').css('cssText', 'background-color: #B69C7D !important; border-color: #B69C7D !important;')
            }, 10)
        }
    }
</script>
