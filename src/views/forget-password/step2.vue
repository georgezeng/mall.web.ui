<template>
    <Layout style="margin: 0 auto; padding: 0;">
        <Header style="margin:0; padding: 0 10px; background-color: #DA4935; position: fixed; z-index: 100; width: 100%; color: #fff; font-size: 16pt; text-align: center;">
            <Icon type="ios-arrow-back" size="30" style="position: absolute; top: 18px; left: 10px;" @click="back" />
            <div>重置密码</div>
        </Header>
        <Content :style="{padding: '20px', paddingTop: '100px', backgroundColor: '#fff'}">
            <Form ref="form" :model="form" :rules="rules" :label-width="75">
                <FormItem label="新密码" prop="password">
                    <Input size="large" type="password" v-model="form.password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirmPassword">
                    <Input size="large" type="password" v-model="form.confirmPassword"></Input>
                </FormItem>
                <Button size="large" :loading="loading" long type="warning" @click="reset">重置</Button>
            </Form>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/forget-password'
    import {Message} from 'iview'

    export default {
        data() {
            const confirmPwdCheck = (rule, value, callback) => {
                if (this.form.password != value) {
                    callback(new Error('确认密码与新密码不相同'));
                } else {
                    callback();
                }
            }
            return {
                loading: false,
                info: null,
                form: {
                    username: null,
                    password: '',
                    confirmPassword: ''
                },
                rules: {
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'},
                        {
                            type: 'string',
                            pattern: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,}$/,
                            message: '密码必须数字+字母（区分大小写）并且不少于8位',
                            trigger: 'change'
                        }
                    ],
                    confirmPassword: [
                        {required: true, validator: confirmPwdCheck, trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            reset() {
                this.$refs.form.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        this.form.username = this.info.username
                        API.reset(this.form, this.info.password).then(res => {
                            this.loading = false
                            Message.success('重置成功')
                            this.goLogin()
                        }).catch(ex => {
                            this.loading = false
                        })
                    }
                })
            },
            back() {
                this.$router.push({
                    name: 'ForgetPasswordStep1'
                })
            },
            goLogin() {
                this.$router.push({
                    name: 'Login'
                })
            },
        },
        mounted() {
            this.info = this.$router.currentRoute.params.info
        }
    }
</script>
