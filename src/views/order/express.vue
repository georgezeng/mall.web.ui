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
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <div style="margin-bottom: 10px; padding: 0 15px;" v-for="express in data.expressList" :key="express.id">
                <div>物流公司: {{express.company}}</div>
                <div>物流单号: {{express.number}}</div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/order.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                commonStyles,
                data: {
                    id: null,
                    expressList: []
                },
                fromList: true,
                type: null
            }
        },
        computed: {},
        methods: {
            back() {
                if (this.fromList) {
                    Util.go('MyOrderList', {
                        type: this.type
                    })
                } else {
                    Util.go('MyOrderDetail', {
                        id: this.data.id,
                        type: this.type
                    })
                }
            },
            load() {
                if (this.data.id > 0) {
                    API.load(this.data.id).then(data => {
                        this.data = data
                    })
                }
            }
        },
        created() {
            this.data.id = this.$router.currentRoute.params.id
            this.fromList = this.$router.currentRoute.params.fromList == 'true'
            this.type = this.$router.currentRoute.params.type
        },
        mounted() {
            this.load()
        }
    }
</script>
