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
        <Header :style="headerStyle" style="height: 135px;">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">我的积分</div>
            <div style="margin-top: -20px; background-color: #AD9979; color: #fff; padding: 10px; text-align: left; font-size: 12pt; line-height: 20px;">
                <div style="position: relative; top: 5px; font-size: 12pt; margin-bottom: 10px;">累积获得: {{data.accInAmount}} DBB</div>
                <div style="font-size: 14px; color: #fff;">积分在订单确认收货完成后赠送，如果退货退款会扣除赠送数量</div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div v-if="list && list.length > 0" style="margin: 10px;">积分明细</div>
            <div style="margin: 10px; position: relative;" v-for="item in list" :key="item.id">
                <div style="background-color: #fff; font-size: 14px; padding: 10px;">
                    <div style="border-bottom: 1px solid #F1F1F1; padding-bottom: 5px; margin-bottom: 5px;">
                        <span style="color: gray;">{{item.createTime}}</span>
                        <span v-if="item.balanceType.name == 'In'" style="float: right; color: orangered;">{{item.type.text}} +{{item.bonusAmount}} DBB</span>
                        <span v-else style="float: right; color: gray;">{{item.type.text}} -{{item.bonusAmount}} DBB</span>
                    </div>
                    <div v-if="item.orderId != null">订单号: {{item.orderId}}</div>
                    <div v-if="item.amount != null">消费金额: ￥{{item.amount.toFixed(2)}}</div>
                    <div v-else>备注: {{item.remark}}</div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}" v-if="list.length == 0" align="center" style="position: relative; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无积分记录</div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/points.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import NoRecord from '../../images/norecord-points.png'

    export default {
        components: {},
        data() {
            return {
                NoRecord,
                noRecordTop: 0,
                config,
                commonStyles,
                headerStyle: {
                    ...commonStyles.header,
                    boxShadow: ''
                },
                contentStyle: {
                    ...commonStyles.content
                },
                data: {
                    currentAmount: 0,
                    accInAmount: 0
                },
                queryInfo: {
                    data: null,
                    page: {
                        num: 1,
                        size: 10,
                        property: 'createTime',
                        order: 'DESC'
                    },
                },
                list: [],
                allLoaded: false,
                showLoading: false,
                loadingList: false,
                showSpin: true,
            }
        },
        computed: {},
        methods: {
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
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
                API.journals(this.queryInfo).then(data => {
                    if (data && data.length > 0) {
                        this.queryInfo.page.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.queryInfo.page.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        } else {
                            this.showLoading = true
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
            scrollHandler(e) {
                Util.scrollHandler(e, this)
            },
        },
        mounted() {
            window.addEventListener('scroll', this.scrollHandler)
            this.contentStyle.marginTop = '130px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 130) + "px"
            this.noRecordTop = ((document.documentElement.clientHeight - 130) - 200) / 2
            this.load()
            API.baseInfo().then(data => {
                this.data = data
            })
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
