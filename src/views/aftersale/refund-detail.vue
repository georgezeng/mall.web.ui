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
            <div v-if="popup" :style="modalStyle" style="position: absolute; z-index: 10000000;">
                <swiper :aspect-ratio="1" auto loop :show-dots="false">
                    <swiper-item v-for="(url, index) in popupImgs" :key="index">
                        <img :src="config.publicBucketDomain + url" :width="popupImgWidth" :height="popupImgWidth">
                    </swiper-item>
                </swiper>
            </div>
            <Modal v-model="popup" footer-hide fullscreen>
            </Modal>
            <div style="background-color: #fff; padding: 20px 10px 10px;">
                <img :src="config.publicBucketDomain + item.subOrder.thumbnail" width="72" height="72"
                     style="display: inline-block; vertical-align: top;">
                <div style="display: inline-block; margin-left: 10px;" :style="{width: itemInfoWidth + 'px'}">
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
            <div v-if="item.refundTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.refundTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    商城已退款
                </div>
                <div style="background-color: #fff; padding: 10px;">
                    <div style="margin-top: 5px;">退款方式: 支付账号</div>
                    <!--<div style="margin-top: 5px;">退款金额: {{item.amount}}</div>-->
                    <div style="margin-top: 5px;">退款单号: {{item.serviceId}}</div>
                </div>
            </div>
            <div v-if="item.rejectTime != null" style="font-size: 14px;">
                <div style="background-color: #f5f5f5; padding: 10px; text-align: center;">
                    {{item.rejectTime}}
                </div>
                <div style="background-color: #fff; padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    {{item.rejectReason}}
                </div>
            </div>
            <div v-if="item.rejectTime == null && item.processedTime != null" style="font-size: 14px;">
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
                    <div style="margin-top: 5px;">原订单号: {{item.order.orderId}}</div>
                    <div style="margin-top: 5px;">货物状态: 未收到货</div>
                    <div style="margin-top: 5px;">退款金额: {{item.amount}}</div>
                    <div style="margin-top: 5px;">售后原因: {{item.reason}}</div>
                    <div style="margin-top: 5px;">售后说明: {{item.description}}</div>
                    <div style="margin-top: 5px;">
                        <img @click="showBigImg(item.photos)" style="margin-right: 5px;" v-for="(path, index) in item.photos" :key="index"
                             :src="config.publicBucketDomain + path" width="42" height="42"/>
                    </div>
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
                itemInfoWidth: 0,
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
                    order: {
                        orderId: null
                    },
                    serviceId: null,
                    status: {
                        name: null
                    },
                    postTime: null,
                    processedTime: null,
                    refundTime: null,
                    rejectTime: null,
                    rejectReason: null,
                    subOrder: {
                        itemName: null,
                        thumbnail: null,
                        specificationValues: null,
                        unitPrice: 0,
                        nums: 0
                    }
                },
                popupImgs: [],
                isSmallDevice: false,
                popup: false,
                modalStyle: {}
            }
        },
        computed: {},
        methods: {
            showBigImg(urls) {
                this.popupImgs = urls
                this.popup = true
            },
            itemName(name) {
                return name
            },
            specText(values) {
                return values
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
            this.contentStyle.paddingBottom = '40px'
            this.itemInfoWidth = document.documentElement.clientWidth - 108
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 100) + "px"
            this.contentStyle.backgroundColor = '#f5f5f5'
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.popupImgWidth = document.documentElement.clientWidth
            this.modalStyle = {
                width: '100%',
                height: this.popupImgWidth + 'px',
                top: (document.documentElement.clientHeight - this.popupImgWidth) / 2 + 'px',
                position: 'fixed'
            }
            this.item.id = this.$router.currentRoute.params.id
            this.load()
        }
    }
</script>
