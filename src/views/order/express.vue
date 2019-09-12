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
        <Content :style="commonStyles.content" style="margin-top: 60px;">
            <div v-for="(express,index) in data.expressList"
                 :key="express.id">
                <div style="padding: 10px 15px 10px; position: relative;">
                    <div>发货时间: {{express.expressTime}}</div>
                    <div>物流方式: {{express.type.text}}</div>
                    <div v-if="express.type.name == 'Delivery'">物流公司: {{express.company}}</div>
                    <div v-if="express.type.name == 'Delivery'">
                        物流单号: {{express.number}}
                        <input ref="numberText" readonly :value="express.number"
                               style="width: 1px; opacity: 0; border:none; outline: none;"/>
                        <div @click="copyNumber(index)"
                             style="border-radius 20px; border: 1px solid #B69C7D; color: #B69C7D; padding: 5px; position: absolute; right: 10px; bottom: 15px;">
                            复制单号
                        </div>
                    </div>
                    <div>
                        <span style="vertical-align: top;">物流商品: </span>
                        <span v-for="sub in express.subList" :key="sub.id">
                            <img :src="config.publicBucketDomain + sub.thumbnail" width="60" height="60"/>
                        </span>
                    </div>
                </div>
                <div style="background-color: #f5f5f5; height: 10px;"></div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/order.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import config from '../../config/index.js'

    export default {
        components: {},
        data() {
            return {
                config,
                commonStyles,
                data: {
                    id: null,
                    expressList: []
                },
            }
        },
        computed: {},
        methods: {
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                if (this.data.id > 0) {
                    API.load(this.data.id).then(data => {
                        this.data = data
                    })
                }
            },
            copyNumber(index) {
                Util.copyText(this.$refs.numberText[index])
            },
        },
        created() {
            this.data.id = this.$router.currentRoute.params.id
        },
        mounted() {
            this.load()
        }
    }
</script>
