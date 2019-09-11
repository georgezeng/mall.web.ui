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
        background-color: #AD9979;
        color: #fff;
        font-weight: bold;
        height: 160px;
        position: relative;
        font-size: 14px;
    }

    .member-rules-btn {
        position: absolute;
        right: 0px;
        top: 20px;
        background-color: rgba(255, 255, 255, 0.4);
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        padding: 5px 10px 5px 20px;
        font-size: 12px;
    }

    .qrcode_wrapper {
        position: absolute;
        right: 30px;
        top: 10px;
        text-align: center;
    }

    .qrcode {
        background-image: url("../../images/goods-share-logo.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 20px;
        height: 20px;
    }

    .invite-bg {
        background-image: url("../../images/invite-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 90%;
        text-align: left;
        position: relative;
    }

    .share-btn {
        position: absolute;
        right: 10px;
        top: 30px;
        background-image: url("../../images/points-share-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 100px;
        height: 25px;
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
            <div align="center" style="position: relative; top: 0px;">邀请好友</div>
        </Header>
        <Content :style="contentStyle" style="margin-top: 60px;">
            <div v-transfer-dom>
                <popup v-model="showShare" style="background-color: #fff; z-index: 1000000;">
                    <div style="height: 88px; position: relative;" align="center">
                        <div class="wechat-friend" @click="share('wechatFriend')"></div>
                        <div class="wechat-timeline" @click="share('wechatTimeline')"></div>
                        <div class="qq-friend" @click="share('qqFriend')"></div>
                        <div class="qq-zone" @click="share('qZone')"></div>
                    </div>
                </popup>
                <popup v-model="posterPopup" style="background-color: #fff; z-index: 1000000;">
                    <div style="height: 100px; position: relative; color: orangered; font-size: 14px;">
                        <div align="center" style="padding-top: 10px; font-weight: bold;">
                            海报分享提示
                        </div>
                        <div style="padding: 10px;">
                            长按图片保存海报到本地相册，把图片发送到好友或者朋友圈，好友可以扫描二维码进入商城购物！
                        </div>
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

            <div v-show="posterPopup" :style="posterPopupStyle" style="position: fixed;">
                <img :src="popupImgSrc" :width="posterWidth" :height="posterHeight"/>
            </div>

            <div v-if="showShareTipInBrowser"
                 @click="closeShareTipPopup"
                 style="position: fixed; top: 0px; width: 100%; z-index: 1000;"
                 :style="{height: popupHeight}" align="center">
                <div style="color: #fff; line-height: 400px; font-size: 14pt; font-weight: bold;">
                    如果不成功请打开浏览器的菜单进行分享
                </div>
            </div>

            <div class="bg">
                <div style="padding: 20px 0 20px 30px;">
                    <div style="margin-bottom: 10px;">注册多呗家居连锁品牌会员</div>
                    <div>线上线下购物享受超级优惠折扣</div>
                </div>
                <div @click="goMemberRules" class="member-rules-btn">
                    会员制度
                </div>
            </div>
            <div align="center" style="position: relative; top: -60px; color: #251F17;">
                <div class="invite-bg" :style="{height: inviteBgHeight + 'px'}">
                    <div style="padding: 20px; font-size: 14px;">我的邀请成绩</div>
                    <div @click="showPoster" class="qrcode_wrapper" align="center">
                        <div><img :src="ShareLogo" width="20" height="20"
                                  style="display: inline-block; vertical-align: bottom;"/></div>
                        <div style="font-size: 10px;">分享海报</div>
                    </div>
                    <div :style="{marginTop: numsMarginTop}" align="center">
                        <div style="display: inline-block; margin-right: 20px;">
                            <div>
                                <span style="font-size: 14pt; font-weight: bold;">{{data.totalPeople}}</span> <span
                                    style="font-size: 12px;">人</span>
                            </div>
                            <div style="font-size: 12px;">邀请人数</div>
                        </div>
                        <div style="display: inline-block; margin-right: 20px;">
                            <div>
                                <span style="font-size: 14pt; font-weight: bold;">{{data.totalCoupons}}</span> <span
                                    style="font-size: 12px;">张</span>
                            </div>
                            <div style="font-size: 12px;">获得优惠券奖励</div>
                        </div>
                        <div style="display: inline-block;">
                            <div>
                                <span style="font-size: 14pt; font-weight: bold;">{{data.totalPoints}}</span> <span
                                    style="font-size: 12px;">DBB</span>
                            </div>
                            <div style="font-size: 12px;">获得积分奖励</div>
                        </div>
                    </div>
                </div>
            </div>


            <div :style="{fontSize: tipFontSize}"
                 style="background-color: #F2F2F2; padding: 20px; position: relative; top: -40px; ">
                <div>现在分享邀请好友注册多呗商城</div>
                <div>立即奖励{{bonus.coupon}}元优惠券和{{bonus.points}}DBB多呗积分</div>
                <div @click="showSharePopup" class="share-btn"></div>
            </div>

            <div style="padding: 10px; position: relative; top: -20px;">
                <div style="margin-bottom: 40px;">
                    分享动态
                </div>
                <div v-for="item in list" :key="item.id">
                    <div style="margin-top: 20px;"></div>
                    <mt-cell style="border-bottom: 1px solid #f5f5f5; overflow: auto;">
                        <div slot="title">
                            <div style="display: inline-block; margin-right: 5px;">
                                <Avatar style="position: relative; top: -8px;" size="large" :src="avatar(item.avatar)"/>
                            </div>
                            <div style="position: relative; top: 8px; display: inline-block;">
                                <div style="margin-bottom: 10px;">{{item.nickname}}</div>
                                <div>{{item.username}}</div>
                            </div>
                        </div>
                        <div style="font-size: 14px;">
                            <div style="color: orangered; margin-bottom: 10px; text-align: right;">+ {{item.invitePoints
                                ?
                                item.invitePoints : 0}} DBB
                            </div>
                            <div>{{item.createTime}}</div>
                        </div>
                    </mt-cell>
                </div>
                <load-more v-if="showLoading" tip="正在加载"></load-more>
                <div :style="{top: noRecordTop + 'px'}" v-if="showNoRecord && list.length == 0" align="center"
                     style="width: 100%; position: absolute; color: gray;">
                    <img :src="NoRecord" width="20%" height="20%"/>
                    <div>暂无分享动态</div>
                </div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/invite.js'
    import MerchantAPI from '../../api/merchant'
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
    import NoRecord from '../../images/norecord-invite.png'
    import ShareLogo from '../../images/goods-share-logo.png'

    export default {
        components: {},
        data() {
            return {
                ShareLogo,
                showNoRecord: false,
                tipFontSize: '14px',
                bonus: {
                    coupon: 0,
                    points: 0
                },
                data: {
                    totalPeople: 0,
                    totalPoints: 0,
                    totalCoupons: 0,
                },
                inviteBgHeight: 0,
                NoRecord,
                noRecordTop: 0,
                config,
                ShareTipArrow,
                commonStyles,
                bgStyle: null,
                shareBtnStyle: null,
                saveBtnStyle: null,
                inviteBtnStyle: null,
                contentStyle: {
                    ...commonStyles.content
                },
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
                minHeight: 0,
                borderLeft: 0,
                numsMarginTop: '25px',
                posterPopup: false,
                posterPopupStyle: {},
                posterWidth: 0,
                posterHeight: 0,
            }
        },
        computed: {
            showModal() {
                return this.popup && !this.showShareTipInBrowser && !this.showShareTip
            }
        },
        methods: {
            goMemberRules() {
                Util.putForNav({
                    from: 'MyInvite'
                })
                Util.go('ArticleDetail', {
                    key: '会员制度'
                })
            },
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
                // this.showPoster()
                this.showShareTip = false
                this.showShareTipInBrowser = false
                this.showShare = false
            },
            showSharePopup() {
                // this.closePoster()
                // this.popupStyle.zIndex = 1
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
                    nickname = '********' + item.username.substring(7)
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
            // showPoster() {
            //     this.popupStyle.zIndex = 100000
            //     this.popup = true
            // },
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
                        } else {
                            this.showLoading = true
                        }
                    } else {
                        this.showNoRecord = true
                        this.allLoaded = true
                        this.showLoading = false
                    }
                })
            },
            scrollHandler(e) {
                Util.scrollHandler(e, this)
            },
            showPoster() {
                this.posterPopupStyle.zIndex = 100000
                this.posterPopup = true
            },
        },
        mounted() {
            this.inviteBgHeight = 228 * document.documentElement.clientWidth * 0.9 / 541
            let height = 550
            if (document.documentElement.clientHeight < 650) {
                height = 450
                this.tipFontSize = '10px'
                this.numsMarginTop = '5px'
            }
            this.noRecordTop = (document.documentElement.clientHeight - height) / 2
            window.addEventListener('scroll', this.scrollHandler)
            this.popupImgSrc = config.baseUrl + '/client/' + UrlParams(window.location.href, 'uid').replace(/#?\/[^\/]+/, '') + '/poster/invite.png'
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
            if (document.documentElement.clientHeight < 610) {
                this.posterWidth = document.documentElement.clientWidth * 0.7
                this.posterHeight = document.documentElement.clientWidth * 0.7 * 1161 / 750
                this.posterPopupStyle = {
                    left: document.documentElement.clientWidth * 0.15 + 'px',
                    width: this.posterWidth + 'px',
                    height: this.posterHeight + 'px',
                    top: '20px'
                }
            } else {
                this.posterWidth = document.documentElement.clientWidth * 0.8
                this.posterHeight = document.documentElement.clientWidth * 0.8 * 1161 / 750
                this.posterPopupStyle = {
                    left: document.documentElement.clientWidth * 0.1 + 'px',
                    width: this.posterWidth + 'px',
                    height: this.posterHeight + 'px',
                    top: '50px',
                    position: 'fixed'
                }
            }
            this.contentStyle.backgroundColor = '#fff'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 60) + 'px'
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
            API.loadTotalInfo().then(data => {
                this.data = data
            })
            MerchantAPI.loadClientInviteBonus().then(data => {
                this.bonus = data
            })
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
