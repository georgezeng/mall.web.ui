<style scoped lang="less">
    body {
        font-weight: 500 !important;
        font-family: PingFangSC-Regular, "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif !important;
    }

    .result {
        position: absolute;
        top: 50%;
        margin-top: -215px;
        width: 100%;
    }

    .result-logo {
        width: 70px;
        height: 98px;
        margin: auto;
        background-image: url(../../images/alipay-logo-2.png);
        background-repeat: no-repeat;
        background-size: contain;
    }

    .result-title {
        margin: 20px 0 14px;
        text-align: center;
        font-size: 21px;
        color: #00a0e8;
        line-height: 25px;
    }

    .result-tips {
        max-width: 370px;
        margin: 0 auto 10px;
        padding: 0 15px;
        font-size: 15px;
        color: #a5a5a5;
        line-height: 18px;
        text-align: left;
        word-break: break-all;
        word-wrap: break-word;
    }

    .result-botton {
        margin: 0 15px 20px;
    }

    .result-botton a {
        display: block;
        margin: auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        max-width: 384px;
        height: 44px;
        text-align: center;
    }

    .result-botton a.am-button-white {
        color: #00aaee;
        background: #ffffff;
        border: 1px solid #00aaee;
        line-height: 40px;
    }

    .result-botton a.am-button-blue {
        border: 1px solid #0ae;
        color: #fff;
        background: #0ae;
        line-height: 40px;
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
                <div class="result-tips">2.如果你已完成或不想支付，请点击“已完成/关闭付款”;</div>
                <div style="margin-top: 60px;" class="result-botton">
                    <a @click="showTip" class="J-h5pay am-button am-button-blue" href="javascript:;">继续支付</a>
                </div>
                <div class="result-botton">
                    <a @click="goSuccess" class="J-complete am-button am-button-white" href="javascript:;">已完成/关闭付款</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TipArrow from '../../images/tip-arrow.png'
    import API from '../../api/order.js'
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
                API.checkPaid(this.id).then(paid => {
                    if (paid) {
                        Util.go('MyOrderList', {
                            type: 'Paid'
                        })
                    } else {
                        Util.go('MyOrderList', {
                            type: 'UnPay'
                        })
                    }
                })
            },
            showTip() {
                this.show = true
                this.closeTip()
            },
            closeTip() {
                window.setTimeout(() => {
                    this.show = false
                }, 3000)
            },
            load() {
                API.checkPaid(this.id).then(paid => {
                    if (paid) {
                        this.goSuccess()
                    } else {
                        window.setTimeout(this.load, 1000)
                    }
                }).catch(e => {
                    window.setTimeout(this.load, 1000)
                })
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
                Util.alipay(this.id, 'wechat')
            } else {
                const oid = UrlParams(window.location.href, 'oid')
                if (!oid) {
                    window.location.href = window.location.href.replace('?', '?oid=' + this.id + '&')
                    return
                }
                this.closeTip()
                this.load()
            }
        }
    }
</script>
