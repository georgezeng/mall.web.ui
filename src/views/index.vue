<template>
</template>
<script>
    import config from '../config/index'

    export default {
        mounted() {
            window.location.href = config.baseUrl + "/index"
        }
    }
</script>
