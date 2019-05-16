<template>
    <Layout style="margin: 0 auto; padding: 0;">
        <Content :style="{padding: '0', backgroundColor: '#fff'}">
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
            goHome() {

            },
            goCategory() {

            },
            goCart() {

            },
            goProfile() {

            }
        }
    }
</script>
