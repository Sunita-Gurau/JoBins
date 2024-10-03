<template>
  <div class="jb-scrollbar overflow-auto" :class="getBorderTypeClasses">
    <table
      :id="props.tableId"
      :ref="tableRefId"
      :class="props.tableHeight"
      class="w-full whitespace-nowrap relative overflow-auto"
    >
      <caption
        v-if="props.tableName"
        class="text-left font-bold"
        :class="[props.captionStyle ? props.captionStyle : 'text-xl']"
      >
        {{
          props.tableName
        }}
      </caption>
      <thead>
        <tr class="bg-gray-2 rounded-tl-lg rounded-tr-lg">
          <th
            v-for="header in props.headers"
            :key="header.key"
            :class="[
              'px-5  h-10 ',
              props.tableHeadStyle ? props.tableHeadStyle : '',
            ]"
          >
            <div
              class="flex gap-2 items-center"
              :class="
                isHeaderSortable(header.sortable)
                  ? 'cursor-pointer'
                  : 'cursor-default'
              "
              @click="
                isHeaderSortable(header.sortable)
                  ? sortedData(header.key)
                  : null
              "
            >
              <div
                class="text-13px uppercase text-gray-4 text-left font-medium"
              >
                {{ header.label }}
              </div>
              <div
                v-if="isHeaderSortable(header.sortable)"
                class="flex flex-col"
              ></div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody
        class="divide-y divide-gray-5"
        :class="props.tableBodyStyle ? props.tableBodyStyle : ''"
      >
        <template v-if="props.isLoading">
          <p
            v-if="props.loadingText"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base text-gray-3 font-bold bg-white"
          >
            {{ props.loadingText }}
          </p>

          <tr
            v-for="item in loadingRows"
            :key="item.id"
            :class="{ 'animate-pulse': !props.loadingText }"
            class="bg-white border-b border-gray-5"
          >
            <td v-for="header in headers" :key="header.key" class="p-3.5">
              <div class="h-2 w-2/3 bg-gray-2 rounded"></div>
            </td>
          </tr>
        </template>
        <template v-else-if="props.records.length">
          <tr
            v-for="(item, index) in props.records"
            :key="index"
            class="jb-transition relative hover:bg-gray-2"
            :class="[
              { 'cursor-pointer': props.isClickable },
              props.tableRowStyle ? props.tableRowStyle : '',
              props.heightRow ? props.heightRow : 'h-8',
            ]"
            @click="props.isClickable ? emits('onRowClicked', item) : null"
          >
            <td
              v-for="header in props.headers"
              :key="header.key"
              class="px-5"
              :class="
                props.tableTdStyle
                  ? props.tableTdStyle
                  : 'max-w-220px overflow-hidden'
              "
            >
              <div
                class="inline-flex !font-normal text-[15px] text-gray-3"
                :class="[
                  props.shouldStopClickEvent
                    ? 'cursor-default'
                    : props.isClickable
                      ? 'cursor-pointer'
                      : 'cursor-default',
                ]"
              >
                <slot
                  :name="'cell-' + header.key"
                  :item="item"
                  :header="header"
                >
                  <p>
                    <span v-if="item[header.key] === ' '"> - </span>
                    <span v-else>
                      {{ item[header.key] || '-' }}
                    </span>
                  </p>
                </slot>
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colspan="props.headers.length">
              <slot name="no-data" :header="props.headers">
                <div class="flex flex-col items-center justify-center h-80">
                  <div>
                    <JbIcon iconName="NoData" />
                  </div>
                  <div class="text-sm text-gray-1 mt-4">No data found</div>
                </div>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot
        v-if="
          !props.isLoading && props.totals.length === 1 && props.records.length
        "
        class="sticky bottom-0 right-0"
      >
        <tr v-for="(total, index) in props.totals" :key="index">
          <td
            v-for="header in props.headers"
            :key="header.key"
            class="px-4 bg-gray-2 h-10"
          >
            <div class="text-left flex items-center">
              <p class="text-13px text-gray-3 font-bold">
                {{ total[header.key] }}
              </p>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import JbIcon from './JbIcon.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, ref, onUnmounted } from 'vue';
import type { SortParamsDTO, TableHeader } from '../../types/DataTypes';
export interface TableTotal {
  [key: string]: string | number;
}
export interface TableData {
  [key: string]: any;
}
type JbTableProps = {
  headers: TableHeader[];
  totals?: TableTotal[];
  records: TableData[];
  tableName?: string;
  captionStyle?: string;
  tableHeadStyle?: string;
  tableBodyStyle?: string;
  tableRowStyle?: string;
  tableTdStyle?: string;
  isSortable?: boolean;
  sortParams?: SortParamsDTO;
  isClickable?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  stickyHead?: boolean;
  shouldStopClickEvent?: boolean;
  tableId?: string;
  borderType?: string;
  heightRow?: string;
  tableHeight?: string;
};

