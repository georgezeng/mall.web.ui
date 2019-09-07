<style scoped lang="less">

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
    }

    .main-bg {
        background-image: url("../../images/points-main-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 100%;
        text-align: center;
    }

    .get-instruction-btn {
        background-image: url("../../images/points-get-instruction-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 30%;
        position: absolute;
        right: 0px;
        top: 20px;
    }

    .qrcode {
        background-image: url("../../images/goods-share-logo.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 20px;
        height: 20px;
        position: absolute;
        right: 50px;
        bottom: 50px;
    }

    .qrcode:after {
        content: '核销码';
        color: #fff;
        font-size: 10px;
        position: absolute;
        width: 60px;
        top: 25px;
        right: -20px;
    }

    .points-list-btn {
        background-image: url("../../images/points-list.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 18%;
        display: inline-block;
    }

    .points-text {
        width: 18%;
        display: inline-block;
        text-align: center;
        font-size: 14px;
    }

    .points-union-btn {
        background-image: url("../../images/points-union.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 18%;
        display: inline-block;
    }

    .points-instruction-btn {
        background-image: url("../../images/points-instruction.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 18%;
        display: inline-block;
    }

    .points-item-btn {
        background-image: url("../../images/points-item.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 18%;
        display: inline-block;
    }

    .invite-bg {
        width: 100%;
        background-image: url("../../images/points-invite-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 100%;
    }

    .share-btn {
        background-image: url("../../images/points-share-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 100px;
        height: 25px;
        position: absolute;
        bottom: 25px;
        right: 20px;
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
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center">我的积分</div>
        </Header>
        <Content :style="contentStyle">
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
            <div style="padding: 10px 10px 10px; position: relative;">
                <div class="main-bg" :style="{height: mainBgHeight + 'px'}">
                    <div @click="goInstruction" class="get-instruction-btn"
                         :style="{height: instructionBtnHeight + 'px'}"></div>
                    <div style="position: relative; color: #fff" :style="{top: amountTop + 'px'}">
                        <div style="font-size: 28pt; font-weight: bold;">{{currentAmount ? currentAmount : 0}}</div>
                        <div style="font-size: 14px; position: relative; top: -10px;">DBB</div>
                    </div>
                    <div @click="showFailTip1" class="qrcode"></div>
                </div>
            </div>
            <div style="padding: 10px; position: relative;" align="center">
                <div @click="goPointsList" class="points-list-btn"
                     :style="{height: btnHeight + 'px', margin: btnMargin}">
                </div>
                <div @click="showFailTip2" class="points-union-btn"
                     :style="{height: btnHeight + 'px', margin: btnMargin}"></div>
                <div @click="goItemList" class="points-item-btn"
                     :style="{height: btnHeight + 'px', margin: btnMargin}"></div>
                <div @click="goInstruction" class="points-instruction-btn"
                     :style="{height: btnHeight + 'px', margin: btnMargin}"></div>
            </div>
            <div style="padding: 0 10px; position: relative; top: -10px;" align="center">
                <div @click="goPointsList" class="points-text" :style="{margin: btnMargin}">积分明细</div>
                <div @click="showFailTip2" class="points-text" :style="{margin: btnMargin}">联盟商家</div>
                <div @click="goItemList" class="points-text" :style="{margin: btnMargin}">积分商城</div>
                <div @click="goInstruction" class="points-text" :style="{margin: btnMargin}">积分说明</div>
            </div>
            <div style="padding: 10px;">积分活动</div>
            <div style="padding: 10px 10px 10px; position: relative; color: #8F7A5B; font-size: 14px;">
                <div class="invite-bg" :style="{height: inviteBgHeight + 'px'}">
                    <div style="position: relative; top: 10px; " :style="{left: inviteTextLeft + 'px'}">
                        <div>邀请好友注册多呗商城奖励 {{invitePoints ? invitePoints : 0}} DBB</div>
                        <div>多呗积分</div>
                    </div>
                    <div @click="showSharePopup" class="share-btn"></div>
                </div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/points.js'
    import MerchantAPI from '../../api/merchant.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import ShareTipArrow from '../../images/tip-arrow.png'
    import wx from 'weixin-js-sdk'
    import NativeShare from 'nativeshare'
    import ProfileAPI from '../../api/profile.js'

    export default {
        components: {},
        data() {
            return {
                popupHeight: 500,
                ShareTipArrow,
                showShareTip: false,
                showShareTipInBrowser: false,
                showShare: false,
                nativeShare: new NativeShare(),
                inviteBgHeight: '',
                btnMargin: '0 10px',
                btnHeight: 0,
                amountTop: 0,
                instructionBtnHeight: 0,
                mainBgHeight: 0,
                inviteTextLeft: 110,
                config,
                commonStyles,
                headerStyle: {
                    ...commonStyles.header,
                    backgroundColor: '#fff',
                    color: '#5D6475',
                    boxShadow: ''
                },
                contentStyle: {
                    ...commonStyles.content
                },
                currentAmount: 0,
                invitePoints: 0,
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
                    // 如果不支持，您可以在这里做降级处理
                }
            },
            closeShareTipPopup() {
                this.showShareTip = false
                this.showShareTipInBrowser = false
                this.showShare = false
            },
            showSharePopup() {
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
            goItemList() {
                Util.putForNav({
                    from: 'MyPoints'
                })
                Util.go('GoodsItemList', {
                    type: 'coupon',
                    id: 0
                })
            },
            goPointsList() {
                Util.putForNav({
                    from: 'MyPoints'
                })
                Util.go('MyPointsList')
            },
            showFailTip2() {
                this.$vux.toast.show({type: 'text', text: '会员等级不够，升级后可在联盟商家使用多呗积分', width: '200px'})
            },
            showFailTip1() {
                this.$vux.toast.show({type: 'text', text: '会员等级不够，请升级后使用该功能', width: '150px'})
            },
            goInstruction() {
                Util.putForNav({
                    from: 'MyPoints'
                })
                Util.go('ArticleDetail', {
                    key: '积分说明'
                })
            },
            back() {
                Util.go('MyCenter')
            },
            load() {
                MerchantAPI.loadClientPointsBonus().then(data => {
                    this.invitePoints = this.data.invite
                })
                API.baseInfo().then(data => {
                    this.currentAmount = data.currentAmount
                })
                ProfileAPI.load().then(data => {
                    this.updateShare(data)
                })
            },
        },
        mounted() {
            if (document.documentElement.clientHeight < 600) {
                this.btnMargin = '0 8px'
                this.inviteTextLeft = 80
            }
            this.popupHeight = document.documentElement.clientHeight + 'px'
            this.inviteBgHeight = 119 * document.documentElement.clientWidth / 543
            this.btnHeight = document.documentElement.clientWidth * 0.18
            this.instructionBtnHeight = 41 * document.documentElement.clientWidth * 0.3 / 174
            this.mainBgHeight = 226 * document.documentElement.clientWidth / 540
            this.amountTop = (this.mainBgHeight - 60) / 2;
            this.contentStyle.marginTop = '60px'
            this.contentStyle.backgroundColor = '#fff'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 60) + "px"
            this.load()
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'updateAppMessageShareData',
                    'updateTimelineShareData',
                ])
            }
        }
    }
</script>
