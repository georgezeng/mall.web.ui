<template>
</template>
<script>
    import config from '../config/index'

    export default {
        mounted() {
            alert(navigator.userAgent)
            window.location.href = config.baseUrl + "/index"
        }
    }
</script>
