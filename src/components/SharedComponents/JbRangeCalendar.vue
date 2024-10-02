<template>
  <div class="relative">
    <div>
      <jbButton variant="secondary" @click="toggleCalendar">
        <span
          :class="props.weekRangeInputClass"
          class="flex items-center gap-1.5"
        >
          {{ formattedDateRange }}
          <JbIcon iconName="Arrow" svgFill="stroke-gray-4" />
        </span>
      </jbButton>
    </div>
    <transition name="list-down">
      <div>
        <div v-if="isOpen">
          <div class="calendar-range-overlay" @click="onClickOutside"></div>
          <div
            class="calendar-container absolute z-30 inline-flex bg-white border rounded-lg shadow-lg mt-1.5"
            :class="calendarAlign === 'l' ? ['right-' + alignmentCalendar] : ''"
          >
            <div
              v-if="isCalendarSideNavVisible"
              class="calendar-range border-r pt-1"
            >
              <ul class="calendar_option">
                <li
                  v-for="(item, key) in defaultOptions"
                  :key="key"
                  class="calendar_option-ranges text-13px text-left whitespace-nowrap"
                  :class="{
                    'active-option': activeOption === item.label,
                    'text-gray-1 !cursor-not-allowed':
                      item.label === 'Tomorrow' && props.isFutureDateDisabled,
                  }"
                  @click="
                    item.label === 'Tomorrow' && props.isFutureDateDisabled
                      ? null
                      : updateSelectedOption(item)
                  "
                >
                  {{ item.label }}
                </li>
              </ul>
            </div>
            <div class="p-2">
              <VDatePicker
                :key="datePickerKey"
                v-model.range="range"
                :max-date="props.isFutureDateDisabled ? new Date() : null"
                :columns="calendarNumber"
                @dayclick="dayClicked()"
              />
              <div
                :class="[
                  calendarAlign === 'l'
                    ? 'flex justify-between items-center pb-1 px-3'
                    : 'px-2.5 pb-2.5',
                ]"
              >
                <div
                  :class="{ 'pt-2': calendarAlign === 'r' }"
                  class="flex gap-2 w-full justify-between pt-2"
                >
                  <div></div>
                  <div class="ml-auto flex gap-2">
                    <jbButton
                      variant="secondary"
                      class="h-10"
                      block
                      @click="clearCalendar"
                    >
                      <p class="px-4 text-13px">Clear</p>
                    </jbButton>
                    <jbButton class="h-10" block @click="applyDateRange">
                      <p class="px-4 text-13px">Apply</p>
                    </jbButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 *
 * ## Props
 * - `v-model` (Boolean, default: `false`):The selected date range. It's a two-element object with start and end properties.
 * - `alignmentCalendar` (string, default: `37`): The alignment of the calendar.
 *
 * ## Events
 * `update:modelValue`: This event is emitted when the selected date range changes.
 *
 * ## Example
 * selectedDateRange:{
 * start: "2023-10-02T18:15:00.000Z",
 * end: "2023-10-13T18:14:59.999Z",
 * }
 *
 */
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from 'vue';
import {
  differenceInDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
  sub,
  subMonths,
} from 'date-fns';
import type { DateRangeDTO } from '../../types/DataTypes';
import { v4 as uuidv4 } from 'uuid';
import {
  convertToISODate,
  formatDateRangeToISO,
} from '../../utils/dateTimeUtils';
import JbIcon from './JbIcon.vue';
import JbButton from './JbButton.vue';

type RangeCalendarProps = {
  modelValue: DateRangeDTO;
  alignmentCalendar?: string;
  weekRangeInputClass?: string;
  isFutureDateDisabled?: boolean;
};

interface CalendarTypeOption {
  label:
    | 'Today'
    | 'Yesterday'
    | 'Tomorrow'
    | 'Last 7 Days'
    | 'Last 30 Days'
    | 'This Month'
    | 'Last Month';
  active: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
}

const props = withDefaults(defineProps<RangeCalendarProps>(), {
  alignmentCalendar: '0',
  isFutureDateDisabled: false,
  weekRangeInputClass: 'text-sm py-1.5 px-2',
});
const todayDate = new Date();
const checkSelectedLabel = ref<string>('');
const inputtedEndDate = ref<string>('');
const inputtedStartDate = ref<string>('');

const formattedDateRange = computed(() => {
  if (submittedDate.value.includes(' - ')) {
    return submittedDate.value.replace(' - ', ' to ');
  } else {
    return submittedDate.value;
  }
});

