<style scoped lang="less">
    .search {
        text-align: left;
        background-color: #f5f5f5;
        height: 33px;
        border-radius: 20px;
        display: inline-block;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        margin-left: 20px;
        border: 1px solid #dcdee2;
    }

    .searchInput {
        color: gray;
        border: none;
        width: 90%;
        background-color: #f5f5f5;
        outline: none;
        border-radius: 20px;
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
        color: #B69C7D;
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
        top: 24px;
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
            <div :style="{width: searchInputWidth + 'px'}" class="search">
                <Icon style="color: gray;" type="ios-search"/>
                <input readonly @focus="goSearch" class="searchInput" :placeholder="keyword"/>
            </div>
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
                    <div class="discount" v-if="item.marketPrice != null">{{discount(item)}}</div>
                    <div class="name">{{brand(item)}}{{item.name.length > 15 ? item.name.substring(0, 15) +
                        '...' : item.name}}
                    </div>
                    <div class="stat">
                        <div style="margin-bottom: 5px;">{{item.orderNums}}人已购买</div>
                        <div>好评率: {{item.goodEvaluationRate}}%</div>
                    </div>
                </div>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}" v-if="showNoRecord && list.length == 0" align="center" style="width: 100%; position: absolute; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无商品信息</div>
            </div>
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
    import NoRecord from '../../../images/norecord-item.png'
    import config from '../../../config/index.js'
    import Util from '../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                NoRecord,
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
                queryInfo: {
                    data: null,
                    page: {
                        num: 1,
                        size: 10,
                        order: 'DESC'
                    },
                },
                list: [],
                showSpin: true,
                isSmallDevice: false,
                showLoading: false,
                loadingList: false,
                type: null,
                noRecordTop: 0,
                showNoRecord: false
            }
        },
        computed: {
            keyword() {
                return this.queryInfo.data ? this.queryInfo.data : '搜索商品'
            }
        },
        methods: {
            goSearch() {
                Util.putForNav({
                    from: 'GoodsItemList',
                    id: this.categoryId,
                    type: this.type
                })
                Util.go('GoodsSearch')
            },
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
                Util.putForNav({
                    from: 'GoodsItemList',
                    id: this.categoryId,
                    type: this.type
                })
                Util.go('GoodsItemDetail', {
                    id
                })
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
                API.list(this.type, this.categoryId, this.searchType, this.queryInfo).then(data => {
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
                        this.showSpin = false
                        // setTimeout(() => {
                        //     new Masonry(this.$refs.grid, {});
                        //     this.showSpin = false
                        //     // if (load) {
                        //     //     this.$refs.wrapper.scrollTop = 0
                        //     // }
                        // }, 100)
                    } else {
                        this.showNoRecord = true
                        this.allLoaded = true
                        this.showLoading = false
                    }
                    this.showSpin = false
                    this.loadingList = false
                    // this.$refs.loadmore.onBottomLoaded()
                }).catch(e => {
                    this.showSpin = false
                    this.loadingList = false
                })
            },
            reload() {
                this.showNoRecord = false
                this.queryInfo.page.num = 1
                this.show = true
                this.allLoaded = false
                this.showLoading = false
                this.showSpin = true
                this.list = []
                this.load()
            },
            orderBy(searchType, load) {
                this.searchType = searchType
                switch (searchType) {
                    case 'default': {
                        this.isSelected.default = true
                        this.isSelected.putTime = [false, false, false]
                        this.isSelected.realPrice = [false, false, false]
                        this.queryInfo.page.order = 'DESC'
                    }
                        break;
                    case 'putTime': {
                        this.isSelected.default = false
                        this.isSelected.realPrice = [false, false, false]
                        this.isSelected.putTime[0] = true
                        if (!this.isSelected.putTime[1] && this.isSelected.putTime[2]) {
                            this.isSelected.putTime[1] = true;
                            this.isSelected.putTime[2] = false;
                            this.queryInfo.page.order = 'ASC'
                        } else {
                            this.isSelected.putTime[1] = false;
                            this.isSelected.putTime[2] = true;
                            this.queryInfo.page.order = 'DESC'
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
                            this.queryInfo.page.order = 'ASC'
                        } else {
                            this.isSelected.realPrice[1] = false;
                            this.isSelected.realPrice[2] = true;
                            this.queryInfo.page.order = 'DESC'
                        }
                    }
                        break;
                }
                if (load) {
                    this.reload()
                }
            }
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientHeight < 610
            this.searchInputWidth = document.documentElement.clientWidth - this.$refs.backIcon.$el.getBoundingClientRect().left - 60
            this.contentStyle.marginTop = '100px'
            this.headerStyle.height = '90px'
            this.headerStyle.backgroundColor = '#fff'
            this.contentStyle.backgroundColor = '#F5F5F5'
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 100
            window.addEventListener('scroll', this.scrollHandler)
            this.itemWidth = (document.documentElement.clientWidth - 24) / 2
            this.itemImageWidth = this.itemWidth - 16
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 90) + 'px'
            this.categoryId = this.$router.currentRoute.params.id
            this.type = this.$router.currentRoute.params.type
            this.categoryId = this.categoryId > 0 ? this.categoryId : 0
            this.queryInfo.data = this.$router.currentRoute.params.key
            this.noRecordTop = ((document.documentElement.clientHeight - 90) - 200) / 2
            this.orderBy('default', true)
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
