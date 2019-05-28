<style scoped lang="less">
    .blockLine {
        height: 10px;
        background-color: #F5F5F5;
    }

    .blockLine2 {
        height: 2px;
        background-color: #F5F5F5;
    }

    .optionPanel {
        font-size: 11pt;
        padding: 20px 10px;
        position: relative;
        .goArrow {
            position: absolute;
            top: 20px;
            right: 7px;
            color: #414141;
        }
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header style="background-color: #fff; height: 60px;">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">个人信息</div>
        </Header>
        <Content :style="commonStyles.content">
            <Modal v-model="nicknameModal.open"
                   :mask-closable="false"
                   title="编辑昵称" :closable="false">
                <Form ref="nicknameForm" :rules="nicknameModal.rules" :label-width="60">
                    <FormItem label="昵称" prop="nickname">
                        <Input v-model="nicknameModal.value"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="warning" :loading="loading" @click="closeNicknameModal">取消</Button>
                    <Button type="primary" :loading="loading" @click="saveNickname">保存</Button>
                </div>
            </Modal>
            <div class="blockLine"></div>
            <div class="optionPanel" @click="editAvatar">
                <span>头像</span>
                <Avatar ref="avatar" size="large" style="position: absolute; right: 30px; top: 10px;" :src="avatar"/>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel">
                <span>账号</span>
                <span style="position: absolute; right: 30px; top: 20px;">{{info.username}}</span>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editNickname">
                <span>昵称</span>
                <span style="position: absolute; right: 30px; top: 20px;">{{info.nickname}}</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editSex">
                <span>性别</span>
                <span ref="sex" id="sex" style="position: absolute; right: 30px; top: 20px;">{{sex}}</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editBirthday">
                <span>生日</span>
                <span ref="birthday" id="birthday"
                      style="position: absolute; right: 30px; top: 20px;">{{info.birthday}}</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/profile.js'
    import WechatAPI from '../../api/wechat.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'
    import wx from 'weixin-js-sdk'
    import MobileSelect from 'mobile-select'

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
                dates: [],
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
                return this.info.sex.text
            },
            isWechat() {
                return Util.isInWechat()
            }
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
                    new MobileSelect({
                        trigger: '#sex',
                        title: '性别',
                        wheels: [
                            {
                                data: [
                                    {id: 'Secret', value: '保密'},
                                    {id: 'Male', value: '男'},
                                    {id: 'Female', value: '女'}
                                ]
                            }
                        ],
                        callback: function (indexArr, data) {
                            info.sex = {
                                name: data[0].id,
                                text: data[0].value
                            }
                            API.save({
                                ...info,
                                sex: info.sex.name
                            });
                        }
                    });
                    new MobileSelect({
                        trigger: '#birthday',
                        title: '生日',
                        wheels: [
                            {
                                data: this.dates
                            }
                        ],
                        callback: function (indexArr, data) {
                            info.birthday = data[2].id
                            self.$refs.birthday.innerText = info.birthday
                            API.save({
                                ...info,
                                sex: info.sex.name
                            });
                        }
                    });
                })
            },
            back() {
                Util.go('MyCenter')
            },
            editAvatar() {
                if (this.isWechat) {
                    wx.ready(function () {
                        wx.chooseImage({
                            count: 1, // 默认9
                            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                            success: function (res) {
                                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                                wx.uploadImage({
                                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                                    isShowProgressTips: 1, // 默认为1，显示进度提示
                                    success: function (res) {
                                        let serverId = res.serverId; // 返回图片的服务器端ID
                                        WechatAPI.uploadFile(serverId, 'avatar.png').then(res => {
                                            Message.success('上传成功')
                                            setTimeout(function () {
                                                window.location.reload(true)
                                            }, 1000)
                                        })
                                    }
                                });
                            }
                        })
                    })
                }
            },
            editSex() {
                this.$refs.sex.click()
            },
            editNickname() {
                this.nicknameModal.value = this.info.nickname
                this.nicknameModal.open = true
            },
            editBirthday() {
                this.$refs.birthday.click()
            },
        },
        mounted() {
            this.load()
            if (this.isWechat) {
                Util.wxConfig([
                    'chooseImage',
                    'uploadImage'
                ])
            }
            const dates = []
            let index = 1
            for (let i = 1950; i < 2100; i++) {
                const year = i
                const isLeap = i % 4 == 0 && i % 100 == 0
                const months = []
                for (let j = 1; j < 13; j++) {
                    const currentMonth = j < 10 ? ('0' + j) : (j + '')
                    const days = []
                    for (let k = 1; k < 29; k++) {
                        const currentDay = k < 10 ? ('0' + k) : (k + '')
                        days.push({
                            id: year + '-' + currentMonth + '-' + currentDay,
                            value: currentDay
                        })
                    }
                    for (let k = 29; k < 32; k++) {
                        const currentDay = k + ''
                        if (k == 29) {
                            if (j != 2 || j == 2 && isLeap) {
                                days.push({
                                    id: year + '-' + currentMonth + '-' + currentDay,
                                    value: currentDay
                                })
                            }
                        } else if(k == 30 && j != 2) {
                            days.push({
                                id: year + '-' + currentMonth + '-' + currentDay,
                                value: currentDay
                            })
                        } else if(k == 31 && j != 2) {
                            switch(j) {
                                case 1:
                                case 3:
                                case 5:
                                case 7:
                                case 8:
                                case 10:
                                case 12: {
                                    days.push({
                                        id: year + '-' + currentMonth + '-' + currentDay,
                                        value: currentDay
                                    })
                                }
                            }
                        }
                    }
                    months.push({
                        id: year + '-' + currentMonth,
                        value: currentMonth,
                        childs: days
                    })
                }
                dates.push({
                    id: year,
                    value: year,
                    childs: months
                })
            }
            this.dates = dates
        }
    }
</script>
