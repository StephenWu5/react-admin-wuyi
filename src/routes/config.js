export default {
    menus: [    // 菜单相关路由
        {
            key: '/app/index', title: '首页', icon: 'star', component: 'Index'
        },
        {
            key: '/app/banner', title: '轮播图管理', icon: 'picture', component: 'Banner'
        },
        {
            key: '/app/partner', title: 'K管理', icon: 'team', component: 'Partner'
        },
        {
            key: '/app/contactUs', title: 'j管理', icon: 'contacts', component: 'ContactUs'
        },
        {
            key: '/app/dynamic', title: 'f管理', icon: 'table', component: 'Dynamic'
        },
        {
            key: '/subs4', title: '页面', icon: 'switcher',
            subs: [
                { key: '/login', title: '登录' },
                { key: '/404', title: '404' },
            ],
        }
    ],
    others: []  // 非菜单相关路由
}