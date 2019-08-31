<style scoped lang="less">
    .header {
        background-color: #fff;
        height: 60px;
        position: fixed;
        top: 0px;
        z-index: 100;
        width: 100%;
        box-shadow: 0px 0px 3px -1px gray;
    }
</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header class="header">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">售后申请</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 60px; margin-bottom: 40px; font-size: 14px;">
            <div v-transfer-dom>
                <popup v-model="reasonPopup" style="background-color: #fff; z-index: 100000;">
                    <div style="position: relative;">
                        <Icon size="30" type="ios-close" class="popup-close" @click="closePopup"/>
                        <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 20px;">
                            申请原因
                        </div>
                        <checklist style="margin-bottom: 100px;" :options="reasonList" v-model="reasonValue"
                                   :max="1"></checklist>
                        <div style="position: fixed; bottom: 0px; width: 100%; padding: 10px;">
                            <x-button action-type="button"
                                      style="width: 100%; background-color: red;"
                                      @click.native="confirmReason">
                                <span style="font-size: 11pt; color: #fff;">确定</span>
                            </x-button>
                        </div>
                    </div>
                </popup>
            </div>
            <div style="padding: 10px;">
                申请服务: <span style="color: gray;">退货退款</span>
            </div>
            <div style="padding: 10px; border-top: 2px solid #f5f5f5;">
                货物状态: <span style="color: gray;">已收到货</span>
            </div>
            <mt-cell style="border-top: 2px solid #f5f5f5;" @click.native="showReasonPopup" is-link>
                <div style="font-size: 14px;" slot="title">
                    申请原因: <span v-if="form.reason == null" style="color: gray;">请选择原因</span>
                </div>
                <span style="font-size: 14px;">{{form.reason}}</span>
            </mt-cell>
            <div style="padding: 10px; border-top: 2px solid #f5f5f5;">
                退还数量:
                <span style="float: right">
                    <wv-number-spinner :min="1" :max="maxNums" input-width="30px"
                                       v-model="form.nums"></wv-number-spinner>
                </span>
            </div>
            <div style="padding: 10px; border-top: 2px solid #f5f5f5;">
                退款金额: <span style="color: gray;">￥{{amount}}</span>
            </div>
            <div style="padding: 10px; border-top: 2px solid #f5f5f5;">
                <div>问题描述:</div>
                <group style="margin-top: -10px;">
                    <x-textarea style="font-size: 14px; border: 1px solid #f5f5f5;"
                                @on-blur="resetUI"
                                placeholder="请描述申请售后服务的具体原因，最多可上传5张图片哦"
                                v-model="form.description"></x-textarea>
                </group>
            </div>
            <img style="margin-right: 5px;" v-for="(path, index) in form.photos" :key="index"
                 :src="config.publicBucketDomain + path" width="42" height="42"/>
            <Icon size="30" style="margin: 0px 15px 10px;" @click="getPhotos" type="md-camera"/>
            <form style="display: none;" ref="uploadform" method="POST" enctype="multipart/form-data">
                <input ref="uploadFile" type="file" accept='image/*' multiple @change="fileChange"/>
            </form>
        </Content>
        <Footer :style="footerStyle">
            <x-button action-type="button" :disabled="loading" style="width: 100%; background-color: #008CEB;"
                      :show-loading="loading" @click.native="save">
                <span style="font-size: 11pt; color: #fff;">提交申请</span>
            </x-button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../api/aftersale.js'
    import config from '../../config/index'
    import Util from '../../libs/util.js'
    import commonStyles from '../../styles/common.js'

    export default {
        components: {},
        data() {
            return {
                config,
                commonStyles,
                footerStyle: {
                    ...commonStyles.footer
                },
                loading: false,
                item: {
                    subOrder: {
                        unitPrice: 0
                    }
                },
                maxNums: 0,
                form: {
                    id: null,
                    type: 'SalesReturn',
                    nums: 1,
                    reason: null,
                    description: null,
                    photos: [],
                },
                reasonPopup: false,
                reasonValue: [],
                reasonList: []
            }
        },
        computed: {
            amount() {
                return (this.item.subOrder.unitPrice * this.form.nums).toFixed(2)
            }
        },
        methods: {
            save() {
                this.loading = true
                API.save(this.form).then(res => {
                    this.loading = false
                    let nav = Util.getForNav()
                    if (nav.from != 'AfterSaleList') {
                        nav = Util.getForNav()
                    }
                    Util.go(nav.from, nav)
                }).catch(e => {
                    this.loading = false
                })
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
                API.upload(this.form.id, formData).then(filePaths => {
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
            confirmReason() {
                if (this.reasonValue[0]) {
                    this.form.reason = this.reasonValue[0]
                } else {
                    this.form.reason = null
                }
                this.closePopup()
            },
            closePopup() {
                this.reasonPopup = false
            },
            showReasonPopup() {
                this.reasonValue = []
                this.reasonPopup = true
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            load() {
                if (this.form.id > 0) {
                    this.loading = true
                    API.load(this.form.id).then(data => {
                        this.item = data
                        this.form.nums = data.subOrder.nums
                        this.maxNums = this.form.nums
                        this.loadReasons();
                        this.loading = false
                    }).catch(e => {
                        this.loading = false
                    })
                }
            },
            loadReasons() {
                this.loading = true
                API.loadReasons('SalesReturn').then(reasonList => {
                    this.reasonList = reasonList
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            }
        },
        created() {
            this.footerStyle.padding = '10px'
            this.form.id = this.$router.currentRoute.params.id
        },
        mounted() {
            this.load()
        }
    }
</script>
