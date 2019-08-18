<style scoped lang="less">
    .info {
        /*background-color: #DA4935;*/
        background-image: url("../../images/center-header.png");
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 80px;
        position: relative;
        color: #fff;
        padding: 0;
        .avatar {
            margin: 10px;
            position: relative;
            top: 10px;
        }
        .nickname {
            font-size: 12pt;
            margin-right: 5px;
        }
        .level {
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.2);
            padding: 5px 8px;
            font-size: 6pt;
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
                color: #2D7AF6;
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
        <Header :style="commonStyles.tideHeader">
            <!--
            <Icon v-if="isLogin" size="24" style="right: 10px; position: absolute; top: 10px;"
                  type="md-notifications-outline"/>
                  -->
        </Header>
        <div style="height: 40px;"></div>
        <Content :style="contentStyle">
            <div class="info" @click="goProfile">
                <Avatar ref="avatar" size="large" class="avatar" :src="avatar"/>
                <span class="nickname">{{nickname}}</span>
                <span v-if="isLogin" class="level">优享会员</span>
                <div v-if="isLogin" class="tip">点击查看或编辑个人信息</div>
                <div v-else class="tip">登录后购买商品</div>
                <Icon type="ios-arrow-forward" size="30" class="goArrow"/>
            </div>
            <div class="finance">
                <div align="center" class="numberBlock" @click="goMyChange">
                    <div v-if="isLogin" class="number">￥0.00</div>
                    <div v-else><img :src="yuan" width="32" height="32"/></div>
                    <div class="title">余额</div>
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
                        <badge class="badge-nums" :style="badgeItemStyle" v-if="tkNums > 0" :text="tkNums"></badge>
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
                        <Icon size="24" type="md-exit" style="margin-right: 10px;"/>
                        退出
                    </cell-box>
                    <cell-box class="optionPanel">
                        <Icon size="24" type="md-contacts" style="margin-right: 10px;"/>
                        <span>客服: 广州多呗生活</span>
                        <input ref="contactText" readonly value="广州多呗生活"
                               style="width: 1px; opacity: 0; border:none; outline: none;"/>
                        <div @click="copyContact"
                             style="border: 1px solid orangered; color: orangered; padding: 5px; position: absolute; right: 10px;">
                            复制微信号
                        </div>
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
    import OrderAPI from '../../api/order.js'
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
    import invite from '../../images/invite.png'
    import yuan from '../../images/yuan.png'
    import coupon from '../../images/coupon.png'
    import evaluate from '../../images/evaluate.png'
    import tuihuo from '../../images/tuihuo.png'

    export default {
        components: {
            Footer
        },
        data() {
            return {
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
                info: {
                    avatar: null,
                    nickname: null
                },
                dfkNums: 0,
                dfhNums: 0,
                dshNums: 0,
                dpjNums: 0,
                tkNums: 0,
                badgeItemStyle: {},
                isSmallDevice: false,
                titleFont: '14px',
                couponNums: 0
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
            exit() {
                API.logout().then(res => {
                    Util.setToken('')
                    // window.location.href = '/#/MyCenter'
                    window.location.reload(true)
                })
            },
            goMyChange() {
                // Util.go('MyChange')
            },
            goMyCoupon() {
                // Util.go('MyCoupon')
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
            }
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientHeight < 610
            this.contentStyle.minHeight = document.documentElement.clientHeight + 'px'
            if (this.isSmallDevice) {
                this.titleFont = '12px'
            }
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
                API.totalUnUseCouponNums().then(data => {
                    this.couponNums = data
                })
                this.getDfkNums()
                this.getDfhNums()
                this.getDshNums()
                this.getDpjNums()
            }
        }
    }
</script>
