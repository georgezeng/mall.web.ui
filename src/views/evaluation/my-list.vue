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
        width: 48%;
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
            <div align="center" style="color: #fff;">评价中心</div>
            <div class="titlePanel">
                <div class="title" @click="selectStatus('UnComment')"
                     :class="{'selected-title': status == 'UnComment'}">
                    待评价 ({{uncommentTotal}})
                </div>
                <div class="title" @click="selectStatus('All')"
                     :class="{'selected-title': status == 'All'}">
                    全部评价 ({{commentTotal}})
                </div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div v-if="status == 'UnComment'" style="background-color: #fff; margin-top: 10px;" v-for="item in list"
                 :key="item.id">
                <div style="padding: 10px; border-bottom: 1px solid #f5f5f5;">
                    <img :src="config.publicBucketDomain + item.thumbnail" width="72" height="72">
                    <div style="display: inline-block; margin-left: 10px;">
                        <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                            {{itemName(item.itemName)}}
                        </div>
                        <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                            {{specText(item.specificationValues)}}
                        </div>
                        <div style="font-size: 11pt;">
                            <span>数量: x{{item.nums}}</span>
                        </div>
                    </div>
                </div>
                <div style="padding: 10px 10px 10px;">
                    <Button @click="goAdd(item.id)" style="float: right;" type="primary">
                        评价
                    </Button>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div v-else style="background-color: #fff; margin-top: 10px;" v-for="item in list"
                 :key="item.id">
                <div style="border-bottom: 1px solid #f5f5f5; padding: 10px 10px 5px; font-size: 14px;">
                    <span>{{item.createTime}}</span>
                    <span style="float: right; color: orangered;">{{item.value.text}}</span>
                </div>
                <div style="padding: 10px;">
                    <img :src="config.publicBucketDomain + item.itemThumbnail" width="72" height="72">
                    <div style="display: inline-block; margin-left: 10px;">
                        <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                            {{itemName(item.itemName)}}
                        </div>
                        <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                            {{specText(item.itemSpecificationValues)}}
                        </div>
                        <div style="font-size: 11pt;">
                            <span>数量: x{{item.itemNums}}</span>
                        </div>
                        <Button v-if="item.passed && item.additional == null" @click="goAddAdditional(item.id)"
                                style="float: right;"
                                type="primary">
                            追加评价
                        </Button>
                    </div>
                </div>
                <div style="padding: 10px 10px 10px;">
                    <div>
                        <span>评价:</span>
                        <span>{{item.remark}}</span>
                    </div>
                    <div v-if="item.photos != null">
                        <img style="margin-right: 5px;" v-for="(path, index) in item.photos" :key="index"
                             :src="config.publicBucketDomain + path"
                             width="42" height="42"/>
                    </div>
                    <div v-if="item.replyTime != null" style="background-color: #f5f5f5;">
                        <div>回复: {{item.reply}}</div>
                        <div style="float: right;">{{item.replyTime}}</div>
                    </div>
                </div>
                <div v-if="item.additional != null" style="padding: 10px 10px 10px;">
                    <div>
                        <span>追加评价:</span>
                        <span>{{item.additional.remark}}</span>
                    </div>
                    <div v-if="item.additional.photos != null">
                        <img style="margin-right: 5px;" v-for="(path, index) in item.additional.photos" :key="index"
                             :src="config.publicBucketDomain + path"
                             width="42" height="42"/>
                    </div>
                    <div v-if="item.additional.replyTime != null" style="background-color: #f5f5f5;">
                        <div>回复: {{item.additional.reply}}</div>
                        <div style="float: right;">{{item.additional.replyTime}}</div>
                    </div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/evaluation.js'
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
                uncommentTotal: 0,
                commentTotal: 0,
                allLoaded: false,
                showLoading: false,
                loadingList: false,
                showSpin: true,
                isSmallDevice: false,
                status: 'UnComment',
            }
        },
        computed: {},
        methods: {
            goAdd(id) {
                Util.putJson('evaluationInfo', {
                    orderId: this.orderId,
                    status: this.status
                })
                Util.go('MyEvaluationAdd', {
                    id,
                    type: 'comment'
                })
            },
            goAddAdditional(id) {
                Util.putJson('evaluationInfo', {
                    orderId: this.orderId,
                    status: this.status
                })
                Util.go('MyEvaluationAdd', {
                    id,
                    type: 'additional'
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
                    return name ? (name.length > 20 ? name.substring(0, 20) + '...' : name) : ''
                }
                return name ? (name.length > 12 ? name.substring(0, 12) + '...' : name) : ''
            },
            specText(values) {
                if (!this.isSmallDevice) {
                    return values ? (values.length > 22 ? values.substring(0, 22) + '...' : values) : ''
                }
                return values ? (values.length > 16 ? values.substring(0, 16) + '...' : values) : ''
            },
            back() {
                const info = Util.getJson('orderInfo')
                if (info) {
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
                    Util.go('MyOrderList', {
                        type: 'All'
                    })
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
                if (this.status == 'UnComment') {
                    API.listUnComment({
                        data: this.orderId,
                        page: this.page
                    }).then(data => {
                        if (data && data.length > 0) {
                            this.page.num++
                            for (let i in data) {
                                this.list.push(data[i])
                            }
                        } else {
                            this.allLoaded = true;
                        }
                        this.showSpin = false
                        this.loadingList = false
                    })
                } else {
                    API.listComment({
                        data: this.orderId,
                        page: this.page
                    }).then(data => {
                        if (data && data.length > 0) {
                            this.page.num++
                            for (let i in data) {
                                this.list.push(data[i])
                            }
                        } else {
                            this.allLoaded = true;
                        }
                        this.showSpin = false
                        this.loadingList = false
                    })
                }

            },
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.contentStyle.marginTop = '130px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 130) + "px"
            this.orderId = this.$router.currentRoute.params.id
            this.status = this.$router.currentRoute.params.status
            this.reload()
            API.countComment({
                data: this.orderId,
                page: this.page
            }).then(total => this.commentTotal = total)
            API.countUnComment({
                data: this.orderId,
                page: this.page
            }).then(total => this.uncommentTotal = total)
        }
    }
</script>
