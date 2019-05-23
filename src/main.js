import Vue from 'vue';
import router from './router/index';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
