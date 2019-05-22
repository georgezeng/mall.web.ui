<template>
    <Layout v-if="showRegister" style="margin: 0 auto; padding: 0;">
        <Header style="margin:0; padding: 0 10px; background-color: #DA4935; position: fixed; z-index: 100; width: 100%; color: #fff; font-size: 16pt; text-align: center;">
            <Icon type="ios-arrow-back" size="30" style="position: absolute; top: 18px; left: 10px;" @click="back" />
            <div>绑定手机</div>
        </Header>
        <Content :style="{padding: '20px', paddingTop: '100px', backgroundColor: '#fff'}">
            <Form ref="form" :model="form" :rules="rules" :label-width="0">
                <FormItem prop="username">
                    <Input size="large" prefix="ios-phone-portrait" v-model="form.username" placeholder="输入手机号"></Input>
                </FormItem>
                <FormItem prop="password">
                    <Input size="large" v-model="form.password" @on-search="sendCode" search
                           :enter-button="codeBtnText"
                           placeholder="输入验证码"></Input>
                </FormItem>
                <Button size="large" :loading="loading" long type="warning" @click="register">绑定</Button>
            </Form>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/wechat.js'
    import LoginAPI from '../../api/login.js'
    import {Message} from 'iview'
    import UrlParams from 'get-url-param'
    export default {
        data() {
            return {
                showRegister: false,
                codeLoading: false,
                codeBtnText: '获取验证码',
                loading: false,
                token: null,
                form: {
                    username: null,
                    password: null,
                    token: null,
                    id: null
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
                this.$router.push({
                    name: 'Login'
                })
            },
            goProfile() {
                this.$router.push({
                    name: 'MyCenter'
                })
            },
            load() {
                this.$Spin.show()
                let code = UrlParams(window.location.href, "code")
                this.token = UrlParams(window.location.href, "state").replace('#/WechatLogin', '')
                API.info({
                    username: this.token,
                    password: code,
                }).then(info => {
                    this.$Spin.hide()
                    if(info.username.length == 11) {
                        this.login(info)
                    } else {
                        this.showRegister = true
                        this.form.id = info.password
                        this.form.token = info.username
                    }
                }).catch(e => {
                    this.$Spin.hide()
                })
            },
            login(info) {
                this.loading = true
                LoginAPI.login({
                    ...info,
                    type: 'ThirdParty'
                }).then(res => {
                    this.loading = false
                    this.goProfile()
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
                    Message.success("发送成功")
                })
            },
            register() {
                this.$refs.form.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        API.register(this.form).then(res => {
                            this.loading = false
                            this.login({
                                username: this.form.username,
                                password: this.token
                            })
                        }).catch(ex => {
                            this.loading = false
                        })
                    }
                })
            }
        },
        mounted() {
            this.load()
        }
    }
</script>
