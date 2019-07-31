<style scoped lang="less">
    .header {
        background-color: #F1CA6F;
        height: 60px;
        box-shadow: 0px 0px 3px -1px gray;
        position: fixed;
        width: 100%;
        z-index: 100;
        color: #fff;
    }

    .bg {
        background-image: url("../../images/share-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
    }

    .share-btn {
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url("../../images/share-btn.png");
        position: absolute;
        bottom: 0px;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">我的邀请</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <div v-if="popup" :style="popupStyle" style="position: absolute; top: 50px; z-index: 10000000;">
                <img crossorigin="use-credentials" :src="popupImgSrc" :width="popupImgWidth" :height="popupImgHeight"/>
            </div>
            <Modal v-model="popup" footer-hide fullscreen>
            </Modal>
            <div class="bg" :style="bgStyle">
                <div @click="showPoster" class="share-btn" :style="btnStyle"></div>
            </div>
            <div align="center">
                <div style="width: 100px; text-align: center; padding: 10px; border-bottom: 3px solid lightgray; margin-bottom: 40px;">
                    分享动态
                </div>
            </div>
            <div v-for="item in list" :key="item.id">
                <div style="margin-top: 20px;"></div>
                <mt-cell style="border-bottom: 1px solid #F5F5F5;">
                    <div slot="title">
                        <div style="display: inline-block; margin-right: 10px;">
                            <Avatar style="position: relative; top: -10px;" size="large" :src="avatar(item.avatar)"/>
                        </div>
                        <div style="display: inline-block;">
                            <div style="margin-bottom: 5px;">{{item.nickname}}</div>
                            <div>{{item.username}}</div>
                        </div>
                    </div>
                    <div>{{item.createTime}}</div>
                </mt-cell>
            </div>
            <load-more v-if="showLoading" tip="正在加载"></load-more>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../api/invite.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'
    import defaultAvatar from '../../images/avatar.png'

    export default {
        components: {},
        data() {
            return {
                config,
                commonStyles,
                bgStyle: null,
                btnStyle: null,
                page: {
                    num: 1,
                    size: 10,
                    order: 'DESC',
                    property: 'createTime'
                },
                list: [],
                allLoaded: false,
                loadingList: false,
                showLoading: false,
                popup: false,
                popupImgSrc: null,
                popupImgWidth: 0,
                popupImgHeight: 0,
                popupStyle: null
            }
        },
        computed: {},
        methods: {
            showPoster() {
                this.popupImgSrc = config.baseUrl + '/client/poster.png?d=' + new Date().getTime()
                this.popup = true
            },
            back() {
                Util.go('MyCenter')
            },
            avatar(avatar) {
                return avatar ?
                    (avatar.startsWith('http') ?
                        avatar
                        : config.publicBucketDomain + avatar)
                    : defaultAvatar
            },
            load() {
                if (this.allLoaded) {
                    this.showLoading = false
                    return
                }
                if (this.loadingList) {
                    return
                }
                this.loadingList = true
                API.list(this.page).then(data => {
                    this.loadingList = false
                    if (data && data.length > 0) {
                        this.page.num++
                        for (let i in data) {
                            this.list.push(data[i])
                        }
                        if (data.length < this.page.size) {
                            this.allLoaded = true
                            this.showLoading = false
                        }
                    } else {
                        this.allLoaded = true
                        this.showLoading = false
                    }
                })
            }
        },
        mounted() {
            this.load()
            this.bgStyle = {
                width: document.documentElement.clientWidth + 'px',
                height: document.documentElement.clientWidth * 786 / 1125 + 'px'
            }
            this.btnStyle = {
                width: document.documentElement.clientWidth * 0.8 + 'px',
                height: document.documentElement.clientWidth * 0.8 * 192 / 885 + 'px',
                left: document.documentElement.clientWidth * 0.1 + 'px'
            }
            this.popupImgWidth = document.documentElement.clientWidth * 0.8
            this.popupImgHeight = document.documentElement.clientWidth * 0.8 * 1497 / 984
            this.popupStyle = {
                left: document.documentElement.clientWidth * 0.1 + 'px'
            }
        }
    }
</script>
