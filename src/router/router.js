import Main from '../views/main'
const routers = [
    {
        path: '/Index',
        name: 'Index',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['../views/index.vue'], resolve)
    },
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                name: 'Home',
                meta: {
                    title: '首页'
                },
                component: (resolve) => require(['../views/home.vue'], resolve)
            }
        ]
    },
    {
        path: '/Login',
        name: 'Login',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['../views/login/index.vue'], resolve)
    },
    {
        path: '/WechatLogin',
        name: 'WechatLogin',
        meta: {
            title: '微信登录'
        },
        component: (resolve) => require(['../views/login/wechat.vue'], resolve)
    },
    {
        path: '/MyCenter',
        name: 'MyCenter',
        meta: {
            title: '个人中心'
        },
        component: (resolve) => require(['../views/profile/mycenter.vue'], resolve)
    },
    {
        path: '/ForgetPassword/Step1',
        name: 'ForgetPasswordStep1',
        meta: {
            title: '忘记密码'
        },
        component: (resolve) => require(['../views/forget-password/step1.vue'], resolve)
    },
    {
        path: '/ForgetPassword/Step2',
        name: 'ForgetPasswordStep2',
        meta: {
            title: '重置密码'
        },
        component: (resolve) => require(['../views/forget-password/step2.vue'], resolve)
    }
];
export default routers;