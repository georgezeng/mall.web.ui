<style scoped lang="less">
    .header {
        background-color: #F1CA6F;
        height: 60px;
        box-shadow: 0px 0px 3px -1px gray;
        position: fixed;
        width: 100%;
        z-index: 100;
        color: #fff;
    }

    .bg {
        background-image: url("../../images/share-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
    }

    .share-btn {
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url("../../images/share-btn.png");
        position: absolute;
        bottom: 0px;
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
                <popup v-model="showShare" style="background-color: #fff;">
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
                 style="position: fixed; background-color: rgba(0, 0, 0, 0.8); width: 100%; z-index: 100000;"
                 :style="{height: minHeight}">
                <img :src="ShareTipArrow" width="111" height="99" style="position: absolute; right: 20px;"/>
                <div style="color: #fff; position: relative; top: 100px; left: 30px;">
                    点击右上角的"..."，分享给你的好友吧
                </div>
            </div>

            <div v-if="showShareTipInBrowser"
                 @click="closeShareTipPopup"
                 style="position: fixed; width: 100%; z-index: 100000;"
                 :style="{height: popupHeight}" align="center">
                <div style="color: #fff; line-height: 400px; font-size: 14pt; font-weight: bold;">
                    如果不成功请打开浏览器的菜单进行分享
                </div>
            </div>
            <div v-if="popup" :style="popupStyle" style="position: absolute; top: 50px;">
                <img crossorigin="use-credentials" :src="popupImgSrc" :width="popupImgWidth" :height="popupImgHeight"/>
                <div style="position: relative; top: -45px; border-top: 1px solid #CC6E2D;">
                </div>
                <div @click="save"
                     style="position: absolute; bottom: 15px; left: 10px; color: #CC6E2D; padding-right: 17px; border-right: 1px solid #CC6E2D;">
                    <Icon size="16" type="md-download"/>
                    保存海报到手机
                </div>
                <div @click="showSharePopup" style="position: absolute; bottom: 15px; right: 10px; color: #CC6E2D;">
                    <Icon size="16" type="md-share"/>
                    分享邀请好友
                </div>
            </div>
            <Modal v-model="popup" footer-hide fullscreen>
            </Modal>
            <div class="bg" :style="bgStyle">
                <div @click="showPoster" class="share-btn" :style="btnStyle"></div>
            </div>
            <div align="center">
                <div style="width: 100px; text-align: center; padding: 10px; border-bottom: 3px solid lightgray; margin-bottom: 40px;">
                    分享动态
                </div>
            </div>
            <div v-for="item in list" :key="item.id">
                <div style="margin-top: 20px;"></div>
                <mt-cell style="border-bottom: 1px solid #F5F5F5;">
                    <div slot="title">
                        <div style="display: inline-block; margin-right: 10px;">
                            <Avatar style="position: relative; top: -10px;" size="large" :src="avatar(item.avatar)"/>
                        </div>
                        <div style="display: inline-block;">
                            <div style="margin-bottom: 5px;">{{item.nickname}}</div>
                            <div>{{item.username}}</div>
                        </div>
                    </div>
                    <div>{{item.createTime}}</div>
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

    export default {
        components: {},
        data() {
            return {
                config,
                ShareTipArrow,
                commonStyles,
                bgStyle: null,
                btnStyle: null,
                page: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'createTime'
                },
                list: [],
                allLoaded: false,
                loadingList: false,
                showLoading: false,
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
                minHeight: 0
            }
        },
        computed: {},
        methods: {
            share(type) {
                try {
                    this.nativeShare.call(type)
                    // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
                    // 类似的命令下面有介绍
                } catch (e) {
                    // 如果不支持，你可以在这里做降级处理
                }
            },
            closeShareTipPopup() {
                this.showShareTip = false
                this.showShareTipInBrowser = false
                this.showShare = false
            },
            showSharePopup() {
                this.closePoster()
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
            updateShare() {
                let uid = UrlParams(window.location.href, 'uid')
                if (uid) {
                    uid = '?uid=' + uid.replace(/#.+/, '')
                } else {
                    uid = ''
                }
                const params = {
                    title: '注册邀请', // 分享标题
                    desc: item.nickname + '邀请您注册成为商城会员', // 分享描述
                    link: window.location.protocol + "//" + window.location.host + "/" + uid + "#/Home", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: null, // 分享图标
                }
                if (Util.isInWechat()) {
                    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                        wx.updateAppMessageShareData(params)
                        wx.updateTimelineShareData(params)
                    })
                } else {
                    this.nativeShare.setShareData({
                        icon: params.imgUrl,
                        link: params.link,
                        title: params.title,
                        desc: params.desc
                    })
                }
            },
            save() {
                const link = this.popupImgSrc

                const blob = new Blob([''], {type: 'application/octet-stream'});

                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');

                a.href = link;

                a.download = link.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];

                const e = document.createEvent('MouseEvents');

                e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                a.dispatchEvent(e);

                URL.revokeObjectURL(url);
            },
            closePoster() {
                this.popup = false
            },
            showPoster() {
                this.popupImgSrc = config.baseUrl + '/client/poster.png?d=' + new Date().getTime()
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
            }
        },
        mounted() {
            this.load()
            this.bgStyle = {
                width: document.documentElement.clientWidth + 'px',
                height: document.documentElement.clientWidth * 786 / 1125 + 'px'
            }
            this.btnStyle = {
                width: document.documentElement.clientWidth * 0.8 + 'px',
                height: document.documentElement.clientWidth * 0.8 * 192 / 885 + 'px',
                left: document.documentElement.clientWidth * 0.1 + 'px'
            }
            this.popupImgWidth = document.documentElement.clientWidth * 0.8
            this.popupImgHeight = document.documentElement.clientWidth * 0.8 * 1497 / 984
            this.popupStyle = {
                left: document.documentElement.clientWidth * 0.1 + 'px'
            }
            this.minHeight = document.documentElement.clientHeight + 'px'
            this.popupHeight = document.documentElement.clientHeight * 0.75 + 'px'
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'updateAppMessageShareData',
                ])
            }
        }
    }
</script>
