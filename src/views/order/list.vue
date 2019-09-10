<style scoped lang="less">

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
        color: #fff;
    }

    .titlePanel {
        color: #5C6677;
        font-size: 14px;
        background-color: #fff;
        margin: 0;
        padding: 0;
        position: absolute;
        top: 65px;
        left: 0px;
        box-shadow: 0px 0px 3px -1px gray;
        overflow: auto;
        width: 100%;
    }

    .title {
        display: inline-block;
        width: 80px;
        margin: 0;
        padding: 0;
    }

    .selected-title {
        color: #B69C7D;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">我的订单</div>
            <div class="titlePanel">
                <div style="width: 500px; float: left;">
                    <div class="title" @click="selectType('All')" :class="{'selected-title': type == 'All'}">全部</div>
                    <div class="title" @click="selectType('UnPay')" :class="{'selected-title': type == 'UnPay'}">待付款
                    </div>
                    <div class="title" @click="selectType('Paid')" :class="{'selected-title': type == 'Paid'}">待发货</div>
                    <div class="title" @click="selectType('Shipped')" :class="{'selected-title': type == 'Shipped'}">待收货
                    </div>
                    <div class="title" @click="selectType('Finished')" :class="{'selected-title': type == 'Finished'}">
                        已完成
                    </div>
                    <div class="title" @click="selectType('Canceled')" :class="{'selected-title': type == 'Canceled'}">
                        已取消
                    </div>
                </div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div v-transfer-dom>
                <popup v-model="payPopup" style="z-index: 10000; background-color: #fff;">
                    <div style="height: 300px; position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePaymentPopup"/>
                        <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            选择支付方式
                        </div>
                        <mt-cell class="payline">
                            <div slot="title">
                                <img :src="WechatLogo" width="42" height="42"/>
                                微信支付
                            </div>
                            <div>
                                <check-icon class="checker"
                                            :value.sync="payment.selected[0]"
                                            @click.native.stop="checkPayment(0)"></check-icon>
                            </div>
                        </mt-cell>
                        <mt-cell class="payline">
                            <div slot="title">
                                <img :src="AlipayLogo" width="42" height="42"/>
                                支付宝支付
                            </div>
                            <div>
                                <check-icon class="checker"
                                            :value.sync="payment.selected[1]"
                                            @click.native.stop="checkPayment(1)"></check-icon>
                            </div>
                        </mt-cell>
                        <div style="position: absolute; bottom: 0px; padding: 10px; width: 100%;">
                            <x-button @click.native="pay" style="color: #fff; width: 100%;">确认支付</x-button>
                        </div>
                    </div>
                </popup>
            </div>
            <div style="background-color: #fff; margin: 20px 0px; padding: 10px 0;" v-for="item in list" :key="item.id">
                <div style="padding: 10px 10px;">
                    <div style="float: left;">下单时间: {{item.createTime}}</div>
                    <div style="float: right; color: darkorange;">{{item.status.clientText}}</div>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 0 10px 10px; border: 1px solid #F5F5F5;"></div>
                <div @click="goDetail(item.id)">
                    <div style="padding: 0 10px 15px;" v-for="sub in item.subList" :key="sub.id">
                        <img :src="config.publicBucketDomain + sub.thumbnail" width="72" height="72"
                             style="display: inline-block; vertical-align: top;"/>
                        <div style="display: inline-block; margin-left: 10px;" :style="{width: itemInfoWidth + 'px'}">
                            <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                                {{itemName(sub.itemName)}}
                            </div>
                            <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                                {{specText(sub.specificationValues)}}
                            </div>
                            <div style="font-size: 11pt;">
                                <span style="color: orangered;margin-right: 10px;">价格: ￥{{sub.unitPrice}}</span>
                                <span>x{{sub.nums}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="text-align: right; margin-right: 10px;">共{{item.subList ? item.subList.length : 0}}件商品,
                    实际支付:
                    <span style="color: orangered;">￥{{item.realPrice}}</span> (含运费)
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'UnPay'">
                    <CountDown style="float: left; color: orangered; font-size: 14px;" :form="item" @close="reload"/>
                    <Button @click="showPaymentPopup(item)" style="float: right; margin-left: 10px;">去支付</Button>
                    <Button @click="cancelConfirm(item.id)" style="float: right;">
                        取消订单
                    </Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Paid'">
                    <Button @click="cancelConfirm(item.id)" style="float: right;">取消订单</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'CanceledForRefund'">
                    <Button @click="refundConfirm(item.id)" style="float: right;">
                        申请退款
                    </Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Shipped'">
                    <Button @click="pickupConfirm(item.id)"
                            style="border-color: #B69C7D; color: #B69C7D; float: right; margin-left: 10px;">
                        确认收货
                    </Button>
                    <!--
                    <Button @click="goRefundOnly(item.id)" style="float: right; margin-left: 10px;">
                        退款售后
                    </Button>
                    -->
                    <Button @click="goExpress(item.id)" style="float: right;">查看物流</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Canceled' || item.status.name == 'Refunded'">
                    <img @click="deleteConfirm(item.id)" style="float: right; position:relative; top:5px;" :src="trash"
                         width="20" height="20"/>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Closed'">
                    <img @click="deleteConfirm(item.id)" style="float: right; position:relative; top:5px;" :src="trash"
                         width="20" height="20"/>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Finished'">
                    <Button v-if="!item.comment" @click="goEvaluate(item.id, 'UnComment')"
                            style="float: right; margin-left: 10px;">
                        评价
                    </Button>
                    <Button v-else @click="goEvaluate(item.id, 'All')" style="float: right; margin-left: 10px;">
                        查看评价
                    </Button>
                    <Button v-if="!item.applied" @click="goAfterSale(item.id)" style="float: right; margin-left: 10px;">
                        申请售后
                    </Button>
                    <img @click="deleteConfirm(item.id)" style="float: right; position:relative; top:5px;" :src="trash"
                         width="20" height="20"/>
                    <div class="clearfix"></div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}" v-if="showNoRecord && list.length == 0" align="center"
                 style="position: relative; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无订单</div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/order.js'
    import WechatAPI from '../../api/wechat.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import {MessageBox} from 'mint-ui';
    import wx from 'weixin-js-sdk'
    import CountDown from './countdown'
    import trash from '../../images/trash.png'
    import WechatLogo from '../../images/wechat-logo.png'
    import AlipayLogo from '../../images/alipay-logo.png'
    import NoRecord from '../../images/norecord-order.png'
    import UrlParams from 'get-url-param'

    export default {
        components: {
            CountDown
        },
        data() {
            return {
                itemInfoWidth: 0,
                showNoRecord: false,
                NoRecord,
                noRecordTop: 0,
                AlipayLogo,
                WechatLogo,
                trash,
                config,
                commonStyles,
                headerStyle: {
                    ...commonStyles.header
                },
                contentStyle: {
                    ...commonStyles.content
                },
                queryInfo: {
                    data: null,
                    page: {
                        num: 1,
                        size: 10,
                    },
                },
                list: [],
                allLoaded: false,
                showLoading: false,
                loadingList: false,
                showSpin: true,
                isSmallDevice: false,
                type: 'All',
                payPopup: false,
                item: null,
                payment: {
                    selected: [],
                },
            }
        },
        computed: {},
        methods: {
            refundConfirm(id) {
                MessageBox.confirm('您确定要申请退款吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.refundApply(id).then(res => {
                        this.type = 'All'
                        this.$vux.loading.hide()
                        this.$vux.toast.show({
                            text: '申请成功，等待平台审核'
                        })
                        this.reload()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            goAfterSale(id) {
                Util.putForNav({
                    from: 'MyOrderList',
                    type: this.type
                })
                Util.go('AfterSaleList', {
                    id,
                    status: 'NotYet'
                })
            },
            goRefundOnly(id) {
                Util.putForNav({
                    from: 'MyOrderList',
                    type: this.type,
                    id
                })
                Util.go('AfterSaleRefundOnly', {
                    id
                })
            },
            goExpress(id) {
                Util.putForNav({
                    from: 'MyOrderList',
                    type: this.type
                })
                Util.go('MyOrderExpress', {
                    id
                })
            },
            checkPayment(index) {
                for (let i in this.payment.selected) {
                    this.payment.selected[i] = false
                }
                this.payment.selected[index] = true
            },
            closePaymentPopup() {
                this.payPopup = false
            },
            showPaymentPopup(item) {
                this.item = item
                if (item.payment.name == 'WePay') {
                    this.payment.selected[0] = true
                    this.payment.selected[1] = false
                } else {
                    this.payment.selected[0] = false
                    this.payment.selected[1] = true
                }
                this.payPopup = true
            },
            pay() {
                let payment = null
                if (this.payment.selected[0]) {
                    payment = {
                        name: 'WePay'
                    }
                } else {
                    payment = {
                        name: 'AliPay'
                    }
                }
                const item = this.item
                const hasChanged = item.payment.name != payment.name
                item.payment = payment
                this.closePaymentPopup()
                const _this = this

                function pay() {
                    const id = item.id
                    if (Util.isInWechat()) {
                        switch (item.payment.name) {
                            case 'WePay': {
                                Util.wepayForJsApi(id, () => {
                                    _this.$vux.loading.hide()
                                    // this.type = 'Paid'
                                    _this.reload()
                                })
                            }
                                break
                            case 'AliPay': {
                                _this.$vux.loading.hide()
                                Util.go('AlipayInWechat', {
                                    id
                                })
                            }
                                break
                        }
                    } else {
                        switch (item.payment.name) {
                            case 'WePay': {
                                Util.wepayForMweb(id)
                                _this.$vux.loading.hide()
                            }
                                break
                            case 'AliPay': {
                                Util.alipay(id, 'system')
                                _this.$vux.loading.hide()
                            }
                                break
                        }
                    }
                }

                this.$vux.loading.show({
                    text: '加载中...'
                })
                if (hasChanged) {
                    API.changePayment(item.id, payment.name).then(res => {
                        pay()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                } else {
                    pay()
                }
            },
            goDetail(id) {
                Util.putForNav({
                    from: 'MyOrderList',
                    type: this.type
                })
                Util.go('MyOrderDetail', {
                    id
                })
            },
            goEvaluate(id, status) {
                Util.putForNav({
                    from: 'MyOrderList',
                    type: this.type
                })
                Util.go('MyEvaluationList', {
                    id,
                    status
                })
            },
            selectType(type) {
                if (this.type == type) {
                    return
                }
                this.type = type
                this.reload()
            },
            reload() {
                this.showNoRecord = false
                this.allLoaded = false
                this.queryInfo.page.num = 1
                this.list = []
                this.showSpin = true
                switch (this.type) {
                    case 'All':
                        this.queryInfo.data = null;
                        break
                    default:
                        this.queryInfo.data = this.type
                }
                this.load()
            },
            pickupConfirm(id) {
                MessageBox.confirm('您确定已经收到商品吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.pickup(id).then(res => {
                        this.type = 'Finished'
                        this.$vux.loading.hide()
                        this.$vux.toast.show({
                            text: '已确认收货'
                        })
                        this.reload()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            deleteConfirm(id) {
                MessageBox.confirm('您确定要删除订单吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.delete(id).then(res => {
                        this.$vux.loading.hide()
                        this.type = 'All'
                        this.$vux.toast.show({
                            text: '删除成功'
                        })
                        this.reload()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            cancelConfirm(id) {
                MessageBox.confirm('您确定要取消订单吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.cancel(id).then(res => {
                        this.$vux.loading.hide()
                        this.type = 'All'
                        this.$vux.toast.show({
                            text: '取消成功'
                        })
                        this.reload()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            itemName(name) {
                return name ? (name.length > 16 ? name.substring(0, 16) + '...' : name) : ''
            },
            specText(values) {
                return values ? (values.length > 20 ? values.substring(0, 20) + '...' : values) : ''
            },
            back() {
                Util.go('MyCenter')
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
                API.list(this.queryInfo).then(data => {
                    if (data && data.length > 0) {
                        this.queryInfo.page.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.queryInfo.page.size) {
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
                    this.showSpin = false
                    this.loadingList = false
                }).catch(e => {
                    this.showSpin = false
                    this.loadingList = false
                })
            },
            scrollHandler(e) {
                Util.scrollHandler(e, this)
            },
        },
        beforeCreate() {
            const tradeNo = UrlParams(window.location.href, 'out_trade_no')
            if (tradeNo != null && tradeNo != '') {
                let query = '?uid=' + UrlParams(window.location.href, 'uid')
                if (config.env == 'uat' && config.debug) {
                    query += '&eruda=true'
                }
                window.location.href = '/' + query + '#/Order/List/All'
            }
        },
        mounted() {
            this.itemInfoWidth = document.documentElement.clientWidth - 108
            window.addEventListener('scroll', this.scrollHandler)
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.contentStyle.marginTop = '125px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 125) + "px"
            this.type = this.$router.currentRoute.params.type
            this.noRecordTop = ((document.documentElement.clientHeight - 125) - 200) / 2
            this.reload()
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'chooseWXPay',
                ])
            }
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
