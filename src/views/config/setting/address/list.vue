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

    .checker {
        position: relative;
    }

    .wrap {
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
        font-size: 11pt;
    }

    .address {
        font-size: 11pt;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">收货地址</div>
        </Header>
        <Content :style="contentStyle">
            <!--<load-more v-if="showLoading" tip="正在加载"></load-more>-->

            <mescroll-vue ref="mescroll" :down="mescrollDown">
                <swipeout>
                    <swipeout-item @click.native="getItem(item, index)" :key="item.id" v-for="(item, index) in list"
                                   transition-mode="follow">
                        <div slot="content" class="item vux-1px-t">
                            <table width="100%">
                                <tr>
                                    <td width="30" rowspan="2" v-if="fromOrderPreview">
                                        <check-icon class="checker"
                                                    :value.sync="isSelected[index]"></check-icon>
                                    </td>
                                    <td class="wrap">
                                        <span>{{item.name}}</span>
                                        <span>{{item.phone.substring(0, 3)}}****{{item.phone.substring(7, item.phone.length)}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="wrap address">
                                        {{item.province+item.city.replace('市辖区', '')+item.district+item.location}}
                                    </td>
                                    <td width="30" rowspan="2" style="text-align: right;">
                                        <div v-if="item.asDefault"
                                             style="font-size: 14px; color: orangered; position: absolute; width: 100px; right: 20px; top: 20px;">
                                            默认地址
                                        </div>
                                        <Icon @click.stop="goEdit(item.id)" size="30" type="ios-create-outline"/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div slot="right-menu">
                            <swipeout-button @click.native.stop="remove(item.id, index)" type="warn">删除
                            </swipeout-button>
                        </div>
                    </swipeout-item>
                </swipeout>
            </mescroll-vue>

            <!--<div class="wrapper" @scroll="scroll" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">-->
            <!-- <mt-loadmore :bottom-method="load"
                          :bottom-all-loaded="allLoaded"
                          :bottom-distance="10"
                          ref="loadmore">
                 <mt-cell-swipe
                         @click.native="getItem(item)"
                         v-for="(item, index) in list"
                         :right="swipeButtons(item.id)">
                     <table class="item" slot="title" width="100%">
                         <tr>
                             <td width="30" rowspan="2" v-if="fromOrderPreview">
                                 <check-icon class="checker"
                                             :value.sync="isSelected[index]"></check-icon>
                             </td>
                             <td class="wrap">
                                 <span>{{item.name}}</span>
                                 <span>{{item.phone.substring(0, 3)}}****{{item.phone.substring(7, item.phone.length)}}</span>
                             </td>
                         </tr>
                         <tr>
                             <td class="wrap address">
                                 {{item.province+item.city.replace('市辖区','')+item.district+item.location}}
                             </td>
                             <td width="30" rowspan="2" style="text-align: right;">
                                 <Icon @click.stop="goEdit(item.id)" size="30" type="ios-create-outline"/>
                             </td>
                         </tr>
                     </table>
                 </mt-cell-swipe>

            </mt-loadmore>-->
            <!--<div v-if="allLoaded" class="loadMoreBaseLine">已到底部</div>-->
            <!--</div>-->
        </Content>
        <Footer :style="footerStyle">
            <x-button action-type="button" style="width: 100%; background-color: #008CEB;" @click.native="goEdit(0)">
                <span style="font-size: 11pt; color: #fff;">新建收货地址</span>
            </x-button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../../../api/address.js'
    import Util from '../../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../../styles/common.js'
    import MescrollVue from 'mescroll.js/mescroll.vue'

    export default {
        components: {
            MescrollVue
        },
        data() {
            return {
                commonStyles,
                footerStyle: {
                    ...commonStyles.footer
                },
                contentStyle: {
                    ...commonStyles.content
                },
                isSelected: [],
                allLoaded: false,
                wrapperHeight: 0,
                list: [],
                pageInfo: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'createTime'
                },
                fromOrderPreview: false,
                showLoading: false,
                loadingList: false,
                mescrollDown: { // 上拉加载的配置.
                    callback: this.msLoad, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                    //以下是一些常用的配置,当然不写也可以的.
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 10 //每页数据条数,默认10
                    },
                    htmlNodata: '<p class="upwarp-nodata">-- 到底了 --</p>',
                    noMoreSize: 10, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                    //避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                    //这就是为什么无更多数据有时候不显示的原因
                    toTop: {
                        //回到顶部按钮
                        src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
                        offset: 1000 //列表滚动1000px才显示回到顶部按钮
                    },
                    empty: {
                        //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                        warpId: "warpId", //父布局的id (1.3.5版本支持传入dom元素)
                        icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
                        tip: "暂无相关数据~" //提示
                    }
                },
            }
        },
        computed: {},
        methods: {
            getItem(item, index) {
                if (this.fromOrderPreview) {
                    this.checkAsSelect(item.id, index)
                    const data = Util.getJson('settleAccountData')
                    data.address = item
                    Util.putJson('settleAccountData', data)
                    Util.go('OrderPreview', {
                        key: Util.get('settleAccountKey')
                    })
                }
            },
            back() {
                if (this.fromOrderPreview) {
                    const key = Util.get('settleAccountKey')
                    Util.go('OrderPreview', {
                        key
                    })
                } else {
                    Util.go('MySetting')
                }
            },
            goEdit(id) {
                Util.go('MyAddressEdit', {
                    id,
                    fromOrderPreview: this.fromOrderPreview ? 'true' : 'false'
                })
            },
            checkAsSelect(id, index) {
                for (let i in this.isSelected) {
                    this.isSelected[i] = false
                }
                this.isSelected[index] = true
            },
            remove(id, index) {
                // this.init = false
                const data = Util.getJson('settleAccountData')
                if (id == data.address.id) {
                    data.address = {
                        id: null,
                        name: null,
                        phone: null,
                        province: null,
                        city: null,
                        district: null,
                        location: null
                    }
                }
                Util.putJson('settleAccountData', data)
                API.delete(id).then(res => {
                    this.isSelected = []
                    this.list = []
                    this.pageInfo.num = 1
                    this.load()
                })
            },
            scrollHandler(e) {
                const scrollTop = document.body.scrollHeight - e.target.scrollingElement.scrollTop
                if (scrollTop - document.documentElement.clientHeight < -10) {
                    if (!this.allLoaded) {
                        this.showLoading = true
                    }
                } else if (scrollTop - document.documentElement.clientHeight < -30) {
                    this.load();
                }
            },
            msLoad(page, mescroll) {
                this.pageInfo.num = page.num
                API.list(this.pageInfo).then(data => {
                    if (data && data.length > 0) {
                        const settleAccountData = Util.getJson('settleAccountData')
                        let address = {}
                        if (settleAccountData) {
                            address = Util.getJson('settleAccountData').address
                        }
                        for (let i in data) {
                            this.list.push(data[i])
                            this.isSelected.push(address && address.id != null ? data[i].id == address.id : false)
                        }
                        this.$nextTick(() => {
                            mescroll.endSuccess(data.length)
                        })
                    }
                }).catch((e) => {
                    // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    mescroll.endErr()
                })
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
                    if (data && data.length > 0) {
                        this.pageInfo.num++
                        const settleAccountData = Util.getJson('settleAccountData')
                        let address = {}
                        if (settleAccountData) {
                            address = Util.getJson('settleAccountData').address
                        }
                        for (let i in data) {
                            this.list.push(data[i])
                            this.isSelected.push(address && address.id != null ? data[i].id == address.id : false)
                        }
                        if (data.length < this.pageInfo.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        }
                    } else {
                        this.allLoaded = true
                        this.showLoading = false
                    }
                    this.loadingList = false
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
            },
        },
        created() {
            this.footerStyle.padding = "20px"
            this.contentStyle.marginTop = "60px"
            this.contentStyle.marginBottom = "80px"
        },
        mounted() {
            this.fromOrderPreview = this.$router.currentRoute.params.fromOrderPreview == 'true'
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
            window.addEventListener('scroll', this.scrollHandler)
            // this.load()
        }
    }
</script>
