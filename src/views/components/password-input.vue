<style scoped lang="less">
</style>
<template>
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
                input: null
            }
        },
        computed: {
        },
        watch: {
            value: function(val) {
                this.input.val(val)
            }
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
            const wrapperEl = $(this.$refs.input.$el).find('input').parent()
            wrapperEl.find('input').remove()
            this.input = $('<input type="password"' +
                ' style="outline: none; border: none; width: 100%; height: 25px;"/>')
            this.input.change(this.change)
            wrapperEl.append(this.input)
        }
    }
</script>
