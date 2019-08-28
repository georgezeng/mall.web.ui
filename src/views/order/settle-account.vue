<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        width: 100%;
        box-shadow: 0px 0px 3px -1px gray;
        font-weight: bold;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 1000;
    }

    .address:after {
        background-image: url('../../images/mail.png');
        content: ' ';
        height: 5px;
        width: 100%;
        display: block;
        position: relative;
        top: 10px;
    }

    .address {
        padding: 10px 0 10px;

        .name {
            font-size: 18px;
            font-weight: bold;
        }

        .phone {
            font-weight: bold;
            font-size: 16px;
        }

        .location {
            font-size: 14px;
        }
    }

    .payment {
        margin-top: 10px;
        padding: 10px 0 10px;
    }

    .checker {
        float: right;
    }

    .gallery {
        padding: 10px 0 10px;
        margin-top: 10px;
    }

    .itemNums {
        color: gray;
        font-size: 12px;
        float: right;
        position: relative;
        left: -20px;
        top: 7px;
    }

    .invoice {
        padding: 10px 0 10px;
        margin-top: 10px;
    }

    .coupon {
        padding: 10px 0 10px;
        margin-top: 2px;
    }

    .payline {
        background-image: none !important;
    }

    .totalPrice {
        margin-top: -10px;
    }

    .couponPrice {
        margin-top: -15px;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">填写订单</div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="show"></Spin>
            <div v-transfer-dom>
                <popup v-model="showPayment" style="z-index: 10000; background-color: #fff;">
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
                                            :value.sync="data.payment.selected[0]"
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
                                            :value.sync="data.payment.selected[1]"
                                            @click.native.stop="checkPayment(1)"></check-icon>
                            </div>
                        </mt-cell>
                    </div>
                </popup>
                <popup v-model="showItem" style="z-index: 10000; background-color: #fff;">
                    <div style="position: relative;">
                        <div style="padding: 0 10px;">
                            <Icon size="30" type="ios-close" class="popup-close" @click="closeItemPopup"/>
                            <div style="width: 100%; margin-top: 10px; margin-bottom: 20px;">
                                商品清单
                                <span class="itemNums">共{{data.items.length}}件</span>
                            </div>
                        </div>
                        <mt-cell>
                            <div class="wrapper" :style="{height: popupHeight + 'px'}"
                                 slot="title">
                                <div :key="item.property.id" v-for="item in data.items" style="margin-bottom: 20px;">
                                    <div style="display: inline-block; margin-right: 10px; vertical-align: bottom; position: relative; ">
                                        <img :src="config.publicBucketDomain + item.item.thumbnail" width="72"
                                             height="72"/>
                                    </div>
                                    <div style="display: inline-block; position: relative;">
                                        <div style="color: #505A6D; font-size: 11pt; margin-bottom: 10px;">
                                            {{item.item.name.length > 12 ? item.item.name.substring(0, 12) + '...' :
                                            item.item.name}}
                                        </div>
                                        <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 10px;">
                                            {{specText(item.attrs)}}
                                        </div>
                                        <div style="font-size: 11pt; color: orangered;">￥{{item.property.price}}</div>
                                    </div>
                                    <div style="float:right; color: gray; font-size: 14px; position: relative; top: 60px;">
                                        x{{item.nums}}
                                    </div>
                                </div>
                            </div>
                        </mt-cell>
                    </div>
                </popup>
            </div>
            <div v-if="!show">
                <mt-cell @click.native="goPickupAddress" is-link class="address" v-if="data.address.id != null">
                    <div slot="title">
                        <div style="margin-bottom: 10px;">
                            <span class="name">{{data.address.name}}</span>
                            <span class="phone">{{data.address.phone.substring(0, 3)}}****{{data.address.phone.substring(7, data.address.phone.length)}}</span>
                        </div>
                        <div>
                            <span class="location">{{Util.getLongLocation(data.address)}}</span>
                        </div>
                    </div>
                </mt-cell>
                <mt-cell @click.native="goPickupAddress" is-link class="address" v-else>
                    <div slot="title">收货地址</div>
                    <div>请选择</div>
                </mt-cell>
                <mt-cell class="payment" @click.native="showPaymentPopup">
                    <div slot="title" style="font-size: 11pt;">支付方式</div>
                    <div style="font-size: 11pt;">
                        <span v-if="data.payment.text == null">请选择</span>
                        <span v-else>{{data.payment.text}}</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <mt-cell class="gallery" @click.native="showItemPopup">
                    <div slot="title">
                        <img style="margin-right: 8px; margin-bottom: 5px;" :key="item.property.id"
                             v-for="item in orderItems"
                             :src="config.publicBucketDomain + item.item.thumbnail" width="60" height="60"/>
                    </div>
                    <div>
                        <span style="font-size: 11pt;">共{{data.items.length}}件</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <mt-cell class="invoice" @click.native="goInvoice">
                    <div slot="title" style="font-size: 11pt;">
                        发票
                    </div>
                    <div style="font-size: 11pt;">
                        <span v-if="data.invoice.title == null">不开发票</span>
                        <span v-else>{{data.invoice.title}}</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <mt-cell class="coupon" @click.native="goCoupon">
                    <div slot="title" style="font-size: 11pt;">
                        优惠券
                    </div>
                    <div style="font-size: 11pt;">
                        <span>{{data.coupons && data.coupons.length > 0 ? `使用${data.coupons.length}张` : '尚未使用'}}</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <group style="position: relative; top: -19px;">
                    <x-textarea style="font-size: 11pt; position: relative; left: -5px;" @on-blur="resetUI"
                                placeholder="选填(限30字)" title="买家留言"
                                v-model="data.remark"></x-textarea>
                </group>
                <mt-cell class="totalPrice">
                    <div slot="title" style="font-size: 11pt;">
                        商品金额
                    </div>
                    <div style="font-size: 11pt;">
                        <span>{{totalPrice}}</span>
                    </div>
                </mt-cell>
                <mt-cell class="couponPrice">
                    <div slot="title" style="font-size: 11pt;">
                        优惠金额
                    </div>
                    <div style="font-size: 11pt;">
                        <span style="color: orangered;">-￥{{couponPrice}}</span>
                    </div>
                </mt-cell>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <div style="font-size: 12pt; display: inline-block;color: orangered; padding: 10px 10px;">订单金额:
                ￥{{finalPrice}}
            </div>
            <div @click="createOrder"
                 style="float: right; display: inline-block; padding: 10px 20px; background-color: #B69C7D; color: #fff;">
                提交订单
            </div>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/order.js'
    import AddressAPI from '../../api/address.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import WechatLogo from '../../images/wechat-logo.png'
    import AlipayLogo from '../../images/alipay-logo.png'
    import More from '../../images/more.png'

    export default {
        components: {},
        data() {
            return {
                More,
                WechatLogo,
                AlipayLogo,
                key: null,
                config,
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                footerStyle: {
                    ...commonStyles.footer
                },
                show: true,
                showPayment: false,
                showItem: false,
                popupHeight: 500,
                data: {
                    address: {
                        id: null,
                        name: null,
                        phone: null,
                        province: null,
                        city: null,
                        district: null,
                        location: null
                    },
                    payment: {
                        selected: [],
                        name: null,
                        text: null
                    },
                    invoice: {
                        id: null,
                        title: null,
                        code: null,
                        content: null,
                        type: null
                    },
                    fromCart: false,
                    items: [],
                    remark: null
                },
                loading: false,
            }
        },
        computed: {
            finalPrice() {
                const price = this.totalPrice - this.couponPrice
                return price.toFixed(2)
            },
            couponPrice() {
                let total = 0
                for (let i in this.data.coupons) {
                    let item = this.data.coupons[i];
                    total += item.amount
                }
                return total.toFixed(2)
            },
            totalPrice() {
                let total = 0
                for (let i in this.data.items) {
                    let item = this.data.items[i];
                    total += item.property.price * item.nums
                }
                return total.toFixed(2)
            },
            orderItems() {
                return this.data.items.length > 8 ? this.data.items.slice(0, 8) : this.data.items
            }
        },
        methods: {
            goCoupon() {
                Util.putForNav({
                    from: 'OrderSettleAccount',
                    key: this.key
                })
                Util.go('OrderCouponList', {
                    key: this.key
                })
            },
            createOrder() {
                const data = {
                    ...this.data,
                    items: this.data.items.map(item => {
                        return {
                            cartItemId: item.cartItemId,
                            itemId: item.item.id,
                            propertyId: item.property.id,
                            nums: item.nums
                        }
                    }),
                    payment: this.data.payment.name
                }
                if (this.data.address.name == null) {
                    this.$vux.toast.show({
                        text: '请先选择收货地址',
                        type: 'text',
                        width: '200px'
                    })
                    return
                }
                if (this.data.payment.name == null) {
                    this.$vux.toast.show({
                        text: '请先选择支付方式',
                        type: 'text',
                        width: '200px'
                    })
                    return
                }
                if (this.data.invoice.title == null) {
                    data.invoice = null
                }
                if (this.loading == true) {
                    return
                }
                this.loading = true
                this.$vux.loading.show({
                    text: '加载中...'
                })
                API.create(data).then(id => {
                    // Util.put('settleAccountData', null)

                    if (Util.isInWechat()) {
                        switch (data.payment) {
                            case 'WePay': {
                                Util.wepayForJsApi(id, () => {
                                    Util.go('MyOrderList', {
                                        type: 'All'
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
                        switch (data.payment) {
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
                }).catch(e => {
                    this.$vux.loading.hide()
                    this.loading = false
                })
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            goInvoice() {
                Util.putForNav({
                    from: 'OrderSettleAccount',
                    key: this.key
                })
                Util.go('MyInvoiceList')
            },
            closeItemPopup() {
                this.showItem = false
            },
            showItemPopup() {
                this.showItem = true
            },
            checkPayment(index) {
                for (let i in this.data.payment.selected) {
                    this.data.payment.selected[i] = false
                }
                this.data.payment.selected[index] = true
                switch (index) {
                    case 0: {
                        this.data.payment.text = '微信支付'
                        this.data.payment.name = 'WePay'
                    }
                        break
                    case 1: {
                        this.data.payment.text = '支付宝支付'
                        this.data.payment.name = 'AliPay'
                    }
                        break
                }
                Util.putJson('settleAccountData', this.data)
                this.closePaymentPopup()
            },
            closePaymentPopup() {
                this.showPayment = false
            },
            showPaymentPopup() {
                this.showPayment = true
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            goPickupAddress() {
                Util.putForNav({
                    from: 'OrderSettleAccount',
                    key: this.key
                })
                Util.go('MyAddressList')
            },
            load() {
                AddressAPI.loadDefault().then(address => {
                    if (address) {
                        this.data.address = address
                    }
                    API.getPreview(this.key).then(data => {
                        if (!data) {
                            this.$vux.toast.show({
                                text: '结算失效，请重新下单',
                                type: 'text',
                                width: '250px'
                            })
                            setTimeout(() => {
                                Util.go('GoodsItemList', {
                                    id: 0,
                                    type: 'category'
                                })
                            }, 1000)
                            return
                        }
                        this.data.items = data.items
                        this.data.fromCart = data.fromCart
                        Util.putJson('settleAccountData', this.data)
                        this.show = false
                    })
                })

            },
            specText(attrs) {
                let title = ''
                for (let i in attrs) {
                    const attr = attrs[i]
                    if (i < attrs.length - 1) {
                        title += attr + '，'
                    } else {
                        title += attr
                    }
                }
                return title
            }
        },
        mounted() {
            this.footerStyle.boxShadow = '0px 0px 3px -1px gray'
            this.popupHeight = document.documentElement.clientHeight * 0.6
            this.contentStyle.marginTop = '60px'
            this.contentStyle.marginBottom = '40px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            const wrapperHeight = document.documentElement.clientHeight - 105
            this.contentStyle.minHeight = wrapperHeight + 'px'
            this.footerStyle.padding = '0'
            this.key = this.$router.currentRoute.params.key
            if (!this.key) {
                Util.go('Home')
                return
            }
            const data = Util.getJson('settleAccountData')
            if (data) {
                this.data = data
                this.show = false
            } else {
                this.load()
            }
            if (Util.isInWechat()) {
                this.data.payment = {
                    selected: [true, false],
                    name: 'WePay',
                    text: '微信支付'
                }
                Util.wxConfig([
                    'chooseWXPay',
                ])
            }
        }
    }
</script>
