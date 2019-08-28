<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        position: fixed;
        top: 0px;
        z-index: 100;
        width: 100%;
        box-shadow: 0px 0px 3px -1px gray;
    }

    .info {
        background-image: url("../../images/center-header.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0px 0;
        width: 100%;
        height: 100px;
        position: relative;
        padding: 0;
    }

    .address {
        background-color: #fff;
        z-index: 10;
        position: relative;
        width: 80%;
        height: 80px;
        border-radius: 5px;
        top: 20px;
        margin: 0 auto;
        padding: 10px;
        box-shadow: 0px 0px 5px 0px gray;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">订单详情</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 60px; margin-bottom: 60px;">
            <div class="info">
                <div style="width: 90%; margin: 0 auto; color: #fff; padding: 20px 0 10px;">
                    <div style="float: left; ">{{form.status.clientText}}</div>
                    <CountDown style="float: right;" :form="form" @close="refresh"/>
                </div>
                <div class="address">
                    <div :style="{marginLeft: isSmallDevice ? '16px' : '0'}" style="float: left;">
                        <img style="position: absolute; left: 8px;" :src="location" width="24" height="24"/>
                        <div style="display: inline-block;position: absolute; left: 28px;">
                            <span style="margin-left: 10px;">{{form.address.name}}</span>
                            <span style="margin-left: 10px;">{{form.address.phone.substring(0, 3)}}****{{form.address.phone.substring(7, form.address.phone.length)}}</span>
                        </div>
                        <div style="margin-bottom: 25px;"></div>
                    </div>
                    <div class="clearfix"></div>
                    <div style="font-size: 12px; color: gray; position: relative; left: 28px;">
                        {{Util.getLongLocation(form.address)}}
                    </div>
                </div>
            </div>
            <div style="background-color: #fff; padding: 40px 0 10px;">
                <div style="margin: 0 15px;">
                    <Icon size="24" type="md-text"/>
                    <span>买家留言</span>
                    <div style="margin-top: 5px; margin-left: 30px; font-size: 14px; color: gray;">
                        {{form.remark}}
                    </div>
                </div>
            </div>
            <div style="background-color: #f5f5f5; height: 10px;"></div>
            <div style="background-color: #fff;">
                <div @click="goDetail(item.itemId)" style="padding: 15px 15px 0;" v-for="item in form.subList"
                     :key="item.id">
                    <img :src="config.publicBucketDomain + item.thumbnail" width="72" height="72">
                    <div style="display: inline-block; margin-left: 10px;">
                        <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                            {{itemName(item.itemName)}}
                        </div>
                        <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                            {{specText(item.specificationValues)}}
                        </div>
                        <div style="font-size: 11pt;">
                            <span style="color: orangered;margin-right: 10px;">价格: ￥{{item.unitPrice}}</span>
                            <span>x{{item.nums}}</span>
                        </div>
                    </div>
                    <!--
                    <div style="float: right; position: relative; top: -28px;">
                        <Button v-if="form.status.name == 'Finished' && item.comment && !item.additionalComment"
                                style="color: orangered; border: 1px solid orangered;">
                            追加评价
                        </Button>
                        <Button v-if="form.status.name == 'Finished' && !item.comment"
                                style="color: orangered; border: 1px solid orangered; margin-left: 5px;">
                            评价
                        </Button>
                        <Button v-if="form.status.name == 'Finished' && item.comment"
                                style="color: orangered; border: 1px solid orangered; margin-left: 5px;">
                            查看评价
                        </Button>
                    </div>
                    -->
                    <div v-if="form.status.name != 'Finished'" style="margin-bottom: 15px;"></div>
                    <div v-else class="clearfix"></div>
                </div>
                <div style="margin: 10px 10px 10px; border: 1px solid #F5F5F5;"></div>
                <div style="padding: 0 15px; font-size: 14px;">
                    <div>
                        <span>商品总额:</span>
                        <div style="float: right;">￥{{form.totalPrice}}</div>
                    </div>
                    <div style="margin-top: 5px;">
                        <span style="margin-left: 28px;">运费:</span>
                        <div style="float: right;">￥0.00</div>
                    </div>
                    <div style="margin-top: 5px;">
                        <span>商品优惠:</span>
                        <div style="float: right;">-￥{{form.couponAmount}}</div>
                    </div>
                </div>
                <div style="text-align: right; font-size: 14px; margin-right: 15px; padding-bottom: 10px;">实付: <span
                        style="color: orangered;">￥{{form.realPrice}}</span></div>
            </div>
            <div style="background-color: #f5f5f5; height: 10px;"></div>
            <div style="background-color: #fff; padding: 15px; font-size: 14px;">
                <div v-for="coupon in form.coupons" :key="coupon.id">
                    <div style="display: inline-block; margin-right: 10px;">优惠券编号: {{coupon.couponId}}</div>
                    <div style="display: inline-block;">优惠金额: ￥{{coupon.amount}}</div>
                </div>
            </div>
            <div style="background-color: #f5f5f5; height: 10px;"></div>
            <div style="background-color: #fff; padding: 15px; font-size: 14px;">
                <div>订单编号: {{form.orderId}}</div>
                <div>下单时间: {{form.createTime}}</div>
                <div>支付方式: {{form.payment.text}}</div>
                <div>支付时间: {{form.payTime}}</div>
            </div>
            <div style="background-color: #f5f5f5; height: 10px;"></div>
            <div style="background-color: #fff; padding: 15px; font-size: 14px;" v-if="form.invoice != null">
                <div>发票类型: {{form.invoice.type.text}}</div>
                <div>发票抬头: {{form.invoice.title}}</div>
                <div>发票内容: {{form.invoice.content}}</div>
            </div>
            <div class="clearfix"></div>
        </Content>
        <Footer :style="footerStyle">
            <div style="margin: 10px;" v-if="form.status.name == 'UnPay'">
                <Button @click="pay"  :loading="loading" style="float: right; margin-left: 10px;"
                        >去支付
                </Button>
                <Button  :loading="loading" @click="cancelConfirm(form.id)" style="float: right;"
                        >
                    取消订单
                </Button>
                <div class="clearfix"></div>
            </div>
            <div style="margin: 10px;" v-if="form.status.name == 'Paid'">
                <Button  :loading="loading" @click="cancelConfirm(form.id)" style="float: right;"
                        >取消订单
                </Button>
                <div class="clearfix"></div>
            </div>
            <div style="margin: 10px;" v-if="form.status.name == 'CanceledForRefund'">
                <Button @click="refundConfirm(form.id)" style="float: right;" >
                    申请退款
                </Button>
                <div class="clearfix"></div>
            </div>
            <div style="margin: 10px;" v-if="form.status.name == 'Shipped'">
                <Button :loading="loading" @click="pickupConfirm(form.id)"
                        style="border-color: #B69C7D; color: #B69C7D; float: right; margin-left: 10px;"
                        >
                    确认收货
                </Button>
                <Button @click="goRefundOnly(form.id)" style="float: right; margin-left: 10px;" >
                    取消订单
                </Button>
                <Button :loading="loading" style="float: right;" @click="goExpress(form.id)"
                        >
                    查看物流
                </Button>
                <div class="clearfix"></div>
            </div>
            <div style="margin: 10px;" v-if="form.status.name == 'Canceled' || form.status.name == 'Refunded'">
                <img @click="deleteConfirm(item.id)" style="float: right; position:relative; top:5px;" :src="trash" width="20" height="20" />
                <div class="clearfix"></div>
            </div>
            <div style="margin: 10px;" v-if="form.status.name == 'Closed'">
                <img @click="deleteConfirm(item.id)" style="float: right; position:relative; top:5px;" :src="trash" width="20" height="20" />
                <div class="clearfix"></div>
            </div>
            <div style="margin: 10px;" v-if="form.status.name == 'Finished'">
                <Button  :loading="loading" v-if="!form.comment" @click="goEvaluate(form.id, 'UnComment')"
                        style="float: right; margin-left: 10px;"
                        >
                    评价
                </Button>
                <Button  :loading="loading" v-else @click="goEvaluate(form.id, 'All')"
                        style="float: right; margin-left: 10px;" >
                    查看评价
                </Button>
                <Button v-if="!form.applied"  :loading="loading" @click="goAfterSale(form.id)"
                        style="float: right; margin-left: 10px;" >
                    申请售后
                </Button>
                <img @click="deleteConfirm(item.id)" style="float: right; position:relative; top:5px;" :src="trash" width="20" height="20" />
                <div class="clearfix"></div>
            </div>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/order.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import {MessageBox} from 'mint-ui';
    import location from '../../images/location.png';
    import moment from 'moment';
    import config from '../../config/index.js'
    import CountDown from './countdown'
    import trash from '../../images/trash.png'

    export default {
        components: {
            CountDown
        },
        data() {
            return {
                Util,
                trash,
                config,
                location,
                commonStyles,
                loading: false,
                footerStyle: {
                    ...commonStyles.footer
                },
                form: {
                    id: null,
                    orderId: null,
                    coupons: [],
                    address: {
                        name: '',
                        phone: '',
                        province: '',
                        city: '',
                        district: '',
                        location: ''
                    },
                    subList: [],
                    remark: null,
                    status: {},
                    comment: null,
                    totalPrice: 0,
                    realPrice: 0,
                    couponAmount: 0,
                    createTime: null,
                    payTime: null,
                    payment: {},
                    invoice: null,
                    applied: false
                },
                isSmallDevice: false
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
                            text: '申请成功'
                        })
                        this.load()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            refresh() {
                window.location.reload(true)
            },
            pay() {
                this.loading = true
                this.$vux.loading.show({
                    text: '加载中...'
                })
                const id = this.form.id
                if (Util.isInWechat()) {
                    switch (this.form.payment.name) {
                        case 'WePay': {
                            Util.wepayForJsApi(id, () => {
                                Util.go('MyOrderList', {
                                    type: 'Paid'
                                })
                            })
                        }
                            break
                        case 'AliPay': {
                            Util.go('AlipayInWechat', {
                                id
                            })
                        }
                            break
                    }
                } else {
                    switch (this.form.payment.name) {
                        case 'WePay': {
                            Util.wepayForMweb(id)
                        }
                            break
                        case 'AliPay': {
                            Util.alipay(id, 'system')
                        }
                            break
                    }
                }
                this.$vux.loading.hide()
                this.loading = false
            },
            goRefundOnly(id) {
                Util.putForNav({
                    from: 'MyOrderDetail',
                    id: this.form.id
                })
                Util.go('AfterSaleRefundOnly', {
                    id
                })
            },
            goAfterSale(id) {
                Util.putForNav({
                    from: 'MyOrderDetail',
                    id: this.form.id
                })
                Util.go('AfterSaleList', {
                    id,
                    status: 'NotYet'
                })
            },
            goExpress(id) {
                Util.putForNav({
                    from: 'MyOrderDetail',
                    id: this.form.id
                })
                Util.go('MyOrderExpress', {
                    id
                })
            },
            itemName(name) {
                if (!this.isSmallDevice) {
                    return name.length > 16 ? name.substring(0, 16) + '...' : name
                }
                return name.length > 11 ? name.substring(0, 11) + '...' : name
            },
            specText(values) {
                if (!this.isSmallDevice) {
                    return values.length > 18 ? values.substring(0, 18) + '...' : values
                }
                return values.length > 13 ? values.substring(0, 13) + '...' : values
            },
            goEvaluate(id, status) {
                Util.putForNav({
                    from: 'MyOrderDetail',
                    id: this.form.id
                })
                Util.go('MyEvaluationList', {
                    id,
                    status
                })
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
                        this.load()
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
                        this.load()
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
                        this.load()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            goDetail(id) {
                Util.putForNav({
                    from: 'MyOrderDetail',
                    id: this.form.id
                })
                Util.go('GoodsItemDetail', {
                    id
                })
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                if (this.form.id > 0) {
                    this.loading = true
                    API.load(this.form.id).then(data => {
                        this.form = data
                        this.loading = false
                    }).catch(e => {
                        this.loading = false
                    })
                }
            }
        },
        created() {
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientWidth < 370
            this.form.id = this.$router.currentRoute.params.id
            this.form.id = this.form.id > 0 ? this.form.id : null
            this.load()
        }
    }
</script>
