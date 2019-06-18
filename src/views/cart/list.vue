<style scoped lang="less">
    .goAroundBtn {
        background-color: red;
        color: #fff;
        padding: 10px 20px;
        width: 160px;
    }

    .header {
        background-color: #fff;
        height: 60px;
        width: 100%;
        box-shadow: 0px 0px 3px -1px gray;
        font-weight: bold;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 1000;
    }

    .item {
        padding: 20px 10px;
        position: relative;
    }

    .checker {
        position: relative;
    }

    .disabledTitle {
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 0px;
        font-size: 12px;
        color: #fff;
        position: absolute;
        top: 50px;
        width: 72px;
        text-align: center;
    }

    .cartFooter {
        position: fixed;
        bottom: 63px;
        left: 0px;
        width: 100%;
        background-color: #fff;
        font-size: 11pt;
        box-shadow: 0px 0px 3px -1px gray;
    }

    .checkBtn {
        float: right;
        padding: 10px 20px;
        background-color: orangered;
        color: #fff;
    }

    .totalPanel {
        float: right;
        padding: 10px 20px;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <div align="center" style="font-weight: bold;">
                购物车
            </div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="show"></Spin>
            <div v-if="showEmpty && !show" align="center" style="padding-top: 200px; background-color: #F5F5F5;">
                <div>
                    <img :src="Cart" width="200px" height="200"/>
                </div>
                <div style="margin-bottom: 20px;">
                    购物车还没有商品哦~
                </div>
                <div>
                    <div class="goAroundBtn" @click="goGoodsList">去逛逛</div>
                </div>
            </div>
            <div v-for="(cartItem, index) in items" style="padding-bottom: 10px; background-color: #F5F5F5;">
                <mt-cell-swipe
                        :right="swipeButtons(index)" style="padding: 10px; position: relative;">
                    <div slot="title">
                        <div style="display: inline-block; margin-right: 10px; vertical-align: top; position: relative; top: 30px; left: -10px;">
                            <check-icon class="checker" :value.sync="cartItem.selected"></check-icon>
                        </div>
                        <div @click="goItem(cartItem.item.id)"
                             style="display: inline-block; margin-right: 10px; vertical-align: bottom; position: relative; left: -20px; position: relative;">
                            <img :src="config.publicBucketDomain + cartItem.item.thumbnail" width="72" height="72"/>
                            <div class="disabledTitle" v-if="!cartItem.item.enabled">
                                商品已下架
                            </div>
                        </div>
                        <div @click="goItem(cartItem.item.id)" style="display: inline-block; position: relative; left: -20px;">
                            <div style="color: #505A6D; font-size: 11pt; margin-bottom: 10px;">
                                {{cartItem.item.name.length > 12 ? cartItem.item.name.substring(0, 12) + '...' : cartItem.item.name}}
                            </div>
                            <div style="background-color: #F5F5F5;display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 10px;">
                                {{specText(cartItem.attrs)}}
                            </div>
                            <div style="font-size: 11pt; color: orangered;">￥{{cartItem.property.price}}</div>
                        </div>
                    </div>
                    <div style="float: right; position: absolute; top: 52px; right: 10px;">
                        <wv-number-spinner :min="1" :max="99" input-width="30px"
                                           v-model="cartItem.nums"></wv-number-spinner>
                    </div>
                </mt-cell-swipe>
            </div>

        </Content>
        <div class="cartFooter" v-if="!showEmpty">
            <div style="display: inline-block; padding: 10px 20px 10px 10px;">
                <check-icon @click.native="checkAll" :value.sync="allSelected"></check-icon>
                <span>全选</span>
            </div>
            <div class="checkBtn">去结算{{selectedNums}}</div>
            <div class="totalPanel">
                合计: <span style="color: orangered;">￥{{totalPrice}}</span>
            </div>
        </div>
        <Footer selection="cart" :style="commonStyles.footer"/>
    </Layout>
</template>
<script>
    import API from '../../api/cart.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import Footer from '../footer'
    import commonStyles from '../../styles/common.js'
    import Cart from '../../images/cart.png'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                config,
                Cart,
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                items: [],
                allSelected: false,
                show: true,
            }
        },
        computed: {
            showEmpty() {
                return this.items.length == 0
            },
            totalPrice() {
                let total = 0
                this.items.map(item => {
                    if (item.selected) {
                        total += item.property.price * item.nums
                    }
                })
                return total > 0 ? total.toFixed(2) : '0.00'
            },
            selectedNums() {
                let count = 0
                this.items.map(item => {
                    if (item.selected) {
                        count++
                    }
                })
                if (count == this.items.length) {
                    this.allSelected = true
                } else {
                    this.allSelected = false
                }
                return count > 0 ? '(' + count + ')' : ''
            }
        },
        methods: {
            goItem(id) {
                Util.go('GoodsItemDetail', {
                    id
                })
            },
            checkAll() {
                this.items.map(item => {
                    item.selected = this.allSelected
                })
            },
            load() {
                API.list().then(data => {
                    this.items = data
                    this.show = false
                })
            },
            goGoodsList() {
                Util.go('GoodsItemList', {
                    id: 0
                })
            },
            remove(index) {
                this.items.splice(index, 1)
                const cart = Util.getCart()
                cart.items = this.items
                Util.saveCart(cart)
            },
            swipeButtons(index) {
                return [
                    {
                        content: '删除',
                        style: {background: 'red', color: '#fff', padding: '20px 10px 0 10px'},
                        handler: () => this.remove(index)
                    }
                ]
            },
            specText(attrs) {
                let title = ''
                for (let i in attrs) {
                    const attr = attrs[i]
                    if (i < attrs.length - 1) {
                        title += attr + '，'
                    } else {
                        title += attr
                    }
                }
                // return title.length > 7 ? title.substring(0, 7) + '...' : title
                return title
            }
        },
        mounted() {
            this.contentStyle.marginTop = '60px'
            this.contentStyle.backgroundColor = '#F5F5F5'
            const wrapperHeight = document.documentElement.clientHeight - 120
            this.contentStyle.minHeight = wrapperHeight + 'px'
            this.load()
        }
    }
</script>
