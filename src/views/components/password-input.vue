<style scoped lang="less">
</style>
<template>
    <x-input ref="input" @on-blur="resetUI" style="clear: both;"
             class="optionalLine optionalCell" :title="title"
             :placeholder="placeholder"
             :value="value" @on-change="change"></x-input>
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
        computed: {},
        methods: {
            change(value) {
                this.$emit("change", value)
            },
            resetUI() {
                document.body.scrollTop = document.documentElement.scrollTop = 0
            },
        },
        mounted() {
            const inputEl = this.$refs.input.$el
            const inputJQEl = $(inputEl).find('input').parent()
            inputJQEl.find('input').remove()
            inputJQEl.append('<input type="password" style="outline: none; border: none; width: 100%; height: 25px;" />')
        }
    }
</script>
