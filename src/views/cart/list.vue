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

    a:active {
        color: #505A6D !important;
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
            <div v-show="showEmpty" align="center" style="padding-top: 200px; background-color: #F5F5F5;">
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
            <mt-cell-swipe
                    v-for="(item, index) in items"
                    :right="swipeButtons(index)" style="padding: 10px;">
                <div slot="title">
                    <div style="display: inline-block; margin-right: 10px; vertical-align: top; position: relative; top: 30px; left: -10px;">
                        <check-icon class="checker" :value.sync="item.selected"></check-icon>
                    </div>
                    <div style="display: inline-block; margin-right: 10px; vertical-align: bottom; position: relative; left: -20px; position: relative;">
                        <img :src="config.publicBucketDomain + item.thumbnail" width="72" height="72"/>
                        <div class="disabledTitle" v-show="!item.enabled">
                            商品已下架
                        </div>
                    </div>
                    <div style="display: inline-block; position: relative; left: -20px;">
                        <div style="color: #505A6D; font-size: 11pt; margin-bottom: 10px;">
                            {{item.name.length > 7 ? item.name.substring(0, 7) + '...' : item.name}}
                        </div>
                        <div style="background-color: #F5F5F5;display: inline-block; padding: 5px 10px; font-size: 11pt; margin-bottom: 10px;">
                            {{specText(item.attrs)}}
                        </div>
                        <div style="font-size: 11pt;">￥{{item.property.price}}</div>
                    </div>
                </div>
                <div style="float: right; position: relative; top: 24px;">
                    <wv-number-spinner :min="1" :max="99" input-width="30px" v-model="item.nums"></wv-number-spinner>
                </div>
            </mt-cell-swipe>
        </Content>
        <div class="cartFooter" v-show="!showEmpty">
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
            checkAll() {
                this.items.map(item => {
                    item.selected = this.allSelected
                })
            },
            load() {
                const cart = Util.getCart()
                if (cart.items.length > 0) {
                    const indexes = []
                    API.list(cart.items.map(item => item.id)).then(data => {
                        this.items = data.map((item, index) => {
                            let property = null
                            out: for (let i in item.properties) {
                                for (let j in cart.items) {
                                    if (cart.items[j].propertyId == item.properties[i].id) {
                                        property = item.properties[i]
                                        break out
                                    }
                                }
                            }
                            return {
                                ...item,
                                selected: false,
                                property,
                                nums: cart.items[index].nums,
                                attrs: property.values.map(value => value.name)
                            }
                        }).filter((item, index) => {
                            const cartItem = cart.items[index]
                            const lastingTime = cartItem.updateTime + 1000 * 3600 * 24 * 7
                            const valid = lastingTime > new Date().getTime()
                            if (!valid) {
                                indexes.push(index)
                            }
                            return valid
                        })
                        cart.items = cart.items.filter((item, index) => {
                            for (let i in indexes) {
                                if (indexes[i] == index) {
                                    return false
                                }
                            }
                            return true
                        })
                        Util.saveCart(cart)
                        this.showEmpty = this.items.length == 0
                        this.show = false
                    })
                } else {
                    this.showEmpty = true
                    this.show = false
                }
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
                        style: {background: 'red', color: '#fff'},
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
                return title
            }
        },
        mounted() {
            this.contentStyle.marginTop = '60px'
            this.load()
        }
    }
</script>
