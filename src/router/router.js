const routers = [
    {
        path: '/',
        name: 'Index',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/index.vue'], resolve)
    },
    {
        path: '/Home',
        name: 'Home',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/home.vue'], resolve)
    },
    {
        path: '/Login',
        name: 'Login',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/login/index.vue'], resolve)
    },
    {
        path: '/WechatLogin',
        name: 'WechatLogin',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/login/wechat.vue'], resolve)
    },
    {
        path: '/ForgetPassword/Step1',
        name: 'ForgetPasswordStep1',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/forget-password/step1.vue'], resolve)
    },
    {
        path: '/ForgetPassword/Step2',
        name: 'ForgetPasswordStep2',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/forget-password/step2.vue'], resolve)
    },
    {
        path: '/Goods/Search',
        name: 'GoodsSearch',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/search.vue'], resolve)
    },
    {
        path: '/Goods/Category',
        name: 'GoodsCategory',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/category.vue'], resolve)
    },
    {
        path: '/Goods/Item/List/:type/:id',
        name: 'GoodsItemList',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/item/list.vue'], resolve)
    },
    {
        path: '/Goods/Item/Detail/:id',
        name: 'GoodsItemDetail',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/goods/item/detail.vue'], resolve)
    },
    {
        path: '/MyCart',
        name: 'MyCart',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/cart/list.vue'], resolve)
    },
    {
        path: '/MyPoints',
        name: 'MyPoints',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/points/list.vue'], resolve)
    },
    {
        path: '/MyCoupon/:type',
        name: 'MyCoupon',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/coupon/list.vue'], resolve)
    },
    {
        path: '/MyInvoice/List',
        name: 'MyInvoiceList',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/invoice/list.vue'], resolve)
    },
    {
        path: '/MyInvoice/Edit/:id',
        name: 'MyInvoiceEdit',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/invoice/edit.vue'], resolve)
    },
    {
        path: '/Order/Coupon/List/:key',
        name: 'OrderCouponList',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/coupon-list.vue'], resolve)
    },
    {
        path: '/Order/List/:type',
        name: 'MyOrderList',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/list.vue'], resolve)
    },
    {
        path: '/Order/Detail/:id',
        name: 'MyOrderDetail',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/detail.vue'], resolve)
    },
    {
        path: '/Order/Express/:id',
        name: 'MyOrderExpress',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/express.vue'], resolve)
    },
    {
        path: '/Order/SettleAccount/:key',
        name: 'OrderSettleAccount',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/order/settle-account.vue'], resolve)
    },
    {
        path: '/AlipayInWechat/:id',
        name: 'AlipayInWechat',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/order/alipay-in-wechat.vue'], resolve)
    },
    {
        path: '/AfterSale/Express/:id',
        name: 'AfterSaleExpress',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/express.vue'], resolve)
    },
    {
        path: '/AfterSale/List/:id/:status',
        name: 'AfterSaleList',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/list.vue'], resolve)
    },
    {
        path: '/AfterSale/Select/:id',
        name: 'AfterSaleTypeSelect',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/type-select.vue'], resolve)
    },
    {
        path: '/AfterSale/RefundOnly/:id',
        name: 'AfterSaleRefundOnly',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/refund-only.vue'], resolve)
    },
    {
        path: '/AfterSale/SalesReturn/:id',
        name: 'AfterSaleSalesReturn',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/sales-return.vue'], resolve)
    },
    {
        path: '/AfterSale/Change/:id',
        name: 'AfterSaleChange',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/change.vue'], resolve)
    },
    {
        path: '/AfterSale/RefundOnly/Detail/:id',
        name: 'AfterSaleRefundOnlyDetail',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/refund-detail.vue'], resolve)
    },
    {
        path: '/AfterSale/SalesReturn/Detail/:id',
        name: 'AfterSaleSalesReturnDetail',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/return-detail.vue'], resolve)
    },
    {
        path: '/AfterSale/Change/Detail/:id',
        name: 'AfterSaleChangeDetail',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/aftersale/change-detail.vue'], resolve)
    },
    {
        path: '/Evaluation/ItemList/:id',
        name: 'EvaluationItemList',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/evaluation/item-list.vue'], resolve)
    },
    {
        path: '/Evaluation/MyList/:id/:status',
        name: 'MyEvaluationList',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/evaluation/my-list.vue'], resolve)
    },
    {
        path: '/Evaluation/Add/:id/:type',
        name: 'MyEvaluationAdd',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/evaluation/add.vue'], resolve)
    },
    {
        path: '/MyCenter',
        name: 'MyCenter',
        meta: {
            needLogin: false
        },
        component: (resolve) => require(['../views/config/center.vue'], resolve)
    },
    {
        path: '/MyProfile',
        name: 'MyProfile',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/profile.vue'], resolve)
    },
    {
        path: '/MyInvite',
        name: 'MyInvite',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/invite.vue'], resolve)
    },
    {
        path: '/MySetting',
        name: 'MySetting',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/index.vue'], resolve)
    },
    {
        path: '/MySecurity',
        name: 'MySecurity',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/security.vue'], resolve)
    },
    {
        path: '/MyIdentity',
        name: 'MyIdentity',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/identity.vue'], resolve)
    },
    {
        path: '/MyAddress/List',
        name: 'MyAddressList',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/address/list.vue'], resolve)
    },
    {
        path: '/MyAddress/Edit/:id',
        name: 'MyAddressEdit',
        meta: {
            needLogin: true
        },
        component: (resolve) => require(['../views/config/setting/address/edit.vue'], resolve)
    },
    {
        path: '/404',
        name: 'NotFound',
        meta: {
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