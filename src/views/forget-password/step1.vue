<template>
    <Layout style="margin: 0 auto; padding: 0;">
        <Header style="margin:0; padding: 0 10px; background-color: #DA4935; position: fixed; z-index: 100; width: 100%; color: #fff; font-size: 16pt; text-align: center;">
            <Icon type="ios-arrow-back" size="30" style="position: absolute; top: 18px; left: 10px;" @click="back" />
            <div>忘记密码</div>
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
                <Button size="large" long type="warning" @click="check">下一步</Button>
            </Form>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/forget-password'
    import {Message} from 'iview'

    export default {
        data() {
            return {
                loading: false,
                codeLoading: false,
                codeBtnText: '获取验证码',
                form: {
                    username: '',
                    verifyCode: ''
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
                }).catch(ex => {
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
            check() {
                this.$refs.form.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        API.next(this.form).then(res => {
                            this.loading = false
                            this.goStep2()
                        }).catch(ex => {
                            this.loading = false
                        })
                    }
                })
            },
            back() {
                this.$router.push({
                    name: 'Login'
                })
            },
            goStep2() {
                this.$router.push({
                    name: 'ForgetPasswordStep2',
                    params: {
                        info: this.form
                    }
                })
            },
        },
    }
</script>
