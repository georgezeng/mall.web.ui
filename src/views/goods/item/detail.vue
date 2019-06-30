<style scoped lang="less">

    .marketPrice {
        display: inline-block;
        font-size: 11pt;
        color: #c5c8ce;
        text-decoration: line-through;
    }

    .realPrice {
        display: inline-block;
        font-size: 13pt;
        color: orangered;
        font-weight: bold;
        margin-top: 10px;
        margin-left: 12px;
    }

    .discount {
        display: inline-block;
        font-size: 11pt;
        color: gray;
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
        position: fixed;
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
        position: fixed;
        top: 10px;
        z-index: 100;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 5px;
        color: #fff;
    }

    .share {
        position: fixed;
        top: 10px;
        z-index: 100;
        right: 50px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding: 5px;
        color: #fff;
    }

    .cartItems {
        position: fixed;
        right: 5px;
        z-index: 1000;
        top: 5px;
        border-radius: 10px !important;
        padding: 0px 0px !important;
        width: 18px !important;
        height: 16px !important;
        line-height: 16px;
    }

    .wechat-friend {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../../images/wechat-friend.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .wechat-timeline {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../../images/wechat-timeline.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .qq-friend {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../../images/qq-friend.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    .qq-zone {
        display: inline-block;
        width: 65px;
        height: 65px;
        margin: 10px;
        background-image: url("../../../images/qq-zone.png");
        background-repeat: no-repeat;
        background-size: contain;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Content :style="contentStyle">
            <div v-transfer-dom>
                <popup v-model="show" style="background-color: #fff;">
                    <div class="popup wrapper" :style="{height: popupHeight + 'px'}">
                        <Icon size="30" type="ios-close" class="close" @click="closePopup"/>
                        <img style="vertical-align: bottom;" :src="thumbnail"
                             width="80"
                             height="80"/>
                        <div style="display: inline-block; margin-left: 10px;">
                            <div class="price">￥{{popupPriceRange}}</div>
                            <div class="inventory">库存{{property.inventory}}件</div>
                        </div>
                        <div style="margin: 10px;" :key="definition.id" v-for="(definition, index) in definitions">
                            <div class="definition">{{definition.name}}</div>
                            <div>
                            <span @click="toggleValue(definition, value)"
                                  :class="{selected: value.checked}"
                                  class="value"
                                  :key="value.id"
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
                <popup v-model="showShare" style="background-color: #fff;">
                    <div style="height: 88px; position: relative;" align="center">
                        <div class="wechat-friend" @click="share('wechatFriend')"></div>
                        <div class="wechat-timeline" @click="share('wechatTimeline')"></div>
                        <div class="qq-friend" @click="share('qqFriend')"></div>
                        <div class="qq-zone" @click="share('qZone')"></div>
                    </div>
                </popup>
            </div>

            <div v-if="showShareTip"
                 @click="closeShareTipPopup"
                 style="position: fixed; background-color: rgba(0, 0, 0, 0.8); width: 100%; z-index: 100000;"
                 :style="{height: contentStyle.minHeight}">
                <img :src="ShareTipArrow" width="111" height="99" style="position: absolute; right: 20px;"/>
                <div style="color: #fff; position: relative; top: 100px; left: 30px;">
                    点击右上角的"..."，分享给你的好友吧
                </div>
            </div>

            <div v-if="showShareTipInBrowser"
                 @click="closeShareTipPopup"
                 style="position: fixed; width: 100%; z-index: 100000;"
                 :style="{height: popupHeight + 'px'}" align="center">
                <div style="color: #fff; line-height: 400px; font-size: 14pt; font-weight: bold;">
                    如果不成功请打开浏览器的菜单进行分享
                </div>
            </div>
            <Icon size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <Icon size="24" class="cart" type="ios-cart" @click="goCart"/>
            <Icon size="24" class="share" type="md-share" @click="showSharePopup"/>
            <mt-badge class="cartItems" v-if="cartItems > 0" size="small" type="error">{{cartItems}}</mt-badge>
            <mt-swipe :auto="3000" style="height: 375px;">
                <mt-swipe-item :key="photo.id" v-for="photo in item.photos">
                    <div align="center">
                        <img :src="config.publicBucketDomain + photo" :width="itemImgSize" :height="itemImgSize"/>
                    </div>
                </mt-swipe-item>
            </mt-swipe>
            <div>
                <span class="realPrice">￥{{priceRange}}</span>
                <span class="marketPrice" v-if="isSinglePrice">{{item.marketPrice ? '￥' + item.marketPrice : ''}}</span>
                <span class="discount" v-if="isSinglePrice">{{discount}}</span>
            </div>
            <div class="name">{{item.name}}</div>
            <div class="sellingPoints">{{sellingPoints}}</div>
            <div class="blockLine"></div>
            <cell @click.native="showPopup" style="height: 50px; font-size: 14px;" is-link value="请选择">
                <div slot="title">
                    <span>规格</span>
                </div>
                <div v-if="values.length > 0">{{pickupSpec}}</div>
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
    import OrderAPI from '../../../api/order.js'
    import CartAPI from '../../../api/cart.js'
    import config from '../../../config/index.js'
    import commonStyles from '../../../styles/common.js'
    import defaultAvatar from '../../../images/avatar.png'
    import Util from '../../../libs/util.js'
    import ShareTipArrow from '../../../images/tip-arrow.png'
    import wx from 'weixin-js-sdk'
    import NativeShare from 'nativeshare'

    export default {
        components: {},
        data() {
            return {
                ShareTipArrow,
                config,
                commonStyles,
                showShareTip: false,
                showShareTipInBrowser: false,
                showShare: false,
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
                    topEvaluation: null
                },
                tempValues: [],
                definitionIds: [],
                definitions: [],
                show: false,
                popupHeight: 500,
                confirmAddToCart: false,
                cartItems: 0,
                itemNums: 0,
                confirmBuy: false,
                nativeShare: new NativeShare(),
                isBigDevice: false
            }
        },
        computed: {
            itemImgSize() {
                return this.isBigDevice ? 375 : document.documentElement.clientWidth
            },
            thumbnail() {
                return config.publicBucketDomain + this.item.thumbnail
            },
            isSinglePrice() {
                return this.item.minPrice == this.item.maxPrice
            },
            discount() {
                let discount = 0
                if (this.item.marketPrice > 0) {
                    discount = this.item.minPrice / this.item.marketPrice * 10
                    discount = discount.toFixed(1)
                }
                return discount > 0 ? discount + '折' : ''
            },
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
                if (this.item.topEvaluation) {
                    const avatar = this.item.topEvaluation.clientAvatar
                    if (avatar && !avatar.startsWith('http') && this.$refs.avatar) {
                        this.$refs.avatar.$el.children[0].crossOrigin = 'use-credentials'
                    }
                    return avatar ?
                        (avatar.startsWith('http') ?
                            avatar
                            : config.baseUrl + '/client/img/load?filePath=' + avatar)
                        : defaultAvatar
                }
                return ''
            },
            pickupSpec() {
                let spec = ''
                for (let i in this.values) {
                    const value = this.values[i]
                    spec += value.name + '，'
                }
                spec += this.nums + "件"
                return spec
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
            share(type) {
                try {
                    this.nativeShare.call(type)
                    // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
                    // 类似的命令下面有介绍
                } catch (e) {
                    // 如果不支持，你可以在这里做降级处理
                }
            },
            closeShareTipPopup() {
                this.showShareTip = false
                this.showShareTipInBrowser = false
                this.showShare = false
            },
            showSharePopup() {
                const token = Util.getToken()
                if (!token) {
                    Util.go('Login')
                    return
                }
                if (Util.isInWechat()) {
                    this.showShareTip = true
                } else {
                    this.showShareTipInBrowser = true
                    this.showShare = true
                }
            },
            updateShare() {
                const params = {
                    title: this.item.name, // 分享标题
                    desc: this.item.sellingPoints ? this.item.sellingPoints : window.location.href, // 分享描述
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: this.thumbnail, // 分享图标
                }
                if (Util.isInWechat()) {
                    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                        wx.updateAppMessageShareData(params)
                        wx.updateTimelineShareData(params)
                    })
                } else {
                    this.nativeShare.setShareData({
                        icon: params.imgUrl,
                        link: params.link,
                        title: params.title,
                        desc: params.desc
                    })
                }
            },
            goCart() {
                Util.go('MyCart')
            },
            back() {
                Util.go('GoodsItemList', {
                    id: Util.get('goodsCategoryId')
                })
            },
            addToCart() {
                const token = Util.getToken()
                if (!token) {
                    Util.go('Login')
                    return
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
                    this.itemNums = data.itemNums
                    this.confirmAddToCart = false
                    this.$vux.toast.show({text: '添加成功'})
                })
            },
            buy() {
                const token = Util.getToken()
                if (!token) {
                    Util.go('Login')
                    return
                }
                if (this.values.length == 0) {
                    this.showPopup()
                    this.confirmBuy = true
                    return
                }
                OrderAPI.settleAccount({
                    fromCart: false,
                    items: [
                        {
                            itemId: this.item.id,
                            propertyId: this.property.id,
                            nums: this.nums
                        }
                    ]
                }).then(key => {
                    Util.put('settleAccountData', null)
                    Util.put('settleAccountKey', key)
                    Util.go('OrderPreview', {
                        key
                    })
                })
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
                    this.$vux.toast.show({text: '请先选择规格', type: 'text', width: '150px'})
                    return
                }
                if (this.nums == 0) {
                    this.$vux.toast.show({text: '请先选择数量', type: 'text', width: '150px'})
                    return
                }
                this.values = this.tempValues
                if (this.confirmAddToCart) {
                    this.addToCart()
                } else if (this.confirmBuy) {
                    this.buy()
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
                                this.$vux.toast.show({text: '商品已下架，2秒后返回列表页', type: 'warn', width: '250px'})
                                this.back()
                            }, 2000)
                            return
                        }
                        this.item = item
                        document.title = item.name
                        const descMeta = document.createElement('meta');
                        if (item.sellingPoints) {
                            descMeta.content = item.sellingPoints
                        } else {
                            descMeta.content = window.location.href
                        }
                        descMeta.name = 'description'
                        document.getElementsByTagName('head')[0].appendChild(descMeta);
                        this.updateShare()
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
            // let url = window.location.href
            // if (Util.getToken()) {
            //     if (url.indexOf('?') == -1) {
            //         url += "?uid=" + Util.get('userId')
            //         window.location.href = url
            //         return
            //     }
            // }
            this.isBigDevice = document.documentElement.clientWidth > 500
            this.contentStyle.minHeight = document.documentElement.clientHeight + 'px'
            this.popupHeight = document.documentElement.clientHeight * 0.75
            this.item.id = this.$router.currentRoute.params.id
            this.item.id = this.item.id > 0 ? this.item.id : null
            this.load()
            if (Util.isInWechat()) {
                Util.wxConfig([
                    'updateAppMessageShareData',
                ])
            }
        }
    }
</script>
