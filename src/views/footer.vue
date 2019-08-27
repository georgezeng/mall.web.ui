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
        top: -3px;
        color: #fff;
        border-radius: 10px !important;
        background-color: red !important;
        padding: 0px 0px !important;
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
                    <img :src="home" width="30" height="30" class="img"/>
                </div>
                <div :style="homeStyle">
                    首页
                </div>
            </div>
            <div @click="goCategory" class="button">
                <div>
                    <img :src="category" width="30" height="30" class="img"/>
                </div>
                <div :style="categoryStyle">
                    分类
                </div>
            </div>
            <div @click="goCart" class="button" style="position: relative;">
                <div>
                    <img :src="cart" width="30" height="30" class="img"/>
                    <mt-badge :style="cartItemStyle" class="cartItems" v-if="cartItems > 0" size="small">{{cartItems}}
                    </mt-badge>
                </div>
                <div :style="cartStyle">
                    购物车
                </div>
            </div>
            <div @click="goCenter" class="button">
                <div>
                    <img :src="mine" width="30" height="30" class="img"/>
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
    import home from '../images/home.png'
    import homeSelected from '../images/home-selected.png'
    import category from '../images/category.png'
    import categorySelected from '../images/category-selected.png'
    import cart from '../images/cart2.png'
    import cartSelected from '../images/cart-selected.png'
    import mine from '../images/mine.png'
    import mineSelected from '../images/mine-selected.png'

    export default {
        props: [
            'selection'
        ],
        data() {
            return {
                home,
                homeSelected,
                category,
                categorySelected,
                cart,
                cartSelected,
                mine,
                mineSelected,
                mineStyle: {
                    color: '#B69C7D'
                },
                cartStyle: {
                    color: '#B69C7D'
                },
                categoryStyle: {
                    color: '#B69C7D'
                },
                homeStyle: {
                    color: '#B69C7D'
                },
                cartItemStyle: {},
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
            goCenter() {
                Util.go('MyCenter')
            }
        },
        mounted() {
            const docWidth = document.documentElement.clientWidth
            if (docWidth < 375 && docWidth > 330) {
                this.cartItemStyle.left = '45px'
            } else if (docWidth < 330) {
                this.cartItemStyle.left = '40px'
            } else {
                this.cartItemStyle.left = '50px'
            }
            switch (this.selection) {
                case 'mine': {
                    this.mineStyle.color = '#586274'
                    this.mine = this.mineSelected
                }
                    break
                case 'cart': {
                    this.cartStyle.color = '#586274'
                    this.cart = this.cartSelected
                }
                    break
                case 'category': {
                    this.categoryStyle.color = '#586274'
                    this.category = this.categorySelected
                }
                    break
                case 'home': {
                    this.homeStyle.color = '#586274'
                    this.home = this.homeSelected
                }
                    break
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
