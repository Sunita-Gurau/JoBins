<template>
  <div class="flex justify-between lg:flex-nowrap flex-wrap">
    <div class="flex gap-4 lg:flex-nowrap flex-wrap">
      <div class="w-[150px]">
        <JbSelect
          v-model="status"
          name="status"
          placeholder="Status"
          optionSelected="object"
          selectTheme="gray"
          svgFillColor="stroke-gray-4"
          leftIcon="Arrow"
          :options="statusOptions"
          selectType="normalSelect"
        />
      </div>

      <div class="w-[200px]">
        <JbSearchBar
          v-model="searchClient"
          :has-border="false"
          placeholder="Search ..."
        />
      </div>
    </div>
    <div class="">
      <JbRangeCalendar v-model="selectedDateRange" />
    </div>
  </div>
</template>
<script setup lang="ts">
import JbSearchBar from './SharedComponents/JbSearchBar.vue';
import { ref } from 'vue';
import JbSelect from './SharedComponents/JbSelect.vue';
import JbRangeCalendar from './SharedComponents/JbRangeCalendar.vue';
import { convertToISODate } from '../utils/dateTimeUtils';
import { DateRangeDTO } from '../types/DataTypes';

const searchClient = ref<string>('');
const status = ref<string>('All ');
const statusOptions = ref<string[]>([
  'All ',
  'Cancelled',
  'Completed',
  'Pending',
]);
const selectedDateRange = ref<DateRangeDTO>({
  start: convertToISODate(new Date().toISOString(), 'start'),
  end: convertToISODate(new Date().toISOString(), ''),
});
</script>
<style scoped></style>
