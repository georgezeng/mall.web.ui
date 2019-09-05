<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        box-shadow: 0px 0px 3px -1px gray;
        position: fixed;
        width: 100%;
        z-index: 100;
    }

    .bg {
        background-image: url("../../images/invite-share-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
    }

    .save-to-local-btn {
        background-image: url("../../images/invite-save-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .invite-btn {
        background-image: url("../../images/invite-share-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .share-btn {
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url("../../images/invite-share-btn2.png");
        position: absolute;
        bottom: 20px;
    }

    .wechat-friend {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../images/wechat-friend.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .wechat-timeline {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../images/wechat-timeline.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .qq-friend {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../images/qq-friend.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .qq-zone {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../images/qq-zone.png");
        background-repeat: no-repeat;
        background-size: contain;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">我的邀请</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <div v-transfer-dom>
                <popup v-model="showShare" style="background-color: #fff; z-index: 1000000;">
                    <div style="height: 88px; position: relative;" align="center">
                        <div class="wechat-friend" @click="share('wechatFriend')"></div>
                        <div class="wechat-timeline" @click="share('wechatTimeline')"></div>
                        <div class="qq-friend" @click="share('qqFriend')"></div>
                        <div class="qq-zone" @click="share('qZone')"></div>
                    </div>
                </popup>
            </div>
            <div v-if="showShareTip"
                 @click="closeShareTipPopup"
                 style="position: fixed; top: 0px; background-color: rgba(0, 0, 0, 0.8); width: 100%; z-index: 100000;"
                 :style="{height: minHeight}">
                <img :src="ShareTipArrow" width="111" height="99" style="position: absolute; right: 20px;"/>
                <div style="color: #fff; position: relative; top: 100px; left: 30px;">
                    点击右上角的"..."，分享给您的好友吧
                </div>
            </div>

            <div v-if="showShareTipInBrowser"
                 @click="closeShareTipPopup"
                 style="position: fixed; top: 0px; width: 100%; z-index: 1000;"
                 :style="{height: popupHeight}" align="center">
                <div style="color: #fff; line-height: 400px; font-size: 14pt; font-weight: bold;">
                    如果不成功请打开浏览器的菜单进行分享
                </div>
            </div>
            <div v-show="popup" :style="popupStyle" style="position: fixed; top: 50px;">
                <img :src="popupImgSrc" :width="popupImgWidth" :height="popupImgHeight"/>
                <div class="save-to-local-btn" :style="saveBtnStyle"
                     style="position: absolute; bottom: 10px; left: 10px;">
                </div>
                <div class="invite-btn" @click="showSharePopup" :style="inviteBtnStyle"
                     style="position: absolute; bottom: 10px; right: 10px;">
                </div>
            </div>
            <Modal :value="showModal" @on-visible-change="popupChange" footer-hide fullscreen>
            </Modal>
            <div class="bg" :style="bgStyle">
                <div @click="showPoster" class="share-btn" :style="shareBtnStyle"></div>
            </div>
            <div style="font-size: 14px; padding: 10px;">累积邀请获得: {{totalPoints}} DBB</div>
            <div align="center">
                <div style="width: 100px; text-align: center; padding: 10px; border-bottom: 3px solid lightgray; margin-bottom: 40px;">
                    分享动态
                </div>
            </div>
            <div v-for="item in list" :key="item.id">
                <div style="margin-top: 20px;"></div>
                <mt-cell style="border-bottom: 1px solid #F5F5F5; overflow: auto;">
                    <div slot="title">
                        <div style="display: inline-block; margin-right: 5px;">
                            <Avatar style="position: relative; top: -8px;" size="large" :src="avatar(item.avatar)"/>
                        </div>
                        <div style="display: inline-block;">
                            <div style="margin-bottom: 5px;">{{item.nickname}}</div>
                            <div>{{item.username}}</div>
                        </div>
                    </div>
                    <div style="font-size: 14px;">
                        <div style="color: orangered; margin-bottom: 5px;">+ {{item.invitePoints ? item.invitePoints : 0}} DBB</div>
                        <div>{{item.createTime}}</div>
                    </div>
                </mt-cell>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/invite.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'
    import ShareTipArrow from '../../images/tip-arrow.png'
    import wx from 'weixin-js-sdk'
    import NativeShare from 'nativeshare'
    import UrlParams from 'get-url-param'
    import ProfileAPI from '../../api/profile.js'
    import md5 from 'md5'

    export default {
        components: {},
        data() {
            return {
                config,
                ShareTipArrow,
                commonStyles,
                bgStyle: null,
                shareBtnStyle: null,
                saveBtnStyle: null,
                inviteBtnStyle: null,
                totalPoints: 0,
                page: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'createTime'
                },
                list: [],
                allLoaded: false,
                loadingList: false,
                showLoading: true,
                popup: false,
                popupImgSrc: null,
                popupImgWidth: 0,
                popupImgHeight: 0,
                popupStyle: null,
                showShareTip: false,
                showShareTipInBrowser: false,
                showShare: false,
                nativeShare: new NativeShare(),
                popupHeight: 500,
                minHeight: 0,
                borderLeft: 0,
            }
        },
        computed: {
            showModal() {
                return this.popup && !this.showShareTipInBrowser && !this.showShareTip
            }
        },
        methods: {
            popupChange(value) {
                if (!value && !this.showShareTip && !this.showShareTipInBrowser) {
                    this.closePoster()
                }
            },
            share(type) {
                try {
                    this.nativeShare.call(type)
                    // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
                    // 类似的命令下面有介绍
                } catch (e) {
                    // 如果不支持，您可以在这里做降级处理
                }
            },
            closeShareTipPopup() {
                this.showPoster()
                this.showShareTip = false
                this.showShareTipInBrowser = false
                this.showShare = false
            },
            showSharePopup() {
                // this.closePoster()
                this.popupStyle.zIndex = 1
                const token = Util.getToken()
                if (!token) {
                    Util.go('Login')
                    return
                }
                if (Util.isInWechat()) {
                    this.showShareTip = true
                } else {
                    this.showShareTipInBrowser = true
                    this.showShare = true
                }
            },
            updateShare(item) {
                let uid = Util.get('userId')
                let nickname = item.nickname
                if (!nickname || nickname == '') {
                    nickname = '****' + item.username.substring(7)
                }
                const params = {
                    title: '注册邀请', // 分享标题
                    desc: nickname + '邀请您注册成为' + item.shopName + '会员', // 分享描述
                    link: window.location.protocol + "//" + window.location.host + "/?uid=" + uid + "#/Home", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: config.publicBucketDomain + 'common/logo-2.png', // 分享图标
                }
                if (Util.isInWechat()) {
                    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                        wx.updateAppMessageShareData(params)
                        wx.updateTimelineShareData(params)
                    })
                } else {
                    this.nativeShare.setShareData({
                        ...params,
                        icon: params.imgUrl
                    })
                }
            },
            md5(item) {
                let nickname = item.nickname
                if (!nickname || nickname == '') {
                    nickname = '****' + item.username.substring(7)
                }
                const seed = item.id + '_' + nickname
                return md5(seed)
            },
            closePoster() {
                this.popup = false
            },
            showPoster() {
                this.popupStyle.zIndex = 100000
                this.popup = true
            },
            back() {
                Util.go('MyCenter')
            },
            avatar(avatar) {
                return avatar ?
                    (avatar.startsWith('http') ?
                        avatar
                        : config.publicBucketDomain + avatar)
                    : defaultAvatar
            },
            load() {
                if (this.allLoaded) {
                    this.showLoading = false
                    return
                }
                if (this.loadingList) {
                    return
                }
                this.loadingList = true
                API.list(this.page).then(data => {
                    this.loadingList = false
                    if (data && data.length > 0) {
                        this.page.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.page.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        }
                    } else {
                        this.allLoaded = true
                        this.showLoading = false
                    }
                })
            },
            scrollHandler(e) {
                Util.scrollHandler(e, this)
            },
        },
        mounted() {
            window.addEventListener('scroll', this.scrollHandler)
            this.popupImgSrc = config.baseUrl + '/client/' + Util.get('userId') + '/poster/invite.png'
            this.load()
            this.bgStyle = {
                width: document.documentElement.clientWidth + 'px',
                height: document.documentElement.clientWidth * 500 / 750 + 'px'
            }
            this.shareBtnStyle = {
                width: document.documentElement.clientWidth * 0.5 + 'px',
                height: document.documentElement.clientWidth * 0.5 * 68 / 359 + 'px',
                left: document.documentElement.clientWidth * 0.25 + 'px'
            }
            this.saveBtnStyle = {
                width: document.documentElement.clientWidth * 0.35 + 'px',
                height: document.documentElement.clientWidth * 0.35 * 92 / 314 + 'px',
            }
            this.inviteBtnStyle = {
                width: document.documentElement.clientWidth * 0.35 + 'px',
                height: document.documentElement.clientWidth * 0.35 * 92 / 314 + 'px',
            }
            this.popupImgWidth = document.documentElement.clientWidth * 0.8
            this.borderLeft = document.documentElement.clientWidth * 0.42 + 'px'
            this.popupImgHeight = document.documentElement.clientWidth * 0.8 * 1497 / 984
            this.popupStyle = {
                left: document.documentElement.clientWidth * 0.1 + 'px'
            }
            if (document.documentElement.clientWidth < 330) {
                this.popupStyle.fontSize = '14px'
            }
            this.minHeight = document.documentElement.clientHeight + 'px'
            this.popupHeight = document.documentElement.clientHeight + 'px'
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'updateAppMessageShareData',
                    'updateTimelineShareData',
                ])
            }
            ProfileAPI.load().then(data => {
                this.updateShare(data)
            })
            API.loadTotalPoints().then(data => {
                this.totalPoints = data
            })
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
