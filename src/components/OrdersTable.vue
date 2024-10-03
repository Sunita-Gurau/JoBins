<template>
  <div>
    {{ activeTab }} test
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
        :isLoading="isLoading"
        borderType="rounded"
        :stickyHead="false"
      >
        <template #cell-status="{ item, header }">
          <p
            :class="{
              'text-green-500':
                item[header.key] === 'Completed' ||
                item[header.key] === 'Delivered',
              'text-yellow-500': item[header.key] === 'Pending',
              'text-blue-500': item[header.key] === 'Shipped',
              'text-red-500': item[header.key] === 'Cancelled',
            }"
          >
            {{ item[header.key] }}
          </p>
        </template>
        <template #cell-order_date="{ item, header }">
          <p>
            {{ getDateTime(item[header.key]) }}
          </p>
        </template>
        <template #cell-action="{}">
          <p class="text-[#0F60FF] cursor-pointer">View Details</p>
        </template>
      </JbTable>
    </div>
    <JbPagination
      class="pt-3"
      :total-items="ordersTableData.length"
      :items-per-page="pageSize"
      :current-page="pageNumber"
      @handle-page-changed="handlePageNumber"
    />
  </div>
</template>
<script setup lang="ts">
import JbSearchBar from './SharedComponents/JbSearchBar.vue';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import JbSelect from './SharedComponents/JbSelect.vue';
import JbRangeCalendar from './SharedComponents/JbRangeCalendar.vue';
import { convertToISODate, getDateTime } from '../utils/dateTimeUtils';
import { DateRangeDTO, KeyValue, TableHeader } from '../types/DataTypes';
import JbPagination from './SharedComponents/JbPagination.vue';
import JbTable from './SharedComponents/JbTable.vue';
import { getDashboardOrderList } from '../api/dashboardApi';
import { makeApiRequest } from '../api/apiHelper';

const searchClient = ref<string>('');
const isLoading = ref<boolean>(false);
const status = ref<string>('All ');
const statusOptions = ref<string[]>([
  'All ',
  'Cancelled',
  'Completed',
  'Pending',
  'Delivered',
]);
const selectedDateRange = ref<DateRangeDTO>({
  start: convertToISODate(new Date().toISOString(), 'start'),
  end: convertToISODate(new Date().toISOString(), ''),
});
const pageSize = ref<number>(0);
const pageNumber = ref<number>(0);
const ordersTableData = ref<KeyValue[]>([]);
const ordersTableHeaders: TableHeader[] = [
  {
    key: 'id',
    label: 'id',
  },
  {
    key: 'first_name',
    label: 'customer',
  },
  {
    key: 'order_date',
    label: 'date',
  },
  {
    key: 'total_price',
    label: 'total',
  },
  {
    key: 'payment_method',
    label: 'method',
  },
  {
    key: 'status',
    label: 'status',
  },
  {
    key: 'action',
    label: 'action',
  },
];

const fetchOrderList = () => {
  isLoading.value = true;
  makeApiRequest<any>(getDashboardOrderList())
    .then((response) => {
      console.log(response, 'response');
      ordersTableData.value = response;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onBeforeMount(() => {
  console.log(
    localStorage.getItem('activeTab'),
    "localStorage.getItem('activeTab')",
  );

  fetchOrderList();
});

// const activeTab = ref<string | null>(null);

// const hasUserProfileUpdateAccess = computed(() => {
//   return localStorage.getItem('activeTab');
// });
// watch(
//   () => hasUserProfileUpdateAccess.value,
//   () => {
//     console.log('hitteddd');

//     activeTab.value = hasUserProfileUpdateAccess.value;
//     console.log(activeTab, 'activeTab');
//   },
//   {
//     immediate: true,
//   },
// );
</script>
<style scoped></style>
