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
        box-shadow: 0px 0px 3px -1px gray;
    }

    .title {
        display: inline-block;
        width: 48%;
        text-align: center;
        margin: 0;
        padding: 0;
        font-size: 14px;
    }

    .selected-title {
        color: #B69C7D;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">退款/售后</div>
            <div class="titlePanel">
                <div class="title" @click="selectStatus('NotYet')" :class="{'selected-title': status == 'NotYet'}">
                    未申请
                </div>
                <div class="title" @click="selectStatus('All')" :class="{'selected-title': status == 'All'}">
                    申请记录
                </div>
                <!--
                <div class="title" @click="selectStatus('Processing')"
                     :class="{'selected-title': status == 'Processing'}">
                    审核中
                </div>
                <div class="title" @click="selectStatus('WaitForProcess')"
                     :class="{'selected-title': status == 'WaitForProcess'}">
                    待处理
                </div>
                <div class="title" @click="selectStatus('WaitForConfirm')"
                     :class="{'selected-title': status == 'WaitForConfirm'}">
                    待确认
                </div>
                <div class="title" @click="selectStatus('Finished')" :class="{'selected-title': status == 'Finished'}">
                    申请记录
                </div>
                -->
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div style="background-color: #fff; margin-top: 20px;" v-for="item in list"
                 :key="item.id">
                <div v-if="item.status.name != 'NotYet'"
                     style="border-bottom: 1px solid #f5f5f5; padding: 10px 10px 5px; font-size: 14px;">
                    申请时间: {{item.createTime}}
                    <span style="float: right; color: orangered;">{{item.status.clientText}}</span>
                </div>
                <div @click="goDetail(item)" style="padding: 10px;">
                    <img :src="config.publicBucketDomain + item.subOrder.thumbnail" width="72" height="72"
                         style="display: inline-block; vertical-align: top;"/>
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
                <div style="padding: 10px 10px 10px;" v-if="item.status.name == 'NotYet'">
                    <Button @click="goApply(item.id)" style="float: right;">
                        申请售后
                    </Button>
                    <div class="clearfix"></div>
                </div>
                <div style="padding: 10px 10px 10px;" v-if="item.status.name == 'WaitForReturn'">
                    <Button @click="goExpress(item.id)" style="float: right;">填写运单</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="padding: 10px 10px 10px;" v-if="item.status.name == 'WaitForPickup'">
                    <Button @click="pickupConfirm(item.id)" style="float: right;">确认收货</Button>
                    <div class="clearfix"></div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}" v-if="showNoRecord && list.length == 0" align="center" style="position: relative; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div v-if="status == 'NotYet'">暂无商品可申请</div>
                <div v-else>暂无申请记录</div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/aftersale.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import {MessageBox} from 'mint-ui';
    import NoRecord from '../../images/norecord-aftersale.png'

    export default {
        components: {},
        data() {
            return {
                itemInfoWidth: 0,
                showNoRecord: false,
                init: false,
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
                orderId: 0,
                page: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'createTime'
                },
                list: [],
                allLoaded: false,
                showLoading: false,
                loadingList: false,
                showSpin: true,
                isSmallDevice: false,
                status: 'NotYet',
            }
        },
        computed: {},
        methods: {
            goDetail(item) {
                Util.putForNav({
                    from: 'AfterSaleList',
                    id: this.orderId,
                    status: this.status
                })
                if (item.type) {
                    switch (item.type.name) {
                        case 'RefundOnly': {
                            Util.go('AfterSaleRefundOnlyDetail', {
                                id: item.id
                            })
                        }
                            break
                        case 'SalesReturn': {
                            Util.go('AfterSaleSalesReturnDetail', {
                                id: item.id
                            })
                        }
                            break
                        case 'Change': {
                            Util.go('AfterSaleChangeDetail', {
                                id: item.id
                            })
                        }
                            break
                    }
                } else {
                    Util.go('MyOrderDetail', {
                        id: item.order.id
                    })
                }
            },
            pickupConfirm(id) {
                MessageBox.confirm('您确定已经收到商品吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.pickup(id).then(res => {
                        this.$vux.loading.hide()
                        this.reload()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            goApply(id) {
                Util.putForNav({
                    from: 'AfterSaleList',
                    id: this.orderId,
                    status: this.status
                })
                Util.go('AfterSaleTypeSelect', {
                    id
                })
            },
            goExpress(id) {
                Util.putForNav({
                    from: 'AfterSaleList',
                    id: this.orderId,
                    status: this.status
                })
                Util.go('AfterSaleExpress', {
                    id
                })
            },
            selectStatus(status) {
                if (this.status == status) {
                    return
                }
                this.status = status
                this.reload()
            },
            reload() {
                this.showNoRecord = false
                this.allLoaded = false
                this.page.num = 1
                this.list = []
                this.loadingList = false
                this.showSpin = true
                this.load()
            },
            itemName(name) {
                return name ? (name.length > 16 ? name.substring(0, 16) + '...' : name) : ''
            },
            specText(values) {
                return values ? (values.length > 20 ? values.substring(0, 20) + '...' : values) : ''
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            scrollHandler(e) {
                Util.scrollHandler(e, this)
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
                API.list(this.orderId, this.status, this.page).then(data => {
                    if (data && data.length > 0) {
                        this.page.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.page.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        } else {
                            this.showLoading = true
                        }
                    } else {
                        this.showNoRecord = true
                        this.allLoaded = true
                        this.showLoading = false
                        if (this.list.length == 0 && this.status == 'NotYet' && !this.init) {
                            this.status = 'All'
                            this.reload()
                            this.init = true
                            return
                        }
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
            this.itemInfoWidth = document.documentElement.clientWidth - 108
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.contentStyle.marginTop = '125px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 125) + "px"
            this.orderId = this.$router.currentRoute.params.id
            this.status = this.$router.currentRoute.params.status
            this.noRecordTop = ((document.documentElement.clientHeight - 125) - 200) / 2
            Util.put('afterSaleOrderId', this.orderId)
            window.addEventListener('scroll', this.scrollHandler)
            this.reload()
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
