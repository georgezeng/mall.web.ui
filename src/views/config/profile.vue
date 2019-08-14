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
            <div v-transfer-dom>
                <popup v-model="nicknameModal.open" style="background-color: #fff;">
                    <div :style="{height: popupHeight + 'px'}" style="position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePopup"/>
                        <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            编辑昵称
                        </div>
                        <group>
                            <x-input @on-blur="resetUI" class="optionalLine optionalCell" title="昵称"
                                     placeholder="请输入昵称"
                                     v-model="nicknameModal.value"></x-input>
                        </group>
                        <div style="position: fixed; bottom: 0px; width: 100%; z-index: 100; padding: 10px;">
                            <x-button action-type="button" :disabled="loading"
                                      style="width: 100%; background-color: #008CEB;"
                                      :show-loading="loading"
                                      @click.native="saveNickname">
                                <span style="font-size: 11pt; color: #fff;">保存</span>
                            </x-button>
                        </div>
                    </div>
                </popup>
            </div>
            <form style="display: none;" ref="uploadform" method="POST" enctype="multipart/form-data">
                <input ref="uploadFile" type="file" accept='image/*' name="file" @change="fileChange"/>
            </form>
            <group>
                <cell class="optionalLine optionalCell" style="margin: 5px 0;" is-link title="头像"
                      @click.native="editAvatar">
                    <Avatar ref="avatar" size="large" style="position: absolute; right: 15px; top: -24px;"
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
                          @on-confirm="changeBirthday"
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
                config,
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
                popupHeight: 0,
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
                return this.info.avatar ?
                    (this.info.avatar.startsWith('http') ?
                        this.info.avatar
                        : config.publicBucketDomain + this.info.avatar)
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
            fileChange() {
                const formData = new FormData(this.$refs.uploadform)
                formData.append('file', this.$refs.uploadFile.files[0])
                this.$vux.loading.show({
                    text: '上传中...'
                })
                API.uploadAvatar(formData).then(filePath => {
                    // window.location.reload(true)
                    this.info.avatar = filePath// + '?d=' + new Date().getTime()
                    this.$vux.toast.show({text: '上传成功', type: 'success'})
                    this.$vux.loading.hide()
                }).catch(e => {
                    this.$vux.loading.hide()
                })
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            closePopup() {
                this.nicknameModal.open = false
            },
            saveNickname() {
                if (!this.nicknameModal.value || this.nicknameModal.value == '') {
                    this.$vux.toast.show({text: '昵称不能为空', type: 'text'})
                    return
                }
                if (this.nicknameModal.value.length > 15) {
                    this.$vux.toast.show({text: '昵称长度不能超过15个字符', type: 'text'})
                    return
                }
                this.loading = true
                this.info.nickname = this.nicknameModal.value
                API.save({
                    ...this.info,
                    sex: this.info.sex.name
                }).then(res => {
                    this.loading = false
                    this.closePopup()
                }).catch(e => {
                    this.loading = false
                })
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
                // if (!Util.isInWechat()) {
                //     return
                // }
                // let info = this.info
                // Util.uploadImageFromWechat('avatar.png', (url) => {
                //     this.loading = true
                //     info.avatar = url
                //     API.save({
                //         ...info,
                //         sex: info.sex.name
                //     }).then(res => {
                //         window.location.reload(true)
                //     }).catch(e => {
                //         this.loading = false
                //     })
                // })
                this.$refs.uploadFile.click()
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
            this.popupHeight = document.documentElement.clientHeight
            this.load()
            // if (Util.isInWechat()) {
            //     Util.wxConfig([
            //         'chooseImage',
            //         'uploadImage'
            //     ])
            // }
        }
    }
</script>
