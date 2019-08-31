<style scoped lang="less">
    .search {
        text-align: left;
        background-color: #f5f5f5;
        height: 33px;
        border-radius: 20px;
        display: inline-block;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        margin-left: 20px;
        border: 1px solid #dcdee2;
    }

    .searchInput {
        border: none;
        width: 85%;
        background-color: #f5f5f5;
        outline: none;
        border-radius: 20px;
    }

    .backArrow {
        left: 10px;
        position: absolute;
        top: 24px;
        color: #5C6677;
    }

    .key {
        background-color: gray;
        color: #fff;
        padding: 5px 15px;
        margin-bottom: 10px;
        display: inline-block;
        margin-right: 10px;
        border-radius: 10px;
        font-size: 14px;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <form action="" @submit.prevent="">
                <div :style="{width: searchInputWidth + 'px'}" class="search">
                    <Icon style="color: gray;" type="ios-search"/>
                    <input @keyup="show=true" @keyup.13="goItemList()" type="search" ref="searchInput"
                           class="searchInput" v-model="key" placeholder="搜索商品"/>
                    <Icon v-show="show" @click="reset" style="color: gray;" size="20" type="ios-close"/>
                </div>
            </form>
        </Header>
        <Content :style="contentStyle">
            <div style="padding: 30px 10px 10px;">
                历史记录
                <Icon @click="clear" style="float:right;" size="24" type="md-trash"/>
            </div>
            <div style="padding: 10px;">
                <div @click="goItemList(item)" class="key" v-for="(item, index) in keys" :key="index">
                    {{item}}
                </div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import $ from 'jquery'

    export default {
        components: {},
        data() {
            return {
                commonStyles,
                headerStyle: {
                    ...commonStyles.header
                },
                contentStyle: {
                    ...commonStyles.content
                },
                key: null,
                searchInputWidth: 0,
                keys: [],
                show: false
            }
        },
        computed: {},
        methods: {
            reset() {
                this.key = null
                this.show = false
            },
            clear() {
                Util.putJson('SearchHistory', null)
                this.keys = []
            },
            load() {
                const history = Util.getJson('SearchHistory')
                if (history) {
                    this.keys = history.keys
                }
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            goItemList(key) {
                if (!key) {
                    let history = Util.getJson('SearchHistory')
                    if (!history) {
                        history = {
                            keys: []
                        }
                    }
                    let found = false
                    for (let i in history.keys) {
                        if (history.keys[i] == this.key) {
                            found = true
                            break
                        }
                    }
                    if (this.key != null && this.key != '' && !found) {
                        history.keys.push(this.key)
                        Util.putJson('SearchHistory', history)
                    }
                    key = this.key
                }
                if (!key || key == '') {
                    return
                }
                Util.getForNav()
                Util.go('GoodsItemList', {
                    id: 0,
                    type: 'category',
                    key
                })
            }
        },
        mounted() {
            this.searchInputWidth = document.documentElement.clientWidth - this.$refs.backIcon.$el.getBoundingClientRect().left - 60
            this.contentStyle.backgroundColor = '#fff'
            this.headerStyle.backgroundColor = '#fff'
            this.contentStyle.marginTop = '60px'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 60) + "px"
            const input = this.$refs.searchInput
            $(input).change(() => {
                $(this).focus()
            })
            this.$nextTick(() => {
                input.focus()
            })
            this.load()
        }
    }
</script>
