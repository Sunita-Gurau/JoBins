import { createRouter, createWebHistory } from 'vue-router';
import DashBoard from '../views/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
    },
    {
      path: '/order-management',
      name: 'orderManagement',
      component: () => import('../views/OrderManagement.vue'),
    },
    {
      path: '/add-products',
      name: 'addProducts',
      component: () => import('../views/AddProducts.vue'),
    },
    {
      path: '/brand',
      name: 'brand',
      component: () => import('../views/Brand.vue'),
    },
    {
      path: '/product-list',
      name: 'productList',
      component: () => import('../views/ProductList.vue'),
    },
  ],
});

export default router;
