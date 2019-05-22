<template>
    <div><Button @click="test">测试</Button></div>
</template>
<script>
    import API from '../../api/forget-password'
    import {Message} from 'iview'

    export default {
        data() {
            return {
            }
        },
        methods: {
            test() {
                API.test().then(res=>Message.success('success'))
            }
        },
    }
</script>
