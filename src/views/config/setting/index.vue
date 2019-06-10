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
            <mt-cell title="标题文字" is-link value="带链接"></mt-cell>
            <group>
                <cell class="optionalLine optionalCell" is-link title="账号安全" @click.native="goSecurity" />
                <cell class="optionalLine optionalCell" is-link title="实名认证" @click.native="goIdentity" />
                <cell class="optionalLine optionalCell" is-link title="收货地址" @click.native="goAddress" />
                <cell class="optionalLine optionalCell" is-link title="关于我们" @click.native="goAbout" />
            </group>
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
            goIdentity() {
                Util.go('MyIdentity')
            },
            goAddress() {
                Util.go('MyAddressList')
            },
            goAbout() {
                Util.go('AboutUs')
            },
        },
    }
</script>
