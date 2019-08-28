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
            <div align="center" style="position: relative; top: 0px;">{{action}}收货地址</div>
        </Header>
        <Content :style="commonStyles.content" style="margin-top: 40px;">
            <div v-transfer-dom>
                <popup v-model="datepickerPopup"
                       :style="{height: popupHeight + 'px'}"
                       style="background-color: #fff; z-index: 1000000;">
                    <v-distpicker v-if="datepickerPopup" :province="form.province" :city="form.city" :area="form.district" @selected="selected"
                                  type="mobile"></v-distpicker>
                </popup>
            </div>
            <group>
                <x-switch title="默认地址" :value-map="[false, true]" v-model="form.asDefault"></x-switch>
                <x-input class="optionalLine optionalCell" placeholder="请输入收货人" title="收货人"
                         v-model="form.name"></x-input>
                <x-input class="optionalLine optionalCell" placeholder="请输入联系电话" title="联系电话"
                         v-model="form.phone"></x-input>
                <!--<x-address :list="addressData" class="optionalLine optionalPicker" title="所在地区"
                           v-model="form.area"></x-address>-->
                <cell @click.native="showPopup" is-link style="padding: 15px !important;"
                      class="optionalLine optionalPicker" title="所在地区" :value="area"></cell>
                <x-textarea @on-blur="resetUI" placeholder="请输入详细地址" class="optionalLine optionalCell" title="详细地址"
                            v-model="form.location"></x-textarea>
            </group>
        </Content>
        <Footer :style="footerStyle">
            <x-button action-type="button" :disabled="loading" style="width: 100%; background-color: #008CEB;"
                      :show-loading="loading" @click.native="save">
                <span style="font-size: 11pt; color: #fff;">保存</span>
            </x-button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../../../api/address.js'
    import Util from '../../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../../styles/common.js'
    // import {ChinaAddressV4Data, Value2nameFilter as value2name} from 'vux'
    import VDistpicker from 'v-distpicker'

    export default {
        components: {
            VDistpicker
        },
        data() {
            return {
                popupHeight: 0,
                datepickerPopup: false,
                commonStyles,
                // addressData: ChinaAddressV4Data,
                loading: false,
                footerStyle: {
                    ...commonStyles.footer
                },
                form: {
                    id: null,
                    name: null,
                    phone: null,
                    // area: [],
                    district: null,
                    province: null,
                    city: null,
                    location: null,
                    asDefault: false
                },
            }
        },
        computed: {
            action() {
                return this.form.id > 0 ? '编辑' : '新增'
            },
            area() {
                return this.form.district ? this.form.province + " " + this.form.city + ' ' + this.form.district : ''
            }
        },
        methods: {
            showPopup() {
                this.datepickerPopup = true
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
            back() {
                const nav = Util.getForNav()
                Util.go(nav.from, nav)
            },
            selected(value) {
                if (value.area.code != null) {
                    this.form.province = value.province.value
                    this.form.city = value.city.value
                    this.form.district = value.area.value
                    this.datepickerPopup = false
                }
            },
            save() {
                if (!this.form.name || this.form.name == '') {
                    this.$vux.toast.show({text: '收货人不能为空', type: 'text', width: '200px'})
                    return
                }
                if (!this.form.phone || this.form.phone == '') {
                    this.$vux.toast.show({text: '联系电话不能为空', type: 'text', width: '200px'})
                    return
                }
                if (this.form.phone.length < 11) {
                    this.$vux.toast.show({text: '联系电话必须是手机号码或者座机号', type: 'text', width: '300px'})
                    return
                }
                if (!(this.form.district && this.form.province && this.form.city)) {
                    this.$vux.toast.show({text: '所在地区不能为空', type: 'text', width: '200px'})
                    return
                }
                if (!this.form.location || this.form.location == '') {
                    this.$vux.toast.show({text: '详细地址不能为空', type: 'text', width: '200px'})
                    return
                }
                this.loading = true
                // const area = value2name(this.form.area, ChinaAddressV4Data).split(/\s+/)
                API.save(this.form).then(res => {
                    this.$vux.toast.show({text: '保存成功'})
                    this.back()
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            load() {
                if (this.form.id > 0) {
                    this.loading = true
                    API.load(this.form.id).then(data => {
                        this.form = data
                        // this.form.area = [data.province, data.city, data.district]
                        this.loading = false
                    }).catch(e => {
                        this.loading = false
                    })
                }
            }
        },
        created() {
            this.footerStyle.padding = "20px"
            this.popupHeight = document.documentElement.clientHeight - 100
        },
        mounted() {
            this.form.id = this.$router.currentRoute.params.id
            this.form.id = this.form.id > 0 ? this.form.id : null
            this.load()
        }
    }
</script>
