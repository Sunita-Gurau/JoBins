<template>
    <div
      :class="avatarClasses"
      class="mr-2 relative flex justify-center items-center rounded-full font-bold text-white"
    >
      {{ avatarContent }}
      <img
        v-if="hasImage"
        :class="[props.size ? 'avatar-' + props.size : '']"
        :src="tempImageSrc ? tempImageSrc : props.imageSrc"
        class="rounded-full"
        :alt="props.fullName"
      />
  
    </div>
  </template>
  
  <script setup lang="ts">
    import { computed, ref } from "vue"
  
    type BgAvatarProps = {
      fullName: string
      imageSrc?: string
      size?: string
      bgColor?: string
   
    }
  
    const props = withDefaults(defineProps<BgAvatarProps>(), {
      imageSrc: "",
      size: "md",
      bgColor: "black",
  
    })
    const tempImageSrc = ref<string>("")
  
    const hasImage = computed(() => props.imageSrc && props.imageSrc.length > 0)
  
    const avatarContent = computed(() => {
      if (hasImage.value) {
        return ""
      } else {
        const names = props.fullName.trim().split(" ")
        const firstInitial = names[0].charAt(0).toUpperCase()
        const middleInitial = names
          .slice(1, -1)
          .map((name) => name.charAt(0).toUpperCase())
          .join("")
        const lastInitial = names[names.length - 1].charAt(0).toUpperCase()
        if (names.length >= 3) {
          return `${firstInitial}${middleInitial}${lastInitial}`
        } else if (names.length === 2) {
          return `${firstInitial}${lastInitial}`
        } else if (names.length === 1) {
          return names[0].charAt(0).toUpperCase()
        } else {
          return ""
        }
      }
    })
  

  
    const avatarClasses = computed(() => {
      return [
        props.size ? "avatar-" + props.size : "",
        props.bgColor ? "bg-" + props.bgColor : "",
      ]
    })
  
  
  </script>
  
  <style scoped>
    .avatar-sm {
      width: 1.3rem;
      height: 1.3rem;
      font-size: 9px;
    }
    .avatar-md {
      width: 2rem;
      height: 2rem;
      font-size: 16px;
    }
    .avatar-lg {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 16px;
    }
    .avatar-xl {
      width: 3rem;
      height: 3rem;
      font-size: 20px;
    }
    .avatar-2xl {
      width: 3.5rem;
      height: 3.5rem;
      font-size: 24px;
    }
    .avatar-3xl {
      width: 4rem;
      height: 4rem;
      font-size: 32px;
    }
    .avatar-4xl {
      width: 5.375rem;
      height: 5.375rem;
      font-size: 32px;
    }
  </style>