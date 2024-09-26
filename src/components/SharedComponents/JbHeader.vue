<template>
    <header class="text-secondary-3" :class="`header-${headingLevel}`">
      <component
        :is="props.headingLevel"
        class="font-bold"
        :class="getTextSizeStyle()"
        >{{ props.text }}</component
      >
    </header>
  </template>
  
  <script setup lang="ts">
    type BgHeaderProps = {
      headingLevel?: string
      text?: string
    }
  
    const props = withDefaults(defineProps<BgHeaderProps>(), {
      headingLevel: "h6",
    })
  
    const getTextSizeStyle = () => {
      const headingLevelSizes: { [key: string]: string } = {
        h1: "text-4xl",
        h2: "text-2xl",
        h3: "text-xl",
        h4: "text-lg",
        h5: "text-base",
        h6: "text-sm",
      }
      return headingLevelSizes[props.headingLevel] || "text-sm"
    }
  </script>