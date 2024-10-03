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
    <div class="flex justify-between">
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
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Completed';
}

const searchClient = ref<string>('');
const isLoading = ref<boolean>(false);
const status = ref<string>('All');
const statusOptions = ref<string[]>([
  'All',
  'Cancelled',
  'Completed',
  'Pending',
  'Delivered',
  'Shipped',
]);
const selectedDateRange = ref<DateRangeDTO>({
  start: convertToISODate(new Date().toISOString(), 'start'),
  end: convertToISODate(new Date().toISOString(), ''),
});
const pageSize = ref<number>(10);
const pageNumber = ref<number>(1);
const pageSizeOptions = ref<any>([
  { id: 10, label: '10' },
  { id: 25, label: '25' },
  { id: 50, label: '50' },
]);

const filteredAndPaginatedOrders = computed(() => {
  let filtered = ordersTableData.value;
  if (status.value !== 'All') {
    filtered = filtered.filter((order) => order.status === status.value);
  } else {
    filtered = ordersTableData.value;
  }

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

const ordersTableData = ref<KeyValue[]>([
  {
    id: 1,
    first_name: 'Darice',
    last_name: 'Lydden',
    email: 'dlydden0@hp.com',
    quantity: 51,
    unit_price: 237.38,
    total_price: 12106.38,
    order_date: '2024-10-4T06:33:59Z',
    shipping_address: '402 Graedel Alley',
    payment_method: 'PayPal',
    status: 'Pending',
  },
  {
    id: 2,
    first_name: 'Ainslie',
    last_name: 'Biskup',
    email: 'abiskup1@ow.ly',
    quantity: 26,
    unit_price: 917.35,
    total_price: 23851.1,
    order_date: '2024-10-31T13:03:54Z',
    shipping_address: '58540 Division Place',
    payment_method: 'Credit Card',
    status: 'Shipped',
  },
  {
    id: 3,
    first_name: 'Thekla',
    last_name: 'Carriage',
    email: 'tcarriage2@wisc.edu',
    quantity: 31,
    unit_price: 284.47,
    total_price: 8818.57,
    order_date: '2024-10-09T15:53:18Z',
    shipping_address: '67082 Arrowood Place',
    payment_method: 'Cash on Delivery',
    status: 'Pending',
  },
  {
    id: 4,
    first_name: 'Charlotte',
    last_name: 'Dielhenn',
    email: 'cdielhenn3@comcast.net',
    quantity: 38,
    unit_price: 367.59,
    total_price: 13968.42,
    order_date: '2024-10-22T02:03:06Z',
    shipping_address: '8548 Fieldstone Way',
    payment_method: 'Credit Card',
    status: 'Delivered',
  },
  {
    id: 5,
    first_name: 'Valery',
    last_name: 'Antonietti',
    email: 'vantonietti4@fda.gov',
    quantity: 33,
    unit_price: 932.25,
    total_price: 30764.25,
    order_date: '2024-10-08T07:12:28Z',
    shipping_address: '2 High Crossing Pass',
    payment_method: 'PayPal',
    status: 'Shipped',
  },
  {
    id: 6,
    first_name: 'Lowell',
    last_name: 'Mouncher',
    email: 'lmouncher5@issuu.com',
    quantity: 34,
    unit_price: 635.68,
    total_price: 21613.12,
    order_date: '2020-12-14T14:56:11Z',
    shipping_address: '5 Kropf Point',
    payment_method: 'PayPal',
    status: 'Delivered',
  },
  {
    id: 7,
    first_name: 'Lesya',
    last_name: 'Sprowson',
    email: 'lsprowson6@aol.com',
    quantity: 51,
    unit_price: 642.53,
    total_price: 32769.03,
    order_date: '2024-02-25T08:45:28Z',
    shipping_address: '7 Clove Drive',
    payment_method: 'PayPal',
    status: 'Pending',
  },
  {
    id: 8,
    first_name: 'Starr',
    last_name: 'Dikelin',
    email: 'sdikelin7@cloudflare.com',
    quantity: 63,
    unit_price: 955.47,
    total_price: 60194.61,
    order_date: '2024-01-23T11:35:05Z',
    shipping_address: '4 Boyd Pass',
    payment_method: 'Credit Card',
    status: 'Delivered',
  },
  {
    id: 9,
    first_name: 'Kore',
    last_name: 'Casterot',
    email: 'kcasterot8@bluehost.com',
    quantity: 12,
    unit_price: 959.73,
    total_price: 11516.76,
    order_date: '2022-02-20T12:44:44Z',
    shipping_address: '3 Burrows Street',
    payment_method: 'Credit Card',
    status: 'Shipped',
  },
  {
    id: 10,
    first_name: 'Bunni',
    last_name: 'Marshland',
    email: 'bmarshland9@vistaprint.com',
    quantity: 6,
    unit_price: 918.54,
    total_price: 5511.24,
    order_date: '2020-06-04T19:19:21Z',
    shipping_address: '244 Calypso Park',
    payment_method: 'PayPal',
    status: 'Delivered',
  },
  {
    id: 11,
    first_name: 'Eugenius',
    last_name: 'Schulkins',
    email: 'eschulkinsa@scribd.com',
    quantity: 75,
    unit_price: 196.79,
    total_price: 14759.25,
    order_date: '2020-07-19T16:58:28Z',
    shipping_address: '1427 Waxwing Drive',
    payment_method: 'Credit Card',
    status: 'Pending',
  },
  {
    id: 12,
    first_name: 'Martainn',
    last_name: 'Gawkes',
    email: 'mgawkesb@mapquest.com',
    quantity: 2,
    unit_price: 304.95,
    total_price: 609.9,
    order_date: '2024-07-28T16:41:49Z',
    shipping_address: '45902 Pine View Pass',
    payment_method: 'PayPal',
    status: 'Pending',
  },
  {
    id: 13,
    first_name: 'Quent',
    last_name: 'Abdie',
    email: 'qabdiec@webmd.com',
    quantity: 70,
    unit_price: 194.11,
    total_price: 13587.7,
    order_date: '2022-03-06T18:57:14Z',
    shipping_address: '8799 Green Trail',
    payment_method: 'Cash on Delivery',
    status: 'Shipped',
  },
  {
    id: 14,
    first_name: 'Cass',
    last_name: 'Poker',
    email: 'cpokerd@comcast.net',
    quantity: 62,
    unit_price: 755.63,
    total_price: 46849.06,
    order_date: '2020-04-25T01:24:42Z',
    shipping_address: '446 American Ash Circle',
    payment_method: 'Cash on Delivery',
    status: 'Delivered',
  },
  {
    id: 15,
    first_name: 'Chlo',
    last_name: 'Densumbe',
    email: 'cdensumbee@illinois.edu',
    quantity: 29,
    unit_price: 305.46,
    total_price: 8858.34,
    order_date: '2022-09-09T12:19:41Z',
    shipping_address: '9 Moulton Circle',
    payment_method: 'Credit Card',
    status: 'Shipped',
  },
  {
    id: 16,
    first_name: 'Ardith',
    last_name: 'McDougall',
    email: 'amcdougallf@businessinsider.com',
    quantity: 77,
    unit_price: 597,
    total_price: 45969,
    order_date: '2022-12-22T06:36:48Z',
    shipping_address: '4 Aberg Court',
    payment_method: 'Credit Card',
    status: 'Pending',
  },
  {
    id: 17,
    first_name: 'Moyra',
    last_name: 'Rive',
    email: 'mriveg@hostgator.com',
    quantity: 82,
    unit_price: 749.7,
    total_price: 61475.4,
    order_date: '2024-06-04T04:45:25Z',
    shipping_address: '088 Toban Crossing',
    payment_method: 'Cash on Delivery',
    status: 'Pending',
  },
]);

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
      // ordersTableData.value = response;
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
