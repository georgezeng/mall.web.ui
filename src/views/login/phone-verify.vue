<style>
</style>
<template>
    <div style="border: none; padding: 20px;">
        <Form ref="form" :model="form" :rules="rules" :label-width="0">
            <FormItem prop="username">
                <Input clearable size="large" prefix="ios-phone-portrait" v-model="form.username"
                       placeholder="输入手机号"></Input>
            </FormItem>
            <FormItem prop="password">
                <Input ref="verifyCode" clearable size="large" v-model="form.password" @on-search="sendCode" search
                       :enter-button="codeBtnText"
                       placeholder="输入验证码"></Input>
            </FormItem>
            <FormItem>
                温馨提示：未注册XXX账号的手机号，登录时将自动注册，且代表您已同意<a style="color: #B69C7D !important;" href="javascript:;">《用户服务协议》</a>
            </FormItem>
            <x-button action-type="button" :disabled="loading" style="width: 100%;"
                      :show-loading="loading" @click.native="login">
                <span style="font-size: 11pt; color: #fff;">登录/注册</span>
            </x-button>
        </Form>
    </div>
</template>
<script>
    import {Message} from 'iview'
    import API from '../../api/login'
    import Util from '../../libs/util'
    import UrlParams from 'get-url-param'
    import $ from 'jquery'

    export default {
        data() {
            return {
                loading: false,
                codeLoading: false,
                codeBtnText: '获取验证码',
                form: {
                    username: null,
                    password: null,
                    type: 'PhoneVerify',
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
            login() {
                this.$refs.form.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        API.login(this.form).then(data => {
                            this.loading = false
                            Util.loginSuccess(data, '/Home')
                        }).catch(ex => {
                            this.loading = false
                        })
                    }
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
            }
        },
        mounted() {
            const uid = UrlParams(window.location.href, 'uid')
            if (uid) {
                this.form.pid = uid.replace(/#.+/, '')
            }
            setTimeout(() => {
                $(this.$refs.verifyCode.$el).find('.ivu-input-search').css('cssText', 'background-color: #B69C7D !important; border-color: #B69C7D !important;')
            }, 10)
        }
    }
</script>
