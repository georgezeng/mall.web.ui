<style scoped lang="less">
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header style="background-color: #fff; height: 60px;">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">实名认证</div>
        </Header>
        <Content v-if="showEdit" :style="commonStyles.content">
            <div class="blockLine"></div>
            <div class="optionPanel" @click="editPassword">
                <span>真实姓名</span>
                <Input size="large" placeholder="申请人真实姓名" style="width: 80%;" />
            </div>
            <div class="blockLine2"></div>
            <div class="optionPanel" @click="resetPassword">
                <span>身份证号</span>
                <Input size="large" placeholder="申请人身份证号" style="width: 80%;"  />
            </div>
            <div style="background-color: #F5F5F5; padding: 10px;">
                请上传你的身份证原件，确保照片清晰，四角完整
            </div>
            <div style="margin: 20px 0;" align="center">
                <img :src="faceIdentity" width="300" height="182" />
            </div>
            <div style="margin: 20px 0;" align="center">
                <img :src="badgeIdentity" width="300" height="182" />
            </div>
            <div style="margin: 20px 0;" align="center">
                <img :src="peopleIdentity" width="300" height="182" />
            </div>
            <div style="margin: 20px;" align="center">
                <Button size="large" :loading="loading" long type="primary" @click="save">确认提交</Button>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../../../api/identity.js'
    import config from '../../../../config/index.js'
    import defaultBadgeIdentity from '../../../../images/badgeIdentity.png'
    import defaultFaceIdentity from '../../../../images/faceIdentity.png'
    import defaultPeopleIdentity from '../../../../images/peopleIdentity.png'
    import Util from '../../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                defaultBadgeIdentity,
                defaultFaceIdentity,
                defaultPeopleIdentity,
                commonStyles,
                loading: false,
                showEdit: false,
                data: {
                    name: null,
                    number: null,
                    facePhoto: null,
                    badgePhoto: null,
                    peoplePhoto: null
                }
            }
        },
        computed: {
            isWechat() {
                return Util.isInWechat()
            },
            badgeIdentity() {
                return this.data.badgePhoto ? this.data.badgePhoto : this.defaultBadgeIdentity
            },
            faceIdentity() {
                return this.data.facePhoto ? this.data.facePhoto : this.defaultFaceIdentity
            },
            peopleIdentity() {
                return this.data.peoplePhoto ? this.data.peoplePhoto : this.defaultPeopleIdentity
            }
        },
        methods: {
            save() {
                if(!this.data.name) {
                    Message.error('真实姓名不能为空')
                    return
                }
                if(!this.data.number) {
                    Message.error('身份证号不能为空')
                    return
                }
                if(!this.data.facePhoto || !this.data.badgePhoto || !this.data.peoplePhoto) {
                    Message.error('请上传身份证照片')
                    return
                }
                this.loading = true
                API.save(this.data).then(res => {
                    window.location.reload(true)
                }).catch(e => {
                    this.loading = false
                })
            },
            load() {
                this.loading = true
                API.load().then(data => {
                    if(data) {
                        this.data = data
                        this.showEdit = false
                    } else {
                        this.showEdit = true
                    }
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            back() {
                Util.go('MySetting')
            },
            uploadFaceIdentity() {
                Util.uploadImageFromWechat('identity/face.png', (url) => {
                    this.data.facePhoto = config.baseUrl + '/' + url
                })
            },
            uploadBadgeIdentity() {
                Util.uploadImageFromWechat('identity/badge.png', (url) => {
                    this.data.badgePhoto = config.baseUrl + '/' + url
                })
            },
            uploadPeopleIdentity() {
                Util.uploadImageFromWechat('identity/people.png', (url) => {
                    this.data.peoplePhoto = config.baseUrl + '/' + url
                })
            }
        },
        mounted() {
            this.load()
            if (this.isWechat) {
                Util.wxConfig([
                    'chooseImage',
                    'uploadImage'
                ])
            }
        }
    }
</script>
