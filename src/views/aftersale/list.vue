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
        width: 18%;
        text-align: center;
        margin: 0;
        padding: 0;
        font-size: 14px;
    }

    .selected-title {
        color: orangered;
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
                <div style="padding: 10px 10px 10px;" v-if="item.status.name == 'NotYet'">
                    <Button @click="goApply(item.id)" style="float: right;" type="primary">
                        申请售后
                    </Button>
                    <div class="clearfix"></div>
                </div>
                <div style="padding: 10px 10px 10px;" v-if="item.status.name == 'WaitForReturn'">
                    <Button @click="goExpress(item.id)" style="float: right;" type="primary">填写运单</Button>
                    <div class="clearfix"></div>
                </div>
                <div style="padding: 10px 10px 10px;" v-if="item.status.name == 'WaitForPickup'">
                    <Button @click="pickupConfirm(item.id)" style="float: right;" type="primary">确认收货</Button>
                    <div class="clearfix"></div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/aftersale.js'
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
                Util.putJson('afterSaleInfo', {
                    status: this.status
                })
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
            },
            pickupConfirm(id) {
                MessageBox.confirm('你确定已经收到商品吗?').then(action => {
                    this.$vux.loading.show({
                        text: '加载中...'
                    })
                    API.pickup(id).then(res => {
                        this.status = 'Finished'
                        this.$vux.loading.hide()
                        this.reload()
                    }).catch(e => {
                        this.$vux.loading.hide()
                    })
                })
            },
            goApply(id) {
                Util.putJson('afterSaleInfo', {
                    orderId: this.orderId,
                    status: this.status
                })
                Util.go('AfterSaleTypeSelect', {
                    id
                })
            },
            goExpress(id) {
                Util.putJson('afterSaleInfo', {
                    orderId: this.orderId,
                    status: this.status,
                    fromList: true
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
                this.allLoaded = false
                this.page.num = 1
                this.list = []
                this.showSpin = true
                this.load()
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
                const info = Util.getJson('orderInfo')
                if (info) {
                    Util.putJson('orderInfo', null)
                    if (info.fromList) {
                        Util.go('MyOrderList', {
                            type: info.type
                        })
                    } else {
                        Util.go('MyOrderDetail', {
                            id: info.id
                        })
                    }
                } else {
                    if (this.orderId > 0) {
                        Util.go('MyOrderList', {
                            type: 'All'
                        })
                    } else {
                        Util.go('MyCenter')
                    }
                }
            },
            scrollHandler(e) {
                const scrollTop = document.body.scrollHeight - e.target.scrollingElement.scrollTop
                if (scrollTop == document.documentElement.clientHeight) {
                    this.showLoading = true
                    this.load();
                }
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
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.contentStyle.marginTop = '125px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 125) + "px"
            this.orderId = this.$router.currentRoute.params.id
            this.status = this.$router.currentRoute.params.status
            Util.put('afterSaleOrderId', this.orderId)
            window.addEventListener('scroll', this.scrollHandler)
            this.reload()
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
