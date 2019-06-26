<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        box-shadow: 0px 0px 3px -1px gray;
        position: fixed;
        width: 100%;
        z-index: 100;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">设置</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
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
                Util.go('MyAddressList', {
                    fromOrderPreview: false
                })
            },
            goAbout() {
                Util.go('AboutUs')
            },
        },
    }
</script>
