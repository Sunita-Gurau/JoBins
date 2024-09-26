<template>
<div class="flex">
  <div style="transition: all 500ms ease-in-out;"
  :class="isSideNavigationToggled ? 'w-18': 'w-1/6'"><SideNav  @toggle-side-navigation="toggleSideNavigation"/></div>
  <div class=" bg-gray-1 min-h-screen"
  :class="isSideNavigationToggled ? 'w-full': 'w-5/6'">
    <div class="m-6 flex justify-between">
      <JbHeader headingLevel="h2" text="Dashboard"/>
      <div class="flex items-center justify-center">
        <div class="relative mr-4">
          <JbIcon iconName="NotificationBell" />
          <div class="bg-red-500 w-4 h-4 rounded-full absolute -top-[3px] -right-[3px] text-center text-white text-13px">4</div>
        </div>
      <div class="relative ">
        <JbAvatar
          size="xl"
          fullName="Sunita Gurau"
          />
<div class="flex items-center justify-center bg-white w-5 h-5 rounded-full absolute -bottom-[6px] right-[4px] text-center text-white text-13px">
  <div class="bg-green-500 w-3 h-3 rounded-full  "></div>

</div>      </div>
     </div>
    </div>
    <RouterView />
  </div>
</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideNav from "../src/components/SideNav.vue";
import JbHeader from './components/SharedComponents/JbHeader.vue';
import JbIcon from "./components/SharedComponents/JbIcon.vue";
import JbAvatar from "./components/SharedComponents/JbAvatar.vue";
import {ref } from "vue"

const isSideNavigationToggled = ref(false)


const toggleSideNavigation = (isSideNavigation:boolean) => {
  isSideNavigationToggled.value=isSideNavigation
console.log(isSideNavigationToggled,"isSideNavigationToggled");
}
</script>