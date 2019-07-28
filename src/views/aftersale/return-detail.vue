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
                    <div style="margin-top: 5px;">用户发起: 退货退款</div>
                    <div style="margin-top: 5px;">服务单号: {{item.serviceId}}</div>
                    <div style="margin-top: 5px;">原订单号: {{item.orderId}}</div>
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
                    商城同意退款，请尽快回寄商品
                </div>
            </div>
            <div v-if="item.rejectTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.rejectTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城拒绝退款，不在退款规则内
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
                    <div style="margin-top: 5px;">物流公司: {{item.expressCompany}}</div>
                    <div style="margin-top: 5px;">物流单号: {{item.expressNumber}}</div>
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
                    RMB将原路退回支付账号，请耐心等待...(1-2工作日)
                </div>
            </div>
            <div v-if="item.refundTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.refundTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城已退款
                </div>
                <div style="background-color: #fff; padding: 10px;">
                    <div style="margin-top: 5px;">退款方式: 支付账号</div>
                    <div style="margin-top: 5px;">退款金额: {{item.amount}}</div>
                    <div style="margin-top: 5px;">备注: {{item.remark}}</div>
                </div>
            </div>
        </Content>
        <Footer v-if="item.status.name == 'WaitForReturn'" :style="footerStyle">
            <x-button action-type="button" :disabled="loading"
                      style="float: right; margin-right: 10px; background-color: red;"
                      :show-loading="loading" @click.native="goExpress">
                <span style="font-size: 11pt; color: #fff;">填写运单</span>
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
                    orderId: null,
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
            goExpress() {
                Util.putForNav({
                    from: 'AfterSaleSalesReturnDetail',
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
