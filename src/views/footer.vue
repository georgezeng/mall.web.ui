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
    <Footer style="position: relative; margin: 0; padding: 0;">
        <div style="background-color: #F5F7F9; position: fixed; z-index: 100; width: 100%; padding: 5px 0; bottom: 0px;"
             align="center">
            <div @click="goHome"
                 class="button margin-right">
                <div>
                    <Icon type="md-home" size="30"/>
                </div>
                <div>
                    首页
                </div>
            </div>
            <div @click="goCategory"
                 class="button margin-right">
                <div>
                    <Icon type="md-book" size="30"/>
                </div>
                <div>
                    分类
                </div>
            </div>
            <div @click="goCart"
                 class="button margin-right">
                <div>
                    <Icon type="md-cart" size="30"/>
                </div>
                <div>
                    购物车
                </div>
            </div>
            <div @click="goProfile"
                 class="button">
                <div>
                    <Icon type="md-contact" size="30"/>
                </div>
                <div>
                    我的
                </div>
            </div>
        </div>
    </Footer>
</template>
<script>
    export default {
        data() {
            return {

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
                    name: 'Login',
                })
            }
        }
    }
</script>
