<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        box-shadow: 0px 0px 3px -1px gray;
        position: fixed;
        width: 100%;
        z-index: 100;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">账号安全</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <div v-transfer-dom>
                <popup v-model="passwordModal.editOpen" style="background-color: #fff;">
                    <div :style="{height: popupHeight + 'px'}" style="position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePasswordPopup"/>
                        <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            修改密码
                        </div>
                        <group>
                            <PasswordInput :value="passwordModal.form.oldPassword" placeholder="请输入旧密码" title="旧密码" @change="changeOldPassword" />
                            <PasswordInput :value="passwordModal.form.password" placeholder="请输入新密码" title="新密码"
                                           @change="changeNewPassword"/>
                            <PasswordInput :value="passwordModal.form.confirmPassword" placeholder="请输入确认密码"
                                           title="确认密码" @change="changeConfirmPassword"/>
                        </group>
                        <div style="position: fixed; bottom: 0px; width: 100%; z-index: 100; padding: 10px;">
                            <x-button action-type="button" :disabled="loading"
                                      style="width: 100%; background-color: #008CEB;"
                                      :show-loading="loading"
                                      @click.native="savePassword">
                                <span style="font-size: 11pt; color: #fff;">保存</span>
                            </x-button>
                        </div>
                    </div>
                </popup>

                <popup v-model="passwordModal.resetOpen" style="background-color: #fff;">
                    <div :style="{height: popupHeight + 'px'}" style="position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePasswordPopup"/>
                        <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            设置/重置密码
                        </div>
                        <group>
                            <x-input class="optionalLine optionalCell" style="width: 65%; float: left;"
                                     title="验证码" placeholder="请输入验证码"
                                     v-model="passwordModal.form.verifyCode">
                            </x-input>
                            <x-button action-type="button"
                                      :disabled="passwordModal.loading"
                                      style="position: relative; top: 10px; left: -10px;float: right; width: 35%; background-color: #008CEB;"
                                      @click.native="sendCode">
                                <span style="font-size: 11pt; color: #fff;">{{passwordModal.codeBtnText}}</span>
                            </x-button>
                            <PasswordInput :value="passwordModal.form.password" placeholder="请输入新密码" title="新密码"
                                           @change="changeNewPassword"/>
                            <PasswordInput :value="passwordModal.form.confirmPassword" placeholder="请输入确认密码"
                                           title="确认密码" @change="changeConfirmPassword"/>
                        </group>
                        <div style="position: fixed; bottom: 0px; width: 100%; z-index: 100; padding: 10px;">
                            <x-button action-type="button" :disabled="loading"
                                      style="width: 100%; background-color: #008CEB;"
                                      :show-loading="loading"
                                      @click.native="savePassword">
                                <span style="font-size: 11pt; color: #fff;">保存</span>
                            </x-button>
                        </div>
                    </div>
                </popup>
            </div>


            <group>
                <cell class="optionalLine optionalCell" is-link title="修改密码" @click.native="editPassword"/>
                <cell class="optionalLine optionalCell" is-link title="设置/重置密码" @click.native="resetPassword"/>
            </group>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../../api/security.js'
    import Util from '../../../libs/util.js'
    import commonStyles from '../../../styles/common.js'
    import $ from 'jquery'
    import PasswordInput from '../../components/password-input'

    export default {
        components: {
            PasswordInput
        },
        data() {
            return {
                commonStyles,
                loading: false,
                passwordModal: {
                    loading: false,
                    codeLoading: false,
                    codeBtnText: '获取验证码',
                    editOpen: false,
                    resetOpen: false,
                    form: {
                        verifyCode: null,
                        oldPassword: null,
                        password: null,
                        confirmPassword: null
                    },
                },
                popupHeight: 0,
                input: false
            }
        },
        computed: {},
        methods: {
            changeOldPassword(value) {
                this.passwordModal.form.oldPassword = value
            },
            changeConfirmPassword(value) {
                this.passwordModal.form.confirmPassword = value
            },
            changeNewPassword(value) {
                this.passwordModal.form.password = value
            },
            resetUI(value, e) {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            back() {
                Util.go('MySetting')
            },
            editPassword() {
                this.resetPasswordPopup()
                this.passwordModal.editOpen = true
            },
            resetPassword() {
                this.resetPasswordPopup()
                this.passwordModal.resetOpen = true
            },
            resetPasswordPopup() {
                this.passwordModal.form = {
                    verifyCode: '',
                    oldPassword: '',
                    password: '',
                    confirmPassword: ''
                }
            },
            closePasswordPopup() {
                this.passwordModal.editOpen = false
                this.passwordModal.resetOpen = false
            },
            savePassword() {
                if (this.passwordModal.resetOpen) {
                    if (!this.passwordModal.form.verifyCode || this.passwordModal.form.verifyCode == '') {
                        this.$vux.toast.show({text: '验证码不能为空', type: 'text', width: '200px'})
                        return
                    }
                } else {
                    if (!this.passwordModal.form.oldPassword || this.passwordModal.form.oldPassword == '') {
                        this.$vux.toast.show({text: '旧密码不能为空', type: 'text', width: '200px'})
                        return
                    }
                }
                if (!this.passwordModal.form.password || this.passwordModal.form.password == '') {
                    this.$vux.toast.show({text: '新密码不能为空', type: 'text', width: '200px'})
                    return
                }
                if (!this.passwordModal.form.confirmPassword || this.passwordModal.form.confirmPassword == '') {
                    this.$vux.toast.show({text: '确认密码不能为空', type: 'text', width: '200px'})
                    return
                }

                this.loading = true
                const delay = 2000
                if (this.passwordModal.resetOpen) {
                    API.resetPassword({
                        ...this.passwordModal.form,
                        oldPassword: this.passwordModal.form.verifyCode
                    }).then(res => {
                        this.loading = false
                        this.closePasswordPopup()
                        this.$vux.toast.show({text: '设置成功，重置密码，须重新登录', width: '200px', time: delay})
                        setTimeout(() => {
                            Util.getForNav()
                            Util.setToken(null)
                            Util.go('Login', {
                                tab: 'password'
                            })
                        }, delay)
                    }).catch(e => {
                        this.loading = false
                    })
                } else {
                    API.updatePassword(this.passwordModal.form).then(res => {
                        this.loading = false
                        this.closePasswordPopup()
                        this.$vux.toast.show({text: '设置成功，修改密码，须重新登录', width: '200px', time: delay})
                        setTimeout(() => {
                            Util.getForNav()
                            Util.setToken(null)
                            Util.go('Login', {
                                tab: 'password'
                            })
                        }, delay)
                    }).catch(e => {
                        this.loading = false
                    })
                }
            },
            disableVerifyCodeBtn(second) {
                if (second > 0) {
                    this.passwordModal.codeBtnText = second + '秒后重试'
                    let self = this
                    setTimeout(function () {
                        self.disableVerifyCodeBtn(second - 1)
                    }, 1000)
                    return
                }
                this.passwordModal.loading = false
                this.passwordModal.codeBtnText = '获取验证码'
            },
            sendCode() {
                this.passwordModal.loading = true
                this.disableVerifyCodeBtn(30)
                API.sendCode().then(res => {
                    this.$vux.toast.show({text: '发送成功'})
                })
            },
        },
        mounted() {
            this.popupHeight = document.documentElement.clientHeight
        }
    }
</script>
