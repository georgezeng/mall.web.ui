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
        /*font-size: 14px;*/
    }

    .selected-title {
        color: #B69C7D;
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
                    待评价<!-- ({{uncommentTotal}})-->
                </div>
                <div class="title" @click="selectStatus('All')"
                     :class="{'selected-title': status == 'All'}">
                    全部评价<!-- ({{commentTotal}})-->
                </div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div v-if="popup" :style="modalStyle" style="position: absolute; z-index: 10000000;">
                <swiper :aspect-ratio="1" auto loop :show-dots="false">
                    <swiper-item v-for="(url, index) in popupImgs" :key="index">
                        <img :src="config.publicBucketDomain + url" :width="popupImgWidth" :height="popupImgWidth">
                    </swiper-item>
                </swiper>
            </div>
            <Modal v-model="popup" footer-hide fullscreen>
            </Modal>
            <div style="background-color: #fff; margin-top: 10px;" v-for="item in uncommentList"
                 :key="item.id">
                <div @click="goItem(item.itemId)" style="padding: 10px;">
                    <img :src="config.publicBucketDomain + item.thumbnail" width="72" height="72"
                         style="display: inline-block; vertical-align: top;"/>
                    <div style="display: inline-block; margin-left: 10px;" :style="{width: itemInfoWidth + 'px'}">
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
                    <Button @click="goAdd(item.id)" style="float: right;">
                        评价
                    </Button>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div style="background-color: #fff; margin-top: 10px;" v-for="item in list"
                 :key="item.id">
                <div style="border-bottom: 1px solid #f5f5f5; padding: 10px 10px 5px; font-size: 14px;">
                    <span>{{item.createTime}}</span>
                    <span style="float: right; color: orangered;">{{item.value.text}}</span>
                </div>
                <div @click="goItem(item.itemId)" style="padding: 10px; position: relative;">
                    <img :src="config.publicBucketDomain + item.itemThumbnail" width="72" height="72"
                         style="display: inline-block; vertical-align: top;"/>
                    <div style="display: inline-block; margin-left: 10px;" :style="{width: itemInfoWidth + 'px'}">
                        <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                            {{itemName(item.itemName)}}
                        </div>
                        <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                            {{specText(item.itemSpecificationValues)}}
                        </div>
                        <div style="font-size: 11pt;">
                            <span>数量: x{{item.itemNums}}</span>
                        </div>
                    </div>
                    <Button v-if="item.passed && item.additionalEvaluation == null"
                            @click="goAddAdditional(item.id, $event)"
                            style="position: absolute; bottom: 0px; right: 10px;">
                        追加评价
                    </Button>
                </div>
                <div style="padding: 10px 10px 10px; position: relative; border-bottom: 1px solid #f5f5f5;">
                    <div style="margin-bottom: 10px;">
                        <span>评价:</span>
                        <span>{{item.remark}}</span>
                    </div>
                    <div v-if="item.photos != null">
                        <img @click="showBigImg(item.photos)" style="margin-right: 10px;"
                             v-for="(path, index) in item.photos" :key="index"
                             :src="config.publicBucketDomain + path"
                             width="60" height="60"/>
                    </div>
                    <div v-if="item.replyTime != null"
                         style="padding: 10px; background-color: #f5f5f5; font-size: 14px; color: gray;">
                        <div>客服回复: {{item.reply}}</div>
                        <div style="float: right;">{{item.replyTime}}</div>
                        <div class="clearfix"></div>
                    </div>
                    <img v-if="!item.passed && item.hasAudit" :src="UnPass" width="40" height="40"
                         style="position: absolute; bottom: 10px; right: 10px;"></img>
                </div>
                <div v-if="item.additionalEvaluation != null" style="padding: 10px 10px 10px; position: relative;">
                    <div style="margin-bottom: 10px;">
                        <span>追加评价:</span>
                        <span>{{item.additionalEvaluation.remark}}</span>
                    </div>
                    <div v-if="item.additionalEvaluation.photos != null">
                        <img @click="showBigImg(item.additionalEvaluation.photos)" style="margin-right: 10px;"
                             v-for="(path, index) in item.additionalEvaluation.photos" :key="index"
                             :src="config.publicBucketDomain + path"
                             width="160" height="160"/>
                    </div>
                    <div v-if="item.additionalEvaluation.replyTime != null"
                         style="padding: 10px; background-color: #f5f5f5; font-size: 14px; color: gray;">
                        <div>客服回复: {{item.additionalEvaluation.reply}}</div>
                        <div style="float: right;">{{item.additionalEvaluation.replyTime}}</div>
                        <div class="clearfix"></div>
                    </div>
                    <img v-if="!item.additionalEvaluation.passed && item.additionalEvaluation.hasAudit" :src="UnPass"
                         width="40" height="40" style="position: absolute; bottom: 10px; right: 10px;"></img>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}"
                 v-if="showNoRecord && uncommentList.length == 0 && status == 'UnComment'" align="center"
                 style="width: 100%; position: absolute; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无商品可评价</div>
            </div>
            <div :style="{top: noRecordTop + 'px'}" v-if="showNoRecord && list.length == 0 && status == 'All'"
                 align="center" style="position: relative; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无评价记录</div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/evaluation.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import {MessageBox} from 'mint-ui';
    import NoRecord from '../../images/norecord-evaluation.png'
    import UnPass from '../../images/img_stamp_unpass.png'

    export default {
        components: {},
        data() {
            return {
                UnPass,
                itemInfoWidth: 0,
                showNoRecord: false,
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
                init: false,
                list: [],
                uncommentList: [],
                uncommentTotal: 0,
                commentTotal: 0,
                allLoaded: false,
                showLoading: false,
                loadingList: false,
                showSpin: true,
                isSmallDevice: false,
                status: 'UnComment',
                popup: false,
                popupImgs: [],
                popupImgWidth: 0,
                modalStyle: null
            }
        },
        computed: {},
        methods: {
            showBigImg(urls) {
                this.popupImgs = urls
                this.popup = true
            },
            goItem(id) {
                Util.putForNav({
                    from: 'MyEvaluationList',
                    id: this.orderId,
                    status: this.status
                })
                Util.go('GoodsItemDetail', {
                    id
                })
            },
            goAdd(id) {
                Util.putForNav({
                    from: 'MyEvaluationList',
                    id: this.orderId,
                    status: this.status
                })
                Util.go('MyEvaluationAdd', {
                    id,
                    type: 'comment'
                })
            },
            goAddAdditional(id, e) {
                e.stopPropagation()
                Util.putForNav({
                    from: 'MyEvaluationList',
                    id: this.orderId,
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
                this.showNoRecord = false
                this.allLoaded = false
                this.page.num = 1
                this.list = []
                this.uncommentList = []
                this.showSpin = true
                this.loadingList = false
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
                                this.uncommentList.push(data[i])
                            }
                            if (data.length < this.page.size) {
                                this.allLoaded = true
                                this.showLoading = false
                            } else {
                                this.showLoading = true
                            }
                        } else {
                            this.allLoaded = true
                            this.showLoading = false
                            if (this.uncommentList.length == 0) {
                                if (!this.init) {
                                    this.status = 'All'
                                    this.reload()
                                    return
                                } else {
                                    this.showNoRecord = true
                                }
                            }
                        }
                        this.showSpin = false
                        this.loadingList = false
                    }).catch(e => {
                        this.showSpin = false
                        this.loadingList = false
                    })
                } else {
                    this.init = true
                    API.listComment({
                        data: this.orderId,
                        page: this.page
                    }).then(data => {
                        if (data && data.length > 0) {
                            this.page.num++
                            for (let i in data) {
                                this.list.push(data[i])
                            }
                            if (data.length < this.page.size) {
                                this.allLoaded = true
                                this.showLoading = false
                            }
                        } else {
                            this.showNoRecord = true
                            this.allLoaded = true
                            this.showLoading = false
                        }
                        this.showSpin = false
                        this.loadingList = false
                    }).catch(e => {
                        this.showSpin = false
                        this.loadingList = false
                    })
                }

            },
            scrollHandler(e) {
                Util.scrollHandler(e, this)
            },
            count() {
                API.countComment({
                    data: this.orderId,
                    page: this.page
                }).then(total => total ? this.commentTotal = total : this.commentTotal = 0)
                API.countUnComment({
                    data: this.orderId,
                    page: this.page
                }).then(total => total ? this.uncommentTotal = total : this.uncommentTotal = 0)
            }
        },
        mounted() {
            this.itemInfoWidth = document.documentElement.clientWidth - 108
            window.addEventListener('scroll', this.scrollHandler)
            this.isSmallDevice = document.documentElement.clientHeight < 620
            this.popupImgWidth = document.documentElement.clientWidth
            this.modalStyle = {
                width: '100%',
                height: this.popupImgWidth + 'px',
                top: (document.documentElement.clientHeight - this.popupImgWidth) / 2 + 'px',
                position: 'fixed'
            }
            this.contentStyle.marginTop = '130px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 130) + "px"
            this.noRecordTop = ((document.documentElement.clientHeight - 130) - 200) / 2
            this.orderId = this.$router.currentRoute.params.id
            this.status = this.$router.currentRoute.params.status
            this.reload()
            // this.count()
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
