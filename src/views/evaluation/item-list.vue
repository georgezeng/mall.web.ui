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
            <Icon size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">商品评价</div>
            <div class="titlePanel">
                <div class="title" @click="selectStatus('Good')"
                     :class="{'selected-title': status == 'Good'}">
                    好评 ({{goodTotal}})
                </div>
                <div class="title" @click="selectStatus('Neutrality')"
                     :class="{'selected-title': status == 'Neutrality'}">
                    中评 ({{neutralityTotal}})
                </div>
                <div class="title" @click="selectStatus('Bad')"
                     :class="{'selected-title': status == 'Bad'}">
                    差评 ({{badTotal}})
                </div>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div style="background-color: #fff; margin-top: 10px;" v-for="item in list"
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
            }
        },
        computed: {},
        methods: {
            selectStatus(status) {
                if (this.queryInfo.data.value == status) {
                    return
                }
                this.queryInfo.data.value = status
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
                const from = Util.get('goodsItemDetailFrom')
                Util.go('GoodsItemDetail', {
                    id: this.queryInfo.data.id,
                    from: from ? from : 'home'
                })
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
            },
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientWidth < 400
            this.contentStyle.marginTop = '130px'
            // this.headerStyle.height = '90px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 130) + "px"
            this.queryInfo.data.id = this.$router.currentRoute.params.id
            this.reload()
            API.countForGoodsItem({
                ...this.queryInfo,
                data: {
                    ...this.queryInfo.data.id,
                    value: 'Good'
                }
            }).then(total => this.goodTotal = total)
            API.countForGoodsItem({
                ...this.queryInfo,
                data: {
                    ...this.queryInfo.data.id,
                    value: 'Neutrality'
                }
            }).then(total => this.neutralityTotal = total)
            API.countForGoodsItem({
                ...this.queryInfo,
                data: {
                    ...this.queryInfo.data.id,
                    value: 'Bad'
                }
            }).then(total => this.badTotal = total)
        }
    }
</script>
