<template>
 <div class="flex justify-between items-center m-6">
    <div class="flex justify-center items-center">
    <div class="mr-4 cursor-pointer">
   <div  @click="openSideNavigation"> <JbIcon iconName="JoBinsLogo" /></div>
    </div>  
<div v-if="!isSideNavigationToggled">  <JbHeader headingLevel="h2" text="JoBins"/></div>
  </div>  
  <div class=" cursor-pointer" @click="toggleSideNavigation"
  v-if="!isSideNavigationToggled">
    <JbIcon iconName="TogglerMenu"/>
  </div>



 </div>
 <div>
    
  </div>
</template>
<script setup lang="ts">
import JbIcon from './SharedComponents/JbIcon.vue';
import JbHeader from './SharedComponents/JbHeader.vue';
import {ref } from "vue"

const isSideNavigationToggled = ref(false)

const emits = defineEmits<{
    (e: "toggle-side-navigation", isSideNavigationToggled: boolean): void
  }>()

  const toggleSideNavigation = () => {
    isSideNavigationToggled.value = !isSideNavigationToggled.value
    emits("toggle-side-navigation", isSideNavigationToggled.value)
  }
  const openSideNavigation = () => {
    isSideNavigationToggled.value = !isSideNavigationToggled.value
    emits("toggle-side-navigation", isSideNavigationToggled.value)
  }
</script>
