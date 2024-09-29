<template>
  <div>
    <main class="flex bg-gray-1">
      <div
        class="bg-white min-h-screen transition-all"
        :class="isSideNavigationToggled ? 'w-14' : 'sm:w-66 w-14'"
      >
        <SideNav @toggle-side-navigation="toggleSideNavigation" />
      </div>
      <section class="flex-1">
        <div class="m-6 flex justify-between">
          <JbHeader headingLevel="h2" :text="currentLabel" />
          <div class="flex items-center justify-center">
            <div class="relative mr-4">
              <JbIcon iconName="NotificationBell" />
              <div
                class="bg-red-500 w-4 h-4 rounded-full absolute -top-[3px] -right-[3px] text-center text-white text-13px"
              >
                4
              </div>
            </div>
            <div class="relative">
              <JbAvatar size="xl" fullName="Robert Fox" />
              <div
                class="flex items-center justify-center bg-white w-5 h-5 rounded-full absolute -bottom-[6px] right-[4px] text-center text-white text-13px"
              >
                <div class="bg-green-500 w-3 h-3 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="m-6"><RouterView /></div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SideNav from '../src/components/SideNav.vue';
import JbHeader from './components/SharedComponents/JbHeader.vue';
import JbIcon from './components/SharedComponents/JbIcon.vue';
import JbAvatar from './components/SharedComponents/JbAvatar.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const routes = ref([
  '/dashboard',
  '/order-management',
  '/brand',
  '/add-products',
  '/product-list',
]);

const labels = ref([
  'Dashboard',
  'Order Management',
  'Brand',
  'Add Products',
  'Product List',
]);

const isSideNavigationToggled = ref(false);

const route = useRoute();

const toggleSideNavigation = (isSideNavigation: boolean) => {
  isSideNavigationToggled.value = isSideNavigation;
  console.log(isSideNavigationToggled, 'isSideNavigationToggled');
};

const currentLabel = computed(() => {
  const index = routes.value.indexOf(route.path);
  return index !== -1 ? labels.value[index] : 'DashBoard';
});
</script>

<style scoped></style>
