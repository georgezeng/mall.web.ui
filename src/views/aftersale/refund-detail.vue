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
                    <div style="margin-top: 5px;">用户发起: 仅退款</div>
                    <div style="margin-top: 5px;">服务单号: {{item.serviceId}}</div>
                    <div style="margin-top: 5px;">原订单号: {{item.orderId}}</div>
                    <div style="margin-top: 5px;">货物状态: 未收到货</div>
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
                    等待商城退款
                </div>
                <div style="background-color: #fff; padding: 10px;">
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
                </div>
            </div>
        </Content>
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
                item: {
                    id: null,
                    orderId: null,
                    serviceId: null,
                    status: null,
                    postTime: null,
                    processedTime: null,
                    refundTime: null,
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
