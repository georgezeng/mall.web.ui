<template>
    <div style="border: none; padding: 20px;">
        <Form ref="form" :model="form" :rules="rules" :label-width="0">
            <FormItem prop="username">
                <Input size="large" prefix="ios-phone-portrait" v-model="form.username" placeholder="输入手机号"></Input>
            </FormItem>
            <FormItem prop="password">
                <Input size="large" v-model="form.password" prefix="ios-lock" type="password"
                       placeholder="输入密码"></Input>
            </FormItem>
            <Button @click="login" long
                    size="large"
                    type="primary"
                    class="margin-right"
                    :loading="loading">登录
            </Button>
            <a href="javascript:;"
               style="float: right; margin-top: 10px;"
               @click="goForgetPassword">忘记密码?</a>
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
                        API.login(this.form).then(res => {
                            this.loading = false
                            this.goProfile()
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
            goProfile() {
                this.$router.push({
                    name: 'Profile'
                })
            }
        }
    }
</script>
