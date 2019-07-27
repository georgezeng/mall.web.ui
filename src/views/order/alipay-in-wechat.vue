<style scoped lang="less">
    body {
        font-weight: 500 !important;
        font-family: PingFangSC-Regular, "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif !important;
    }

    .result {
        position: absolute !important;
        top: 50% !important;
        margin-top: -215px !important;
        width: 100% !important;
    }

    .result-logo {
        width: 70px !important;
        height: 98px !important;
        margin: auto !important;
        background-image: url(../../images/alipay-logo-2.png) !important;
        background-repeat: no-repeat !important;
        background-size: contain !important;
    }

    .result-title {
        margin: 40px 0 14px !important;
        text-align: center !important;
        font-size: 21px !important;
        color: #00a0e8 !important;
        line-height: 25px !important;
    }

    .result-tips {
        max-width: 370px !important;
        margin: 0 auto 10px !important;
        padding: 0 15px !important;
        font-size: 15px !important;
        color: #a5a5a5 !important;
        line-height: 18px !important;
        text-align: left !important;
        word-break: break-all !important;
        word-wrap: break-word !important;
    }

    .result-botton {
        margin: 0 15px 20px !important;
    }

    .result-botton a {
        display: block !important;
        margin: auto !important;
        -webkit-box-sizing: border-box !important;
        box-sizing: border-box !important;
        max-width: 384px !important;
        height: 44px !important;
        text-align: center !important;
    }

    .result-botton a.am-button-white {
        color: #00aaee !important;
        background: #ffffff !important;
        border: 1px solid #00aaee !important;
    }

    .result-botton .am-button[disabled=disabled] {
        color: #e6e6e6 !important;
        background: #f8f8f8 !important;
        border: 1px solid #dedede !important;
    }

</style>

<template>
    <div v-if="isInWechat">
        <div v-if="show"
             style="position: fixed; background-color: rgba(0, 0, 0, 0.8); width: 100%; z-index: 100000;"
             :style="{height: minHeight}">
            <img :src="TipArrow" width="111" height="99" style="position: absolute; right: 20px;"/>
            <div style="color: #fff; position: relative; top: 100px; left: 30px;">
                点击右上角的"..."，打开系统浏览器进行支付
            </div>
        </div>
        <div v-else class="am-content">
            <div class="result">
                <div class="result-logo"></div>
                <div class="result-title">&nbsp;</div>
                <div class="result-tips">1.如果未打开支付宝客户端或未完成付款，请点击“继续支付”;</div>
                <div class="result-tips" style="margin-bottom: 60px;">2.如果你已完成，请点击“已完成付款”；</div>
                <div class="result-botton">
                    <a @click="showTip" class="J-h5pay am-button am-button-blue" href="javascript:;">继续支付</a>
                </div>
                <div class="result-botton">
                    <a @click="goSuccess" class="J-complete am-button am-button-white" href="javascript:;">已完成付款</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TipArrow from '../../images/tip-arrow.png'
    import Util from '../../libs/util.js'
    import UrlParams from 'get-url-param'

    export default {
        components: {},
        data() {
            return {
                TipArrow,
                show: true,
                id: null,
                minHeight: 0,

            }
        },
        methods: {
            goSuccess() {
                let uid = UrlParams(window.location.href, 'uid')
                if (uid) {
                    uid = uid.replace(/#.+/, '')
                    window.location.href = '/?uid=' + uid + '#/Order/List/All'
                } else {
                    window.location.href = '/'
                }
            },
            showTip() {
                this.show = true
                window.setTimeout(() => {
                    this.show = false
                }, 3000)
            },
            load() {
                Util.alipay(this.id, 'wechat')
            }
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
            } else {
                const oid = UrlParams(window.location.href, 'oid')
                if (!oid) {
                    window.location.href = window.location.href.replace('?', '?oid=' + this.id + '&')
                    return
                }
                window.setTimeout(() => {
                    this.show = false
                }, 3000)
            }
        }
    }
</script>