const defaultOptions = ref<CalendarTypeOption[]>([
  {
    label: 'Today',
    active: false,
    dateRange: {
      start: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    },
  },
  {
    label: 'Yesterday',
    active: false,
    dateRange: {
      start: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate() - 1,
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate() - 1,
        23,
        59,
        59,
        999,
      ),
    },
  },
  {
    label: 'Tomorrow',
    active: false,
    dateRange: {
      start: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate() + 1,
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate() + 1,
        23,
        59,
        59,
        999,
      ),
    },
  },
  {
    label: 'Last 7 Days',
    active: false,
    dateRange: {
      start: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate() - 6,
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    },
  },
  {
    label: 'Last 30 Days',
    active: false,
    dateRange: {
      start: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate() - 29,
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        todayDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    },
  },
  {
    label: 'This Month',
    active: false,
    dateRange: props.isFutureDateDisabled
      ? {
          start: new Date(
            todayDate.getUTCFullYear(),
            todayDate.getUTCMonth(),
            1,
            0,
            0,
            0,
            0,
          ),
          end: new Date(
            todayDate.getUTCFullYear(),
            todayDate.getUTCMonth(),
            todayDate.getUTCDate(),
            23,
            59,
            59,
            999,
          ),
        }
      : {
          start: new Date(
            todayDate.getUTCFullYear(),
            todayDate.getUTCMonth(),
            1,
            0,
            0,
            0,
            0,
          ),
          end: new Date(
            todayDate.getUTCFullYear(),
            todayDate.getUTCMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          ),
        },
  },
  {
    label: 'Last Month',
    active: false,
    dateRange: {
      start: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth() - 1,
        1,
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        todayDate.getUTCFullYear(),
        todayDate.getUTCMonth(),
        0,
        23,
        59,
        59,
        999,
      ),
    },
  },
]);

const isOpen = ref<boolean>(false);
const datePickerKey = ref<string>(uuidv4().slice(0, 5));
const windowWidth = ref<number>(window.innerWidth);
const calendarAlign = ref<string>('l');
const calendarNumber = ref<number>(2);
const isCalendarSideNavVisible = ref<boolean>(true);
const activeOption = ref<string | null>('');

const emits = defineEmits<{
  (e: 'update:modelValue', range: DateRangeDTO): void;
  (e: 'clear-calendar'): void;
}>();
const hasModelValue = computed(() => {
  return props.modelValue.start !== null && props.modelValue.end !== null;
});

const range = ref<DateRangeDTO>({
  start: hasModelValue.value
    ? props.modelValue.start
    : convertToISODate(new Date().toISOString(), 'start'),
  end: hasModelValue.value
    ? props.modelValue.end
    : convertToISODate(new Date().toISOString(), ''),
});

const toggleCalendar = () => {
  isOpen.value = !isOpen.value;
};
const isLastSevenDays = () => {
  return (
    (differenceInDays(
      new Date(range.value.end),
      new Date(range.value.start),
    ) === 6 &&
      convertToISODate(new Date(range.value.start).toISOString(), 'start') ===
        convertToISODate(
          new Date(sub(new Date(), { days: 6 })).toISOString(),
          'start',
        )) ||
    (convertToISODate(new Date(range.value.end).toISOString(), '') ===
      convertToISODate(new Date().toISOString(), '') &&
      convertToISODate(new Date(range.value.start).toISOString(), 'start') ===
        convertToISODate(
          new Date(sub(new Date(), { days: 6 })).toISOString(),
          'start',
        ))
  );
};

const isLastThirtyDays = () => {
  return (
    (differenceInDays(
      new Date(range.value.end),
      new Date(range.value.start),
    ) === 29 &&
      convertToISODate(new Date(range.value.start).toISOString(), 'start') ===
        convertToISODate(
          new Date(sub(new Date(), { days: 29 })).toISOString(),
          'start',
        )) ||
    (convertToISODate(new Date(range.value.end).toISOString(), '') ===
      convertToISODate(new Date().toISOString(), '') &&
      convertToISODate(new Date(range.value.start).toISOString(), 'start') ===
        convertToISODate(
          new Date(sub(new Date(), { days: 29 })).toISOString(),
          'start',
        ))
  );
};

