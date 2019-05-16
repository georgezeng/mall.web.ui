<template>
    <Layout style="margin: 0 auto; padding: 0;">
        <Header style="background-color: #DA4935; position: fixed; z-index: 100; width: 100%;">
            <Input search placeholder="搜索商品"/>
        </Header>
        <Content :style="{padding: '64px 0 0 0', backgroundColor: '#fff'}">
            <router-view/>
        </Content>
        <Footer />
    </Layout>
</template>
<script>
    import Footer from './footer'
    export default {
        components: {
          Footer
        },
        data() {
            return {

            }
        },
        methods: {
        }
    }
</script>
