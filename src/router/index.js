import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/mall',
      name: 'mall',
      component: () => import('@/views/mall/Index.vue'),
      children: [
        {
          path: '/classify',
          name: 'classify',
          component: () => import('@/views/mall/Classify.vue')
        }
      ]
    },

    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/mall/Search.vue')
    },

    {
      path: '/commodityList/:primary/:second',
      name: 'commodityList',
      component: () => import('@/views/mall/CommodityList.vue'),
      props: true,
      meta: {
        keepAlive: true
      }
    },

    {
      path: '/commodityDetails/:id',
      name: 'commodityDetails',
      component: () => import('@/views/mall/CommodityDetails.vue'),
      props: true,
    },





    {
      path: '/manage',
      component: () => import('@/views/manage/Login.vue')
    },

    {
      path: '/index',
      component: () => import('@/views/manage/Index.vue'),
      children: [
        {
          path: '/classifitionManagement',
          component: () => import('@/views/manage/ClassifitionManagement.vue')
        },
        {
          path: '/commodityList/',
          component: () => import('@/views/manage/CommodityList.vue'),
        },
        {
          path: '/commodityAdd',
          component: () => import('@/views/manage/CommodityAdd.vue')
        }
      ]
    }
  ]
})
