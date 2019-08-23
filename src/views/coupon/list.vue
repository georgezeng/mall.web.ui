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
        width: 100%;
        position: absolute;
        top: 65px;
        left: 0px;
        box-shadow: 0px 0px 3px -1px gray;
    }

    .title {
        display: inline-block;
        width: 28%;
        text-align: center;
        margin: 0;
        padding: 0;
    }

    .selected-title {
        color: orangered;
    }

    .stamp_unuse {
        position: absolute;
        background-image: url(../../images/stamp-unuse.png);
        background-size: contain;
        background-repeat: no-repeat;
        width: 50px;
        height: 50px;
        top: 0px;
        right: 0px;
        z-index: 10;
    }

    .stamp_used {
        position: absolute;
        background-image: url(../../images/stamp-used.png);
        background-size: contain;
        background-repeat: no-repeat;
        width: 50px;
        height: 50px;
        top: 0px;
        right: 0px;
        z-index: 10;
    }

    .stamp_out {
        position: absolute;
        background-image: url(../../images/stamp-out.png);
        background-size: contain;
        background-repeat: no-repeat;
        width: 50px;
        height: 50px;
        top: 0px;
        right: 0px;
        z-index: 10;
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

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">我的优惠券</div>
            <div class="titlePanel">
                <div class="title" @click="selectType('UnUse')" :class="{'selected-title': type == 'UnUse'}">
                    已领取({{unuseCount}})
                </div>
                <div class="title" @click="selectType('Used')" :class="{'selected-title': type == 'Used'}">
                    已使用({{usedCount}})
                </div>
                <div class="title" @click="selectType('Out')" :class="{'selected-title': type == 'Out'}">
                    已失效({{outCount}})
                </div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div v-transfer-dom>
                <popup v-model="popup" style="background-color: #fff;">
                    <div :style="{height: popupHeight + 'px'}" style="position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePopup"/>
                        <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            使用说明
                        </div>
                        <div style="margin: 10px; overflow: auto;" :style="{maxHeight: popupHeight/2 + 'px'}">
                            <span v-if="coupon.hxType.name == 'Category'">
                                仅限类型:
                            </span>
                            <span v-if="coupon.hxType.name == 'Category'" v-for="(category,index) in coupon.categories" :key="index">
                                {{category.name}}{{index < coupon.categories.length - 1 ? ', ' : ''}}
                            </span>
                            <span v-if="coupon.hxType.name == 'Item'">
                                仅限商品:
                            </span>
                            <span v-if="coupon.hxType.name == 'Item'" v-for="(item,index) in coupon.items" :key="index">
                                {{item.name}}{{index < coupon.items.length - 1 ? ', ' : ''}}
                            </span>
                            <span v-if="coupon.hxType.name == 'All'">
                                适用全部商品
                            </span>
                        </div>
                        <div style="margin: 10px;">
                            说明详情: {{coupon.description}}
                        </div>
                    </div>
                </popup>
            </div>
            <div style="margin: 10px; position: relative;" v-for="item in list" :key="item.id">
                <div :class="'stamp_'+type.toLowerCase()"></div>
                <img :src="config.publicBucketDomain + item.imgPath" width="150" height="90"
                     style="float: left; border:none;"/>
                <div style="float: left; background-color: #fff; height: 86px; position: relative; top: 3px; font-size: 12px;"
                     :style="{width: couponWidth}">
                    <div style="margin: 5px 10px;">
                        <div class="hxType">{{hxTypeText(item.hxType.name)}}</div>
                        <div class="couponTitle">{{item.title}}</div>
                    </div>
                    <div style="margin: 5px 10px;">{{item.startDate}}-{{item.endDate ? + item.endDate : '不限期'}}</div>
                    <div @click="showPopup(item)" style="margin: 5px 10px; text-decoration: underline;">使用说明</div>
                    <div @click="goItemList(item.id)" class="use_now">立即使用</div>
                </div>
                <div class="clearfix"></div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/coupon.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import {MessageBox} from 'mint-ui';

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
                    data: 'UnUse',
                    page: {
                        num: 1,
                        size: 10,
                        property: 'receivedTime',
                        order: 'ASC'
                    },
                },
                list: [],
                allLoaded: false,
                showLoading: true,
                loadingList: false,
                showSpin: true,
                type: 'UnUse',
                couponWidth: 0,
                unuseCount: 0,
                usedCount: 0,
                outCount: 0,
                popup: false,
                coupon: {
                    hxType: {}
                },
                popupHeight: 0
            }
        },
        computed: {},
        methods: {
            closePopup() {
                this.popup = false
            },
            goItemList(id) {
                Util.putForNav({
                    from: 'MyCoupon',
                    type: this.type
                })
                Util.go('GoodsItemList', {
                    id,
                    type: 'coupon'
                })
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
            count() {
                API.count({
                    data: 'UnUse'
                }).then(data => {
                    this.unuseCount = data
                })
                API.count({
                    data: 'Used'
                }).then(data => {
                    this.usedCount = data
                })
                API.count({
                    data: 'Out'
                }).then(data => {
                    this.outCount = data
                })
            },
            selectType(type) {
                if (this.queryInfo.data == type) {
                    return
                }
                this.queryInfo.data = type
                this.reload()
            },
            reload() {
                this.allLoaded = false
                this.queryInfo.page.num = 1
                this.list = []
                this.showSpin = true
                this.load()
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
                        }
                    } else {
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
        },
        mounted() {
            // this.isSmallDevice = document.documentElement.clientWidth < 400
            this.couponWidth = (document.documentElement.clientWidth - 20 - 150) + "px"
            this.contentStyle.marginTop = '125px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.popupHeight = document.documentElement.clientHeight * 0.8
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 125) + "px"
            this.type = this.$router.currentRoute.params.type
            this.reload()
            this.count()
        }
    }
</script>
