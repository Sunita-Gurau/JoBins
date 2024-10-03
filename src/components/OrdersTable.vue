<template>
  <div>
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
    <div class="bg-white mt-2 rounded-lg">
      <JbTable
        :headers="ordersTableHeaders"
        :records="ordersTableData"
        :isLoading="false"
        borderType="rounded"
        :stickyHead="false"
      >
        <template #cell-status="{ item, header }">
          <p
            :class="{
              'text-green-500': item[header.key] === 'Completed',
              'text-yellow-500': item[header.key] === 'Pending',
              'text-red-500': item[header.key] === 'Cancelled',
            }"
          >
            {{ item[header.key] }}
          </p>
        </template>
        <template #cell-date="{ item, header }">
          <p>
            {{ getDateTime(item[header.key]) }}
          </p>
        </template>
      </JbTable>
    </div>
    <JbPagination
      class="pt-3"
      :total-items="ordersTableDataTotalElements"
      :items-per-page="pageSize"
      :current-page="pageNumber"
      @handle-page-changed="handlePageNumber"
    />
  </div>
</template>
<script setup lang="ts">
import JbSearchBar from './SharedComponents/JbSearchBar.vue';
import { ref } from 'vue';
import JbSelect from './SharedComponents/JbSelect.vue';
import JbRangeCalendar from './SharedComponents/JbRangeCalendar.vue';
import { convertToISODate, getDateTime } from '../utils/dateTimeUtils';
import { DateRangeDTO, KeyValue, TableHeader } from '../types/DataTypes';
import JbPagination from './SharedComponents/JbPagination.vue';
import JbTable from './SharedComponents/JbTable.vue';

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
const pageSize = ref<number>(0);
const pageNumber = ref<number>(0);
const ordersTableData = ref<KeyValue[]>([
  {
    id: '1',
    customer: 'John Doe',
    date: '2024-09-30T00:00:00Z',
    total: '$100.00',
    method: 'Credit Card',
    status: 'Completed',
  },
  {
    id: '2',
    customer: 'Jane Smith',
    date: '2024-10-01T00:00:00Z',
    total: '$200.00',
    method: 'PayPal',
    status: 'Pending',
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    date: '2024-10-02T00:00:00Z',
    total: '$150.00',
    method: 'Debit Card',
    status: 'Cancelled',
  },
  {
    id: '4',
    customer: 'Emily Clark',
    date: '2024-10-03T00:00:00Z',
    total: '$300.00',
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: '5',
    customer: 'David Wilson',
    date: '2024-10-04T00:00:00Z',
    total: '$250.00',
    method: 'Credit Card',
    status: 'Pending',
  },
]);
const ordersTableDataTotalElements = ref<number>(0);
const ordersTableHeaders: TableHeader[] = [
  {
    key: 'id',
    label: 'id',
  },
  {
    key: 'customer',
    label: 'customer',
  },
  {
    key: 'date',
    label: 'date',
  },
  {
    key: 'total',
    label: 'total',
  },
  {
    key: 'method',
    label: 'method',
  },
  {
    key: 'status',
    label: 'status',
  },
];
</script>
<style scoped></style>
