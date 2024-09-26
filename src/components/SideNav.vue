<template>
  <div  :class="isSideNavigationToggled ? 'my-6 mx-2' : 'sm:auto my-6 mx-2 sm:m-6'">
    <div class="w-auto  mr-4 cursor-pointer mb-2" :class="isSideNavigationToggled ? 'hidden' : 'hidden sm:block'">
      <div class="flex text-black gap-2 items-center">
        <JbIcon iconName="JoBinsLogo" />
        <JbHeader headingLevel="h2" text="JoBins" />

        <div class="ml-auto " @click="toggleSideNavigation">
          <JbIcon iconName="TogglerMenu" />
        </div>
      </div>
    </div>
    <div v-if="isSideNavigationToggled" @click="openSideNavigation"
      class="sm:block hidden rotate-180 px-4 mb-4 cursor-pointer  items-center justify-center">
      <JbIcon iconName="TogglerMenu" />
    </div>
    <div>
      <div class="text-gray-4 font-normal text-sm py-4 w-auto "
        :class="isSideNavigationToggled ? 'hidden' : 'hidden sm:block'">
        MAIN MENU</div>
      <ul class="mt-1">
        <li
        v-for="menuItem in menuItems" :key="menuItem.id"
          :class="isSideNavigationToggled ? 'flex items-center justify-center' : 'sm:justify-start flex items-center justify-center '"
          class="relative hover:bg-gray-2 cursor-pointer px-4 h-12 active rounded-md mb-1">
          <JbIcon :iconName="menuItem.icon" />
          <span :class="isSideNavigationToggled ? 'hidden' : 'hidden sm:block'"
            class="ml-3  text-gray-3 font-semibold tracking-wide hover:text-white transition-colors text-base">
            {{ menuItem.label }}</span>
        </li>
      </ul>
    </div>
    <div>
      <div class="text-gray-4 font-normal text-sm py-4 w-auto "
        :class="isSideNavigationToggled ? 'hidden' : 'hidden sm:block'">
        PRODUCTS</div>
      <ul class="mt-1">
        <li
        v-for="productItem in productItems" :key="productItem.id"
          :class="isSideNavigationToggled ? 'flex items-center justify-center' : 'sm:justify-start flex items-center justify-center '"
          class="relative hover:bg-gray-2 cursor-pointer px-4 h-12 active rounded-md mb-1">
          <JbIcon :iconName="productItem.icon" />
          <span :class="isSideNavigationToggled ? 'hidden' : 'hidden sm:block'"
            class="ml-3  text-gray-3 font-semibold tracking-wide hover:text-white transition-colors text-base">
            {{ productItem.label }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>
<script setup lang="ts">
import JbIcon from './SharedComponents/JbIcon.vue';
import JbHeader from './SharedComponents/JbHeader.vue';
import { ref } from "vue"

const isSideNavigationToggled = ref(false)
const menuItems = ref([
  { id: 1, label: 'Dashboard', icon: 'SmartHome' },
  { id: 2, label: 'Order Management', icon: 'ShoppingCart' },
  { id: 3, label: 'Brand', icon: 'StarBrand' },
]);
const productItems = ref([
  { id: 1, label: 'Add Products', icon: 'CirclePlus' },
  { id: 2, label: 'Product List', icon: 'ProductBox' },
]);

const emits = defineEmits<{
  (e: "toggle-side-navigation", isSideNavigationToggled: boolean): void
}>()

const toggleSideNavigation = () => {
  isSideNavigationToggled.value = !isSideNavigationToggled.value
  emits("toggle-side-navigation", isSideNavigationToggled.value)
}
const openSideNavigation = () => {
  isSideNavigationToggled.value = false
  emits("toggle-side-navigation", isSideNavigationToggled.value)
}
</script>
<style>
li.active {
  background: #F3F4F8;

}

li.active span {
  color: #23272E;
}
</style>