<style>
</style>
<template>
    <div style="border: none; padding: 20px;">
        <Form ref="form" :model="form" :rules="rules" :label-width="0">
            <FormItem prop="username">
                <Input size="large" prefix="ios-phone-portrait" v-model="form.username" placeholder="输入手机号"></Input>
            </FormItem>
            <FormItem prop="password">
                <Input size="large" v-model="form.password" @on-search="sendCode" search
                       :enter-button="codeBtnText"
                       placeholder="输入验证码"></Input>
            </FormItem>
            <Button @click="login" long
                    size="large"
                    type="primary"
                    class="margin-right"
                    :loading="loading">登录/注册
            </Button>
        </Form>
    </div>
</template>
<script>
    import {Message} from 'iview'
    import API from '../../api/login'
    export default {
        data() {
            return {
                loading: false,
                codeLoading: false,
                codeBtnText: '获取验证码',
                form: {
                    username: null,
                    password: null,
                    type: 'PhoneVerify'
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
                        API.login(this.form).then(res => {
                            this.loading = false
                            this.goProfile()
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
                    Message.success("发送成功")
                })
            },
            goProfile() {

            }
        }
    }
</script>
