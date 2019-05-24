<style>
    .gradient {
        display: inline-block;
        margin: 0 auto;
        height: 2px;
        width: 30%;
        background: radial-gradient(gray 10%, white 80%);
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="commonStyles.header">
            <Icon type="ios-arrow-back" size="30" :style="commonStyles.backArrow" @click="back"/>
            <div>登录商城</div>
        </Header>
        <Content :style="commonStyles.content">
            <Tabs ref="tabs" style="margin-top: 100px;" value="password">
                <TabPane label="密码登录" name="password">
                    <UsernamePasswordPanel/>
                </TabPane>
                <TabPane label="验证码登录" name="verify">
                    <PhoneVerifyPanel/>
                </TabPane>
            </Tabs>

            <div style="padding: 0 20px;">
                <div style="margin-bottom: 20px;" align="center">
                    <div class="gradient"></div>
                    <div style="display: inline-block; color: gray; width: 30%; text-align: center;">快捷登录</div>
                    <div class="gradient"></div>
                </div>
                <Button icon="ios-chatbubbles" size="large" :loading="loading" long type="success" @click="goWechatLogin">
                    微信登录
                </Button>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import WechatAPI from '../../api/wechat.js'
    import commonStyles from '../../styles/common.js'
    import UsernamePasswordPanel from './username-password'
    import PhoneVerifyPanel from './phone-verify'

    export default {
        components: {
            UsernamePasswordPanel,
            PhoneVerifyPanel
        },
        data() {
            return {
                commonStyles,
                loading: false
            }
        },
        methods: {
            back() {
                this.$router.push({
                    name: 'MyCenter'
                })
            },
            goWechatLogin() {
                this.loading = true
                WechatAPI.loginUrl().then(url => {
                    this.loading = false
                    window.location.href = url
                }).catch(e => {
                    this.loading = false
                });
            }
        },
    }
</script>
