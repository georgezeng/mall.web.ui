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
            <div class="wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore :bottom-method="load"
                             :bottom-all-loaded="allLoaded"
                             :bottom-distance="30"
                             ref="loadmore">
                    <mt-cell-swipe
                            @click.native="getItem(item)"
                            v-for="(item, index) in list"
                            :right="swipeButtons(item.id)">
                        <table class="item" slot="title" width="100%">
                            <tr>
                                <td width="30" rowspan="2">
                                    <check-icon class="checker"
                                                :value.sync="isDefault[index]"
                                                @click.native.stop="checkAsDefault(item.id, index)"></check-icon>
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
                </mt-loadmore>
                <div v-if="allLoaded" style="color: gray; font-size: 14px; text-align: center; margin: 10px;">------ 我是有底线的 >_< ------</div>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <Button type="primary" size="large" long @click="goEdit(0)">新建收货地址</Button>
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
                commonStyles,
                footerStyle: {
                    ...commonStyles.footer
                },
                contentStyle: {
                    ...commonStyles.content
                },
                isDefault: [],
                allLoaded: false,
                wrapperHeight: 0,
                list: [],
                pageInfo: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'createTime'
                },
                fromOrderPreview: false
            }
        },
        computed: {},
        methods: {
            getItem(item) {
                if (this.fromOrderPreview) {
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
                    id
                })
            },
            checkAsDefault(id, index) {
                for (let i in this.isDefault) {
                    if (i != index) {
                        this.isDefault[i] = false
                    }
                }
                this.isDefault[index] = true
                API.asDefault(id).then(res => {
                    this.$vux.toast.show({text: "默认地址保存成功"})
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
                        for (let i in data) {
                            this.isDefault.push(data[i].default)
                        }
                    } else {
                        this.allLoaded = true;
                    }
                    this.$refs.loadmore.onBottomLoaded()
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
            this.fromOrderPreview = this.$router.currentRoute.params.fromOrderPreview == 'true'
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
        }
    }
</script>
