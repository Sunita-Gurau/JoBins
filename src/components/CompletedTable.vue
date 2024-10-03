<template>
  <div>
    <div class="flex justify-between lg:flex-nowrap flex-wrap">
      <div class="flex gap-4 lg:flex-nowrap flex-wrap">
        <div class="w-full sm:w-[150px]">
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

        <div class="w-full sm:w-[200px]">
          <JbSearchBar
            v-model="searchClient"
            :has-border="false"
            placeholder="Search ..."
          />
        </div>
      </div>
      <div class="mt-4 sm:mt-0">
        <JbRangeCalendar v-model="selectedDateRange" />
      </div>
    </div>
    <div class="bg-white mt-4 rounded-lg">
      <JbTable
        :headers="ordersTableHeaders"
        :records="filteredAndPaginatedOrders"
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
              'text-yellow-500': item[header.key] === 'Completed',
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
        <template #cell-action="{ item }">
          <router-link
            :to="{
              name: 'viewDetail',
              params: { orderId: item.id },
            }"
            class="text-[#0F60FF] cursor-pointer"
          >
            View Details
          </router-link>
        </template>
      </JbTable>
    </div>
    <div class="flex justify-between" v-if="filteredAndPaginatedOrders.length">
      <div class="text-sm flex items-center gap-2 md:mt-0 mt-2">
        <div class="mt-2">Showing</div>
        <div class="max-w-[80px]">
          <JbSelect
            v-model="pageSize"
            name="pageSize"
            gap="mt-2"
            height="h-7"
            selectType="normalSelect"
            optionSelected="objectLabelEmitted"
            :options="pageSizeOptions"
            @selected-option="handlePageSizeFilter"
          />
        </div>
        <div class="mt-2">of {{ filteredAndPaginatedOrders.length }}</div>
      </div>

      <JbPagination
        class="pt-3"
        :total-items="filteredAndPaginatedOrders.length"
        :items-per-page="pageSize"
        :current-page="pageNumber"
        @handle-page-changed="handlePageNumber"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import JbSearchBar from './SharedComponents/JbSearchBar.vue';
import { computed, onBeforeMount, ref, watch } from 'vue';
import JbSelect from './SharedComponents/JbSelect.vue';
import JbRangeCalendar from './SharedComponents/JbRangeCalendar.vue';
import { convertToISODate, getDateTime } from '../utils/dateTimeUtils';
import { DateRangeDTO, KeyValue, TableHeader } from '../types/DataTypes';
import JbPagination from './SharedComponents/JbPagination.vue';
import JbTable from './SharedComponents/JbTable.vue';
import { getDashboardOrderList } from '../api/dashboardApi';
import { makeApiRequest } from '../api/apiHelper';
import { endOfMonth, formatISO, startOfMonth } from 'date-fns';

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_date: string;
  shipping_address: string;
  payment_method: string;
  status: 'Completed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Completed';
}

const searchClient = ref<string>('');
const isLoading = ref<boolean>(false);
const status = ref<string>('All');
const statusOptions = ref<string[]>([
  'All',
  'Cancelled',
  'Completed',
  'Completed',
  'Delivered',
  'Shipped',
]);
const selectedDateRange = ref<DateRangeDTO>({
  start: formatISO(startOfMonth(new Date())),
  end: formatISO(endOfMonth(new Date())),
});
const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);
const pageSizeOptions = ref<any>([
  { id: 10, label: '10' },
  { id: 25, label: '25' },
  { id: 50, label: '50' },
]);

const filteredAndPaginatedOrders = computed(() => {
  let filtered = ordersTableData.value.filter(
    (order) => order.status === 'Completed',
  );

  // Filter by search (first name, last name, or email)
  if (searchClient.value.trim()) {
    filtered = filtered.filter(
      (order) =>
        `${order.first_name} ${order.last_name}`
          .toLowerCase()
          .includes(searchClient.value.toLowerCase()) ||
        order.email.toLowerCase().includes(searchClient.value.toLowerCase()),
    );
  }

  // Filter by date range
  if (selectedDateRange.value.start && selectedDateRange.value.end) {
    const startDate = new Date(selectedDateRange.value.start).getTime();
    const endDate = new Date(selectedDateRange.value.end).getTime();
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.order_date).getTime();
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  //  Pagination
  const startIndex = (pageNumber.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filtered.slice(startIndex, endIndex);
});

const handlePageSizeFilter = (option: any) => {
  pageSize.value = Number(option.id);
  pageNumber.value = 1;
};

const handlePageNumber = (page: number) => {
  pageNumber.value = page;
};

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
  makeApiRequest<Order>(getDashboardOrderList())
    .then((response) => {
      ordersTableData.value = response;
    })
    .finally(() => {
      isLoading.value = false;
    });
};

watch([status, searchClient, selectedDateRange], () => {
  pageNumber.value = 1;
});

onBeforeMount(() => {
  console.log(
    localStorage.getItem('activeTab'),
    "localStorage.getItem('activeTab')",
  );

  fetchOrderList();
});
</script>
<style scoped></style>
