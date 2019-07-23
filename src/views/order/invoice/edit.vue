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

    .checker {
        position: relative;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">{{action}}发票</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <group>
                <popup-picker show-name
                              class="optionalLine optionalPicker"
                              @on-change="changeType"
                              @click.native="hideSaveBtn"
                              title="发票类型"
                              :value="type"
                              :data="typeList">
                </popup-picker>
                <x-input class="optionalLine optionalCell" title="发票抬头" placeholder="请输入抬头"
                         v-model="data.title"></x-input>
                <x-input class="optionalLine optionalCell" title="纳税编号" placeholder="请输入纳税编号" v-model="data.code"
                         v-if="data.type=='Company'"></x-input>
                <cell class="optionalLine optionalCell">
                    <div slot="title">
                        <div>发票内容</div>
                        <div :key="item.id" v-for="(item, index) in contentList" style="margin: 10px 0;">
                            <check-icon class="checker"
                                        :value.sync="content[index]"
                                        @click.native.stop="check(index)"></check-icon>
                            <span>{{item}}</span>
                        </div>
                    </div>
                </cell>
            </group>
        </Content>
        <Footer :style="footerStyle">
            <x-button :disabled="loading" :show-loading="loading" action-type="button"
                      style="width: 100%; background-color: #008CEB;" @click.native="save">
                <span style="font-size: 11pt; color: #fff;">保存</span>
            </x-button>
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
                typeList: [[
                    {
                        name: '个人',
                        value: 'Individual'
                    },
                    {
                        name: '公司',
                        value: 'Company'
                    }
                ]],
                commonStyles,
                loading: false,
                footerStyle: {
                    ...commonStyles.footer
                },
                contentList: [],
                content: [],
                data: {
                    id: null,
                    title: null,
                    type: null,
                    code: null,
                    content: null
                },
            }
        },
        computed: {
            action() {
                return this.data.id > 0 ? '编辑' : '新增'
            },
            type() {
                if (!this.data.type) {
                    this.data.type = 'Individual'
                }
                return [this.data.type]
            },
        },
        methods: {
            check(index) {
                for (let i in this.content) {
                    this.content[i] = false
                }
                this.content[index] = true
                this.data.content = this.contentList[index]
            },
            hideSaveBtn() {
                this.footerStyle.zIndex = 0
            },
            changeType(option) {
                this.footerStyle.zIndex = 100
                for (let i = 0; i < this.typeList[0].length; i++) {
                    let item = this.typeList[0][i]
                    if (item.value == option[0]) {
                        this.data.type = item.value
                        break;
                    }
                }
                if (this.data.type == 'Individual') {
                    this.data.code = null
                }
            },
            back() {
                Util.go('MyInvoiceList')
            },
            save() {
                if (!this.data.title || this.data.title == '') {
                    this.$vux.toast.show({text: '发票抬头不能为空', type: 'text', width: '200px'})
                    return
                }
                if (this.data.type == 'Company') {
                    if (!this.data.code || this.data.code == '') {
                        this.$vux.toast.show({text: '纳税编号不能为空', type: 'text', width: '200px'})
                        return
                    }
                }
                if (!this.data.content || this.data.content == '') {
                    this.$vux.toast.show({text: '发票内容不能为空', type: 'text', width: '200px'})
                    return
                }
                this.loading = true
                API.save(this.data).then(res => {
                    this.$vux.toast.show({text: '保存成功'})
                    this.back()
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            load() {
                if (this.data.id > 0) {
                    this.loading = true
                    API.contentList().then(contentList => {
                        this.contentList = contentList
                        API.load(this.data.id).then(data => {
                            this.data = data
                            this.data.type = data.type.name
                            for (let i in this.contentList) {
                                if (this.contentList[i] == this.data.content) {
                                    this.content[i] = true
                                } else {
                                    this.content[i] = false
                                }
                            }
                            this.loading = false
                        }).catch(e => {
                            this.loading = false
                        })
                    }).catch(e => {
                        this.loading = false
                    })
                } else {
                    API.contentList().then(contentList => {
                        this.contentList = contentList
                    }).catch(e => {
                        this.loading = false
                    })
                }
            }
        },
        created() {
            this.footerStyle.padding = "20px"
            this.data.id = this.$router.currentRoute.params.id
            this.data.id = this.data.id > 0 ? this.data.id : null
        },
        mounted() {
            this.load()
        }
    }
</script>
