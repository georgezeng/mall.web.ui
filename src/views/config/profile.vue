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
        padding: 10px;
        position: relative;
        .img {
            position: relative;
            top: 5px;
        }
        .goArrow {
            position: absolute;
            top: 10px;
            right: 7px;
            color: #414141;
        }
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header style="background-color: #fff; height: 40px;">
            <Icon size="24" style="left: 10px; position: absolute; top: 10px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: -10px;">个人信息</div>
        </Header>
        <Content :style="commonStyles.content">
            <div class="blockLine"></div>
            <div class="optionPanel" @click="editAvatar">
                <span>头像</span>
                <Avatar style="position: absolute; right: 30px; top: 5px;" :src="avatar" />
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel">
                <span>账号</span>
                <span style="position: absolute; right: 15px; top: 10px;">{{info.username}}</span>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editNickname">
                <span>昵称</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editSex">
                <span>性别</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="editBirthday">
                <span>生日</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
        </Content>
        <Footer :style="commonStyles.footer"/>
    </Layout>
</template>
<script>
    import API from '../../api/profile.js'
    import WechatAPI from '../../api/wechat.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import Footer from '../footer'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'

    export default {
        components: {
            Footer
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
                return this.info.avatar ?
                    (this.info.avatar.startsWith('http') ?
                        this.info.avatar
                        : config.baseUrl + '/' + this.info.avatar)
                    : defaultAvatar
            }
        },
        methods: {
            back() {
                Util.go('MyCenter')
            },
            editAvatar() {
                wx.ready(function() {alert(2)
                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            wx.uploadImage({
                                localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    var serverId = res.serverId; // 返回图片的服务器端ID
                                    WechatAPI.uploadFile(serverId)
                                }
                            });
                        }
                    })
                })
            },
            editNickname() {

            },
            editSex() {

            },
            editBirthday() {

            },
        },
        mounted() {
            API.load().then(data => {
                this.info = data
            })
            WechatAPI.jsConfig(window.location.href).then(data => {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonce, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名
                    jsApiList: [] // 必填，需要使用的JS接口列表
                });
            })
        }
    }
</script>
