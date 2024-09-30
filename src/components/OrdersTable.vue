<template>
  <div class="">
    <div class="w-[200px]">
      <JbSearchBar
        v-model="searchClient"
        :has-border="false"
        placeholder="Search ..."
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import JbSearchBar from './SharedComponents/JbSearchBar.vue';
import { ref } from 'vue';

const searchClient = ref<string>('');
</script>
<style scoped></style>
