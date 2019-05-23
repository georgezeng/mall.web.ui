<style>
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
            <Input search placeholder="搜索商品"/>
        </Header>
        <Content :style="{padding: '64px 0 0 0', backgroundColor: '#fff'}">
            <Carousel autoplay loop>
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
                commonStyles
            }
        },
        methods: {
        }
    }
</script>
