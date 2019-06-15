<style scoped lang="less">
    .demo-carousel {
        height: 150px;
        width: 100%;
        background-color: #556B9A;
        text-align: center;
        color: #fff;
        padding: 150px;
        font-size: 20px;
        font-weight: bold;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="commonStyles.header">
            <Input size="large" clearable search placeholder="搜索商品"/>
        </Header>
        <Content :style="contentStyle">
            <mt-swipe :auto="4000" style="height: 300px; background-color: #556B9A;">
                <mt-swipe-item>
                    <div class="demo-carousel">1</div>
                </mt-swipe-item>
                <mt-swipe-item>
                    <div class="demo-carousel">2</div>
                </mt-swipe-item>
                <mt-swipe-item>
                    <div class="demo-carousel">3</div>
                </mt-swipe-item>
            </mt-swipe>
        </Content>
        <Footer selection="home" :style="commonStyles.footer" />
    </Layout>

</template>
<script>
    import Footer from './footer'
    import commonStyles from '../styles/common.js'
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
            }
        },
        methods: {
        },
        created() {
            this.contentStyle.minHeight = document.documentElement.clientHeight + 'px'
            this.contentStyle.marginTop = '64px'
        }
    }
</script>
