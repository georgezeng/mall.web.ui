<style scoped lang="less">
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header style="background-color: #fff; height: 60px;">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">账号安全</div>
        </Header>
        <Content :style="commonStyles.content">
            <Modal v-model="passwordModal.open"
                   :mask-closable="true"
                   :closable="true">
                <p slot="header" style="text-align: center;">
                    <span>{{passwordModalTitle}}</span>
                </p>
                <Form ref="passwordForm" :model="passwordModal.form" :rules="passwordModal.rules" :label-width="80">
                    <FormItem v-if="passwordModal.toEdit" label="旧密码" prop="oldPassword">
                        <Input size="large" type="password" v-model="passwordModal.form.oldPassword"></Input>
                    </FormItem>
                    <FormItem v-else label="验证码" prop="verifyCode">
                        <Input size="large" v-model="passwordModal.form.verifyCode" @on-search="sendCode" search
                               :enter-button="passwordModal.codeBtnText"
                               placeholder="输入验证码"></Input>
                    </FormItem>
                    <FormItem label="新密码" prop="password">
                        <Input size="large" type="password" v-model="passwordModal.form.password"></Input>
                    </FormItem>
                    <FormItem label="确认密码" prop="confirmPassword">
                        <Input size="large" type="password" v-model="passwordModal.form.confirmPassword"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" size="large" long :loading="loading" @click="savePassword">保存</Button>
                </div>
            </Modal>
            <div class="blockLine"></div>
            <div class="optionPanel" @click="editPassword">
                <span>修改密码</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="resetPassword">
                <span>重置密码</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../../../api/security.js'
    import WechatAPI from '../../../../api/wechat.js'
    import config from '../../../../config/index.js'
    import Util from '../../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../../styles/common.js'
    import wx from 'weixin-js-sdk'

    export default {
        components: {},
        data() {
            const pwdCheck = (rule, value, callback) => {
                if (this.passwordModal.form.password !== '' && this.passwordModal.form.password !== value) {
                    callback(new Error('确认密码与新密码不相同'));
                } else {
                    callback();
                }
            }
            const codeCheck = (rule, value, callback) => {
                if (!this.passwordModal.form.oldPassword) {
                    callback(new Error('验证码不能为空'));
                } else {
                    callback();
                }
            }
            return {
                commonStyles,
                loading: false,
                passwordModal: {
                    codeLoading: false,
                    codeBtnText: '获取验证码',
                    open: false,
                    toEdit: false,
                    form: {
                        verifyCode: null,
                        oldPassword: null,
                        password: null,
                        confirmPassword: null
                    },
                    rules: {
                        oldPassword: [
                            {required: true, message: '旧密码不能为空', trigger: 'change'},
                        ],
                        password: [
                            {required: true, message: '新密码不能为空', trigger: 'change'},
                        ],
                        confirmPassword: [
                            {required: true, validator: pwdCheck, trigger: 'change'},
                        ],
                        verifyCode: [
                            {required: true, validator: codeCheck, trigger: 'change'},
                        ],
                    }
                }
            }
        },
        computed: {
            isWechat() {
                return Util.isInWechat()
            },
            passwordModalTitle() {
                return this.passwordModal.toEdit ? '修改密码' : '重置密码'
            }
        },
        methods: {
            back() {
                Util.go('MySetting')
            },
            editPassword() {
                this.toEditPassword(true)
            },
            resetPassword() {
                this.toEditPassword(false)
            },
            toEditPassword(toEdit) {
                this.passwordModal.form = {
                    verifyCode: '',
                    oldPassword: '',
                    password: '',
                    confirmPassword: ''
                }
                this.$refs.passwordForm.resetFields()
                this.passwordModal.toEdit = toEdit
                this.passwordModal.open = true
            },
            closePasswordModal() {
                this.passwordModal.open = false
            },
            savePassword() {
                this.$refs.passwordForm.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        if (!this.passwordModal.toEdit) {
                            API.resetPassword({
                                ...this.passwordModal.form,
                                oldPassword: this.passwordModal.fom.verifyCode
                            }).then(res => {
                                this.loading = false
                                this.closePasswordModal()
                                Message.success('保存成功')
                            }).catch(e => {
                                this.loading = false
                            })
                        } else {
                            API.updatePassword(this.passwordModal.form).then(res => {
                                this.loading = false
                                this.closePasswordModal()
                                Message.success('保存成功')
                            }).catch(e => {
                                this.loading = false
                            })
                        }
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
                if (this.codeLoading) {
                    return
                }
                this.disableVerifyCodeBtn(30)
                API.sendCode().then(res => {
                    Message.success("发送成功")
                })
            },
        },
    }
</script>
