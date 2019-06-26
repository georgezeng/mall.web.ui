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

    .item {
        padding: 20px 10px;
        position: relative;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">发票</div>
        </Header>
        <Content :style="contentStyle">
            <div class="wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-cell title="不开发票" style="margin-bottom: 10px;" @click.native="getItem(null)"></mt-cell>
                <mt-loadmore :bottom-method="load"
                             :bottom-all-loaded="allLoaded"
                             ref="loadmore">
                    <mt-cell-swipe
                            style="margin-bottom: 10px;"
                            @click.native="getItem(item)"
                            v-for="(item, index) in list"
                            :right="swipeButtons(item.id)">
                        <div slot="title" style="font-size: 12pt;">
                            <div>{{item.title}} ({{item.content}})</div>
                        </div>
                        <div>
                            <Icon @click.stop="goEdit(item.id)" size="30" type="ios-create-outline"/>
                        </div>
                    </mt-cell-swipe>
                </mt-loadmore>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <Button type="primary" size="large" long @click="goEdit(0)">新建发票</Button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../../api/invoice.js'
    import Util from '../../../libs/util.js'
    import commonStyles from '../../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                commonStyles,
                footerStyle: {
                    ...commonStyles.footer
                },
                contentStyle: {
                    ...commonStyles.content
                },
                allLoaded: false,
                wrapperHeight: 0,
                list: [],
                pageInfo: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'updateTime'
                },
            }
        },
        computed: {},
        methods: {
            getItem(item) {
                const data = Util.getJson('settleAccountData')
                if (item != null) {
                    data.invoice = item
                } else {
                    data.invoice = {
                        title: null,
                        type: null,
                        content: null,
                        code: null
                    }
                }
                Util.putJson('settleAccountData', data)
                Util.go('OrderPreview', {
                    key: Util.get('settleAccountKey')
                })
            },
            back() {
                const key = Util.get('settleAccountKey')
                Util.go('OrderPreview', {
                    key
                })
            },
            goEdit(id) {
                Util.go('MyInvoiceEdit', {
                    id
                })
            },
            remove(id) {
                API.delete(id).then(res => {
                    this.list = []
                    this.pageInfo.num = 1
                    this.load()
                })
            },
            load() {
                API.list(this.pageInfo).then(data => {
                    if (data && data.length > 0) {
                        this.pageInfo.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                    } else {
                        this.allLoaded = true;
                    }
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded()
                    }, 100)
                })
            },
            swipeButtons(id) {
                return [
                    {
                        content: '删除',
                        style: {background: 'red', color: '#fff', padding: '20px 10px 0 10px'},
                        handler: () => this.remove(id)
                    }
                ]
            }
        },
        created() {
            this.footerStyle.padding = "20px"
            this.contentStyle.marginTop = "60px"
            this.contentStyle.backgroundColor = '#F5F5F5'
            this.contentStyle.marginBottom = "80px"
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
        }
    }
</script>
