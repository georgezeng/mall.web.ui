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
            <div align="center" style="position: relative; top: 0px;">选择发票</div>
        </Header>
        <Content :style="contentStyle">
            <mt-cell title="不开发票" style="margin-top: 10px; margin-bottom: 10px;" @click.native="getItem(null)"></mt-cell>
            <swipeout>
                <swipeout-item @click.native="getItem(item)" :key="item.id" v-for="(item, index) in list"
                               transition-mode="follow">
                    <div slot="content" class="item vux-1px-t">
                        <div style="display: inline-block; position: relative; top: -10px;">
                            <check-icon class="checker"
                                        :value.sync="isSelected[index]"></check-icon>
                        </div>
                        <div style="font-size: 11pt; display: inline-block;">
                            <div style="margin-bottom: 5px;">{{item.title}}</div>
                            <div style="font-size: 12px; color: gray;">{{item.content}}</div>
                        </div>
                        <div style="float: right; position: relative; top: 20px;">
                            <Icon @click.stop="goEdit(item.id)" size="30" type="ios-create-outline"/>
                        </div>
                    </div>
                    <div slot="right-menu">
                        <swipeout-button @click.native.stop="remove(item.id)" type="warn">删除</swipeout-button>
                    </div>
                </swipeout-item>
            </swipeout>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
            <div :style="{top: noRecordTop + 'px'}" v-if="showNoRecord && list.length == 0" align="center" style="width: 100%; position: absolute; color: gray;">
                <img :src="NoRecord" width="30%" height="30%"/>
                <div>暂无发票模板</div>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <x-button action-type="button" style="width: 100%; background-color: #008CEB;" @click.native="goEdit(0)">
                <span style="font-size: 11pt; color: #fff;">新建发票</span>
            </x-button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../../api/invoice.js'
    import Util from '../../../libs/util.js'
    import commonStyles from '../../../styles/common.js'
    import NoRecord from '../../../images/norecord-evaluation.png'

    export default {
        components: {},
        data() {
            return {
                NoRecord,
                showNoRecord: false,
                noRecordTop: 0,
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
                isSelected: [],
                pageInfo: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'updateTime'
                },
                init: false,
                showLoading: false,
                loadingList: false
            }
        },
        computed: {},
        methods: {
            getItem(item) {
                const data = Util.getJson('settleAccountData')
                if (item != null) {
                    data.invoice = item
                    data.invoice.type = item.type.name
                } else {
                    data.invoice = {
                        title: null,
                        type: null,
                        content: null,
                        code: null
                    }
                }
                Util.putJson('settleAccountData', data)
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            goEdit(id) {
                Util.putForNav({
                    from: 'MyInvoiceList'
                })
                Util.go('MyInvoiceEdit', {
                    id
                })
            },
            remove(id) {
                // this.init = false
                const data = Util.getJson('settleAccountData')
                if (id == data.invoice.id) {
                    data.invoice = {
                        id: null,
                        title: null,
                        code: null,
                        content: null,
                        type: null
                    }
                }
                API.delete(id).then(res => {
                    this.list = []
                    this.isSelected = []
                    this.pageInfo.num = 1
                    this.showLoading = true
                    this.allLoaded = false
                    this.loadingList = false
                    this.showNoRecord = false
                    this.load()
                })
            },
            scrollHandler(e) {
                Util.scrollHandler(e, this)
            },
            load() {
                if (this.allLoaded) {
                    this.showLoading = false
                    return
                }
                if (this.loadingList) {
                    return
                }
                this.loadingList = true
                API.list(this.pageInfo).then(data => {
                    this.loadingList = false
                    if (data && data.length > 0) {
                        this.pageInfo.num++
                        const settleAccountData = Util.getJson('settleAccountData')
                        if (settleAccountData) {
                            const invoice = settleAccountData.invoice
                            for (let i in data) {
                                this.list.push(data[i])
                                this.isSelected.push(invoice && invoice.id != null ? data[i].id == invoice.id : false)
                            }
                            if (data.length < this.pageInfo.size) {
                                this.allLoaded = true
                                this.showLoading = false
                            } else {
                                this.showLoading = true
                            }
                        } else {
                            this.$vux.toast.show({text: "找不到结算信息，请返回重新下单", type: 'text'})
                        }
                    } else {
                        this.showNoRecord = true
                        this.allLoaded = true
                        this.showLoading = false
                    }
                    // this.$refs.loadmore.onBottomLoaded()
                    // if (!this.init) {
                    //     this.init = true
                    //     setTimeout(() => {
                    //         this.$refs.wrapper.scrollTop = 0
                    //     }, 100)
                    // }
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
            this.contentStyle.marginTop = "50px"
            this.contentStyle.marginBottom = "80px"
            this.contentStyle.backgroundColor = '#f5f5f5'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 130) + 'px'
            this.noRecordTop = ((document.documentElement.clientHeight - 130) - 200) / 2
        },
        mounted() {
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
            window.addEventListener('scroll', this.scrollHandler)
            this.load()
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }

    }
</script>
