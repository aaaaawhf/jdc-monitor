import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    name: 'device',
    alwaysShow: true,
    meta: {
      title: '设备管理',
      icon: 'device-management'
    },
    children: [
      {
        path: 'index',
        name: '设备列表',
        component: () => import('@/views/device/index'),
        meta: { title: '设备列表', icon: 'device-list' }
      },
      // {
      //   path: 'operate',
      //   name: '设备操作',
      //   component: () => import('@/views/device/operate'),
      //   meta: { title: '设备操作', icon: 'store-house' }
      // }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/account',
    name: 'system',
    alwaysShow: true,
    meta: {
      title: '系统设置',
      icon: 'system-set'
    },
    children: [
      {
        path: 'account',
        name: '账号管理',
        component: () => import('@/views/system/account'),
        meta: { title: '账号管理', icon: 'account-management' }
      },
      {
        path: 'notice',
        name: '通知设置',
        component: () => import('@/views/system/notice'),
        meta: { title: '通知设置', icon: 'notice-set' }
      }
    ]
  },
  // {
  //   path: '/customer',
  //   component: Layout,
  //   redirect: '/customer/index',
  //   name: 'customer-manager',
  //   alwaysShow: true,
  //   meta: {
  //     title: '客户管理',
  //     icon: 'customer-manager'
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: '客户列表',
  //       component: () => import('@/views/customer/index'),
  //       meta: { title: '客户列表', icon: 'customer', roles: ['CUSTOMER_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'order',
  //       name: '销售订单',
  //       component: () => import('@/views/customer/order'),
  //       meta: { title: '销售订单', icon: 'order', roles: ['CUSTOMER_ORDER_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'order-detail/:customerOrderId(\\d+)',
  //       name: '订单详情',
  //       hidden: true,
  //       component: () => import('@/views/customer/order-detail'),
  //       meta: { title: '订单详情', icon: 'order', roles: ['CUSTOMER_ORDER_MANAGEMENT'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/goods',
  //   component: Layout,
  //   redirect: '/goods/index',
  //   name: 'goods-manager',
  //   alwaysShow: true,
  //   meta: {
  //     title: '商品管理',
  //     icon: 'goods-manager'
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: '商品列表',
  //       component: () => import('@/views/goods/index'),
  //       meta: { title: '商品列表', icon: 'goods', roles: ['GOODS_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'tag',
  //       name: '商品标签',
  //       component: () => import('@/views/goods/tag'),
  //       meta: { title: '商品标签', icon: 'goods-tag', roles: ['GOODS_TAG_MANAGEMENT'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/store-house',
  //   component: Layout,
  //   redirect: '/store-house/index',
  //   name: 'store-house-manager',
  //   meta: {
  //     title: '仓库管理',
  //     icon: 'store-house'
  //   },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '仓库管理',
  //       component: () => import('@/views/store-house/index'),
  //       meta: { title: '仓库管理', icon: 'store-house', roles: ['STORE_HOUSE_MANAGEMENT'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user/index',
  //   name: 'system-manager',
  //   alwaysShow: true,
  //   meta: {
  //     title: '系统管理',
  //     icon: 'system'
  //   },
  //   children: [
  //     {
  //       path: 'user/index',
  //       name: '用户管理',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '用户管理', icon: 'user', roles: ['USER_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'department/index',
  //       name: '部门管理',
  //       component: () => import('@/views/department/index'),
  //       meta: { title: '部门管理', icon: 'tree', roles: ['DEPARTMENT_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'role/index',
  //       name: '角色管理',
  //       component: () => import('@/views/role/index'),
  //       meta: { title: '角色管理', icon: 'role', roles: ['ROLE_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'dictionary/index',
  //       name: '字典管理',
  //       component: () => import('@/views/dictionary/index'),
  //       meta: { title: '字典管理', icon: 'dict', roles: ['DICTIONARY_MANAGEMENT'] }
  //     },
  //     {
  //       path: 'dictionary/detail/:dictionaryId(\\d+)',
  //       hidden: true,
  //       name: '字典数据',
  //       component: () => import('@/views/dictionary/detail'),
  //       meta: { title: '字典数据', icon: '', roles: ['DICTIONARY_MANAGEMENT'] }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
