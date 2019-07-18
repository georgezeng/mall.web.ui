<template>
</template>
<script>
    import config from '../config/index'

    export default {
        mounted() {
            // 解决ios下webview和safari不能获取跨域cookie的问题
            window.location.href = config.baseUrl + "/index?url=" + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#/Home")
        }
    }
</script>
