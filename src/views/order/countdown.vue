<template>
    <div>{{countDownText}}</div>
</template>
<script>
    import moment from 'moment';
    import config from '../../config/index'

    export default {
        components: {},
        props: [
            'form'
        ],
        data() {
            return {
                countDownTime: null,
                countDownText: '',
            }
        },
        watch: {
            form: function () {
                this.countDown()
            }
        },
        methods: {
            countDown() {
                if (this.form.status.name == 'UnPay') {
                    this.countDownText = '剩余时间: '
                    const endTime = moment(this.form.createTime, 'YYYY-MM-DD HH:mm:ss').add(1, 'day')
                    const now = moment()
                    if (moment.max(now, endTime) == endTime) {
                        this.countDownTime = endTime.subtract(now.hour(), 'h').subtract(now.minute(), 'm').subtract(now.second(), 's').format('HH:mm:ss')
                        this.countDownText += this.countDownTime
                    } else {
                        this.countDownTime = '00:00:00'
                    }
                    if (this.countDownTime != '00:00:00') {
                        setTimeout(this.countDown, 1000)
                    } else {
                        this.countDownText = ''
                        if (config.env != 'development') {
                            this.$emit('close')
                        }
                    }
                }
            },
        },
        mounted() {
            this.countDown()
        }
    }
</script>
