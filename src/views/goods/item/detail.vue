<style scoped lang="less">

    .marketPrice {
        display: inline-block;
        font-size: 11pt;
        color: #c5c8ce;
        text-decoration: line-through;
    }

    .realPrice {
        display: inline-block;
        font-size: 12pt;
        color: orangered;
        font-weight: bold;
        margin-top: 10px;
        margin-left: 12px;
    }

    .name {
        font-size: 12pt;
        margin: 10px 10px 10px 12px;
        font-weight: bold;
    }

    .blockLine {
        height: 10px;
        background-color: #F5F5F5;
        position: relative;
        z-index: 0;
    }

    .close {
        float: right;
        margin-top: 10px;
        z-index: 1000;
    }

    .popup {
        z-index: 10000;
        position: relative;
        img {
            vertical-align: bottom;
            margin-left: 10px;
            margin-top: 10px;
        }

        .price {
            color: orangered;
            font-weight: bold;
        }

        .inventory {
            font-size: 11pt;
            color: darkgray;
        }

    }

    .definition {
        font-size: 11pt;
        margin-bottom: 5px;
    }

    .value {
        display: inline-block;
        background-color: #F5F5F5;
        border-radius: 20px;
        width: 60px;
        text-align: center;
        padding: 3px 5px;
        margin-right: 10px;
        font-size: 11pt;
        border: 2px solid #F5F5F5;
    }

    .addToCartBtn {
        padding: 10px 0;
        background: linear-gradient(to right, #E9A946, #EEC44E);
        display: inline-block;
        color: #fff;
        text-align: center;
        margin: 0px;
        width: 50%;
    }

    .confirmBtn {
        background: linear-gradient(to right, #E55138, #E66C36);
        padding: 10px 0;
        display: inline-block;
        color: #fff;
        text-align: center;
        margin: 0px;
        width: 100%;
    }

    .buyBtn {
        background: linear-gradient(to right, #E55138, #E66C36);
        padding: 10px 0;
        display: inline-block;
        color: #fff;
        text-align: center;
        margin: 0px;
        position: absolute;
        width: 50%;
    }

    .selected {
        color: orangered;
        border: 2px solid orangered;
    }

    .specification_title {
        font-size: 14px;
    }

    .backArrow {
        position: absolute;
        top: 10px;
        z-index: 100;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 5px;
        color: #fff;
    }

    .avatar {
        margin-left: 10px;
    }

    .sellingPoints {
        margin: 0 12px;
        font-size: 11pt;
        color: #A8A8A8;
    }

    .cart {
        position: absolute;
        top: 10px;
        z-index: 100;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 5px;
        color: #fff;
    }

    .cartItems {
        position: absolute;
        right: 5px;
        z-index: 1000;
        top: 5px;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Content :style="contentStyle">
            <div v-transfer-dom>
                <popup v-model="show" style="background-color: #fff;">
                    <div class="popup" :style="{height: popupHeight + 'px'}">
                        <Icon size="30" type="ios-close" class="close" @click="closePopup"/>
                        <img style="vertical-align: bottom;" :src="config.publicBucketDomain + item.thumbnail"
                             width="80"
                             height="80"/>
                        <div style="display: inline-block; margin-left: 10px;">
                            <div class="price">￥{{popupPriceRange}}</div>
                            <div class="inventory">库存{{property.inventory}}件</div>
                        </div>
                        <div style="margin: 10px;" v-for="(definition, index) in definitions">
                            <div class="definition">{{definition.name}}</div>
                            <div>
                            <span @click="toggleValue(definition, value)"
                                  :class="{selected: value.checked}"
                                  class="value"
                                  v-for="value in definition.values">{{value.name}}</span>
                            </div>
                        </div>
                        <group>
                            <x-number title="数量" v-model="nums" :max="99" :min="0"></x-number>
                        </group>
                        <div style="position: absolute; bottom: 0px; width: 100%; padding:0; margin:0;">
                            <div class="confirmBtn" @click="confirmSpec">确定</div>
                        </div>
                    </div>
                </popup>
            </div>
            <Icon size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <Icon size="24" class="cart" type="ios-cart" @click="goCart"/>
            <mt-badge class="cartItems" v-if="cartItems > 0" size="small" type="error">{{cartItems}}</mt-badge>
            <mt-swipe :auto="0" style="height: 375px;">
                <mt-swipe-item v-for="photo in item.photos">
                    <div align="center">
                        <img :src="config.publicBucketDomain + photo" width="375" height="375"/>
                    </div>
                </mt-swipe-item>
            </mt-swipe>
            <div>
                <span class="realPrice">￥{{priceRange}}</span>
                <span class="marketPrice">￥{{item.marketPrice}}</span>
            </div>
            <div class="name">{{item.name}}</div>
            <div class="sellingPoints">{{sellingPoints}}</div>
            <div class="blockLine"></div>
            <cell @click.native="showPopup" style="height: 50px; font-size: 14px;" is-link value="请选择规格">
                <div slot="title" class="specification_title" :class="{hidden: values.length == 0}">
                    <span style="color: gray;">已选</span>
                    <span>{{pickupTitle}}</span>
                </div>
                <div slot="title" class="specification_title" v-if="!item.enabled">
                    <div style="color: orangered;">商品已下架</div>
                </div>
            </cell>
            <div class="blockLine"></div>
            <div style="font-size: 11pt; margin: 10px;">
                <span>商品评价({{item.totalEvaluations}})</span>
                <span style="color: orangered;float: right;">查看全部 ></span>
            </div>
            <div v-if="item.topEvaluation == null" style="text-align: center; font-size: 11pt;">
                暂无评论
            </div>
            <div v-else>
                <div>
                    <Avatar ref="avatar" class="avatar" :src="avatar"/>
                    <span>{{item.topEvaluation.clientNickname}}</span>
                </div>
                <div style="font-size: 14px; margin: 10px;">
                    {{remark}}
                </div>
            </div>
            <div class="blockLine"></div>
            <div style="text-align: center; font-weight: bold; margin: 10px 10px 20px;">图文详情</div>
            <div v-html="item.content" style="margin-bottom: 40px;"></div>
        </Content>
        <Footer style="position: fixed; bottom: 0px; width: 100%; padding:0; margin:0;">
            <div class="addToCartBtn" @click="addToCart">
                加入购物车{{totalNums}}
            </div>
            <div class="buyBtn" @click="buy">立即购买</div>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../../api/goods-item-detail.js'
    import CartAPI from '../../../api/cart.js'
    import config from '../../../config/index.js'
    import commonStyles from '../../../styles/common.js'
    import defaultAvatar from '../../../images/avatar.png'
    import Util from '../../../libs/util.js'

    export default {
        components: {},
        data() {
            return {
                config,
                commonStyles,
                contentStyle: {
                    ...commonStyles.content
                },
                nums: 0,
                values: [],
                totalProperty: {
                    price: 0,
                    inventory: 0,
                },
                property: {
                    price: 0,
                    inventory: 0,
                    id: null
                },
                item: {
                    id: null,
                    enabled: true,
                    name: null,
                    thumbnail: null,
                    content: null,
                    sellingPoints: null,
                    minPrice: 0,
                    maxPrice: 0,
                    marketPrice: 0,
                    photos: [],
                    properties: [],
                    topEvaluation: {
                        clientNickname: null,
                        clientAvatar: null,
                        remark: null
                    }
                },
                tempValues: [],
                definitionIds: [],
                definitions: [],
                show: false,
                popupHeight: 500,
                confirmAddToCart: false,
                cartItems: 0,
                itemNums: 0
            }
        },
        computed: {
            totalNums() {
                return this.itemNums > 0 ? '(' + this.itemNums + ')' : ''
            },
            cartNums() {
                return this.cartItems > 0 ? '(' + this.cartItems + ')' : ''
            },
            sellingPoints() {
                let sp = this.item.sellingPoints
                if (sp) {
                    sp = '"' + sp + '"'
                }
                return sp ? sp : ''
            },
            remark() {
                let remark = this.item.topEvaluation.remark
                if (remark && remark.length > 45) {
                    remark = remark.substring(0, 45) + '...'
                }
                return remark ? remark : ''
            },
            avatar() {
                const avatar = this.item.topEvaluation.clientAvatar
                if (avatar && !avatar.startsWith('http') && this.$refs.avatar) {
                    this.$refs.avatar.$el.children[0].crossOrigin = 'use-credentials'
                }
                return avatar ?
                    (avatar.startsWith('http') ?
                        avatar
                        : config.baseUrl + '/client/img/load?filePath=' + avatar)
                    : defaultAvatar
            },
            pickupTitle() {
                let title = ''
                for (let i in this.values) {
                    const value = this.values[i]
                    title += value.name + '，'
                }
                title += this.nums + "件"
                return title
            },
            priceRange() {
                if (this.item.minPrice == this.item.maxPrice) {
                    return this.item.minPrice
                } else {
                    return this.item.minPrice + ' - ' + this.item.maxPrice
                }
            },
            popupPriceRange() {
                if (!this.property.id) {
                    if (this.item.minPrice == this.item.maxPrice) {
                        return this.item.minPrice
                    } else {
                        return this.item.minPrice + ' - ' + this.item.maxPrice
                    }
                } else {
                    return this.property.price
                }
            }
        },
        methods: {
            goCart() {
                Util.go('MyCart')
            },
            back() {
                Window.history.back()
            },
            addToCart() {
                const token = Util.getToken()
                if (!token) {
                    Util.go('Login')
                }
                if (this.values.length == 0) {
                    this.showPopup()
                    this.confirmAddToCart = true
                    return
                }
                CartAPI.save({
                    itemId: this.item.id,
                    propertyId: this.property.id,
                    nums: this.nums
                }).then(data => {
                    this.cartItems = data.total
                    this.itemNums = this.itemNums
                    this.confirmAddToCart = false
                })
            },
            buy() {
                const token = Util.getToken()
                if (!token) {
                    Util.go('Login')
                }
                if (this.values.length == 0) {
                    this.showPopup()
                    return
                }
            },
            toggleValue(definition, value) {
                definition.selected = null
                for (let i in definition.values) {
                    const current = definition.values[i]
                    if (current.id != value.id) {
                        current.checked = false
                    }
                }
                value.checked = !value.checked
                if (value.checked) {
                    definition.selected = value
                } else {
                    this.tempValues = []
                    this.property = this.totalProperty
                }

                const values = []
                for (let i in this.definitions) {
                    const definition = this.definitions[i]
                    if (definition.selected) {
                        values.push(definition.selected)
                    }
                }

                let property = null
                let found = false
                for (let i in this.item.properties) {
                    property = this.item.properties[i]
                    let matched = 0
                    for (let j in values) {
                        for (let k in property.values) {
                            if (values[j].id == property.values[k].id) {
                                matched++
                                break
                            }
                        }
                    }
                    if (matched == property.values.length) {
                        found = true
                        break
                    }
                }
                if (found) {
                    this.tempValues = values
                    this.property = property
                }

                this.refreshPopup()
            },
            confirmSpec() {
                if (this.tempValues.length == 0) {
                    this.$vux.toast.text('请先选择规格', 'middle')
                    return
                }
                if (this.nums == 0) {
                    this.$vux.toast.text('请先选择数量', 'middle')
                    return
                }
                this.values = this.tempValues
                if (this.confirmAddToCart) {
                    this.addToCart()
                }
                this.closePopup()
            },
            refreshPopup() {
                // 强制刷新
                this.closePopup()
                this.showPopup()
            },
            closePopup() {
                this.show = false
            },
            showPopup() {
                if (this.item.enabled) {
                    this.show = true
                }
            },
            back() {
                window.history.back()
            },
            load() {
                if (this.item.id) {
                    const token = Util.getToken()
                    if (token) {
                        CartAPI.itemInfo(this.item.id).then(data => {
                            this.cartItems = data.total
                            this.itemNums = data.itemNums
                        })
                    }
                    API.load(this.item.id).then(item => {
                        if (!item.enabled) {
                            setTimeout(() => {
                                this.$vux.toast.show({text: '商品已下架，2秒后返回列表页', type: 'warn'})
                                this.back()
                            }, 2000)
                            return
                        }
                        this.item = item
                        this.property.price = item.minPrice
                        if (item.properties && item.properties.length > 0) {
                            for (let i in item.properties) {
                                this.property.inventory += item.properties[i].inventory
                            }
                            const values = item.properties[0].values
                            for (let i in values) {
                                const value = values[i]
                                this.definitionIds.push(value.parent.id)
                            }
                            API.loadDefinitions(this.definitionIds).then(definitions => {
                                if (definitions.length > 0) {
                                    for (let i in definitions) {
                                        const definition = definitions[i]
                                        definition.values = this.filterValues(definition)
                                    }
                                    this.definitions = definitions
                                }
                            })
                        }
                        this.totalProperty.price = this.property.price
                        this.totalProperty.inventory = this.property.inventory
                    })
                }
            },
            filterValues(definition) {
                const values = definition.attrs
                const selectedValues = []
                for (let i in values) {
                    const value = values[i]
                    const id = value.id
                    out: for (let j in this.item.properties) {
                        const property = this.item.properties[j]
                        for (let k in property.values) {
                            const value = property.values[k]
                            if (value.id == id) {
                                selectedValues.push(value)
                                value.checked = false
                                break out;
                            }
                        }
                    }
                }
                return selectedValues
            }
        },
        created() {
            this.contentStyle.minHeight = document.documentElement.clientHeight + 'px'
            this.popupHeight = document.documentElement.clientHeight * 0.75
            this.item.id = this.$router.currentRoute.params.id
            this.item.id = this.item.id > 0 ? this.item.id : null
            this.load()
        }
    }
</script>
