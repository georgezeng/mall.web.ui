<style scoped lang="less">
    .infoPanel {
        background-image: url("../../images/center-header.png");
        background-repeat: no-repeat;
        background-size: unset;
        width: 100%;
        height: 120px;
        position: relative;
        .info {
            /*background-color: #DA4935;*/
            color: #fff;
            padding: 0;
            height: 80px;
            position: relative;
            .avatar {
                margin: 15px 10px 10px 15px;
            }
            .nickname {
                font-size: 12pt;
                margin-bottom: 5px;
            }
            .level {
                border-radius: 20px;
                background-color: rgba(0, 0, 0, 0.2);
                padding: 5px 8px;
                font-size: 12px;
                float: left;
            }
            .tip {
                font-size: 10pt;
                position: absolute;
                top: 50px;
                left: 75px;
            }
            .goArrow {
                position: absolute;
                top: 25px;
                right: 7px;
                color: #fff !important;
            }
        }
    }


    .finance {
        .gradient {
            display: inline-block;
            position: relative;
            top: 5px;
            height: 60px;
            margin: 10px 0;
            width: 1px;
            background: radial-gradient(lightgray 5%, white 80%);
        }

        .numberBlock {
            width: 48%;
            display: inline-block;
            padding: 0;
            position: relative;
            top: -10px;
            .number {
                font-size: 16pt;
                color: #B69C7D;
                margin-bottom: 10px;
            }
            .title {
                font-size: 10pt;
                color: #9B9B9B;
            }
        }
    }

    .blockLine {
        height: 10px;
        background-color: #F5F5F5;
        position: relative;
    }

    .orderPanel {
        .title-line {
            margin: 15px 10px 20px;
            .more {
                float: right;
                font-size: 10pt;
            }
        }
        .box {
            position: relative;
            display: inline-block;
            width: 18%;
            margin-bottom: 10px;
            .title {
                font-size: 12px;
                color: #9B9B9B;
            }
            .img2 {
                position: relative;
                top: 3px;
            }
        }
    }

    .optionPanel {
        font-size: 11pt;
        padding: 20px 10px;
        .img {
            position: relative;
            top: 0px;
        }
        .goArrow {
            top: 23px;
        }
    }

    .blockLine2 {
        height: 2px;
        background-color: #F5F5F5;
        margin-left: 10px;
    }

    .weui-cell_access.vux-cell-box:after {
        display: none;
    }

    .badge-nums {
        position: absolute;
        top: -3px;
        color: #fff;
        background-color: orangered;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Content :style="contentStyle">
            <div class="infoPanel">
                <div style="height: 40px;"></div>
                <div class="info" @click="goProfile">
                    <Avatar ref="avatar" size="large" class="avatar" :src="avatar"/>
                    <div v-if="isLogin" style="display: inline-block; position: relative; top: -15px;">
                        <div class="nickname">{{nickname}}</div>
                        <div class="level">{{level}}</div>
                    </div>
                    <div v-else style="display: inline-block; position: relative; top: 5px;">
                        立即登录
                    </div>
                    <!--<div v-if="isLogin" class="tip">点击查看或编辑个人信息</div>
                    <div v-else class="tip">登录后购买商品</div>-->
                    <Icon type="ios-arrow-forward" size="30" class="goArrow"/>
                </div>
            </div>
            <div class="finance">
                <div align="center" class="numberBlock" @click="goMyPoints">
                    <div v-if="isLogin" class="number">{{points}}</div>
                    <div v-else><img :src="yuan" width="32" height="32"/></div>
                    <div class="title">积分</div>
                </div>
                <div class="gradient"></div>
                <div align="center" class="numberBlock" @click="goMyCoupon">
                    <div v-if="isLogin" class="number">{{couponNums}}</div>
                    <div v-else><img :src="coupon" width="24" height="24"/></div>
                    <div class="title">优惠券</div>
                </div>
            </div>
            <div class="blockLine"></div>
            <div class="orderPanel">
                <div class="title-line">
                    <span style="font-weight: bold;">我的订单</span>
                    <span class="more" @click="goOrders">查看全部 &gt;</span>
                </div>
                <div align="center">
                    <div class="box" @click="goUnPayOrders">
                        <div class="img"><img :src="dfk" width="40" height="40"/></div>
                        <div class="title" :style="{fontSize: titleFont}">待付款</div>
                        <badge class="badge-nums" :style="badgeItemStyle" v-if="dfkNums > 0" :text="dfkNums"></badge>
                    </div>
                    <div class="box" @click="goPaidOrders">
                        <div class="img"><img :src="dfh" width="40" height="40"/></div>
                        <div class="title" :style="{fontSize: titleFont}">待发货</div>
                        <badge class="badge-nums" :style="badgeItemStyle" v-if="dfhNums > 0" :text="dfhNums"></badge>
                    </div>
                    <div class="box" @click="getShippedOrders">
                        <div class="img"><img :src="dsh" width="40" height="40"/></div>
                        <div class="title" :style="{fontSize: titleFont}">待收货</div>
                        <badge class="badge-nums" :style="badgeItemStyle" v-if="dshNums > 0" :text="dshNums"></badge>
                    </div>
                    <div class="box" @click="goUncommentList">
                        <div class="img"><img :src="evaluate" width="40" height="40"/></div>
                        <div class="title" :style="{fontSize: titleFont}">待评价</div>
                        <badge class="badge-nums" :style="badgeItemStyle" v-if="dpjNums > 0" :text="dpjNums"></badge>
                    </div>
                    <div class="box" @click="goAfterSale">
                        <div class="img"><img :src="tuihuo" width="40" height="40"/></div>
                        <div class="title" :style="{fontSize: titleFont}">退款/售后</div>
                        <badge class="badge-nums" :style="badgeItemStyle" v-if="tkshNums > 0" :text="tkshNums"></badge>
                    </div>
                </div>
            </div>
            <div style="position: relative;">
                <div class="blockLine" style="position:absolute; top: 0px;"></div>
                <group style="position: absolute; width: 100%; top: -10px;">
                    <cell-box class="optionPanel" is-link @click.native="goInvite">
                        <img :src="invite" width="24" height="24" class="img" style="margin-right: 10px;"/> 邀请好友
                        <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
                    </cell-box>
                    <cell-box class="optionPanel" is-link @click.native="goSetting">
                        <img :src="setting" width="24" height="24" class="img" style="margin-right: 10px;"/> 设置
                        <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
                    </cell-box>
                    <cell-box v-if="isLogin" class="optionPanel" is-link @click.native="exit">
                        <img :src="exitImg" width="24" height="24" class="img" style="margin-right: 10px;"/>
                        安全退出
                        <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
                    </cell-box>
                    <cell-box v-if="wechatService != null" class="optionPanel">
                        <img :src="contact" width="24" height="24" class="img" style="margin-right: 10px;"/>
                        <span>客服: {{wechatService}}</span>
                        <input ref="contactText" readonly :value="wechatService"
                               style="width: 1px; opacity: 0; border:none; outline: none;"/>
                        <div @click="copyContact"
                             style="border: 1px solid #B69C7D; color: #B69C7D; padding: 5px; position: absolute; right: 10px;">
                            复制微信号
                        </div>
                    </cell-box>
                    <cell-box class="optionPanel" is-link @click.native="showAboutUsPopup">
                        <Icon size="24" style="color: #7C502E; margin-right: 10px;" type="md-information-circle" /> 关于我们
                        <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
                    </cell-box>
                    <cell-box v-if="isSmallDevice" class="optionPanel" style="visibility: hidden; margin-top: 30px;">
                    </cell-box>
                </group>
            </div>
        </Content>
        <Footer selection="mine" :style="commonStyles.footer"/>
    </Layout>
</template>
<script>
    import API from '../../api/center.js'
    import ClientAPI from '../../api/client.js'
    import AfterSaleAPI from '../../api/aftersale.js'
    import OrderAPI from '../../api/order.js'
    import PointsAPI from '../../api/points.js'
    import ProfileAPI from '../../api/profile.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import Footer from '../footer'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'
    import dfk from '../../images/daifukuan.png'
    import dfh from '../../images/daifahuo.png'
    import dsh from '../../images/daishouhuo.png'
    import done from '../../images/done.png'
    import setting from '../../images/setting.png'
    import exitImg from '../../images/exit.png'
    import contact from '../../images/contact.png'
    import invite from '../../images/invite.png'
    import yuan from '../../images/yuan.png'
    import coupon from '../../images/coupon.png'
    import evaluate from '../../images/evaluate.png'
    import tuihuo from '../../images/tuihuo.png'
    import MerchantAPI from '../../api/merchant'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                contact,
                exitImg,
                dfk,
                dfh,
                dsh,
                done,
                setting,
                invite,
                yuan,
                coupon,
                evaluate,
                tuihuo,
                defaultAvatar,
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                wechatService: null,
                info: {
                    avatar: null,
                    nickname: null
                },
                dfkNums: 0,
                dfhNums: 0,
                dshNums: 0,
                dpjNums: 0,
                tkshNums: 0,
                badgeItemStyle: {},
                isSmallDevice: false,
                titleFont: '14px',
                couponNums: 0,
                points: 0,
                level: null
            }
        },
        computed: {
            isLogin() {
                const token = Util.getToken()
                return token != false
            },
            avatar() {
                return this.info.avatar ?
                    (this.info.avatar.startsWith('http') ?
                        this.info.avatar
                        : config.publicBucketDomain + this.info.avatar)
                    : defaultAvatar
            },
            nickname() {
                return this.info.nickname ? this.info.nickname.length < 15 ? this.info.nickname : this.info.nickname.substring(0, this.isSmallDevice ? 6 : 10) + '...' : (this.isLogin ? '未设置昵称' : '立即登录')
            },
        },
        methods: {
            copyContact() {
                const isIOSDevice = window.navigator.userAgent.match(/ipad|iphone/i);
                if (isIOSDevice) {
                    let el = this.$refs.contactText

                    let oldContentEditable = el.contentEditable,
                        oldReadOnly = el.readOnly,
                        range = document.createRange();

                    el.contentEditable = true;
                    el.readOnly = false;
                    range.selectNodeContents(el);

                    let s = window.getSelection();
                    s.removeAllRanges();
                    s.addRange(range);

                    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

                    el.contentEditable = oldContentEditable;
                    el.readOnly = oldReadOnly;

                } else {
                    this.$refs.contactText.select()
                }

                document.execCommand('copy');
                this.$vux.toast.show('复制成功')

            },
            getDfkNums() {
                OrderAPI.count('UnPay').then(nums => {
                    this.dfkNums = nums
                })
            },
            getDfhNums() {
                OrderAPI.count('Paid').then(nums => {
                    this.dfhNums = nums
                })
            },
            getDshNums() {
                OrderAPI.count('Shipped').then(nums => {
                    this.dshNums = nums
                })
            },
            getDpjNums() {
                OrderAPI.countUncomment().then(nums => {
                    this.dpjNums = nums
                })
            },
            getTkShNums() {
                AfterSaleAPI.countUnFinished().then(nums => {
                    this.tkshNums = nums
                })
            },
            exit() {
                API.logout().then(res => {
                    Util.setToken('')
                    // window.location.href = '/#/MyCenter'
                    window.location.reload(true)
                })
            },
            goMyPoints() {
                Util.go('MyPoints')
            },
            goMyCoupon() {
                Util.go('MyCoupon', {
                    type: 'UnUse'
                })
            },
            goOrders() {
                Util.putForNav({
                    from: 'MyCenter'
                })
                Util.go('MyOrderList', {
                    type: 'All'
                })
            },
            goUnPayOrders() {
                Util.putForNav({
                    from: 'MyCenter'
                })
                Util.go('MyOrderList', {
                    type: 'UnPay'
                })
            },
            goPaidOrders() {
                Util.putForNav({
                    from: 'MyCenter'
                })
                Util.go('MyOrderList', {
                    type: 'Paid'
                })
            },
            getShippedOrders() {
                Util.putForNav({
                    from: 'MyCenter'
                })
                Util.go('MyOrderList', {
                    type: 'Shipped'
                })
            },
            goUncommentList() {
                Util.putForNav({
                    from: 'MyCenter'
                })
                Util.go('MyEvaluationList', {
                    id: 0,
                    status: 'UnComment'
                })
            },
            goAfterSale() {
                Util.putForNav({
                    from: 'MyCenter'
                })
                Util.go('AfterSaleList', {
                    id: 0,
                    status: 'NotYet'
                })
            },
            goSetting() {
                Util.go('MySetting')
            },
            goInvite() {
                Util.go('MyInvite')
            },
            goProfile() {
                Util.go('MyProfile')
            },
            getPoints() {
                PointsAPI.current().then(data => {
                    this.points = data
                })
            }
        },
        created() {
            if (this.isLogin) {
                const docWidth = document.documentElement.clientWidth
                if (docWidth < 375 && docWidth > 330) {
                    this.badgeItemStyle.left = '40px'
                } else if (docWidth < 330) {
                    this.badgeItemStyle.left = '38px'
                } else if (docWidth < 400) {
                    this.badgeItemStyle.left = '42px'
                } else {
                    this.badgeItemStyle.left = '45px'
                }
                ProfileAPI.load().then(data => {
                    this.info = data
                })
                ClientAPI.totalUnUseCouponNums().then(data => {
                    this.couponNums = data
                })
                ClientAPI.currentLevel().then(data => {
                    this.level = data.name
                })
                this.getDfkNums()
                this.getDfhNums()
                this.getDshNums()
                this.getDpjNums()
                this.getTkShNums()
                this.getPoints()
            }
            MerchantAPI.loadSiteInfo().then(data => {
                this.wechatService = data.wechatServiceAccount
            })
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientHeight < 610
            this.contentStyle.minHeight = (document.documentElement.clientHeight + 30) + 'px'
            if (this.isSmallDevice) {
                this.titleFont = '12px'
            }
        }
    }
</script>