const areStartAndEndOfPreviousMonth = (startDate: Date, endDate: Date) => {
  const startOfPreviousMonth = startOfMonth(subMonths(new Date(), 1));
  const endOfPreviousMonth = endOfMonth(subMonths(new Date(), 1));
  return (
    isSameDay(startDate, startOfPreviousMonth) &&
    isSameDay(endDate, endOfPreviousMonth)
  );
};

const updateActiveOption = (value: string | null) => {
  activeOption.value = value;
};
const handleUpdateActiveOption = () => {
  const startDate = new Date(range.value.start);
  const endDate = new Date(range.value.end);
  const formattedStart = format(startDate, 'MMM d, yyyy');
  const formattedEnd = format(endDate, 'MMM d, yyyy');
  const isFirstDayOfMonth = isSameDay(startDate, startOfMonth(todayDate));
  const isLastDayOfMonth = isSameDay(endDate, endOfMonth(todayDate));

  if (formattedStart === formattedEnd) {
    switch (true) {
      case isToday(startDate):
        updateActiveOption('Today');
        return 'Today';

      case isYesterday(new Date(range.value.start)) &&
        isYesterday(new Date(range.value.end)):
        updateActiveOption('Yesterday');
        return formattedStart;

      case isTomorrow(new Date(range.value.start)) &&
        isTomorrow(new Date(range.value.end)):
        updateActiveOption('Tomorrow');
        return formattedStart;

      default:
        updateActiveOption('');
        return formattedStart;
    }
  }
  switch (true) {
    case new Date(range.value.start).getDay() ===
      startOfWeek(new Date()).getDay() &&
      new Date(range.value.end).getDay() === endOfWeek(new Date()).getDay(): //case for appointment by week
      updateActiveOption(null);
      return `${formattedStart} - ${formattedEnd}`;

    case isLastSevenDays():
      updateActiveOption('Last 7 Days');
      return `${formattedStart} - ${formattedEnd}`;

    case areStartAndEndOfPreviousMonth(startDate, endDate):
      updateActiveOption('Last Month');
      return `${formattedStart} - ${formattedEnd}`;

    case isLastThirtyDays():
      updateActiveOption('Last 30 Days');
      return `${formattedStart} - ${formattedEnd}`;

    case isFirstDayOfMonth && isLastDayOfMonth:
      updateActiveOption('This Month');
      return `${formattedStart} - ${formattedEnd}`;

    case isFirstDayOfMonth && isToday(endDate) && props.isFutureDateDisabled:
      updateActiveOption('This Month');
      return `${formattedStart} - ${formattedEnd}`;

    default:
      return `${formattedStart} - ${formattedEnd}`;
  }
};

const dayClicked = () => {
  activeOption.value = null;
  handleUpdateActiveOption();
};

const getFormattedDate = computed(() => {
  return handleUpdateActiveOption();
});

const submittedDate = ref<string>(getFormattedDate.value);

const onClickOutside = () => {
  const tempDate = formatDateRangeToISO(submittedDate.value);
  range.value = {
    start: tempDate.startDate,
    end: tempDate.endDate,
  };
  if (activeOption.value) {
    activeOption.value = null;
  }
  toggleCalendar();
};

const applyDateRange = () => {
  submittedDate.value = getFormattedDate.value;
  range.value.start = convertToISODate(
    new Date(range.value.start).toISOString(),
    'start',
  );
  range.value.end = convertToISODate(
    new Date(range.value.end).toISOString(),
    '',
  );

  range.value = {
    start: range.value.start,
    end: range.value.end,
  };
  emits('update:modelValue', range.value);
  toggleCalendar();
};

const clearCalendar = () => {
  activeOption.value = 'Today';
  range.value = {
    start: convertToISODate(new Date().toISOString(), 'start'),
    end: convertToISODate(new Date().toISOString(), ''),
  };
  submittedDate.value = getFormattedDate.value;
  emits('update:modelValue', range.value);
  toggleCalendar();
  nextTick(() => {
    emits('clear-calendar');
  });
};

const updateSelectedOption = (eventSelected: CalendarTypeOption) => {
  datePickerKey.value = uuidv4().slice(0, 5);
  checkSelectedLabel.value = eventSelected.label;
  range.value = {
    start: new Date(eventSelected.dateRange.start).toISOString(),
    end: new Date(eventSelected.dateRange.end).toISOString(),
  };
};

