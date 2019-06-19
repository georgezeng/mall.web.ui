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
            font-size: 11pt;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
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
            <div style="position: relative; top: -25px;">
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
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="show"></Spin>
            <div ref="wrapper" class="wrapper" :style="{height: wrapperHeight + 'px'}">
                <mt-loadmore :bottom-method="load"
                             :bottom-all-loaded="allLoaded"
                             ref="loadmore">
                    <div ref="grid" style="padding-left: 8px;">
                        <div v-for="item in list" class="item" :style="{width: itemWidth + 'px'}"
                             @click="goDetail(item.id)">
                            <div align="center">
                                <img :src="config.publicBucketDomain + item.thumbnail"
                                     width="168" height="168"/>
                            </div>
                            <div class="realPrice">￥{{priceRange(item)}}</div>
                            <div class="marketPrice">{{item.marketPrice ? '￥' + item.marketPrice : ''}}</div>
                            <div class="discount">{{discount(item)}}</div>
                            <div class="name">{{brand(item)}}{{item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}}
                            </div>
                            <div class="stat">
                                <span>{{item.orderNums}}人已购买, </span>
                                <span>好评率: {{item.goodPointsRate}}%</span>
                            </div>
                        </div>
                    </div>
                </mt-loadmore>
            </div>
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
                itemWidth: 160,
                pageInfo: {
                    num: 1,
                    size: 10,
                    order: 'DESC'
                },
                list: [],
                show: true,
            }
        },
        computed: {},
        methods: {
            brand(item) {
              return item.brand ? item.brand + '|' : ''
            },
            discount(item) {
                let discount = 0
                if(item.marketPrice > 0) {
                    discount = item.minPrice / item.marketPrice * 10
                    discount = discount.toFixed(1)
                }
                return discount > 0 ? discount + '折' : ''
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
                    id
                })
            },
            back() {
                window.history.back()
            },
            load() {
                API.list(this.categoryId, this.searchType, this.pageInfo).then(data => {
                    if (data && data.length > 0) {
                        this.pageInfo.num++
                        this.list = data
                        setTimeout(() => {
                            new Masonry(this.$refs.grid, {});
                            this.show = false
                        }, 100)
                    } else {
                        this.allLoaded = true;
                    }
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded()
                    }, 100)
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
                    this.load()
                }
            }
        },
        mounted() {
            this.contentStyle.marginTop = '100px'
            this.headerStyle.height = '90px'
            this.headerStyle.backgroundColor = '#fff'
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 100
            this.searchInputWidth = document.documentElement.clientWidth - this.$refs.backIcon.$el.getBoundingClientRect().left - 50
            this.itemWidth = (document.documentElement.clientWidth - 24) / 2
            // this.contentStyle.minHeight = this.wrapperHeight + "px"
            this.categoryId = this.$router.currentRoute.params.id
            this.categoryId = this.categoryId > 0 ? this.categoryId : 0
            this.orderBy('default')
        }
    }
</script>
