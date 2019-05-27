<style scoped lang="less">
    .blockLine {
        height: 10px;
        background-color: #F5F5F5;
    }

    .blockLine2 {
        height: 2px;
        background-color: #F5F5F5;
    }

    .optionPanel {
        font-size: 11pt;
        padding: 20px 10px;
        position: relative;
        .goArrow {
            position: absolute;
            top: 20px;
            right: 7px;
            color: #414141;
        }
    }
</style>
<template>
    <!--<Layout :style="commonStyles.layout">-->
        <!--<Header style="background-color: #fff; height: 60px;">-->
            <!--<Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>-->
            <!--<div align="center" style="position: relative; top: 0px;">个人信息</div>-->
        <!--</Header>-->
        <!--<Content :style="commonStyles.content">-->
            <!--<div class="blockLine"></div>-->
            <!--<div class="optionPanel" @click="editAvatar">-->
                <!--<span>头像</span>-->
                <!--<Avatar ref="avatar" size="large" style="position: absolute; right: 30px; top: 10px;" :src="avatar"/>-->
                <!--<Icon type="ios-arrow-forward" size="20" class="goArrow"/>-->
            <!--</div>-->
            <!--<div class="blockLine2"></div>-->
            <!--<div class="optionPanel">-->
                <!--<span>账号</span>-->
                <!--<span style="position: absolute; right: 30px; top: 20px;">{{info.username}}</span>-->
            <!--</div>-->
            <!--<div class="blockLine2"></div>-->
            <!--<div class="optionPanel" @click="editNickname">-->
                <!--<span>昵称</span>-->
                <!--<span style="position: absolute; right: 30px; top: 20px;">{{info.nickname}}</span>-->
                <!--<Icon type="ios-arrow-forward" size="20" class="goArrow"/>-->
            <!--</div>-->
            <!--<div class="blockLine2"></div>-->
            <!--<div class="optionPanel" id="sex">-->
                <!--<span>性别</span>-->
                <!--<span style="position: absolute; right: 30px; top: 20px;">{{sex}}</span>-->
                <!--<Icon type="ios-arrow-forward" size="20" class="goArrow"/>-->
            <!--</div>-->
            <!--<div class="blockLine2"></div>-->
            <!--<div class="optionPanel" @click="editBirthday">-->
                <!--<span>生日</span>-->
                <!--<span style="position: absolute; right: 30px; top: 20px;">{{info.birthday}}</span>-->
                <!--<Icon type="ios-arrow-forward" size="20" class="goArrow"/>-->
            <!--</div>-->
        <!--</Content>-->
        <!--<Footer :style="commonStyles.footer"/>-->
    <!--</Layout>-->
    <div>test</div>
</template>
<script>
    import API from '../../api/profile.js'
    import WechatAPI from '../../api/wechat.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import {Message} from 'iview'
    import Footer from '../footer'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'
    import wx from 'weixin-js-sdk'
    import MobileSelect from 'mobile-select'

    export default {
        components: {
        },
        data() {
            return {
            }
        },
        computed: {
        },
        methods: {
        },
        mounted() {
        }
    }
</script>
