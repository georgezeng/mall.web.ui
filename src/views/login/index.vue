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
    <Layout style="margin: 0 auto; padding: 0;">
        <Header style="margin:0; padding: 0 10px; background-color: #DA4935; position: fixed; z-index: 100; width: 100%; color: #fff; font-size: 16pt; text-align: center;">
            <Icon type="ios-arrow-back" size="30" style="position: absolute; top: 18px; left: 10px;" @click="back"/>
            <div>登录商城</div>
        </Header>
        <Content :style="{padding: '0', backgroundColor: '#fff'}">
            <Tabs ref="tabs" style="margin-top: 100px;" value="password">
                <TabPane label="密码登录" name="password">
                    <UsernamePasswordPanel/>
                </TabPane>
                <TabPane label="验证码登录" name="verify">
                    <PhoneVerifyPanel/>
                </TabPane>
            </Tabs>
        </Content>
        <Footer style="width: 100%; position: absolute; bottom: 50px; background-color: #fff">
            <div style="margin-bottom: 20px;" align="center">
                <div class="gradient"></div>
                <div style="display: inline-block; color: gray; width: 30%; text-align: center;">快捷登录</div>
                <div class="gradient"></div>
            </div>
            <Button icon="ios-chatbubbles" size="large" :loading="loading" long type="success" @click="goWechatLogin">
                微信登录
            </Button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/login.js'
    import UsernamePasswordPanel from './username-password'
    import PhoneVerifyPanel from './phone-verify'

    export default {
        components: {
            UsernamePasswordPanel,
            PhoneVerifyPanel
        },
        data() {
            return {
                loading: false
            }
        },
        methods: {
            back() {
                this.$router.push({
                    name: 'Home'
                })
            },
            goWechatLogin() {
                this.loading = true
                API.loginToken().then(token => {
                    this.loading = false
                    window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?' +
                        'appid=wx137a61306b396b25' +
                        '&redirect_uri=https%3a%2f%2fdobaishop.com%2f%23%2fWechatLogin' +
                        '&response_type=code&scope=snsapi_login&state=' + token + '#wechat_redirect'
                }).catch(e => {
                    this.loading = false

                });
            }
        },
    }
</script>
