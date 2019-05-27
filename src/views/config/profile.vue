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
                <span id="sex" style="position: absolute; right: 30px; top: 20px;">{{sex}}</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editBirthday">
                <span>生日</span>
                <span style="position: absolute; right: 30px; top: 20px;">{{info.birthday}}</span>
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
        components: {
        },
        data() {
            return {
                defaultAvatar,
                commonStyles,
                info: {
                    avatar: null,
                    nickname: null,
                    username: null,
                    sex: null,
                    birthday: null
                }
            }
        },
        computed: {
            avatar() {
                if(this.info.avatar && !this.info.avatar.startsWith('http') && this.$refs.avatar) {
                    this.$refs.avatar.$el.children[0].crossOrigin = 'use-credentials'
                }
                return this.info.avatar ?
                    (this.info.avatar.startsWith('http') ?
                        this.info.avatar
                        : config.baseUrl + '/client/img/load?filePath=' + this.info.avatar)
                    : defaultAvatar
            },
            sex() {
                return this.info.sex ? this.info.sex.text : null
            },
            isWechat() {
                return Util.isInWechat()
            }
        },
        methods: {
            load() {
                API.load().then(data => {
                    this.info = data
                    let pos = 0
                    switch(data.sex.name) {
                        case 'Male': pos = 1; break;
                        case 'Female': pos = 2; break;
                    }
                    new MobileSelect({
                        trigger: '#sex',
                        title: '性别',
                        wheels: [
                            {
                                data:[
                                    {id: 'Secret', value: '保密'},
                                    {id: 'Male', value: '男'},
                                    {id: 'Female', value: '女'}
                                ]
                            }
                        ],
                        position:[pos],
                        callback: function(indexArr, data){
                            this.info.sex = {
                                name: data.id,
                                text: data.value
                            }
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

            },
            editNickname() {

            },
            editBirthday() {

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
        }
    }
</script>
