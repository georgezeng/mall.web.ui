<template>
    <Layout :style="commonStyles.layout">
        <Header :style="commonStyles.header">
            <Icon type="ios-arrow-back" size="30" :style="commonStyles.backArrow" @click="back" />
            <div>忘记密码</div>
        </Header>
        <Content :style="commonStyles.content">
            <Form ref="form" style="margin-top: 100px; padding: 20px;" :model="form" :rules="rules" :label-width="0">
                <FormItem prop="username">
                    <Input clearable size="large" prefix="ios-phone-portrait" v-model="form.username" placeholder="输入手机号"></Input>
                </FormItem>
                <FormItem prop="password">
                    <Input ref="verifyCode" clearable size="large" v-model="form.password" @on-search="sendCode" search
                           :enter-button="codeBtnText"
                           placeholder="输入验证码"></Input>
                </FormItem>
                <x-button action-type="button" :disabled="loading" style="width: 100%; background-color: #FF992D;" :show-loading="loading" @click.native="check">
                    <span style="font-size: 11pt; color: #fff;">下一步</span>
                </x-button>
            </Form>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/forget-password'
    import {Message} from 'iview'
    import commonStyles from '../../styles/common.js'
    import Util from '../../libs/util.js'
    import $ from 'jquery'

    export default {
        data() {
            return {
                commonStyles,
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
                    this.$vux.toast.show({text:"发送成功"})
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
                Util.go('Login')
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
        mounted() {
            setTimeout(() => {
                $(this.$refs.verifyCode.$el).find('.ivu-input-search').css('cssText', 'background-color: #B69C7D !important; border-color: #B69C7D !important;')
            }, 10)
        }
    }
</script>
