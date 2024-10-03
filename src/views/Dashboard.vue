<template>
  <div>
    <div class="flex flex-wrap lg:flex-nowrap w-full gap-4">
      <div
        class="w-full lg:w-[35%] bg-white rounded-lg h-[199px] py-5 flex justify-between items-center px-5 2xl:pl-20"
      >
        <div class="flex items-center mr-5">
          <JbIcon iconName="BusinessFinance" />
        </div>
        <div class="h-[139px] bg-gray-5 w-1"></div>
        <div>
          <p class="text-lg font-semibold text-gray-3">Total Sales & Costs</p>
          <p class="text-gray-4 text-sm font-medium">Last 7 days</p>
          <p class="text-gray-3 font-bold text-32px mt-6">$350K</p>
          <div>
            <JbIcon iconName="ProgressArrow" />
            <span class="text-green-1 text-sm font-medium mx-2">8.56k</span>
            <span class="text-gray-4 text-sm font-medium mr-2"
              >vs Last 7 days</span
            >
          </div>
        </div>
      </div>
      <div class="w-full lg:w-[25%] bg-white rounded-lg h-[199px] p-5">
        <div class="flex">
          <JbIcon iconName="Profit" />
          <div class="ml-4">
            <p class="text-lg font-semibold text-gray-3">Total Profit</p>
            <p class="text-gray-4 text-sm font-medium">Last 7 days</p>
          </div>
        </div>
        <p class="text-gray-3 font-bold text-32px mt-6">50K</p>
        <div>
          <JbIcon iconName="ProgressArrow" />
          <span class="text-green-1 text-sm font-medium mx-2">12%</span>
          <span class="text-gray-4 text-sm font-medium mr-2"
            >vs Last 7 days</span
          >
        </div>
      </div>
      <div class="w-full lg:w-[40%] bg-white rounded-lg h-[199px] p-5">
        <div
          v-for="(countryStatistic, index) in countryStatistics"
          :key="index"
          class="flex items-center justify-center mb-2"
        >
          <div class="flex">
            <JbAvatar
              size="xl"
              :fullName="countryStatistic.country"
              :imageSrc="countryStatistic.imageSrc"
            />
            <div class="ml-2 mr-4">
              <p class="text-lg font-semibold text-gray-3">
                {{ countryStatistic.value }}
              </p>
              <p class="text-gray-4 text-sm font-medium whitespace-nowrap w-20">
                {{ countryStatistic.country }}
              </p>
            </div>
          </div>
          <div
            class="mr-2 w-full bg-gray-200 max-w-sm mx-auto rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="bg-blue-2 text-xs leading-none py-1 rounded-full"
              :style="{ width: countryStatistic.percentage }"
            ></div>
          </div>
          <div
            :class="countryStatistic.status === 'loss' ? 'rotate-180' : ''"
            v-if="countryStatistic.imageSrc"
          >
            <JbIcon
              iconName="Arrow"
              :svgFill="
                countryStatistic.status === 'profit'
                  ? 'stroke-green-2'
                  : 'stroke-red-500'
              "
            />
          </div>
          <span
            class="text-sm font-medium mx-2"
            :class="
              countryStatistic.status === 'loss'
                ? 'text-red-500'
                : 'text-green-1'
            "
            >{{ countryStatistic.percentage }}</span
          >
        </div>
      </div>
    </div>
    <div class="w-full rounded-lg mt-4">
      <div class="flex flex-wrap bg-white">
        <div
          class="w-full lg:flex-1 px-4 pt-6 h-48 flex justify-between items-center"
        >
          <div class="flex justify-center items-center ml-12">
            <JbAvatar size="xl" fullName="Robert Fox" />
            <div class="ml-2">
              <p class="text-lg font-semibold text-gray-3">Robert Fox</p>
              <p class="text-gray-4 text-sm font-medium">robert@gmail.com</p>
            </div>
          </div>
          <div class="justify-end h-[139px] bg-gray-5 w-1 lg:flex hidden"></div>
        </div>
        <div
          class="w-full lg:flex-1 pt-6 px-4 flex justify-between items-center"
        >
          <div class="w-full">
            <p class="text-13px font-medium text-gray-4">
              PERSONAL INFORMATION
            </p>
            <div
              v-for="(info, index) in personalInfo"
              :key="index"
              class="flex justify-between items-center w-60 my-2"
            >
              <p class="font-semibold text-13px text-gray-3">
                {{ info.label }}
              </p>
              <p class="font-semibold text-13px text-gray-3">
                {{ info.value }}
              </p>
            </div>
          </div>
          <div class="justify-end h-[139px] bg-gray-5 w-1 lg:flex hidden"></div>
        </div>

        <div
          class="w-full lg:flex-1 pt-6 px-4 flex justify-between items-center"
        >
          <div class="w-9/12">
            <p class="text-13px font-medium text-gray-4 uppercase">
              Shipping Address
            </p>
            <p class="font-semibold text-13px text-gray-3 my-2">
              3517 W. Gray St. Utica, Pennsylvania 57867
            </p>
            <div class="flex justify-between mt-4">
              <div
                v-for="(shippingDetail, index) in shippingDetails"
                :key="index"
              >
                <p class="font-bold text-2xl text-gray-3">
                  {{ shippingDetail.count }}
                </p>
                <p class="font-medium text-13px text-gray-4">
                  {{ shippingDetail.label }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <JbTab :tabs="ordersTabs" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import JbIcon from '../components/SharedComponents/JbIcon.vue';
import JbAvatar from '../components/SharedComponents/JbAvatar.vue';
import JbTab from '../components/SharedComponents/JbTab.vue';
import OrdersTable from '../components/OrdersTable.vue';
import { ref, markRaw } from 'vue';

const countryStatistics = ref([
  {
    imageSrc: 'src/images/america.jpg',
    value: '30k',
    country: 'United States',
    percentage: '25.8%',
    status: 'profit',
  },
  {
    imageSrc: 'src/images/brazil.jpg',
    value: '26k',
    country: 'Brazil',
    percentage: '16.2%',
    status: 'loss',
  },
  {
    imageSrc: 'src/images/australia.png',
    value: '17k',
    country: 'Australia',
    percentage: '11.9%',
    status: 'loss',
  },
]);

const shippingDetails = ref([
  { count: 150, label: 'Total Order' },
  { count: 140, label: 'Completed' },
  { count: 10, label: 'Cancelled' },
]);

const personalInfo = ref([
  { label: 'Contact Number', value: '(201) 555-0124' },
  { label: 'Date of Birth', value: '1 Jan, 1985' },
  { label: 'Member Since', value: '3 March, 2023' },
]);

const ordersTabs = ref([
  {
    label: 'All Orders',
    component: markRaw(OrdersTable),
  },
  {
    label: 'Completed',
    component: markRaw(OrdersTable),
  },
  {
    label: 'Cancelled',
    component: markRaw(OrdersTable),
  },
]);
</script>
<style scoped></style>
