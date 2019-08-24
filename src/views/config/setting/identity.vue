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
            <div align="center" style="position: relative; top: 0px;">实名认证</div>
        </Header>
        <Content v-if="isInit" :style="commonStyles.content" style="margin-top: 40px;">
            <form style="display: none;" ref="uploadform" method="POST" enctype="multipart/form-data">
                <input ref="uploadFile" type="file" accept='image/*' name="file" @change="fileChange"/>
            </form>
            <group>
                <x-input class="optionalLine" title="真实姓名" v-model="data.name" placeholder="申请人真实姓名"></x-input>
                <x-input class="optionalLine" title="身份证号" v-model="data.number" placeholder="申请人身份证号"></x-input>
            </group>
            <div style="background-color: #F5F5F5; padding: 10px;">
                请上传您的身份证原件，确保照片清晰，四角完整
            </div>
            <div style="margin: 20px 0;" align="center">
                <img :src="faceIdentity" crossorigin="use-credentials" width="300" height="182" @click="uploadFaceIdentity"/>
            </div>
            <div style="margin: 20px 0;" align="center">
                <img :src="badgeIdentity" crossorigin="use-credentials" width="300" height="182" @click="uploadBadgeIdentity"/>
            </div>
            <div style="margin: 20px 0;" align="center">
                <img :src="peopleIdentity" crossorigin="use-credentials" width="300" height="182" @click="uploadPeopleIdentity"/>
            </div>
            <div style="margin: 20px;" align="center">
                <x-button action-type="button" :disabled="loading" style="width: 100%; background-color: #008CEB;"
                          :show-loading="loading" @click.native="save">
                    <span style="font-size: 11pt; color: #fff;">确认提交</span>
                </x-button>
            </div>
        </Content>
        <Content v-if="isChecking" :style="commonStyles.content">
            <div class="blockLine"></div>
            <div style="margin: 20px;" align="center">
                <Icon size="50" style="color: #4090F7;" type="ios-information-circle-outline"/>
                <div>上传完成，请等待审核</div>
                <div style="font-size: 11px; color: #9BA5B7;">身份认证信息已上传完成，我们会在1-3个工作日完成审核，请等待审核结果</div>
            </div>
        </Content>
        <Content v-if="isUnPassed" :style="commonStyles.content">
            <div class="blockLine"></div>
            <div style="margin: 20px;" align="center">
                <Icon size="50" style="color: #E23C39;" type="ios-close-circle-outline"/>
                <div>实名认证失败</div>
                <div style="font-size: 11px; color: #9BA5B7;">{{data.reason}}</div>
            </div>
            <div style="padding: 20px;">
                <x-button action-type="button" :disabled="loading" style="width: 100%; background-color: #008CEB;"
                          :show-loading="loading" @click.native="reset">
                    <span style="font-size: 11pt; color: #fff;">重新认证</span>
                </x-button>
            </div>
        </Content>
        <Content v-if="isPassed" :style="commonStyles.content">
            <div class="blockLine"></div>
            <div style="margin: 20px;" align="center">
                <Icon size="50" style="color: #72C040;" type="ios-checkmark-circle-outline"/>
                <div>实名认证审核通过</div>
                <div style="font-size: 11px; color: #9BA5B7;">您的实名认证审核已通过，恭喜您获得更多权限</div>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import API from '../../../api/identity.js'
    import config from '../../../config/index.js'
    import defaultBadgeIdentity from '../../../images/badgeIdentity.png'
    import defaultFaceIdentity from '../../../images/faceIdentity.png'
    import defaultPeopleIdentity from '../../../images/peopleIdentity.png'
    import Util from '../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                config,
                defaultBadgeIdentity,
                defaultFaceIdentity,
                defaultPeopleIdentity,
                commonStyles,
                loading: false,
                data: {
                    name: null,
                    number: null,
                    status: null,
                    facePhoto: null,
                    badgePhoto: null,
                    peoplePhoto: null,
                    reason: null
                },
                uploadMethod: ''
            }
        },
        computed: {
            isWechat() {
                return Util.isInWechat()
            },
            badgeIdentity() {
                return this.data.badgePhoto ? config.baseUrl + '/client/img/load?filePath=' + this.data.badgePhoto : this.defaultBadgeIdentity
            },
            faceIdentity() {
                return this.data.facePhoto ? config.baseUrl + '/client/img/load?filePath=' + this.data.facePhoto : this.defaultFaceIdentity
            },
            peopleIdentity() {
                return this.data.peoplePhoto ? config.baseUrl + '/client/img/load?filePath=' + this.data.peoplePhoto : this.defaultPeopleIdentity
            },
            isInit() {
                return !this.data || !this.data.status
            },
            isChecking() {
                return this.data.status && this.data.status.name == 'Checking'
            },
            isPassed() {
                return this.data.status && this.data.status.name == 'Passed'
            },
            isUnPassed() {
                return this.data.status && this.data.status.name == 'UnPassed'
            }
        },
        methods: {
            fileChange() {
                const formData = new FormData(this.$refs.uploadform)
                formData.append('file', this.$refs.uploadFile)
                this.$vux.loading.show({
                    text: '上传中...'
                })
                API.uploadIdentityImg(formData).then(filePath => {
                    switch(this.uploadMethod) {
                        case 'Face': this.data.facePhoto = filePath; break
                        case 'Badge': this.data.badgePhoto = filePath; break
                        case 'People': this.data.peoplePhoto = filePath; break
                    }
                    this.$vux.toast.show({text: '上传成功', type: 'success'})
                    this.$vux.loading.hide()
                }).catch(e => {
                    this.$vux.loading.hide()
                })
            },
            save() {
                if (!this.data.name) {
                    this.$vux.toast.show({text: '真实姓名不能为空', type: 'text', width: '200px'})
                    return
                }
                if (!this.data.number) {
                    this.$vux.toast.show({text: '身份证号不能为空', type: 'text', width: '200px'})
                    return
                }
                if (!this.data.facePhoto || !this.data.badgePhoto || !this.data.peoplePhoto) {
                    this.$vux.toast.show({text: '请上传身份证照片', type: 'text', width: '200px'})
                    return
                }
                this.$vux.loading.show({
                    text: '加载中...'
                })
                this.loading = true
                API.save(this.data).then(res => {
                    this.$vux.toast.show({text: '保存成功'})
                    this.loading = false
                    this.$vux.loading.hide()
                }).catch(e => {
                    this.loading = false
                    this.$vux.loading.hide()
                })
            },
            reset() {
              this.data = {
                  name: null,
                  number: null,
                  status: null,
                  facePhoto: null,
                  badgePhoto: null,
                  peoplePhoto: null,
                  reason: null
              }
            },
            load() {
                this.loading = true
                API.load().then(data => {
                    if (data) {
                        this.data = data
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
                // Util.uploadImageFromWechat('identity/face.png', (url) => {
                //     this.data.facePhoto = url
                // })
                this.uploadMethod = 'Face'
                this.$refs.uploadFile.click()
            },
            uploadBadgeIdentity() {
                // Util.uploadImageFromWechat('identity/badge.png', (url) => {
                //     this.data.badgePhoto = url
                // })
                this.uploadMethod = 'Badge'
                this.$refs.uploadFile.click()
            },
            uploadPeopleIdentity() {
                // Util.uploadImageFromWechat('identity/people.png', (url) => {
                //     this.data.peoplePhoto = url
                // })
                this.uploadMethod = 'People'
                this.$refs.uploadFile.click()
            }
        },
        mounted() {
            this.load()
            // if (this.isWechat) {
            //     Util.wxConfig([
            //         'chooseImage',
            //         'uploadImage'
            //     ])
            // }
        }
    }
</script>