const calendarAlignment = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value <= 768) {
    calendarNumber.value = 1;
    calendarAlign.value = 'r';
    if (windowWidth.value <= 425) {
      isCalendarSideNavVisible.value = false;
    } else {
      isCalendarSideNavVisible.value = true;
    }
  } else {
    calendarNumber.value = 2;
    calendarAlign.value = 'l';
    isCalendarSideNavVisible.value = true;
  }
};

function isValidDate(dateString: string): boolean {
  const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
  return isValid(parsedDate);
}

watch(
  () => props.modelValue,
  (newRange) => {
    range.value = {
      start: newRange.start,
      end: newRange.end,
    };
    submittedDate.value = getFormattedDate.value;
  },
  { deep: true },
);

watch(
  [() => inputtedEndDate.value, () => inputtedStartDate.value],
  ([endDate, startDate], [oldEndDateValue, oldStartDateValue]) => {
    activeOption.value = null;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (isValidDate(startDate) && isValidDate(endDate)) {
      range.value.start = convertToISODate(startDateObj.toISOString(), 'start');
      range.value.end = convertToISODate(endDateObj.toISOString(), 'end');
      range.value = {
        start: range.value.start,
        end: range.value.end,
      };
      handleUpdateActiveOption();
    } else {
      inputtedStartDate.value = oldStartDateValue || '';
      inputtedEndDate.value = oldEndDateValue || '';
    }
  },
  { immediate: true },
);

watch(
  () => getFormattedDate.value,
  (newRange) => {
    if (newRange === 'Today') {
      const todayDate = startOfToday();
      inputtedEndDate.value = inputtedStartDate.value = format(
        todayDate,
        'MM/dd/yyyy',
      );
    } else {
      const dates = newRange.split(' - ');
      const startDate = new Date(dates[0]);
      let endDate = startDate;
      if (dates.length > 1) {
        endDate = new Date(dates[1]);
      }
      inputtedStartDate.value = format(startDate, 'MM/dd/yyyy');
      inputtedEndDate.value = format(endDate, 'MM/dd/yyyy');
    }
  },
  { immediate: true },
);

onMounted(() => {
  calendarAlignment();
  window.addEventListener('resize', calendarAlignment);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calendarAlignment);
});
</script>
<style scoped>
.calendar-range-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
}

.calendar_option li {
  line-height: 2.6em;
  width: 100%;
  display: block;
}
.active-option {
  border-left: 0.25rem solid #0f60ff;
  color: #0f60ff;
}

.calendar_option li.calendar_option-ranges.active-option:hover {
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.calendar_option li.calendar_option-ranges {
  padding-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  margin-top: 1px;
  width: 115px;
  transition: all 0.2s ease-in-out;
}

.calendar_option li.calendar_option-ranges:hover {
  background-color: #eee;
  transition: all 0.2s ease-in-out;
}
</style>
<style>
.vc-bordered {
  border: 0px;
  font-family: 'Satoshi', sans-serif;
}
.vc-weekday {
  color: #424142;
  font-weight: 500;
  font-size: 13px;
}
.vc-day-content {
  font-size: 13px;
}
.vc-header .vc-title span {
  color: #424142;
  font-size: 13px;
  font-weight: 700;
}
.vc-blue {
  --vc-accent-50: rgba(205, 182, 168, 0.25);
  --vc-accent-100: rgba(205, 182, 168, 0.25);
  --vc-accent-200: rgba(205, 182, 168, 0.25);
  --vc-accent-300: rgba(205, 182, 168, 0.25);
  --vc-accent-400: #0f60ff;
  --vc-accent-500: #0f60ff;
  --vc-accent-600: #0f60ff;
  --vc-accent-700: #0f60ff;
  --vc-accent-800: #0f60ff;
  --vc-accent-900: #0f60ff;
}
.vc-highlight-content-light {
  font-weight: 500;
  color: #424142;
}
.vc-light {
  --vc-focus-ring: 0 0 0 2px white;
}
.vc-prev.vc-focus:hover,
.vc-next.vc-focus:hover {
  background-color: white;
  transition: all 0.5s ease-in-out;
}
.vc-week,
.vc-week.vc-weekday {
  color: #424142;
  font-size: 13px;
}
button.vc-nav-title.vc-focus {
  font-size: 14px;
}
button.vc-nav-item.vc-focus {
  color: #424142;
  font-size: 12px;
  font-weight: 500;
}
button.vc-nav-item.vc-focus.is-active {
  color: white;
}

.right-37 {
  right: 170px;
}
</style>
