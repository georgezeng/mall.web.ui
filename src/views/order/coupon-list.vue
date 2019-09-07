<style scoped lang="less">

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
        color: #fff;
    }

    .hxType {
        display: inline-block;
        padding: 3px;
        border-radius: 10px;
        background-color: orangered;
        color: #fff;
        font-size: 10px;
    }

    .couponTitle {
        display: inline-block;
        margin-left: 10px;
    }

    .use_now {
        position: absolute;
        right: 10px;
        bottom: 5px;
        border: 1px solid gray;
        color: #2b85e4;
        border-radius: 10px;
        padding: 3px;
        font-size: 10px;
    }

    .checker {
        float: left;
        position: relative;
        top: 30px;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">可用优惠券</div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div v-transfer-dom>
                <popup v-model="popup" style="background-color: #fff;">
                    <div :style="{height: popupHeight + 'px'}" style="position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePopup"/>
                        <div style="font-weight: bold; width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            使用说明
                        </div>
                        <div>
                            <div style="margin: 10px;">
                                <div style="margin-bottom: 5px;">券编号: {{coupon.couponId}}</div>
                                <div style="margin-bottom: 5px;">获取途径: {{coupon.eventType.text}}</div>
                                <div style="margin-bottom: 5px;" v-if="coupon.fromOrderId != null">
                                    订单号: {{coupon.fromOrderId}}
                                </div>
                                <div style="margin-bottom: 5px;" v-if="coupon.invitee != null">
                                    分享用户: {{coupon.invitee}}
                                </div>
                            </div>
                            <div style="margin: 10px;" :style="{maxHeight: popupHeight/2 + 'px'}">
                                <div>核销说明</div>
                                <div style="font-size: 14px; color: gray;">
                                    <div v-if="coupon.hxType.name == 'Category'">
                                        <span>限购买</span>
                                        <span
                                                v-for="(category,index) in coupon.categories"
                                                :key="index">
                                            {{category.name}}{{index < coupon.categories.length - 1 ? ', ' : ''}}
                                        </span>
                                    </div>
                                    <div v-if="coupon.hxType.name == 'Item'">
                                        <span>限购买</span>
                                        <span  v-for="(item,index) in coupon.items"
                                               :key="index">
                                            {{item.name}}{{index < coupon.items.length - 1 ? ', ' : ''}}
                                        </span>
                                    </div>
                                    <div v-if="coupon.hxType.name == 'All'">
                                        <span>适用全部商品</span>
                                    </div>
                                </div>
                            </div>
                            <div style="margin: 10px;">
                                <div>使用详情</div>
                                <div>{{coupon.description}}</div>
                            </div>
                        </div>
                    </div>
                </popup>
            </div>
            <div style="margin: 10px; position: relative;" v-for="item in list" :key="item.id">
                <check-icon class="checker" :value.sync="item.selected"></check-icon>
                <img :src="config.publicBucketDomain + item.imgPath" width="150" height="90"
                     style="float: left; border:none;"/>
                <div style="float: left; background-color: #fff; height: 86px; position: relative; top: 3px; font-size: 12px;"
                     :style="{width: couponWidth}">
                    <div style="margin: 5px 10px;">
                        <div class="hxType">{{hxTypeText(item.hxType)}}</div>
                        <div class="couponTitle">{{item.title.length > 8 ? item.title.substring(0, 8) + "..." :
                            item.title}}
                        </div>
                    </div>
                    <div style="margin: 5px 10px;">{{item.startDate}}-{{item.endDate ? item.endDate : '不限期'}}</div>
                    <div @click="showPopup(item)" style="margin: 5px 10px; text-decoration: underline;">使用说明</div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div :style="{top: noRecordTop + 'px'}" v-if="list.length == 0" align="center" style="position: relative; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无优惠券</div>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <div style="font-size: 12pt; display: inline-block;color: orangered; padding: 10px 10px;">抵扣金额:
                ￥{{totalPrice}}
            </div>
            <div @click="confirmItems"
                 style="float: right; display: inline-block; padding: 10px 20px; background-color: #B69C7D; color: #fff;">
                确定
            </div>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/coupon.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import {MessageBox} from 'mint-ui';
    import NoRecord from '../../images/norecord-coupon.png'

    export default {
        components: {},
        data() {
            return {
                NoRecord,
                noRecordTop: 0,
                config,
                commonStyles,
                headerStyle: {
                    ...commonStyles.header
                },
                contentStyle: {
                    ...commonStyles.content
                },
                footerStyle: {
                    ...commonStyles.footer
                },
                list: [],
                showSpin: true,
                couponWidth: 0,
                popup: false,
                coupon: {
                    couponId: null,
                    fromOrderId: null,
                    invitee: null,
                    eventType: {},
                    hxType: {}
                },
                popupHeight: 0,
                key: null
            }
        },
        computed: {
            totalPrice() {
                let total = 0
                this.list.map(item => {
                    if (item.selected) {
                        total += item.amount
                    }
                })
                return total > 0 ? total.toFixed(2) : '0.00'
            }
        },
        methods: {
            confirmItems() {
                const data = Util.getJson('settleAccountData')
                data.coupons = this.list.filter(it => it.selected)
                Util.putJson('settleAccountData', data)
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            closePopup() {
                this.popup = false
            },
            showPopup(item) {
                this.coupon = item
                this.popup = true
            },
            hxTypeText(type) {
                switch (type) {
                    case 'All':
                        return '无限制'
                    case 'Category':
                        return '限分类'
                    case 'Item':
                        return '限商品'
                }
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                API.availableList(this.key).then(data => {
                    if (data && data.length > 0) {
                        const coupons = Util.getJson('settleAccountData').coupons
                        this.list = data.map(it => {
                            it.hxType = it.hxType.name
                            it.type = it.type.name
                            if (coupons) {
                                for (let i in coupons) {
                                    if (coupons[i].id == it.id) {
                                        it.selected = true
                                        break
                                    }
                                }
                            }
                            return it
                        })
                    }
                    this.showSpin = false
                }).catch(e => {
                    this.showSpin = false
                })
            },
        },
        mounted() {
            // this.isSmallDevice = document.documentElement.clientWidth < 400
            this.couponWidth = (document.documentElement.clientWidth - 20 - 150 - 40) + "px"
            this.contentStyle.marginTop = '60px'
            // this.headerStyle.height = '90px'
            this.footerStyle.padding = '0'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.popupHeight = document.documentElement.clientHeight
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 60) + "px"
            this.key = this.$router.currentRoute.params.key
            this.noRecordTop = ((document.documentElement.clientHeight - 60) - 300) / 2
            this.load()
        }
    }
</script>
