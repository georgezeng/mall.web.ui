<template>
    <div v-if="isInWechat"
         style="position: fixed; background-color: rgba(0, 0, 0, 0.8); width: 100%; z-index: 100000;"
         :style="{height: minHeight}">
        <img :src="ShareTipArrow" width="111" height="99" style="position: absolute; right: 20px;"/>
        <div style="color: #fff; position: relative; top: 100px; left: 30px;">
            点击右上角的"..."，打开系统浏览器进行支付
        </div>
    </div>
</template>
<script>
    import API from '../../api/alipay.js'
    import TipArrow from '../../images/tip-arrow.png'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'

    export default {
        components: {},
        data() {
            return {
                TipArrow,
                id: null,
                minHeight: 0
            }
        },
        methods: {
            load() {
                Util.alipay(this.id)
            },
        },
        computed: {
            isInWechat() {
                return Util.isInWechat()
            }
        },
        mounted() {
            this.minHeight = document.documentElement.clientHeight + 'px'
            this.id = this.$router.currentRoute.params.id
            if (!Util.isInWechat()) {
                this.load()
            }
        }
    }
</script>
