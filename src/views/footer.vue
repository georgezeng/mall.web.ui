<style scoped lang="less">
    .button {
        display: inline-block;
        cursor: pointer;
        width: 24%
    }

    .footer {
        box-shadow: 0px 0px 3px -1px gray;
    }

    .cartItems {
        position: absolute;
        left: 50px;
        top: -3px;
        color: red;
        border-radius: 10px !important;
        background-color: #fff !important;
        border: 1px solid red;
        padding: 0px 0px !important;
        font-size: 6px !important;
        width: 18px;
        height: 16px;
        line-height: 14px;
    }
</style>
<template>
    <Footer class="footer">
        <div align="center">
            <div @click="goHome" class="button">
                <div>
                    <Icon :style="homeStyle" type="md-home" size="30"/>
                </div>
                <div :style="homeStyle">
                    首页
                </div>
            </div>
            <div @click="goCategory" class="button">
                <div>
                    <Icon :style="categoryStyle" type="md-apps" size="30"/>
                </div>
                <div :style="categoryStyle">
                    分类
                </div>
            </div>
            <div @click="goCart" class="button" style="position: relative;">
                <div>
                    <Icon :style="cartStyle" type="md-cart" size="30"/>
                    <mt-badge class="cartItems" v-if="cartItems > 0" size="small" >{{cartItems}}</mt-badge>
                </div>
                <div :style="cartStyle">
                    购物车
                </div>
            </div>
            <div @click="goProfile" class="button">
                <div>
                    <Icon :style="mineStyle" type="md-contact" size="30"/>
                </div>
                <div :style="mineStyle">
                    我的
                </div>
            </div>
        </div>
        <!--<div align="center">-->
            <!--<a href="http://www.beian.miit.gov.cn">粤ICP备17125109号</a>-->
        <!--</div>-->
    </Footer>
</template>
<script>
    import Util from '../libs/util.js'
    import CartAPI from '../api/cart.js'
    export default {
        props: [
          'selection'
        ],
        data() {
            return {
                mineStyle: {
                    color: null
                },
                cartStyle: {
                    color: null
                },
                categoryStyle: {
                    color: null
                },
                homeStyle: {
                    color: null
                },
                cartItems: 0,
            }
        },
        methods: {
            goHome() {
                Util.go('Home')
            },
            goCategory() {
                Util.go('GoodsCategory')
            },
            goCart() {
                Util.go('MyCart')
            },
            goProfile() {
                Util.go('MyCenter')
            }
        },
        mounted() {
            switch(this.selection) {
                case 'mine': this.mineStyle.color = '#DA4935'; break
                case 'cart': this.cartStyle.color = '#DA4935'; break
                case 'category': this.categoryStyle.color = '#DA4935'; break
                case 'home': this.homeStyle.color = '#DA4935'; break
            }
            const token = Util.getToken()
            if (token) {
                CartAPI.itemInfo(0).then(data => {
                    this.cartItems = data.total
                })
            }
        }
    }
</script>