const props = withDefaults(defineProps<JbTableProps>(), {
  totals: () => [],
  tableName: '',
  captionStyle: '',
  tableHeadStyle: '',
  tableBodyStyle: '',
  tableRowStyle: '',
  tableTdStyle: '',
  isSortable: true,
  sortParams: () => ({}),
  isClickable: false,
  isLoading: true,
  stickyHead: true,
  shouldStopClickEvent: true,
  tableId: '',
  borderType: 'bottom-rounded',
  heightRow: 'h-12',
});

const tableRefId = ref<string>(uuidv4().slice(0, 5));
const order = ref<string>('');
const currentSort = ref<string>('');
const activeSortIcon = ref<string>('');
const positionFromTop = ref<number>(120);

const windowDimensions = ref<{
  width: number;
  height: number;
}>({
  width: window.innerWidth,
  height: window.innerHeight,
});

const isHeaderSortable = (isSortable?: boolean) => {
  return props.isSortable && (isSortable !== false || isSortable === undefined);
};

const loadingRows = computed<{ id: string }[]>(() => {
  const numberOfLoadingRows = 10;
  const loadingRows = Array.from({ length: numberOfLoadingRows }, (_, i) => ({
    id: `loading_${i}`,
  }));
  return loadingRows;
});

const emits = defineEmits<{
  (e: 'sortTable', sortParams: SortParamsDTO): void;
  (e: 'onRowClicked', item: any): void;
}>();

onMounted(() => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const sortBy = params.get('sortBy');
  const sortOrder = params.get('sortOrder');
  activeSortIcon.value = sortBy ?? '';
  order.value = sortOrder ?? '';

  window.addEventListener('resize', isMobile);
  if (props.stickyHead) {
    window.addEventListener('scroll', onWindowScroll);
  }
  const tableRef = document.querySelector('table');
  if (!tableRef) return;

  const drawerElement = closestWithClass(
    tableRef.parentElement,
    'drawer-container',
  );

  // set the positionFromTop value to 0 and add a scroll event listener to the drawer element
  if (drawerElement && props.stickyHead) {
    positionFromTop.value = 0;
    drawerElement.addEventListener('scroll', onWindowScroll);
  }
});

// Find the nearest ancestor element with a specific class in the DOM.
function closestWithClass(element: HTMLElement | null, className: string) {
  while (element) {
    if (element.classList.contains(className)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

const getBorderTypeClasses = computed(() => {
  const borderClassMap: Record<string, string> = {
    rounded: 'rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg',
    'top-rounded': 'rounded-tl-lg rounded-tr-lg',
    'bottom-rounded': 'rounded-bl-lg rounded-br-lg',
    pointed: '',
  };

  return borderClassMap[props.borderType] || '';
});

const sortedData = (sortedBy: string) => {
  activeSortIcon.value = sortedBy;
  currentSort.value = props.sortParams.sortBy || activeSortIcon.value;
  if (currentSort.value === sortedBy) {
    order.value = props.sortParams.sortOrder || '';
    order.value =
      order.value === 'ASC' ? 'DESC' : order.value === 'DESC' ? '' : 'ASC';
  } else {
    order.value = 'ASC';
  }
  let sortParams: SortParamsDTO = {};
  if (order.value) {
    sortParams = {
      sortBy: sortedBy,
      sortOrder: order.value === 'ASC' ? 'ASC' : 'DESC',
    };
  } else {
    sortParams = {};
  }
  emits('sortTable', sortParams);
};

const onWindowScroll = () => {
  let thead;
  let table;
  if (props.tableId !== '') {
    table = document.getElementById(props.tableId);
    thead = document.getElementById(props.tableId)?.querySelector('thead');
  } else {
    table = document.querySelector('table');
    thead = document.querySelector('thead');
  }
  if (table?.getBoundingClientRect().top !== undefined) {
    if (table?.getBoundingClientRect().top <= positionFromTop.value) {
      const yTranslation = Math.floor(
        Math.abs(positionFromTop.value - table?.getBoundingClientRect().top),
      );
      if (thead) {
        thead?.style.setProperty('transform', `translateY(${yTranslation}px)`);
        thead?.style.setProperty('position', 'sticky');
        thead?.style.setProperty('z-index', '1');
      }
    } else {
      thead?.style.removeProperty('transform');
    }
  }
};

const isMobile = () => {
  const width = window.innerWidth;
  if (width <= 768) {
    positionFromTop.value = 70;
  } else {
    positionFromTop.value = 120;
  }
};

const handleResize = () => {
  windowDimensions.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);

  if (props.stickyHead) {
    window.removeEventListener('scroll', () => {
      //destroy the function
    });
    window.removeEventListener('resize', () => {
      //destroy the function
    });
  }
});
</script>

<style scoped>
.jb-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 0.2rem;
}

.phone-call {
  animation: beat 0.3s infinite alternate;
}
@keyframes beat {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}
</style>
