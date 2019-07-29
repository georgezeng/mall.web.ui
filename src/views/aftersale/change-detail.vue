<style scoped lang="less">

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
        color: #fff;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">售后详情</div>
        </Header>
        <Content :style="contentStyle">
            <div style="background-color: #fff; padding: 10px;">
                <img :src="config.publicBucketDomain + item.subOrder.thumbnail" width="72" height="72">
                <div style="display: inline-block; margin-left: 10px;">
                    <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                        {{itemName(item.subOrder.itemName)}}
                    </div>
                    <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                        {{specText(item.subOrder.specificationValues)}}
                    </div>
                    <div style="font-size: 11pt;">
                        <span style="color: orangered;margin-right: 10px;">价格: ￥{{item.subOrder.unitPrice}}</span>
                        <span>x{{item.subOrder.nums}}</span>
                    </div>
                </div>
            </div>
            <div v-if="item.postTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.postTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    用户售后申请
                </div>
                <div style="background-color: #fff; padding: 10px;">
                    <div style="margin-top: 5px;">用户发起: 换货</div>
                    <div style="margin-top: 5px;">服务单号: {{item.serviceId}}</div>
                    <div style="margin-top: 5px;">原订单号: {{item.order.orderId}}</div>
                    <div style="margin-top: 5px;">货物状态: 已收到货</div>
                    <div style="margin-top: 5px;">售后原因: {{item.reason}}</div>
                    <div style="margin-top: 5px;">售后说明: {{item.description}}</div>
                    <div style="margin-top: 5px;">
                        <img v-for="(path, index) in item.photos" :key="index" :src="config.publicBucketDomain + path"
                             width="42" height="42"/>
                    </div>
                </div>
            </div>
            <div v-if="item.processedTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.processedTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城同意换货，请尽快回寄商品
                </div>
            </div>
            <div v-if="item.rejectTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.rejectTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城拒绝换货，不在换货规则内
                </div>
            </div>
            <div v-if="item.returnTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.returnTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    用户寄回商品
                </div>
                <div style="background-color: #fff; padding: 10px;">
                    <div style="margin-top: 5px;">物流公司: {{item.clientExpressCompany}}</div>
                    <div style="margin-top: 5px;">物流单号: {{item.clientExpressNumber}}</div>
                </div>
            </div>
            <div v-if="item.receiveTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.receiveTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城确认收货
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    即将为你寄出新的物品，请耐心等待...
                </div>
            </div>
            <div v-if="item.sendTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.sendTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城已将商品寄出
                </div>
                <div style="background-color: #fff; padding: 10px;">
                    <div style="margin-top: 5px;">物流公司: {{item.merchantExpressCompany}}</div>
                    <div style="margin-top: 5px;">物流单号: {{item.merchantExpressNumber}}</div>
                    <div style="margin-top: 5px;">备注: {{item.remark}}</div>
                </div>
            </div>
            <div v-if="item.pickupTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.pickupTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    用户已确认收货
                </div>
                <div style="background-color: #fff; padding: 10px;">
                    期待您的下一次惠顾
                </div>
            </div>
        </Content>
        <Footer v-if="item.status.name == 'WaitForReturn' || item.status.name == 'WaitForPickup'" :style="footerStyle">
            <x-button v-if="item.status.name == 'WaitForReturn'" action-type="button" :disabled="loading"
                      style="float: right; margin-right: 10px; background-color: red;"
                      :show-loading="loading" @click.native="goExpress">
                <span style="font-size: 11pt; color: #fff;">填写运单</span>
            </x-button>
            <x-button v-if="item.status.name == 'WaitForPickup'" action-type="button" :disabled="loading"
                      style="float: right; margin-right: 10px; background-color: red;"
                      :show-loading="loading" @click.native="pickupConfirm">
                <span style="font-size: 11pt; color: #fff;">确认收货</span>
            </x-button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/aftersale.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'

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
                footerStyle: {
                    ...commonStyles.footer,
                    padding: '10px'
                },
                item: {
                    id: null,
                    order: {
                        orderId: null
                    },
                    serviceId: null,
                    status: null,
                    postTime: null,
                    processedTime: null,
                    refundTime: null,
                    returnTime: null,
                    rejectTime: null,
                    receiveTime: null,
                    expressCompany: null,
                    expressNumber: null,
                    subOrder: {
                        itemName: null,
                        thumbnail: null,
                        specificationValues: null,
                        unitPrice: 0,
                        nums: 0
                    }
                },
                isSmallDevice: false,
            }
        },
        computed: {},
        methods: {
            pickupConfirm() {
                MessageBox.confirm('你确定已经收到商品吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.pickup(this.item.id).then(res => {
                        this.$vux.loading.hide()
                        const nav = Util.getForNav()
                        Util.go(nav.from, {
                            id: nav.id ? nav.id : 0,
                            status: 'Finished'
                        })
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            goExpress() {
                Util.putForNav({
                    from: 'AfterSaleChangeDetail',
                    id: this.item.id
                })
                Util.go('AfterSaleExpress', {
                    id: this.item.id
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
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                if (this.item.id > 0) {
                    API.load(this.item.id).then(data => {
                        this.item = data
                    })
                }
            },
        },
        mounted() {
            this.contentStyle.marginTop = '60px'
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.item.id = this.$router.currentRoute.params.id
            this.load()
        }
    }
</script>
