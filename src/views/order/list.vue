<style scoped lang="less">

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
        color: #fff;
    }

    .titlePanel {
        color: #5C6677;
        font-size: 12pt;
        background-color: #fff;
        margin: 0;
        padding: 0;
        width: 100%;
        position: absolute;
        top: 65px;
        left: 0px;
    }

    .title {
        display: inline-block;
        width: 23%;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .selected-title {
        color: orangered;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">我的订单</div>
            <div class="titlePanel">
                <div class="title" @click="selectType('All')" :class="{'selected-title': type == 'All'}">全部</div>
                <div class="title" @click="selectType('UnPay')" :class="{'selected-title': type == 'UnPay'}">待付款</div>
                <div class="title" @click="selectType('Paid')" :class="{'selected-title': type == 'Paid'}">待收货</div>
                <div class="title" @click="selectType('Finished')" :class="{'selected-title': type == 'Finished'}">已完成
                </div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div style="background-color: #fff; margin: 20px 0px; padding: 10px 0;" v-for="item in list" :key="item.id">
                <div style="padding: 10px 10px;">
                    <div style="float: left;">下单时间: {{item.createTime}}</div>
                    <div style="float: right; color: darkorange;">{{item.status.clientText}}</div>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 0 10px 10px; border: 1px solid #F5F5F5;"></div>
                <div @click="goDetail(item.id)">
                    <div style="padding: 0 10px 15px;" v-for="sub in item.subList" :key="sub.id">
                        <img :src="config.publicBucketDomain + sub.thumbnail" width="72" height="72">
                        <div style="display: inline-block; margin-left: 10px;">
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
                    <span style="color: orangered;">￥{{item.totalPrice}}</span> (含运费)
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'UnPay'">
                    <Button @click="pay(item)" style="float: right; margin-left: 10px;" type="primary">去支付</Button>
                    <Button @click="cancelConfirm(item.id)" style="float: right;" type="primary">
                        取消订单
                    </Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Paid'">
                    <Button @click="cancelConfirm(item.id)" style="float: right;" type="primary">取消订单</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Shipped'">
                    <Button style="float: right; margin-left: 10px;" type="primary">查看物流</Button>
                    <Button @click="pickedUpConfirm(item.id)" style="float: right;" type="primary">确认收货</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Canceled'">
                    <Button @click="deleteConfirm(item.id)" style="float: right;" type="primary">清除订单</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Closed'">
                    <Button @click="deleteConfirm(item.id)" style="float: right;" type="primary">清除订单</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="margin: 10px;" v-if="item.status.name == 'Finished'">
                    <Button v-if="!item.comment" @click="goEvaluate(item.id)" style="float: right; margin-left: 10px;"
                            type="primary">
                        评价
                    </Button>
                    <Button v-else @click="goEvaluate(item.id)" style="float: right; margin-left: 10px;" type="primary">
                        查看评价
                    </Button>
                    <Button @click="deleteConfirm(item.id)" style="float: right;" type="primary">
                        清除订单
                    </Button>
                    <div class="clearfix"></div>
                </div>
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

    export default {
        components: {},
        data() {
            return {
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
            }
        },
        computed: {},
        methods: {
            pay(item) {
                if (Util.isInWechat()) {
                    if (item.payment.name == 'WePay') {
                        Util.wepayForJsApi(item.id, () => {
                            this.reload()
                        })
                    } else {

                    }
                } else {
                    if (item.payment.name == 'WePay') {

                    } else {

                    }
                }
            },
            goDetail(id) {
                Util.go('MyOrderDetail', {
                    id,
                    type: this.type
                })
            },
            goEvaluate(id) {
                Util.go('MyEvaluation', {
                    id,
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
                this.allLoaded = false
                this.queryInfo.page.num = 1
                this.list = []
                switch (this.type) {
                    case 'All':
                        this.queryInfo.data = null;
                        break
                    default:
                        this.queryInfo.data = this.type
                }
                this.load()
            },
            pickedUpConfirm(id) {
                MessageBox.confirm('你确定已经收到商品吗?').then(action => {
                    API.pickup(id).then(res => {
                        this.reload()
                    })
                })
            },
            deleteConfirm(id) {
                MessageBox.confirm('你确定要清除订单吗?').then(action => {
                    API.delete(id).then(res => {
                        this.reload()
                    })
                })
            },
            cancelConfirm(id) {
                MessageBox.confirm('你确定要取消订单吗?').then(action => {
                    API.cancel(id).then(res => {
                        this.reload()
                    })
                })
            },
            itemName(name) {
                if (!this.isSmallDevice) {
                    return name.length > 18 ? name.substring(0, 18) + '...' : name
                }
                return name.length > 12 ? name.substring(0, 12) + '...' : name
            },
            specText(values) {
                if (!this.isSmallDevice) {
                    return values.length > 20 ? values.substring(0, 20) + '...' : values
                }
                return values.length > 14 ? values.substring(0, 14) + '...' : values
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
                    } else {
                        this.allLoaded = true;
                    }
                    this.showSpin = false
                    this.loadingList = false
                })
            },
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.contentStyle.marginTop = '125px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.type = this.$router.currentRoute.params.type
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 125) + "px"
            this.reload()
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'chooseWXPay',
                ])
            }
        }
    }
</script>
