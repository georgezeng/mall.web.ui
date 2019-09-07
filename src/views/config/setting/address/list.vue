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
            <swipeout>
                <swipeout-item @click.native="getItem(item, index)" :key="item.id" v-for="(item, index) in list"
                               transition-mode="follow">
                    <div slot="content" class="item vux-1px-t">
                        <table width="100%">
                            <tr>
                                <td width="30" rowspan="2" v-if="nav.from != 'MySetting'">
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
                                    {{Util.getLongLocation(item)}}
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
            <load-more v-if="showLoading" tip="正在加载"></load-more>
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
                             <td width="30" rowspan="2" v-if="!from != 'MySetting'">
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

    export default {
        components: {},
        data() {
            return {
                Util,
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
                // init: false,
                showLoading: false,
                loadingList: false,
                clientY: 0,
                nav: {
                    from: null
                }
            }
        },
        computed: {},
        methods: {
            getItem(item, index) {
                const nav = Util.getForNav()
                switch (nav.from) {
                    case 'OrderSettleAccount': {
                        const data = Util.getJson('settleAccountData')
                        if (data) {
                            this.checkAsSelect(item.id, index)
                            data.address = item
                            Util.putJson('settleAccountData', data)
                            Util.go(nav.from, nav)
                        }
                    }
                        break
                    case 'AfterSaleChange': {
                        const data = Util.getJson('afterSaleChangeData')
                        if (data) {
                            this.checkAsSelect(item.id, index)
                            data.address = item
                            Util.putJson('afterSaleChangeData', data)
                            Util.go(nav.from, nav)
                        }
                    }
                }
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            goEdit(id) {
                Util.putForNav({
                    from: 'MyAddressList'
                })
                Util.go('MyAddressEdit', {
                    id
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
                // if(this.from == 'OrderSettleAccount') {
                //     const data = Util.getJson('settleAccountData')
                //     if (id == data.address.id) {
                //         data.address = {
                //             id: null,
                //             name: null,
                //             phone: null,
                //             province: null,
                //             city: null,
                //             district: null,
                //             location: null
                //         }
                //     }
                //     Util.putJson('settleAccountData', data)
                // }
                API.delete(id).then(res => {
                    this.isSelected = []
                    this.list = []
                    this.pageInfo.num = 1
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
                    if (data && data.length > 0) {
                        this.pageInfo.num++
                        let info = null
                        switch (this.nav.from) {
                            case 'OrderSettleAccount':
                                info = Util.getJson('settleAccountData');
                                break
                            case 'AfterSaleChange':
                                info = Util.getJson('afterSaleChangeData');
                                break
                        }
                        const address = info ? info.address : {}
                        for (let i in data) {
                            this.list.push(data[i])
                            this.isSelected.push(address && address.id != null ? data[i].id == address.id : false)
                        }
                        if (data.length < this.pageInfo.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        } else {
                            this.showLoading = true
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
            }
        },
        created() {
            this.footerStyle.padding = "20px"
            this.contentStyle.marginTop = "60px"
            this.contentStyle.marginBottom = "80px"
        },
        mounted() {
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
            window.addEventListener('scroll', this.scrollHandler)
            this.nav = Util.peekForNav()
            this.load()
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHandler)
        }
    }
</script>
