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
</template>
<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
        }
    }
</script>
