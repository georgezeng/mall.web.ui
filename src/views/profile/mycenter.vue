<style lang="less">
    .info {
        background-color: #E26143;
        width: 100%;
        height: 80px;
        position: relative;
        color: #fff;
        padding: 0;
        .avatar {
            margin: 10px;
            position: relative;
            top: 10px;
        }
        .nickname {
            font-size: 12pt;
            margin-right: 5px;
        }
        .level {
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.2);
            padding: 5px 8px;
            font-size: 6pt;
        }
        .tip {
            font-size: 10pt;
            position: absolute;
            top: 45px;
            left: 65px;
        }
        .goArrow {
            position: absolute;
            top: 25px;
            right: 7px;
        }
    }

    .finance {
        .gradient {
            display: inline-block;
            position: relative;
            top: 5px;
            height: 80px;
            width: 2px;
            background: radial-gradient(gray 5%, white 80%);
        }

        .numberBlock {
            width: 48%;
            display: inline-block;
            padding: 0;
            position: relative;
            top: -10px;
            .number {
                font-size: 16pt;
                color: #2D7AF6;
                margin-bottom: 10px;
            }
            .title {
                font-size: 10pt;
                color: #9B9B9B;
            }
        }
    }

    .blockLine {
        height: 10px;
        background-color: #F5F5F5;
    }

    .orderPanel {
        .title-line {
            margin: 15px 10px 20px;
            .more {
                float: right;
                font-size: 10pt;
            }
        }
        .box {
            display: inline-block;
            width: 30%;
            margin-bottom: 10px;
            .title {
                font-size: 10pt;
                color: #9B9B9B;
            }
        }
    }

    .optionPanel {
        font-size: 11pt;
        padding: 10px;
        position: relative;
        .img {
            position: relative;
            top: 5px;
        }
        .goArrow {
            position: absolute;
            top: 15px;
            right: 7px;
            color: #414141;
        }
    }

    .blockLine2 {
        height: 2px;
        background-color: #F5F5F5;
        margin-left: 10px;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header :style="commonStyles.tideHeader">
            <div>我的</div>
            <Icon size="24" style="right: 10px; position: absolute; top: 10px;"
                  type="md-notifications-outline"/>
        </Header>
        <div style="height: 40px;"></div>
        <Content :style="commonStyles.content">
            <div class="info">
                <Avatar size="large" class="avatar" :src="avatar"/>
                <span class="nickname">{{nickname}}</span>
                <span class="level">普通会员</span>
                <div class="tip">点击查看或编辑个人信息</div>
                <Icon type="ios-arrow-forward" size="30" class="goArrow"/>
            </div>
            <div class="finance">
                <div align="center" class="numberBlock">
                    <div class="number">￥0.00</div>
                    <div class="title">余额</div>
                </div>
                <div class="gradient"></div>
                <div align="center" class="numberBlock">
                    <div class="number">0</div>
                    <div class="title">优惠券</div>
                </div>
            </div>
            <div class="blockLine"></div>
            <div class="orderPanel">
                <div class="title-line">
                    <span style="font-weight: bold;">我的订单</span>
                    <span class="more">查看全部 &gt;</span>
                </div>
                <div align="center">
                    <div class="box">
                        <div class="img"><img :src="dfk" width="40" height="40"/></div>
                        <div class="title">代付款</div>
                    </div>
                    <div class="box">
                        <div class="img"><img :src="dsh" width="40" height="40"/></div>
                        <div class="title">代收货</div>
                    </div>
                    <div class="box">
                        <div class="img"><img :src="done" width="40" height="40"/></div>
                        <div class="title">已完成</div>
                    </div>
                </div>
            </div>
            <div class="blockLine"></div>
            <div class="optionPanel">
                <img :src="invite" width="24" height="24" class="img"/> 邀请好友
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel">
                <img :src="setting" width="24" height="24" class="img"/> 设置
                <Icon type="ios-arrow-forward" size="20" class="goArrow"/>
            </div>
        </Content>
        <Footer selection="mine" :style="commonStyles.footer"/>
    </Layout>
</template>
<script>
    import config from '../../config/index.js'
    import {Message} from 'iview'
    import Footer from '../footer'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'
    import dfk from '../../images/daifukuan.png'
    import dsh from '../../images/daishouhuo.png'
    import done from '../../images/done.png'
    import setting from '../../images/setting.png'
    import invite from '../../images/invite.png'

    export default {
        components: {
            Footer
        },
        data() {
            return {
                dfk,
                dsh,
                done,
                setting,
                invite,
                defaultAvatar,
                commonStyles,
                info: {
                    avatar: null,
                    nickname: null
                }
            }
        },
        computed: {
            avatar() {
                return this.info.avatar ?
                    (this.info.avatar.indexOf('http') > -1 ?
                        this.info.avatar
                        : config.baseUrl + '/' + this.info.avatar)
                    : defaultAvatar
            },
            nickname() {
                return this.info.nickname ? this.info.nickname : '未设置昵称'
            }
        },
        methods: {
            test() {
            }
        },
    }
</script>
