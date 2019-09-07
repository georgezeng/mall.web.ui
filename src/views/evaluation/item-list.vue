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
        width: 28%;
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
            <Icon size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">商品评价</div>
            <div class="titlePanel">
                <div class="title" @click="selectStatus('Good')"
                     :class="{'selected-title': queryInfo.data.value == 'Good'}">
                    好评 ({{goodTotal}})
                </div>
                <div class="title" @click="selectStatus('Neutrality')"
                     :class="{'selected-title': queryInfo.data.value == 'Neutrality'}">
                    中评 ({{neutralityTotal}})
                </div>
                <div class="title" @click="selectStatus('Bad')"
                     :class="{'selected-title': queryInfo.data.value == 'Bad'}">
                    差评 ({{badTotal}})
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
            <div style="background-color: #fff; margin-top: 10px;" v-for="item in list"
                 :key="item.id">
                <div style="border-bottom: 1px solid #f5f5f5; padding: 10px 10px 5px; font-size: 14px;">
                    <span>{{item.createTime}}</span>
                    <span style="float: right; color: orangered;">{{item.value.text}}</span>
                </div>
                <div style="padding: 10px;">
                    <avatar :src="avatar(item.clientAvatar)" size="large"/>
                    <span>{{item.clientNickname}}</span>
                </div>
                <div style="padding: 10px 10px 10px;">
                    <div style="margin-bottom: 10px;">
                        <span>评价:</span>
                        <span>{{item.remark}}</span>
                    </div>
                    <div v-if="item.photos != null">
                        <img @click="showBigImg(item.photos)" style="margin-right: 10px;"
                             v-for="(path, index) in item.photos" :key="index"
                             :src="config.publicBucketDomain + path"
                             width="160" height="160"/>
                    </div>
                    <div v-if="item.replyTime != null"
                         style="padding: 10px; background-color: #f5f5f5; font-size: 14px; color: gray;">
                        <div>客服回复: {{item.reply}}</div>
                        <div style="float: right;">{{item.replyTime}}</div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div v-if="item.additionalEvaluation != null" style="padding: 10px 10px 10px;">
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
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}" v-if="list.length == 0" align="center" style="position: relative; color: gray;">
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
    import defaultAvatar from '../../images/avatar.png'
    import NoRecord from '../../images/norecord-evaluation.png'

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
                queryInfo: {
                    data: {
                        id: null,
                        value: 'Good'
                    },
                    page: {
                        num: 1,
                        size: 10,
                        order: 'DESC',
                        property: 'createTime'
                    },
                },
                list: [],
                goodTotal: 0,
                neutralityTotal: 0,
                badTotal: 0,
                allLoaded: false,
                showLoading: false,
                loadingList: false,
                showSpin: true,
                isSmallDevice: false,
                popup: false,
                popupImgs: [],
                popupImgWidth: 0,
                modalStyle: null
            }
        },
        computed: {},
        methods: {
            avatar(img) {
                const avatar = img
                return avatar ?
                    (avatar.startsWith('http') ?
                        avatar
                        : config.publicBucketDomain + avatar)
                    : defaultAvatar
            },
            showBigImg(urls) {
                this.popupImgs = urls
                this.popup = true
            },
            selectStatus(status) {
                if (this.queryInfo.data.value == status) {
                    return
                }
                this.queryInfo.data.value = status
                this.reload()
            },
            reload() {
                this.allLoaded = false
                this.queryInfo.page.num = 1
                this.list = []
                this.showSpin = true
                this.load()
            },
            itemName(name) {
                if (!this.isSmallDevice) {
                    return name ? (name.length > 16 ? name.substring(0, 16) + '...' : name) : ''
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
                API.listCommentForGoodsItem(this.queryInfo).then(data => {
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
            this.noRecordTop = ((document.documentElement.clientHeight - 130) - 300) / 2
            window.addEventListener('scroll', this.scrollHandler)
            this.isSmallDevice = document.documentElement.clientWidth < 330
            this.popupImgWidth = document.documentElement.clientWidth
            this.modalStyle = {
                width: '100%',
                height: this.popupImgWidth + 'px',
                top: this.isSmallDevice ? '50px' : '100px'
            }
            this.contentStyle.marginTop = '130px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 130) + "px"
            this.queryInfo.data.id = this.$router.currentRoute.params.id
            this.reload()
            API.countForGoodsItem({
                ...this.queryInfo,
                data: {
                    id: this.queryInfo.data.id,
                    value: 'Good'
                }
            }).then(total => total ? this.goodTotal = total : this.goodTotal = 0)
            API.countForGoodsItem({
                ...this.queryInfo,
                data: {
                    id: this.queryInfo.data.id,
                    value: 'Neutrality'
                }
            }).then(total => total ? this.neutralityTotal = total : this.neutralityTotal = 0)
            API.countForGoodsItem({
                ...this.queryInfo,
                data: {
                    id: this.queryInfo.data.id,
                    value: 'Bad'
                }
            }).then(total => total ? this.badTotal = total : this.badTotal = 0)
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
