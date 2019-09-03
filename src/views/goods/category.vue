<style scoped lang="less">
    .search {
        text-align: left;
        background-color: #f5f5f5;
        height: 33px;
        border-radius: 20px;
        width: 90%;
        display: inline-block;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
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

    .leftPanel {
        width: 80px;
        background-color: #F5F5F5;
        text-align: center;
        position: fixed;
        top: 64px;
        z-index: 100;
    }

    .firstCategory {
        padding: 20px 0;
    }

    .selected {
        background-color: #fff;
    }

    .selected:before {
        display: inline-block;
        height: 40px;
        background-color: #B69C7D;
        width: 3px;
        content: '';
        float: left;
        position: relative;
        top: -8px;
    }

    .secondCategory {
        margin: 20px 10px 20px;
        font-weight: bold;
        font-size: 11pt;
    }

    .thirdCategory {
        width: 25%;
        margin: 0 10px;
        margin-bottom: 20px;
        display: inline-block;
        font-size: 11pt;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <div class="search">
                <Icon style="color: gray;" type="ios-search"/>
                <input @focus="goSearch" class="searchInput" placeholder="搜索商品"/>
            </div>
        </Header>
        <Content :style="contentStyle">
            <div class="wrapper leftPanel" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <div class="firstCategory" :class="{selected: isSelect[index]}" @click="select(item.id, index)"
                     :key="item.id"
                     v-for="(item, index) in level1Categories">
                    {{item.name}}
                </div>
            </div>
            <div style="margin-left: 80px;">
                <swiper :aspect-ratio="150/300" auto loop :show-dots="false">
                    <swiper-item v-for="(banner, index) in banners" :key="index">
                        <img @click="goPage(banner.link)" :src="config.publicBucketDomain + banner.path" width="100%">
                    </swiper-item>
                </swiper>
                <div style="margin: 20px 10px 20px; font-weight: bold; font-size: 12pt;">推荐品牌</div>
                <div align="center">
                    <img v-for="(brand,index) in brands" :key="index" @click="goPage(brand.link)"
                         :src="config.publicBucketDomain + brand.path" width="27%"/>
                </div>
                <div :key="item.id" v-for="item in level2Categories">
                    <div class="secondCategory">{{item.name}}</div>
                    <div :key="third.id" v-for="third in item.attrs" align="center" class="thirdCategory"
                         @click="goGoodsList(third.id)">
                        <img :src="img(third.icon)" width="64" height="64"/>
                        <div style="margin-top: 5px; font-size: 10pt;">{{third.name}}</div>
                    </div>
                </div>
            </div>
        </Content>
        <Footer selection="category" :style="commonStyles.footer"/>
    </Layout>
</template>
<script>
    import API from '../../api/goods-category.js'
    import MerchantAPI from '../../api/merchant'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import Footer from '../footer'
    import commonStyles from '../../styles/common.js'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                config,
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                headerStyle: {
                    ...commonStyles.header
                },
                isSelect: [],
                wrapperHeight: 0,
                level1Categories: [],
                level2Categories: [],
                bannerWidth: 0,
                brands: [],
                banners: []
            }
        },
        computed: {},
        methods: {
            goPage(link) {
                if (link) {
                    Util.putForNav({
                        from: 'GoodsCategory'
                    })
                    window.location.href = link
                }
            },
            goSearch() {
                Util.putForNav({
                    from: 'GoodsCategory'
                })
                Util.go('GoodsSearch')
            },
            goItemList() {
                Util.putForNav({
                    from: 'GoodsCategory'
                })
                Util.go('GoodsItemList', {
                    id: 0,
                    type: 'category'
                })
            },
            goGoodsList(id) {
                Util.putForNav({
                    from: 'GoodsCategory'
                })
                Util.go('GoodsItemList', {
                    id,
                    type: 'category'
                })
            },
            img(url) {
                return config.publicBucketDomain + url
            },
            load() {
                API.level1().then(data => {
                    this.level1Categories = data
                    for (let i in data) {
                        this.isSelect.push(false)
                    }
                    this.select(data[0].id, 0)
                })
            },
            select(id, index) {
                for (let i in this.isSelect) {
                    this.isSelect[i] = false
                }
                this.isSelect[index] = true
                API.level2(id).then(data => {
                    this.level2Categories = data
                })
            }
        },
        created() {
            MerchantAPI.loadCategoryBanner().then(data => {
                this.banners = data
            })
            MerchantAPI.loadCategoryBrand().then(data => {
                this.brands = data
            })
        },
        mounted() {
            this.contentStyle.marginTop = '64px'
            this.contentStyle.marginBottom = '60px'
            this.headerStyle.backgroundColor = '#fff'
            this.headerStyle.boxShadow = '0px 0px 3px -1px gray'
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 60
            this.contentStyle.minHeight = this.wrapperHeight + "px"
            this.bannerWidth = document.documentElement.clientWidth - 80
            this.load()
        }
    }
</script>
