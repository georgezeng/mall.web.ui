<style scoped lang="less">

    .backArrow {
        left: 10px;
        position: absolute;
        top: 20px;
        color: #fff;
    }


</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="headerStyle">
            <Icon ref="backIcon" size="24" class="backArrow" type="ios-arrow-back" @click="back"/>
            <div align="center" style="color: #fff;">{{data.title}}</div>
        </Header>
        <Content :style="contentStyle">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div ref="htmlContent" v-html="data.content" style="margin-bottom: 40px;"></div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/merchant.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import UrlParams from 'get-url-param'

    export default {
        components: {},
        data() {
            return {
                config,
                commonStyles,
                headerStyle: {
                    ...commonStyles.header
                },
                contentStyle: {
                    ...commonStyles.content
                },
                showSpin: true,
                data: {
                    title: null,
                    content: null
                }
            }
        },
        computed: {},
        methods: {
            back() {
                const nav = Util.getForNav()
                if (nav.from == 'Login') {
                    Util.goLogin()
                } else {
                    Util.go(nav.from, nav)
                }
            },
            load() {
                API.searchArticle(this.data.title).then(data => {
                    if (data) {
                        this.data = data
                    }
                    this.showSpin = false
                }).catch(e => {
                    this.showSpin = false
                })
            },
        },
        created() {
            this.data.title = this.$router.currentRoute.params.key
            this.contentStyle.backgroundColor = '#fff'
            this.contentStyle.marginTop = '60px'
            this.contentStyle.minHeight = (document.documentElement.clientHeight - 60) + 'px'
            this.load()
        }
    }
</script>
