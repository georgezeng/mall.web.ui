<template>
    <Layout :style="commonStyles.layout">
        <Header :style="commonStyles.header">
            <Icon type="ios-arrow-back" size="30" :style="commonStyles.backArrow" @click="back"/>
            <div>404</div>
        </Header>
        <Content :style="contentStyle">
            <div align="center">
                <img :src="notFound" style="margin: 100px auto;"/>
            </div>
        </Content>
        <Footer :style="commonStyles.footer"/>
    </Layout>

</template>
<script>
    import Footer from './footer'
    import commonStyles from '../styles/common.js'
    import notFound from '../images/404.png'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                notFound,
                commonStyles
            }
        },
        methods: {
            back() {
                window.history.go(-1)
            }
        },
        computed: {
            contentStyle() {
                let content = commonStyles.content
                content.backgroundColor = '#FAFAFA'
                return content
            }
        }
    }
</script>
