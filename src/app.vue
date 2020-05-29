<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-05-23 09:34:29
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-29 10:30:52
--> 
<style>
    @import 'styles/common.css';
    @import '~vux/src/styles/1px.less';
    /* html {
        overflow: hidden;
        height: 100%;
        position: fixed;
    } */
    .no-scroll {
         overflow: hidden;
        /* height: 100%; */
        /* position: fixed; */
    }
</style>
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    }
</script>
