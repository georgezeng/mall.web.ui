<style scoped lang="less">
    .logo {
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
        background-color: #D9CCAB;
        height: 30px;
        border-radius: 20px;
        width: 70%;
        display: inline-block;
        font-size: 14px;
        color: #586274;
        line-height: 30px;
        padding-left: 10px;
    }

    .searchInput {
        color: #586274;
        border: none;
        width: 90%;
        background-color: #D9CCAB;
        outline: none;
        border-radius: 20px;
    }

    .carousel {
        height: 220px;
        width: 100%;
    }

    .category1 {
        margin-right: 10px;
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
        background-image: url("../images/registration_bonus.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .bonusTip {
        color: red;
        font-size: 20px;
        position: absolute;
        text-align: center;
        width: 100%;
    }

    .bonusBtn {
        background-image: url("../images/get-btn.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: absolute;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <div v-show="bonusPopup" align="center" class="bonusModal">
            <div style="position: relative; width: 100%;"
                 :style="{height: bonusImgHeight + 'px', top: bonusImgTop + 'px'}">
                <div v-show="bonusEls" class="bonusTip"
                     :style="{top: bonusTipTop + 'px'}">
                    {{bonus.coupon}}元优惠券 + {{bonus.points}}积分
                </div>
                <img @load="bonusTipLoaded" :src="BonusImg" :style="{width: bonusImgWidth + 'px', height: bonusImgHeight + 'px'}"/>
                <div @click="goMyCoupon" class="bonusBtn"
                     :style="{width: bonusBtnWidth + 'px', height: bonusBtnHeight + 'px', bottom: bonusBtnBottom + 'px', left: bonusBtnLeft + 'px'}"></div>
            </div>
        </div>
        <Header :style="commonStyles.header">
            <div class="logo" :style="{backgroundImage: logoImg}"></div>
            <div class="search">
                <Icon type="ios-search"/>
                <input readonly @focus="goSearch" class="searchInput" value="搜索商品"/>
            </div>
        </Header>
        <Content :style="contentStyle">
            <swiper :aspect-ratio="220/375" auto loop :show-dots="false">
                <swiper-item v-for="(banner, index) in banners" :key="index">
                    <img @click="goPage(banner.link)" :src="config.publicBucketDomain + banner.path" width="100%">
                </swiper-item>
            </swiper>
            <div v-for="(recommendLine, outerIndex) in recommends" :key="outerIndex" align="center"
                 :style="{margin: (outerIndex % 2 == 0 ? '20px 12px 5px' : '0px 12px 20px')}">
                <img v-for="(recommend, index) in recommendLine" :key="index" @click="goPage(recommend.link)"
                     :class="`category${(index+1)}`" :style="categoryStyle"
                     :src="config.publicBucketDomain + recommend.path"/>
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
            <div align="center" style="margin: 5px 0px;">
                <a v-if="config.env != 'production'" href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备17125109号-1</a>
                <a v-else href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备17125109号-2</a>
            </div>
        </Content>
        <Footer selection="home" :style="commonStyles.footer"/>
    </Layout>

</template>
<script>
    import Footer from './footer'
    import commonStyles from '../styles/common'
    import API from '../api/goods-item-list'
    import ClientAPI from '../api/client'
    import config from '../config/index'
    // import Masonry from 'masonry-layout'
    import Util from '../libs/util.js'
    import BonusImg from '../images/registration_bonus.png'
    import MerchantAPI from '../api/merchant'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                BonusImg,
                Util,
                config,
                bonusEls: false,
                logoImg: null,
                bonusPopup: false,
                bonusBtnBottom: null,
                bonusBtnLeft: null,
                bonusImgHeight: null,
                bonusImgWidth: null,
                bonusImgTop: null,
                bonusBtnWidth: null,
                bonusBtnHeight: null,
                bonusTipTop: null,
                bonus: {
                    coupon: null,
                    points: null
                },
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
                categoryStyle: {},
                banners: [],
                recommends: []
            }
        },
        computed: {
            isLogin() {
                const token = Util.getToken()
                return token != false
            },
        },
        methods: {
            bonusTipLoaded() {
                setTimeout(() => {
                    this.bonusEls = true
                }, 300)
            },
            goPage(link) {
                if (link) {
                    Util.putForNav({
                        from: 'Home'
                    })
                    window.location.href = link
                }
            },
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
                        } else {
                            this.showLoading = true
                        }
                        // setTimeout(() => {
                        //     new Masonry(this.$refs.grid, {});
                        // }, 100)
                    } else {
                        this.allLoaded = true
                        this.showLoading = false
                    }
                })
            },
            goMyCoupon() {
                Util.go('MyCoupon', {
                    type: 'UnUse'
                })
            },

        },
        created() {
            // this.contentStyle.minHeight = document.documentElement.clientHeight + 'px'
            this.contentStyle.marginTop = '64px'
            this.contentStyle.marginBottom = '70px'
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
            MerchantAPI.loadSiteInfo().then(data => {
                this.logoImg = 'url("' + config.publicBucketDomain + data.headerLogo + '")'
            })
            MerchantAPI.loadHomeBanner().then(data => {
                this.banners = data
            })
            MerchantAPI.loadHomeRecommend().then(data => {
                this.recommends = []
                let arr = null
                for (let i in data) {
                    if (i % 2 == 0) {
                        arr = []
                        this.recommends.push(arr)
                    }
                    arr.push(data[i])
                }
            })
            this.load()
            if (this.isLogin) {
                ClientAPI.registrationBonus().then(data => {
                    if (data) {
                        this.bonus = data
                        this.bonusPopup = true
                    }
                })
            }
        },
        mounted() {
            if (this.isLogin) {
                this.bonusImgWidth = document.documentElement.clientWidth * 0.9
                this.bonusImgHeight = this.bonusImgWidth * 972 / 750
                this.bonusBtnWidth = document.documentElement.clientWidth * 0.5
                this.bonusBtnHeight = this.bonusBtnWidth * 118 / 432
                this.bonusTipTop = 190 * this.bonusImgHeight / 972
                this.bonusImgTop = (document.documentElement.clientHeight - this.bonusImgHeight) / 2
                this.bonusBtnBottom = 60 * this.bonusImgHeight / 972
                this.bonusBtnLeft = (document.documentElement.clientWidth - this.bonusBtnWidth) / 2
            }
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
