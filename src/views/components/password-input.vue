<style scoped lang="less">
</style>
<template>
    <div style="border-top: 2px solid #EDEDED; border-bottom: 2px solid #EDEDED;">

        <input class="weui-input" ref="input" :value="value" @change="change" type="password"
               style="outline: none; border: none; width: 100%; height: 25px;"/>
    </div>
    <x-input ref="input" @on-blur="resetUI" style="clear: both;"
             class="optionalLine optionalCell" :title="title"
             :placeholder="placeholder">
    </x-input>

</template>
<script>
    import $ from 'jquery'

    export default {
        components: {},
        props: [
            'title',
            'value',
            'placeholder'
        ],
        data() {
            return {

            }
        },
        computed: {
        },
        watch: {

        },
        methods: {
            change(e) {
                this.$emit("change", e.target.value)
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
        },
        mounted() {
            const wrapperEl = $(this.$refs.inputWrapper.$el).find('input').parent()
            wrapperEl.find('input').remove()
            const input = $('<input type="password"' +
                ' style="outline: none; border: none; width: 100%; height: 25px;"/>')
            input.change(this.change)
            input.val(this.value)
            wrapperEl.append(input)
        }
    }
</script>
