<style scoped lang="less">
    .button {
        display: inline-block;
        cursor: pointer;
    }
    .margin-right {
        margin-right: 40px;
    }
</style>
<template>
    <Footer>
        <div align="center">
            <div @click="goHome" class="button margin-right">
                <div>
                    <Icon :style="homeStyle" type="md-home" size="30"/>
                </div>
                <div :style="homeStyle">
                    首页
                </div>
            </div>
            <div @click="goCategory" class="button margin-right">
                <div>
                    <Icon :style="categoryStyle" type="md-book" size="30"/>
                </div>
                <div :style="categoryStyle">
                    分类
                </div>
            </div>
            <div @click="goCart" class="button margin-right">
                <div>
                    <Icon :style="cartStyle" type="md-cart" size="30"/>
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
    </Footer>
</template>
<script>
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
                }
            }
        },
        methods: {
            goHome() {
                this.$router.push({
                    name: 'Home',
                })
            },
            goCategory() {

            },
            goCart() {

            },
            goProfile() {
                this.$router.push({
                    name: 'MyCenter',
                })
            }
        },
        mounted() {
            switch(this.selection) {
                case 'mine': this.mineStyle.color = '#DA4935'; break
                case 'cart': this.cartStyle.color = '#DA4935'; break
                case 'category': this.categoryStyle.color = '#DA4935'; break
                case 'home': this.homeStyle.color = '#DA4935'; break
            }
        }
    }
</script>
