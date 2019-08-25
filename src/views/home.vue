<style scoped lang="less">
    .logo {
        background-image: url("../images/home-logo.png");
        background-repeat: no-repeat;
        background-size: cover;
        display: inline-block;
        width: 80px;
        height: 40px;
        position: relative;
        left: -10px;
        top: 15px;
    }

    .search {
        text-align: left;
        background-color: #f16051;
        height: 30px;
        border-radius: 20px;
        width: 70%;
        display: inline-block;
        font-size: 14px;
        color: #fff;
        line-height: 30px;
        padding-left: 10px;
    }

    .searchInput {
        color: #fff;
        border: none;
        width: 90%;
        background-color: #f16051;
        outline: none;
        border-radius: 20px;
    }

    .carousel {
        height: 220px;
        width: 100%;
    }

    .category1 {
        margin-right: 5px;
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

    .bonusModal {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.4);
        width: 100%;
        height: 100%;
        z-index: 100000000;
    }

    .bonusImg {
        position: relative;
        background-image: url("../../images/registration_bonus.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .bonusTip {
        color: red;
        font-size: 20px;
        position: relative;
    }

    .bonusBtn {
        background-image: url("../../images/get-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: absolute;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <div v-if="bonusPopup" align="center" class="bonusModal">
            <div class="bonusImg"
                 :style="{width: bonusImgWidth + 'px', height: bonusImgHeight + 'px', top: bonusImgTop + 'px'}">
                <div class="bonusTip" :style="{top: bonusTipTop + 'px'}">{{bonus}}元优惠券</div>
                <div @click="goMyCoupon" class="bonusBtn"
                     :style="{width: bonusBtnWidth + 'px', height: bonusBtnHeight + 'px', bottom: bonusBtnBottom + 'px', left: bonusBtnLeft + 'px'}"></div>
            </div>
        </div>
        <Header :style="commonStyles.header">
            <div class="logo"></div>
            <div class="search">
                <Icon type="ios-search"/>
                <input @focus="goSearch" class="searchInput" value="搜索商品"/>
            </div>
        </Header>
        <Content :style="contentStyle">
            <swiper :aspect-ratio="220/375" auto loop :show-dots="false">
                <swiper-item v-for="(url, index) in [banner1, banner2, banner3]" :key="index">
                    <img :src="url" width="100%">
                </swiper-item>
            </swiper>
            <div align="center" style="margin: 20px 12px 5px;">
                <img @click="goItemList(20)" class="category1" :style="categoryStyle" :src="category1"/>
                <img @click="goItemList(11)" class="category2" :style="categoryStyle" :src="category2"/>
            </div>
            <div align="center" style="margin: 0px 12px 20px;">
                <img @click="goItemList(17)" class="category1" :style="categoryStyle" :src="category3"/>
                <img @click="goItemList(14)" class="category2" :style="categoryStyle" :src="category4"/>
            </div>
            <div style="font-size: 14px; text-align: center; position: relative; top: -10px;">新品推荐</div>
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
        </Content>
        <Footer selection="home" :style="commonStyles.footer"/>
    </Layout>

</template>
<script>
    import Footer from './footer'
    import commonStyles from '../styles/common'
    import API from '../api/goods-item-list'
    import CenterAPI from '../api/goods-item-list'
    import config from '../config/index'
    // import Masonry from 'masonry-layout'
    import Util from '../libs/util.js'

    import banner1 from '../images/banner-1.png'
    import banner2 from '../images/banner-2.png'
    import banner3 from '../images/banner-3.png'
    import category1 from '../images/category-1.png'
    import category2 from '../images/category-2.png'
    import category3 from '../images/category-3.png'
    import category4 from '../images/category-4.png'


    export default {
        components: {
            Footer
        },
        data() {
            return {
                category1,
                category2,
                category3,
                category4,
                banner1,
                banner2,
                banner3,
                Util,
                config,
                bonusPopup: false,
                bonusBtnBottom: null,
                bonusBtnLeft: null,
                bonusImgHeight: null,
                bonusImgWidth: null,
                bonusImgTop: null,
                bonusBtnWidth: null,
                bonusBtnHeight: null,
                bonusTipTop: null,
                bonus: null,
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                queryInfo: {
                    data: null,
                    page: {
                        num: 1,
                        size: 10,
                        order: 'DESC'
                    }
                },
                allLoaded: false,
                itemWidth: 0,
                itemImageWidth: 0,
                loadingList: false,
                showLoading: true,
                list: [],
                categoryStyle: {}
            }
        },
        computed: {
            isLogin() {
                const token = Util.getToken()
                return token != false
            },
        },
        methods: {
            goItemList(id) {
                Util.putForNav({
                    from: 'Home'
                })
                Util.go('GoodsItemList', {id, type: 'category'})
            },
            goSearch() {
                Util.putForNav({
                    from: 'Home'
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
                    from: 'Home'
                })
                Util.go('GoodsItemDetail', {
                    id
                })
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
                API.list('category', 0, 'putTime', this.queryInfo).then(data => {
                    this.loadingList = false
                    if (data && data.length > 0) {
                        this.queryInfo.page.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.queryInfo.page.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        }
                        // setTimeout(() => {
                        //     new Masonry(this.$refs.grid, {});
                        // }, 100)
                    } else {
                        this.allLoaded = true
                        this.showLoading = false
                    }
                })
            }

        },
        created() {
            // this.contentStyle.minHeight = document.documentElement.clientHeight + 'px'
            this.contentStyle.marginTop = '64px'
            this.contentStyle.marginBottom = '60px'
            this.contentStyle.backgroundColor = '#f5f5f5'
            this.itemWidth = (document.documentElement.clientWidth - 24) / 2
            this.itemImageWidth = this.itemWidth - 16
            window.addEventListener('scroll', this.scrollHandler)
            const width = (document.documentElement.clientWidth - 40) / 2
            const height = (width * 288 / 504).toFixed(0)
            this.categoryStyle = {
                width: width + 'px',
                height: height + 'px'
            }
            this.load()
        },
        mounted() {
            if (this.isLogin) {
                this.bonusImgWidth = document.documentElement.clientWidth * 0.9
                this.bonusImgHeight = this.bonusImgWidth * 972 / 750
                this.bonusBtnWidth = document.documentElement.clientWidth * 0.5
                this.bonusBtnHeight = this.bonusBtnWidth * 118 / 432
                this.bonusTipTop = 180 * this.bonusImgHeight / 972
                this.bonusImgTop = (document.documentElement.clientHeight - this.bonusImgHeight) / 2
                this.bonusBtnBottom = 60 * this.bonusImgHeight / 972
                this.bonusBtnLeft = (this.bonusImgWidth - this.bonusBtnWidth) / 2
                CenterAPI.registrationBonus().then(amount => {
                    if (amount) {
                        this.bonus = amount
                        this.bonusPopup = true
                    }
                })
            }
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
