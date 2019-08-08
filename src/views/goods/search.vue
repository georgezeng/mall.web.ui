<style scoped lang="less">
    .searchInput {
        position: relative;
        top: 0px;
        right: -10px;
    }

    .backArrow {
        left: 10px;
        position: absolute;
        top: 24px;
        color: #fff;
    }

    .key {
        background-color: gray;
        color: #fff;
        padding: 5px 15px;
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
            <Input size="large" v-model="key" ref="searchInput" class="searchInput"
                   clearable
                   :style="{width: searchInputWidth + 'px'}" search
                   @on-keyup.13="goItemList(null)"
                   placeholder="搜索商品"/>
        </Header>
        <Content :style="contentStyle">
            <div style="padding: 30px 10px 10px;">
                历史记录
                <Icon @click="clear" style="float:right;" size="24" type="md-trash" />
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
                keys: []
            }
        },
        computed: {},
        methods: {
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
                    if (!found) {
                        key = this.key
                        history.keys.push(key)
                        Util.putJson('SearchHistory', history)
                    }
                }
                Util.go('GoodsItemList', {
                    id: 0,
                    key
                })
            }
        },
        mounted() {
            this.searchInputWidth = document.documentElement.clientWidth - this.$refs.backIcon.$el.getBoundingClientRect().left - 50
            this.contentStyle.backgroundColor = '#fff'
            this.contentStyle.marginTop = '60px'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 60) + "px"
            setTimeout(() => {
                this.$nextTick(() => {
                    this.$refs.searchInput.$el.children[2].focus();
                })
            }, 10)
            this.load()
        }
    }
</script>
