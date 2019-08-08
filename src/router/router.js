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
        path: '/Goods/Search',
        name: 'GoodsSearch',
        meta: {
            title: '商品搜索',
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/search.vue'], resolve)
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
        path: '/Goods/Item/Detail/:id',
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
        path: '/Order/Detail/:id',
        name: 'MyOrderDetail',
        meta: {
            title: '订单详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/detail.vue'], resolve)
    },
    {
        path: '/Order/Express/:id',
        name: 'MyOrderExpress',
        meta: {
            title: '订单详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/express.vue'], resolve)
    },
    {
        path: '/Order/SettleAccount/:key',
        name: 'OrderSettleAccount',
        meta: {
            title: '填写订单',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/settle-account.vue'], resolve)
    },
    {
        path: '/AlipayInWechat/:id',
        name: 'AlipayInWechat',
        meta: {
            title: '支付宝支付',
            needLogin: false
        },
        component: (resolve) => require(['../views/order/alipay-in-wechat.vue'], resolve)
    },
    {
        path: '/AfterSale/Express/:id',
        name: 'AfterSaleExpress',
        meta: {
            title: '物流详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/order/express.vue'], resolve)
    },
    {
        path: '/AfterSale/List/:id/:status',
        name: 'AfterSaleList',
        meta: {
            title: '退款/售后',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/list.vue'], resolve)
    },
    {
        path: '/AfterSale/Select/:id',
        name: 'AfterSaleTypeSelect',
        meta: {
            title: '申请售后',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/type-select.vue'], resolve)
    },
    {
        path: '/AfterSale/RefundOnly/:id',
        name: 'AfterSaleRefundOnly',
        meta: {
            title: '仅退款申请',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/refund-only.vue'], resolve)
    },
    {
        path: '/AfterSale/SalesReturn/:id',
        name: 'AfterSaleSalesReturn',
        meta: {
            title: '退货退款申请',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/sales-return.vue'], resolve)
    },
    {
        path: '/AfterSale/Change/:id',
        name: 'AfterSaleChange',
        meta: {
            title: '换货申请',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/change.vue'], resolve)
    },
    {
        path: '/AfterSale/RefundOnly/Detail/:id',
        name: 'AfterSaleRefundOnlyDetail',
        meta: {
            title: '仅退款详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/refund-detail.vue'], resolve)
    },
    {
        path: '/AfterSale/SalesReturn/Detail/:id',
        name: 'AfterSaleSalesReturnDetail',
        meta: {
            title: '退货退款详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/return-detail.vue'], resolve)
    },
    {
        path: '/AfterSale/Change/Detail/:id',
        name: 'AfterSaleChangeDetail',
        meta: {
            title: '换货详情',
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/change-detail.vue'], resolve)
    },
    {
        path: '/Evaluation/ItemList/:id',
        name: 'EvaluationItemList',
        meta: {
            title: '商品评价',
            needLogin: false
        },
        component: (resolve) => require(['../views/evaluation/item-list.vue'], resolve)
    },
    {
        path: '/Evaluation/MyList/:id/:status',
        name: 'MyEvaluationList',
        meta: {
            title: '我的评价',
            needLogin: true
        },
        component: (resolve) => require(['../views/evaluation/my-list.vue'], resolve)
    },
    {
        path: '/Evaluation/Add/:id/:type',
        name: 'MyEvaluationAdd',
        meta: {
            title: '添加评价',
            needLogin: true
        },
        component: (resolve) => require(['../views/evaluation/add.vue'], resolve)
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
        path: '/MyInvite',
        name: 'MyInvite',
        meta: {
            title: '我的邀请',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/invite.vue'], resolve)
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
        path: '/MyAddress/List',
        name: 'MyAddressList',
        meta: {
            title: '收货地址',
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/address/list.vue'], resolve)
    },
    {
        path: '/MyAddress/Edit/:id',
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