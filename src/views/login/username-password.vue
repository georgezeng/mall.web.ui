<template>
    <div style="border: none; padding: 20px;">
        <Form ref="form" :model="form" :rules="rules" :label-width="0">
            <FormItem prop="username">
                <Input clearable size="large" prefix="ios-phone-portrait" v-model="form.username" placeholder="输入手机号"></Input>
            </FormItem>
            <FormItem prop="password">
                <Input clearable size="large" v-model="form.password" prefix="ios-lock" type="password"
                       placeholder="输入密码"></Input>
            </FormItem>
            <x-button :disabled="loading" style="width: 100%; background-color: #008CEB;" :show-loading="loading" @click.native="login">
                <span style="font-size: 11pt; color: #fff;">登录</span>
            </x-button>
            <a href="javascript:;"
               style="float: right; margin-top: 10px;"
               @click="goForgetPassword">忘记密码?</a>
        </Form>
    </div>
</template>
<script>
    import {Message} from 'iview'
    import API from '../../api/login'
    import Util from '../../libs/util'
    export default {
        data() {
            return {
                loading: false,
                form: {
                    username: '',
                    password: '',
                    type: 'UsernamePassword'
                },
                rules: {
                    username: [
                        {required: true, message: '手机号不能为空', trigger: 'change'},
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'}
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
                            Util.setToken(data.token)
                            Util.put('userId', data.userId)
                            this.goCenter()
                        }).catch(ex => {
                            this.loading = false
                        })
                    }
                })
            },
            goForgetPassword() {
                this.$router.push({
                    name: 'ForgetPasswordStep1'
                })
            },
            goCenter() {
                this.$router.push({
                    name: 'MyCenter'
                })
            }
        }
    }
</script>
