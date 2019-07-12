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
        path: '/Goods/Category',
        name: 'GoodsCategory',
        meta: {
            title: '商品分类',
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/category.vue'], resolve)
    },
    {
        path: '/Goods/Item/List/:id',
        name: 'GoodsItemList',
        meta: {
            title: '商品列表',
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/item/list.vue'], resolve)
    },
    {
        path: '/Goods/Item/Detail/:id/:from',
        name: 'GoodsItemDetail',
        meta: {
            title: '商品详情',
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/item/detail.vue'], resolve)
    },
    {
        path: '/MyCart',
        name: 'MyCart',
        meta: {
            title: '购物车',
            needLogin: true
        },
        component: (resolve) => require(['../views/cart/list.vue'], resolve)
    },
    {
        path: '/MyInvoice/List',
        name: 'MyInvoiceList',
        meta: {
            title: '选择发票',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/invoice/list.vue'], resolve)
    },
    {
        path: '/MyInvoice/Edit/:id',
        name: 'MyInvoiceEdit',
        meta: {
            title: '编辑发票',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/invoice/edit.vue'], resolve)
    },
    {
        path: '/Order/List/:type',
        name: 'MyOrderList',
        meta: {
            title: '我的订单',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/list.vue'], resolve)
    },
    {
        path: '/Order/Detail/:id/:type',
        name: 'MyOrderDetail',
        meta: {
            title: '订单详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/detail.vue'], resolve)
    },
    {
        path: '/Order/Preview/:key',
        name: 'OrderPreview',
        meta: {
            title: '填写订单',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/settleAccount.vue'], resolve)
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
        path: '/MySetting',
        name: 'MySetting',
        meta: {
            title: '设置',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/index.vue'], resolve)
    },
    {
        path: '/MySecurity',
        name: 'MySecurity',
        meta: {
            title: '账号安全',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/security.vue'], resolve)
    },
    {
        path: '/MyIdentity',
        name: 'MyIdentity',
        meta: {
            title: '实名认证',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/identity.vue'], resolve)
    },
    {
        path: '/MyAddress/List/:fromOrderPreview',
        name: 'MyAddressList',
        meta: {
            title: '收货地址',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/address/list.vue'], resolve)
    },
    {
        path: '/MyAddress/Edit/:id/:fromOrderPreview',
        name: 'MyAddressEdit',
        meta: {
            title: '编辑收货地址',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/address/edit.vue'], resolve)
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