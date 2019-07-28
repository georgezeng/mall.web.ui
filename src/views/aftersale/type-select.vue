<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        position: fixed;
        top: 0px;
        z-index: 100;
        width: 100%;
        box-shadow: 0px 0px 3px -1px gray;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">选择售后类型</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 60px;">
            <!--
            <mt-cell @click.native="goRefundOnly" is-link>
                <div slot="title" style="padding: 20px 0;">
                    <div style="font-weight: bold; color: black; margin-bottom: 10px;">仅退款</div>
                    <div style="color: gray; font-size: 12px;">未收到货(包含未签收与拒收)，或者协商后需要退款。</div>
                </div>
            </mt-cell>
            -->
            <mt-cell @click.native="goSalesReturn" is-link style="border-top: 2px solid #f5f5f5;">
                <div slot="title" style="padding: 20px 0;">
                    <div style="font-weight: bold; color: black; margin-bottom: 10px;">退货退款</div>
                    <div style="color: gray; font-size: 12px;">已收到货物，需要退全部或者部分收到的货物。</div>
                </div>
            </mt-cell>
            <mt-cell @click.native="goChange" is-link style="border-top: 2px solid #f5f5f5;">
                <div slot="title" style="padding: 20px 0;">
                    <div style="font-weight: bold; color: black; margin-bottom: 10px;">换货</div>
                    <div style="color: gray; font-size: 12px;">已收到货物，需要更换全部或者部分收到的货物。</div>
                </div>
            </mt-cell>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/aftersale.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                commonStyles,
                id: null,
            }
        },
        computed: {},
        methods: {
            goChange() {
                Util.go('AfterSaleChange', {
                    id: this.id
                })
            },
            goSalesReturn() {
                Util.putForNav({
                    from: 'AfterSaleTypeSelect',
                    id: this.id
                })
                Util.go('AfterSaleSalesReturn', {
                    id: this.id
                })
            },
            // goRefundOnly() {
            //     Util.go('AfterSaleRefundOnly', {
            //         id: this.id
            //     })
            // },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
        },
        created() {
            this.id = this.$router.currentRoute.params.id
        },
        mounted() {
        }
    }
</script>
