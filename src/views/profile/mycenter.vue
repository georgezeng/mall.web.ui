<template>
    <div style="margin: 300px auto;">
        <Button size="large" long type="success" @click="test">测试</Button>
    </div>
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
                API.test().then(res=> {
                    Message.success('success')
                }).catch(e => {
                    Message.error(e.msgs[0])
                })
            }
        },
    }
</script>
