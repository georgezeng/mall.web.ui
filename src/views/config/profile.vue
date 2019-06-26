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
            <div align="center" style="position: relative; top: 0px;">个人信息</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <Modal v-model="nicknameModal.open"
                   :mask-closable="true"
                   :closable="true">
                <p slot="header" style="text-align: center;">
                    <span>编辑昵称</span>
                </p>
                <Form ref="nicknameForm" :rules="nicknameModal.rules" :label-width="0">
                    <FormItem prop="nickname">
                        <Input clearable size="large" v-model="nicknameModal.value"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" size="large" long :loading="loading" @click="saveNickname">保存</Button>
                </div>
            </Modal>
            <group>
                <cell class="optionalLine optionalCell" is-link title="头像" @click.native="editAvatar">
                    <Avatar ref="avatar" size="large" style="position: absolute; right: 15px; top: -20px;"
                            :src="avatar"/>
                </cell>
                <cell class="optionalLine optionalCell" :value="info.username" title="账号">
                </cell>
                <cell class="optionalLine optionalCell" is-link title="昵称" :value="info.nickname"
                      @click.native="editNickname">
                </cell>
                <popup-picker show-name
                              @on-change="changeSex"
                              class="optionalLine optionalPicker" title="性别"
                              :value="sex"
                              :data="sexList">
                </popup-picker>
                <datetime popup-title="生日"
                          @on-change="changeBirthday"
                          class="optionalLine optionalCell" title="生日"
                          :min-year="1900" :max-year="2100"
                          v-model="info.birthday"/>
            </group>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/profile.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'

    export default {
        components: {},
        data() {
            const nicknameCheck = (rule, value, callback) => {
                if (!this.nicknameModal.value || this.nicknameModal.value == '') {
                    callback(new Error('昵称不能为空'))
                    return
                }
                callback()
            }
            return {
                defaultAvatar,
                commonStyles,
                loading: false,
                sexList: [[
                    {
                        name: '保密',
                        value: 'Secret'
                    },
                    {
                        name: '男',
                        value: 'Male'
                    },
                    {
                        name: '女',
                        value: 'Female'
                    }
                ]],
                info: {
                    id: null,
                    avatar: null,
                    nickname: null,
                    username: null,
                    sex: null,
                    birthday: null
                },
                nicknameModal: {
                    open: false,
                    value: null,
                    rules: {
                        nickname: [
                            {required: true, validator: nicknameCheck, trigger: 'change'},
                        ],
                    }
                }
            }
        },
        computed: {
            avatar() {
                if (this.info.avatar && !this.info.avatar.startsWith('http') && this.$refs.avatar) {
                    this.$refs.avatar.$el.children[0].crossOrigin = 'use-credentials'
                }
                return this.info.avatar ?
                    (this.info.avatar.startsWith('http') ?
                        this.info.avatar
                        : config.baseUrl + '/client/img/load?filePath=' + this.info.avatar)
                    : defaultAvatar
            },
            sex() {
                if (!this.info.sex) {
                    this.info.sex = {
                        name: 'Secret',
                        text: '保密'
                    }
                }
                return [this.info.sex.name]
            },
        },
        methods: {
            saveNickname() {
                this.$refs.nicknameForm.validate().then(valid => {
                    if (valid) {
                        this.loading = true
                        this.info.nickname = this.nicknameModal.value
                        API.save({
                            ...this.info,
                            sex: this.info.sex.name
                        }).then(res => {
                            this.loading = false
                            this.closeNicknameModal()
                        }).catch(e => {
                            this.loading = false
                        })
                    }
                })
            },
            closeNicknameModal() {
                this.nicknameModal.open = false
            },
            load() {
                API.load().then(data => {
                    this.info = data
                    let self = this
                    let info = this.info
                })
            },
            back() {
                Util.go('MyCenter')
            },
            editAvatar() {
                if (!Util.isInWechat()) {
                    return
                }
                let info = this.info
                Util.uploadImageFromWechat('avatar.png', (url) => {
                    this.loading = true
                    info.avatar = url
                    API.save({
                        ...info,
                        sex: info.sex.name
                    }).then(res => {
                        window.location.reload(true)
                    }).catch(e => {
                        this.loading = false
                    })
                })
            },
            changeSex(option) {
                this.loading = true
                for (let i = 0; i < this.sexList[0].length; i++) {
                    let item = this.sexList[0][i]
                    if (item.value == option[0]) {
                        this.info.sex = {
                            name: item.value,
                            text: item.name
                        }
                        break;
                    }
                }
                API.save({
                    ...this.info,
                    sex: this.info.sex.name
                }).then(res => {
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            editNickname() {
                this.nicknameModal.value = this.info.nickname
                this.nicknameModal.open = true
            },
            changeBirthday(value) {
                this.loading = true
                API.save({
                    ...this.info,
                    sex: this.info.sex.name
                }).then(res => {
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
        },
        mounted() {
            this.load()
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'chooseImage',
                    'uploadImage'
                ])
            }
        }
    }
</script>
