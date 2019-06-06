<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        position: fixed;
        top: 0px;
        z-index: 100;
        width: 100%;
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

    @component mint-loadmore-bottom {
        text-align: center;
        span {
            display: inline-block;
            transition: .2s linear;
            vertical-align: middle;
        @when rotate {
            transform: rotate(180deg);
        }
        }
    }

    @descendent wrapper {
        margin-top: 80px;
        overflow: scroll;
        -webkit-overflow-scrolling : touch;
    }

    .mint-spinner {
        display: inline-block;
        vertical-align: middle;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">收货地址</div>
        </Header>
        <Content :style="commonStyles.content">
            <div class="blockLine" style="z-index: 100; position: fixed; top: 60px;"></div>
            <div class="wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore :bottom-method="load" @bottom-status-change="handleBottomChange"
                             :bottom-all-loaded="allLoaded"
                             ref="loadmore">
                    <swipeout>
                        <swipeout-item v-for="(address, index) in list" transition-mode="follow">
                            <div slot="content" class="item vux-1px-t">
                                <table width="100%">
                                    <tr>
                                        <td width="30" rowspan="2">
                                            <check-icon class="checker"
                                                        :value.sync="isDefault[index]"
                                                        @click.native="checkAsDefault(address.id, index)"></check-icon>
                                        </td>
                                        <td class="wrap">
                                            <span>{{address.name}}</span>
                                            <span>*******{{address.phone.substring(7, 11)}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="wrap address">
                                            {{address.province+address.city.replace('市辖区',
                                            '')+address.district+address.location}}
                                        </td>
                                        <td width="30" rowspan="2" style="text-align: right;">
                                            <Icon @click="goEdit(address.id)" size="30" type="ios-create-outline"/>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div slot="right-menu">
                                <swipeout-button @click.native="remove(address.id)" type="warn">删除</swipeout-button>
                            </div>
                        </swipeout-item>
                    </swipeout>
                    <div slot="bottom" class="mint-loadmore-bottom" align="center">
                        <span v-show="bottomStatus !== 'loading'"
                              :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'">
                            <mt-spinner class="mint-spinner" type="snake"></mt-spinner>
                        </span>
                    </div>
                </mt-loadmore>
            </div>
            <div style="height: 80px;">
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
                bottomStatus: '',
                allLoaded: false,
                wrapperHeight: 0,
                list: [],
                pageInfo: {
                    num: 1,
                    size: 1,
                    order: 'DESC',
                    property: 'createTime'
                }
            }
        },
        computed: {},
        methods: {
            handleBottomChange(status) {
                this.bottomStatus = status
            },
            back() {
                Util.go('MySetting')
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
                    Message.success('默认地址保存成功')
                })
            },
            remove(id) {
                API.delete(id).then(res => {
                    window.location.reload(true)
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
        },
        created() {
            this.footerStyle.padding = "20px"
            this.contentStyle.marginTop = "80px"
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 80
        }
    }
</script>
