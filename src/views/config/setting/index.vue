<style scoped lang="less">
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header style="background-color: #fff; height: 60px;">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">设置</div>
        </Header>
        <Content :style="commonStyles.content">
            <div class="blockLine"></div>
            <div class="optionPanel" @click="goSecurity">
                <span>账号安全</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="goIdentify">
                <span>实名认证</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="goAddress">
                <span>收货地址</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="goAbout">
                <span>关于我们</span>
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../../api/profile.js'
    import WechatAPI from '../../../api/wechat.js'
    import config from '../../../config/index.js'
    import Util from '../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../styles/common.js'
    import defaultAvatar from '../../../images/avatar.png'
    import wx from 'weixin-js-sdk'

    export default {
        components: {},
        data() {
            return {
                commonStyles,
            }
        },
        computed: {
            isWechat() {
                return Util.isInWechat()
            }
        },
        methods: {
            back() {
                Util.go('MyCenter')
            },
            goSecurity() {
                Util.go('MySecurity')
            },
            goIdentify() {
                Util.go('MyIdentity')
            },
            goAddress() {
                Util.go('MyAddress')
            },
            goAbout() {
                Util.go('AboutUs')
            },
        },
    }
</script>
