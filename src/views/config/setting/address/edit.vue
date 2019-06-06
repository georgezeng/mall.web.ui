<style scoped lang="less">

</style>
<template>
    <Layout :style="commonStyles.layout">
        <Header style="background-color: #fff; height: 60px;">
            <Icon size="24" style="left: 10px; position: absolute; top: 20px;" type="ios-arrow-back" @click="back"/>
            <div align="center" style="position: relative; top: 0px;">{{action}}收货地址</div>
        </Header>
        <Content :style="commonStyles.content">
            <div class="blockLine"></div>
            <group>
                <x-input class="optionalLine optionalCell" title="收货人" v-model="form.name"></x-input>
                <x-input class="optionalLine optionalCell" title="手机号码" v-model="form.phone"></x-input>
                <x-address :list="addressData" class="optionalLine optionalPicker" title="所在地区"
                           v-model="form.area"></x-address>
                <x-textarea @on-blur="resetUI" class="optionalLine optionalCell" title="详细地址"
                            v-model="form.location"></x-textarea>
            </group>
        </Content>
        <Footer :style="commonStyles.footer">
            <Button :loading="loading" type="primary" size="large" long @click="save">保存</Button>
        </Footer>
    </Layout>
</template>
<script>
    import API from '../../../../api/address.js'
    import Util from '../../../../libs/util.js'
    import {Message} from 'iview'
    import commonStyles from '../../../../styles/common.js'
    import {ChinaAddressV4Data, Value2nameFilter as value2name} from 'vux'

    export default {
        components: {},
        data() {
            return {
                commonStyles,
                addressData: ChinaAddressV4Data,
                loading: false,
                form: {
                    id: null,
                    name: null,
                    phone: null,
                    area: [],
                    location: null
                },
            }
        },
        computed: {
            action() {
                return this.form.id > 0 ? '编辑' : '新增'
            }
        },
        methods: {
            resetUI() {
                window.scrollTo(0, 0)
            },
            back() {
                Util.go('MyAddressList')
            },
            save() {
                window.scrollTo(0, 0)
                if (!this.form.name || this.form.name == '') {
                    Message.error('收货人不能为空')
                    return
                }
                if (!this.form.phone || this.form.phone == '') {
                    Message.error('手机号码不能为空')
                    return
                }
                if (!/\d{11}/.test(this.form.phone)) {
                    Message.error('手机号码必须是11位数字')
                    return
                }
                if (!this.form.area || this.form.area.length < 3) {
                    Message.error('所在地区不能为空')
                    return
                }
                if (!this.form.location || this.form.location == '') {
                    Message.error('详细地址不能为空')
                    return
                }
                this.loading = true
                const area = value2name(this.form.area, ChinaAddressV4Data).split(/\s+/)
                API.save({
                    ...this.form,
                    province: area[0],
                    city: area[1],
                    district: area[2]
                }).then(res => {
                    Message.success('保存成功')
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
                        this.form.area = [data.province, data.city, data.district]
                        this.loading = false
                    }).catch(e => {
                        this.loading = false
                    })
                }
            }
        },
        created() {
            this.commonStyles.footer.padding = "20px"
            this.form.id = this.$router.currentRoute.params.id
        },
        mounted() {
            this.load()
        }
    }
</script>
