const routers = [
    {
        path: '/',
        name: 'Index',
        meta: {
            title: '首页',
            needLogin: false
        },
        component: (resolve) => require(['../views/index.vue'], resolve)
    },
    {
        path: '/Home',
        name: 'Home',
        meta: {
            title: '首页',
            needLogin: false
        },
        component: (resolve) => require(['../views/home.vue'], resolve)
    },
    {
        path: '/Login',
        name: 'Login',
        meta: {
            title: '登录',
            needLogin: false
        },
        component: (resolve) => require(['../views/login/index.vue'], resolve)
    },
    {
        path: '/WechatLogin',
        name: 'WechatLogin',
        meta: {
            title: '微信登录',
            needLogin: false
        },
        component: (resolve) => require(['../views/login/wechat.vue'], resolve)
    },
    {
        path: '/ForgetPassword/Step1',
        name: 'ForgetPasswordStep1',
        meta: {
            title: '忘记密码',
            needLogin: false
        },
        component: (resolve) => require(['../views/forget-password/step1.vue'], resolve)
    },
    {
        path: '/ForgetPassword/Step2',
        name: 'ForgetPasswordStep2',
        meta: {
            title: '重置密码',
            needLogin: false
        },
        component: (resolve) => require(['../views/forget-password/step2.vue'], resolve)
    },
    {
        path: '/MyCenter',
        name: 'MyCenter',
        meta: {
            title: '个人中心',
            needLogin: false
        },
        component: (resolve) => require(['../views/config/center.vue'], resolve)
    },
    {
        path: '/MyProfile',
        name: 'MyProfile',
        meta: {
            title: '个人信息',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/profile.vue'], resolve)
    },
    {
        path: '/404',
        name: 'NotFound',
        meta: {
            title: '404',
            needLogin: false
        },
        component: (resolve) => require(['../views/404.vue'], resolve)
    },
    {
        path: "*",
        redirect: '/404'
    },
];
export default routers;