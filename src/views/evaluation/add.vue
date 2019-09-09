<style scoped lang="less">

    .header {
        background-color: #fff;
        height: 60px;
        position: fixed;
        top: 0px;
        z-index: 100000;
        width: 100%;
        box-shadow: 0px 0px 3px -1px gray;
        padding: 0 10px;
    }

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px; z-index: 100;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">{{title}}</div>
        </Header>
        <Content :style="contentStyle" style="margin-top: 60px;">
            <div v-if="popup" :style="modalStyle" style="position: absolute; z-index: 10000000;">
                <swiper :aspect-ratio="1" auto loop :show-dots="false">
                    <swiper-item v-for="(url, index) in popupImgs" :key="index">
                        <img :src="config.publicBucketDomain + url" :width="popupImgWidth" :height="popupImgWidth">
                    </swiper-item>
                </swiper>
            </div>
            <Modal v-model="popup" footer-hide fullscreen>
            </Modal>
            <div style="padding: 10px; margin-bottom: 10px; background-color: #fff; position: relative;">
                <img :src="form.itemThumbnail ? config.publicBucketDomain + form.itemThumbnail : ''" width="72" height="72">
                <div style="display: inline-block; margin-left: 10px; position: relative; top: -25px;">
                    <div style="color: #505A6D; font-size: 11pt; margin-bottom: 5px;">
                        商品评分等级
                    </div>
                    <div style="background-color: #f5f5f5; display: inline-block; padding: 5px; font-size: 12px; color: gray; margin-bottom: 5px;">
                        <RadioGroup size="large" v-model="form.value">
                            <Radio :disabled="isAdditional" label="Bad">
                                <span style="position: relative; left: -3px;">差评</span>
                            </Radio>
                            <Radio :disabled="isAdditional" label="Neutrality">
                                <span style="position: relative; left: -3px;">中评</span>
                            </Radio>
                            <Radio :disabled="isAdditional" label="Good">
                                <span style="position: relative; left: -3px;">好评</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div v-if="!isAdditional" style="position: absolute; bottom: 10px; right: 10px;">
                    <check-icon style="position: relative; left: 5px;" :value.sync="form.anonymous"></check-icon>
                    匿名评价
                </div>
                <div style="margin-bottom: 10px;" class="clearfix"></div>
            </div>
            <div style="background-color: #fff; padding: 10px;">
                <div>
                    <div>评价内容</div>
                    <group style="position: relative; top: -19px;">
                        <x-textarea style="font-size: 11pt; border: 1px solid #f5f5f5;"
                                    @on-blur="resetUI"
                                    placeholder="评价下商品吧，您的评价还能够帮助到其他小伙伴哦~"
                                    v-model="form.remark"></x-textarea>
                    </group>
                </div>
                <img @click="showBigImg(form.photos)" style="margin-right: 5px;" v-for="(filePath, index) in form.photos" :key="index"
                     :src="config.publicBucketDomain + filePath" width="42" height="42"/>
                <Icon size="30" style="margin: 0px 15px 10px;" @click="getPhotos" type="md-camera"/>
                <form style="display: none;" ref="uploadform" method="POST" enctype="multipart/form-data">
                    <input ref="uploadFile" type="file" accept='image/*' multiple @change="fileChange"/>
                </form>
            </div>
        </Content>
        <Footer :style="footerStyle">
            <x-button :disabled="loading" :show-loading="loading" action-type="button"
                      style="width: 100%; background-color: #008CEB;" @click.native="save">
                <span style="font-size: 11pt; color: #fff;">提交评价</span>
            </x-button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/evaluation.js'
    import config from '../../config/index.js'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                config,
                commonStyles,
                headerStyle: {
                    ...commonStyles.header
                },
                contentStyle: {
                    ...commonStyles.content
                },
                footerStyle: {
                    ...commonStyles.footer,
                    padding: '10px'
                },
                type: 'comment',
                form: {
                    id: null,
                    itemThumbnail: null,
                    anonymous: false,
                    value: null,
                    remark: null,
                    photos: []
                },
                loading: false,
                popupImgs: [],
                isSmallDevice: false,
                popup: false,
                modalStyle: {}
            }
        },
        computed: {
            isAdditional() {
                return this.type != 'comment'
            },
            title() {
                return !this.isAdditional ? '添加评价' : '追加评价'
            }
        },
        methods: {
            save() {
                this.loading = true
                if (this.type == 'comment') {
                    API.save(this.form).then(res => {
                        this.loading = false
                        this.back()
                    }).catch(e => {
                        this.loading = false
                    })
                } else {
                    API.saveAdditional(this.form).then(res => {
                        this.loading = false
                        this.back()
                    }).catch(e => {
                        this.loading = false
                    })
                }
            },
            fileChange() {
                const formData = new FormData(this.$refs.uploadform)
                const ufiles = this.$refs.uploadFile.files
                if (this.form.photos.length + ufiles.length > 5) {
                    this.$vux.toast.show({text: "最多上传5张图片", type: 'text'})
                    return
                }
                for (let i = 0; i < ufiles.length; i++) {
                    formData.append("files", ufiles[i]);
                }
                this.$vux.loading.show({
                    text: '上传中...'
                })
                API.upload(formData).then(filePaths => {
                    for (let i in filePaths) {
                        this.form.photos.push(filePaths[i])
                    }
                    this.$vux.toast.show({text: '上传成功', type: 'success'})
                    this.$vux.loading.hide()
                }).catch(e => {
                    this.$vux.loading.hide()
                })
            },
            getPhotos() {
                this.$refs.uploadFile.click()
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                if(this.form.id > 0) {
                    this.loading = true
                    if(this.type == 'comment') {
                        API.loadOrder(this.form.id).then(data => {
                            this.form.itemThumbnail = data.itemThumbnail
                            this.loading = false
                        }).catch(e => {
                            this.loading = false
                        })
                    } else {
                        API.load(this.form.id).then(data => {
                            this.form.value = data.value.name
                            this.form.itemThumbnail = data.itemThumbnail
                            this.loading = false
                        }).catch(e => {
                            this.loading = false
                        })
                    }
                }
            },
            showBigImg(urls) {
                this.popupImgs = urls
                this.popup = true
            },
        },
        mounted() {
            this.isSmallDevice = document.documentElement.clientWidth < 620
            this.popupImgWidth = document.documentElement.clientWidth
            this.modalStyle = {
                width: '100%',
                height: this.popupImgWidth + 'px',
                top: this.isSmallDevice ? '50px' : '100px'
            }
            this.contentStyle.backgroundColor = '#f5f5f5'
            this.form.id = this.$router.currentRoute.params.id
            this.type = this.$router.currentRoute.params.type
            this.load()
        }
    }
</script>
