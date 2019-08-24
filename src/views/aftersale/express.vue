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
            <div align="center" style="position: relative; top: 0px;">物流信息</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 60px; font-size: 14px;">
            <div style="background-color: #fff; padding: 10px;">
                <div style="margin-bottom: 5px;">回寄地址:</div>
                <div style="margin-bottom: 5px;">{{address.name}}</div>
                <div style="margin-bottom: 5px;">{{address.phone}}</div>
                <div style="margin-bottom: 5px;">{{address.location}}</div>
            </div>
            <div style="margin-top: 20px;">
                <div style="margin-left: 10px; color: gray;">
                    (已同意您的申请，请尽快寄回商品，并填写运单)
                </div>
                <group>
                    <x-input @on-blur="resetUI" title="物流公司:" placeholder="请填写物流公司名称"
                             v-model="data.company"></x-input>
                    <x-input @on-blur="resetUI" title="物流单号:" placeholder="请填写物流单号"
                             v-model="data.number"></x-input>
                </group>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <div style="padding: 0px 10px;">
                <x-button :disabled="loading" :show-loading="loading" action-type="button"
                          style="width: 100%; background-color: #008CEB;" @click.native="fillExpress">
                    <span style="font-size: 11pt; color: #fff;">确认发货</span>
                </x-button>
            </div>
        </Footer>
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
                loading: false,
                footerStyle: {
                    ...commonStyles.footer
                },
                address: {
                    name: null,
                    phone: null,
                    location: null
                },
                data: {
                    id: null,
                    company: null,
                    number: null
                },
            }
        },
        computed: {},
        methods: {
            fillExpress() {
                this.loading = true
                API.fillExpress(this.data).then(res => {
                    this.loading = false
                    let nav = Util.getForNav()
                    Util.go(nav.from, nav)
                }).catch(e => {
                    this.loading = false
                })
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                if (this.data.id > 0) {
                    API.returnAddress(this.data.id).then(address => {
                        if (address) {
                            this.address = address
                        }
                    })
                }
            }
        },
        created() {
            this.data.id = this.$router.currentRoute.params.id
        },
        mounted() {
            this.load()
        }
    }
</script>
