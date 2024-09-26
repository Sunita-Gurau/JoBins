<template>
    <div v-if="svgIcon" class="inline-block align-middle">
      <span :innerHTML="svgIcon" :class="svgFill" class="bg-transition"></span>
    </div>
  </template>
  
  <script lang="ts" setup>
    import * as Icons from "../../utils/iconUtils"
    import { computed } from "vue"
    import type { KeyValue } from "../../types/DataTypes"
  
    const icons: KeyValue = Icons as KeyValue
  
    type BgIconType = {
      iconName: string
      svgFill?: string
    }
  
    const props = withDefaults(defineProps<BgIconType>(), {
      svgFill: "fill-gray-1",
    })
  
    const svgIcon = computed<string>(() => {
      return icons[props.iconName]
    })
  </script>