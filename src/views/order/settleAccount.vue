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
        }

        .phone {
            font-size: 16px;
        }

        .location {
            font-size: 14px;
        }
    }

    .payment {
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

    .payline {
        background-image: none !important;
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
                <popup v-model="showPayment" style="background-color: #fff;">
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
                <popup v-model="showItem" style="background-color: #fff;">
                    <div style="position: relative;">
                        <div style="padding: 0 10px;">
                            <Icon size="30" type="ios-close" class="popup-close" @click="closeItemPopup"/>
                            <div style="width: 100%; margin-top: 10px; margin-bottom: 20px;">
                                商品清单
                                <span class="itemNums">共{{data.items.length}}件</span>
                            </div>
                        </div>
                        <mt-cell>
                            <div style="overflow: auto; padding: 0 10px;" :style="{height: popupHeight + 'px'}"
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
                            <span class="location">{{data.address.province + data.address.city.replace('市辖区', '') + data.address.district + data.address.location}}</span>
                        </div>
                    </div>
                </mt-cell>
                <mt-cell @click.native="goPickupAddress" is-link class="address" v-else>
                    <div slot="title">收货地址</div>
                    <div>请选择</div>
                </mt-cell>
                <mt-cell class="payment" @click.native="showPaymentPopup">
                    <div slot="title">支付方式</div>
                    <div>
                        <span v-if="data.payment.text == null">请选择</span>
                        <span v-else>{{data.payment.text}}</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <mt-cell class="gallery" @click.native="showItemPopup">
                    <div slot="title">
                        <img style="margin-right: 10px;" :key="item.item.id" v-for="item in orderItems"
                             :src="config.publicBucketDomain + item.item.thumbnail" width="42" height="42"/>
                    </div>
                    <div>
                        <span>共{{data.items.length}}件</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <mt-cell class="invoice" @click.native="goInvoice">
                    <div slot="title">
                        发票
                    </div>
                    <div>
                        <span v-if="data.invoice.title == null">不开发票</span>
                        <span v-else>{{data.invoice.title}}</span>
                        <img :src="More" width="32" height="32"/>
                    </div>
                </mt-cell>
                <group style="position: relative; top: -10px; left: -5px;">
                    <x-textarea style="font-size: 12pt;" @on-blur="resetUI" placeholder="选填(限30字)" title="买家留言"
                                v-model="data.remark"></x-textarea>
                </group>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <div style="font-style: 12pt; display: inline-block;color: orangered; padding: 10px 10px;">订单金额: ￥{{totalPrice}}</div>
            <div @click="createOrder"
                 style="float: right; display: inline-block; padding: 10px 20px; background-color: #E55038; color: #fff;">
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
                        title: null,
                        code: null,
                        content: null,
                        type: null
                    },
                    items: [],
                    fromCart: false,
                    remark: null
                }
            }
        },
        computed: {
            totalPrice() {
                let total = 0
                for (let i in this.data.items) {
                    let item = this.data.items[i];
                    total += item.property.price * item.nums
                }
                return total.toFixed(2)
            },
            orderItems() {
                return this.data.items.length > 5 ? this.data.items.slice(0, 5) : this.data.items
            }
        },
        methods: {
            createOrder() {
                const data = {
                    ...this.data,
                    items: this.data.items.map(item => {
                       return {
                           itemId: item.item.id,
                           propertyId: item.property.id,
                           nums: item.nums
                       }
                    }),
                    payment: this.data.payment.name
                }
                if (this.data.address.name == null) {
                    this.$vux.toast.show({text: '请先选择收货地址', type: 'warn'})
                    return
                }
                if (this.data.payment.name == null) {
                    this.$vux.toast.show({text: '请先选择支付方式', type: 'warn'})
                    return
                }
                if (this.data.invoice.title == null) {
                    data.invoice = null
                }
                API.create(data).then(res => {
                    this.$vux.toast.show({text: '创建订单成功'})
                })
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            goInvoice() {
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
                if (this.data.fromCart) {
                    Util.go('MyCart')
                } else {
                    Util.go('GoodsItemDetail', {
                        id: this.data.items[0].item.id
                    })
                }
            },
            goPickupAddress() {
                Util.putJson('settleAccountData', this.data)
                Util.put('settleAccountKey', this.key)
                Util.go('MyAddressList', {
                    fromOrderPreview: 'true'
                })
            },
            loadAddress() {
                AddressAPI.loadDefault().then(address => {
                    if (address) {
                        this.data.address = address
                    }
                })
            },
            load() {
                this.loadAddress()
                API.getPreview(this.key).then(data => {
                    if (!data) {
                        this.$vux.toast.text('结算信息失效，请重新下单')
                        setTimeout(() => {
                            Util.go('GoodsItemList', {
                                id: 0,
                                fromOrderPreview: true
                            })
                        }, 1000)
                        return
                    }
                    this.data.items = data.items
                    this.data.fromCart = data.fromCart
                    Util.putJson('settleAccountData', this.data)
                    this.show = false
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
            this.popupHeight = document.documentElement.clientHeight * 0.6
            this.contentStyle.marginTop = '60px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            const wrapperHeight = document.documentElement.clientHeight - 120
            this.contentStyle.minHeight = wrapperHeight + 'px'
            this.footerStyle.padding = '0'
            this.key = this.$router.currentRoute.params.key
            const data = Util.getJson('settleAccountData')
            if (data) {
                this.data = data
                this.show = false
            } else {
                this.load()
            }

        }
    }
</script>
