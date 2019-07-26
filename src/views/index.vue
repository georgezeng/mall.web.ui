<template>
</template>
<script>
    import config from '../config/index'
    import UrlParams from 'get-url-param'
    import Util from '../libs/util.js'

    export default {
        mounted() {
            const orderId = UrlParams(window.location.href, 'oid')
            if (orderId) {
                Util.go('AlipayInWechat', {
                    id: orderId
                })
                return
            }
            // 解决ios下webview和safari不能获取跨域cookie的问题
            window.location.href = config.baseUrl + "/index?url=" + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#/Home")
        }
    }
</script>
