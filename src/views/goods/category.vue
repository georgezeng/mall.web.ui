<style scoped lang="less">
    .leftPanel {
        width: 80px;
        background-color: #F5F5F5;
        text-align: center;
        position: fixed;
        top: 60px;
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
        background-color: orangered;
        width: 3px;
        content: '';
        float: left;
        position: relative;
        top: -8px;
    }

    .demo-carousel {
        height: 128px !important;
        width: 100%;
        background-color: #556B9A;
        padding: 0 !important;
        text-align: center;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
    }

    .demo-carousel2 {
        height: 60px !important;
        width: 27%;
        background-color: #556B9A;
        padding: 0 !important;
        text-align: center;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        display: inline-block;
        margin: 0 3px;
    }

    .secondCategory {
        margin: 20px 10px 20px;
        font-weight: bold;
        font-size: 11pt;
    }

    .thirdCategory {
        width: 27%;
        margin: 0 10px;
        margin-bottom: 20px;
        display: inline-block;
        font-size: 11pt;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="commonStyles.header">
            <Input search placeholder="搜索商品"/>
        </Header>
        <Content :style="contentStyle">
            <div class="wrapper leftPanel" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <div class="firstCategory" :class="{selected: isSelect[index]}" @click="select(item.id, index)"
                     v-for="(item, index) in level1Categories">
                    {{item.name}}
                </div>
            </div>
            <div style="margin-left: 80px;">
                <Carousel autoplay loop style="margin:10px;">
                    <CarouselItem>
                        <div class="demo-carousel">1</div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">2</div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">3</div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="demo-carousel">4</div>
                    </CarouselItem>
                </Carousel>
                <div style="margin: 20px 10px 20px; font-weight: bold; font-size: 12pt;">推荐品牌</div>
                <div align="center">
                    <div class="demo-carousel2">1</div>
                    <div class="demo-carousel2">2</div>
                    <div class="demo-carousel2">3</div>
                </div>
                <div v-for="item in level2Categories">
                    <div class="secondCategory">{{item.name}}</div>
                    <div v-for="third in item.attrs" align="center" class="thirdCategory">
                        <img :src="img(third.icon)" width="64" height="64" />
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
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                isSelect: [],
                wrapperHeight: 0,
                level1Categories: [],
                level2Categories: []
            }
        },
        computed: {},
        methods: {
            img(url) {
                return config.publicBucketDomain + "/" + url
            },
            load() {
                API.level1().then(data => {
                    this.level1Categories = data
                    for(let i in data) {
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
        mounted() {
            this.contentStyle.marginTop = '64px'
            this.contentStyle.marginBottom = '80px'
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
            this.contentStyle.height = this.wrapperHeight + "px"
            this.load()
        }
    }
</script>
