<style scoped lang="less">
    .searchInput {
        position: relative;
        top: -5px;
        right: -10px;
    }

    .orderTab {
        position: relative;
        margin: 10px 40px;
        font-size: 12pt;
        color: #5C6677;
    }

    .orderTab2 {
        position: relative;
        margin: 10px 20px;
        font-size: 12pt;
        color: #5C6677;
    }

    .selected {
        color: orangered;
    }

    .orderUpBtn {
        left: 30px;
        position: absolute;
        top: -2px;
    }

    .orderDownBtn {
        left: 30px;
        position: absolute;
        top: 5px;
    }

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
        color: #5C6677;
    }

    .item {
        background-color: #fff;
        margin-bottom: 8px;
        margin-right: 8px;
        display: inline-block;
        .name {
            font-size: 14px;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            margin-top: -10px;
        }
        .marketPrice {
            display: inline-block;
            font-size: 12px;
            color: #c5c8ce;
            text-decoration: line-through;
        }
        .realPrice {
            display: inline-block;
            font-size: 16px;
            color: orangered;
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .discount {
            display: inline-block;
            font-size: 12px;
            color: gray;
        }
    }

    .stat {
        color: gray;
        font-size: 10pt;
        margin: 0 10px 10px;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <Input size="large" class="searchInput" clearable :style="{width: searchInputWidth + 'px'}" search
                   placeholder="搜索商品"/>
            <div v-if="!isSmallDevice" style="position: relative; top: -25px;">
                <span class="orderTab" :class="{selected: isSelected.default}"
                      @click="orderBy('default', true)">默认</span>
                <span class="orderTab" @click="orderBy('putTime', true)">
                    <span :class="{selected: isSelected.putTime[0]}">时间</span>
                    <Icon size="15" class="orderUpBtn" :class="{selected: isSelected.putTime[1]}"
                          type="md-arrow-dropup"/>
                    <Icon size="15" class="orderDownBtn" :class="{selected: isSelected.putTime[2]}"
                          type="md-arrow-dropdown"/>
                </span>
                <span class="orderTab" @click="orderBy('price', true)">
                    <span :class="{selected: isSelected.realPrice[0]}">价格</span>
                    <Icon size="15" class="orderUpBtn" :class="{selected: isSelected.realPrice[1]}"
                          type="md-arrow-dropup"/>
                    <Icon size="15" class="orderDownBtn" :class="{selected: isSelected.realPrice[2]}"
                          type="md-arrow-dropdown"/>
                </span>
            </div>
            <div v-else style="position: relative; top: -25px;">
                <span class="orderTab2" :class="{selected: isSelected.default}"
                      @click="orderBy('default', true)">默认</span>
                <span class="orderTab2" @click="orderBy('putTime', true)">
                    <span :class="{selected: isSelected.putTime[0]}">时间</span>
                    <Icon size="15" class="orderUpBtn" :class="{selected: isSelected.putTime[1]}"
                          type="md-arrow-dropup"/>
                    <Icon size="15" class="orderDownBtn" :class="{selected: isSelected.putTime[2]}"
                          type="md-arrow-dropdown"/>
                </span>
                <span class="orderTab2" @click="orderBy('price', true)">
                    <span :class="{selected: isSelected.realPrice[0]}">价格</span>
                    <Icon size="15" class="orderUpBtn" :class="{selected: isSelected.realPrice[1]}"
                          type="md-arrow-dropup"/>
                    <Icon size="15" class="orderDownBtn" :class="{selected: isSelected.realPrice[2]}"
                          type="md-arrow-dropdown"/>
                </span>
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div ref="grid" style="padding-left: 8px;">
                <div :key="item.id" v-for="item in list" class="item" :style="{width: itemWidth + 'px'}"
                     @click="goDetail(item.id)">
                    <div style="margin: 8px" align="center">
                        <img :src="config.publicBucketDomain + item.thumbnail" :width="itemImageWidth"
                             :height="itemImageWidth"/>
                    </div>
                    <div class="realPrice">￥{{priceRange(item)}}</div>
                    <div class="marketPrice" v-if="isSinglePrice(item)">{{item.marketPrice ? '￥' +
                        item.marketPrice : ''}}
                    </div>
                    <div class="discount" v-if="isSinglePrice(item)">{{discount(item)}}</div>
                    <div class="name">{{brand(item)}}{{item.name.length > 15 ? item.name.substring(0, 15) +
                        '...' : item.name}}
                    </div>
                    <div class="stat">
                        <span>{{item.orderNums}}人已购买, </span>
                        <span>好评率: {{item.goodEvaluationRate}}%</span>
                    </div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <!--<div ref="wrapper" class="wrapper" :style="{height: wrapperHeight + 'px'}">-->
            <!--<mt-loadmore :bottom-method="load"
                         :bottom-all-loaded="allLoaded"
                         :bottom-distance="10"
                         ref="loadmore">
                <div ref="grid" style="padding-left: 8px;">
                    <div :key="item.id" v-for="item in list" class="item" :style="{width: itemWidth + 'px'}"
                         @click="goDetail(item.id)">
                        <div style="margin: 8px" align="center">
                            <img :src="config.publicBucketDomain + item.thumbnail" :width="itemImageWidth"
                                 :height="itemImageWidth"/>
                        </div>
                        <div class="realPrice">￥{{priceRange(item)}}</div>
                        <div class="marketPrice" v-if="isSinglePrice(item)">{{item.marketPrice ? '￥' +
                            item.marketPrice : ''}}
                        </div>
                        <div class="discount" v-if="isSinglePrice(item)">{{discount(item)}}</div>
                        <div class="name">{{brand(item)}}{{item.name.length > 15 ? item.name.substring(0, 15) +
                            '...' : item.name}}
                        </div>
                        <div class="stat">
                            <span>{{item.orderNums}}人已购买, </span>
                            <span>好评率: {{item.goodEvaluationRate}}%</span>
                        </div>
                    </div>
                </div>
            </mt-loadmore>-->
            <!--<div v-if="allLoaded" class="loadMoreBaseLine">已到底部</div>-->
            <!--</div>-->
        </Content>
    </Layout>
</template>
<script>
    import API from '../../../api/goods-item-list.js'
    import config from '../../../config/index.js'
    import Util from '../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../styles/common.js'
    import Masonry from 'masonry-layout'

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
                categoryId: null,
                wrapperHeight: 0,
                searchInputWidth: 0,
                isSelected: {
                    default: false,
                    putTime: [false, false, false],
                    realPrice: [false, false, false]
                },
                searchType: null,
                allLoaded: false,
                itemWidth: 0,
                itemImageWidth: 0,
                pageInfo: {
                    num: 1,
                    size: 10,
                    order: 'DESC'
                },
                list: [],
                showSpin: true,
                isSmallDevice: false,
                showLoading: false,
                loadingList: false
            }
        },
        computed: {},
        methods: {
            brand(item) {
                return item.brand ? item.brand + '|' : ''
            },
            discount(item) {
                let discount = 0
                if (item.marketPrice > 0) {
                    discount = item.minPrice / item.marketPrice * 10
                    discount = discount.toFixed(1)
                }
                return discount > 0 ? discount + '折' : ''
            },
            isSinglePrice(item) {
                return item.minPrice == item.maxPrice
            },
            priceRange(item) {
                if (item.minPrice == item.maxPrice) {
                    return item.minPrice
                } else {
                    return item.minPrice + '-' + item.maxPrice
                }
            },
            goDetail(id) {
                Util.go('GoodsItemDetail', {
                    id,
                    from: 'list'
                })
            },
            back() {
                if (this.categoryId > 0) {
                    Util.go('GoodsCategory')
                } else {
                    Util.go('MyCart')
                }
            },
            scrollHandler(e) {
                const scrollTop = document.body.scrollHeight - e.target.scrollingElement.scrollTop
                if (scrollTop == document.documentElement.clientHeight) {
                    this.showLoading = true
                    this.load();
                }
            },
            load(load) {
                if (this.allLoaded) {
                    this.showLoading = false
                    return
                }
                if (this.loadingList) {
                    return
                }
                this.loadingList = true
                API.list(this.categoryId, this.searchType, this.pageInfo).then(data => {
                    if (data && data.length > 0) {
                        this.pageInfo.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.pageInfo.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        }
                        setTimeout(() => {
                            new Masonry(this.$refs.grid, {});
                            this.showSpin = false
                            // if (load) {
                            //     this.$refs.wrapper.scrollTop = 0
                            // }
                        }, 100)
                    } else {
                        this.allLoaded = true
                        this.showSpin = false
                        this.showLoading = false
                    }
                    this.loadingList = false
                    // this.$refs.loadmore.onBottomLoaded()
                })
            },
            orderBy(searchType, load) {
                this.searchType = searchType
                switch (searchType) {
                    case 'default': {
                        this.isSelected.default = true
                        this.isSelected.putTime = [false, false, false]
                        this.isSelected.realPrice = [false, false, false]
                        this.pageInfo.order = 'DESC'
                    }
                        break;
                    case 'putTime': {
                        this.isSelected.default = false
                        this.isSelected.realPrice = [false, false, false]
                        this.isSelected.putTime[0] = true
                        if (!this.isSelected.putTime[1] && this.isSelected.putTime[2]) {
                            this.isSelected.putTime[1] = true;
                            this.isSelected.putTime[2] = false;
                            this.pageInfo.order = 'ASC'
                        } else {
                            this.isSelected.putTime[1] = false;
                            this.isSelected.putTime[2] = true;
                            this.pageInfo.order = 'DESC'
                        }
                    }
                        break;
                    case 'price': {
                        this.isSelected.default = false
                        this.isSelected.putTime = [false, false, false]
                        this.isSelected.realPrice[0] = true
                        if (!this.isSelected.realPrice[1] && this.isSelected.realPrice[2]) {
                            this.isSelected.realPrice[1] = true;
                            this.isSelected.realPrice[2] = false;
                            this.pageInfo.order = 'ASC'
                        } else {
                            this.isSelected.realPrice[1] = false;
                            this.isSelected.realPrice[2] = true;
                            this.pageInfo.order = 'DESC'
                        }
                    }
                        break;
                }
                if (load) {
                    this.pageInfo.num = 1
                    this.show = true
                    this.allLoaded = false
                    this.showLoading = false
                    this.list = []
                    this.load(load)
                }
            }
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientHeight < 600
            this.contentStyle.marginTop = '100px'
            this.headerStyle.height = '90px'
            this.headerStyle.backgroundColor = '#fff'
            this.contentStyle.backgroundColor = '#F5F5F5'
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 100
            window.addEventListener('scroll', this.scrollHandler)
            this.searchInputWidth = document.documentElement.clientWidth - this.$refs.backIcon.$el.getBoundingClientRect().left - 50
            this.itemWidth = (document.documentElement.clientWidth - 24) / 2
            this.itemImageWidth = this.itemWidth - 16
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 90) + 'px'
            this.categoryId = this.$router.currentRoute.params.id
            this.categoryId = this.categoryId > 0 ? this.categoryId : 0
            Util.put('goodsCategoryId', this.categoryId)
            this.orderBy('default', true)
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
