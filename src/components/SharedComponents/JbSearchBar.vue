<template>
  <div>
    <div class="relative w-full z-10">
      <div
        class="py-2.5 pr-2.5 flex items-center gap-2 rounded-lg max-h-10"
        :class="{
          'border-primary': isFocused,
          'bg-gray-3': props.hasBackgroundColor,
          'bg-white': !props.hasBackgroundColor,
          'border border-gray-5 ': props.hasBorder,
        }"
      >
        <div class="absolute right-2"><JbIcon iconName="Search" /></div>
        <input
          class="text-black placeholder-gray-1 text-sm outline-0 w-full px-2"
          :class="props.hasBackgroundColor ? 'bg-gray-3' : 'bg-white'"
          :type="props.type"
          :placeholder="props.placeholder"
          :value="props.modelValue"
          @input="
            emits(
              'update:modelValue',
              ($event.target as HTMLInputElement).value,
            )
          "
          @focus="toggleDropdown"
          @blur="closeDropdown"
        />
        <JbIcon
          v-if="computeIsCloseIconVisible"
          class="cursor-pointer"
          iconName="CloseCircleIcon"
          @click="clearSearch"
        />
      </div>

      <div
        class="mt-2 absolute z-20 shadow-md bg-white sm:!w-92 xs:!w-75 rounded-md transform -translate-x-1/2"
        :class="isDropdownCenterAlign ? 'left-1/2' : 'left-30 sm:left-10'"
      >
        <!-- Dropdown With Data -->
        <ul
          v-if="computeIsCloseIconVisible && computeHasDropdownValues"
          class="border border-gray-2 rounded-md sm:p-3 p-1 overflow-y-auto jb-scrollbar"
          :class="{
            'max-h-[384px]': computeIsCloseIconVisible,
            '!overflow-y-hidden': !computeHasDropdownValues,
          }"
        >
          <li
            v-for="option in props.options"
            :key="option.id"
            class="jb-transition text-sm cursor-pointer p-2"
            @click="handleItemClick(option)"
          >
            <slot name="optionList" :option="option">
              <div
                class="p-3 border border-gray-2 rounded-md hover:border-primary jb-transition"
              >
                <div
                  v-if="option.firstName || option.lastName"
                  class="flex gap-2"
                >
                  <JbIcon iconName="UserIcon" svgFill="fill-secondary-3" />
                  <p class="text-sm font-semibold text-secondary-3">
                    {{ option.firstName }}
                    {{ option.lastName }}
                  </p>
                </div>

                <div v-if="option.address" class="flex gap-2 mt-2">
                  <JbIcon iconName="Location" svgFill="fill-secondary-3" />
                  <p class="text-sm font-medium text-secondary-3">
                    {{ option.address }}
                  </p>
                </div>
              </div>
            </slot>
          </li>
        </ul>

        <!-- Empty dropdown -->
        <ul
          v-if="
            computeIsCloseIconVisible &&
            !computeHasDropdownValues &&
            !props.isApiLoading &&
            showDropdown
          "
          class="border border-gray-2 rounded-md"
        >
          <slot name="noData">
            <div class="flex flex-col items-center justify-center gap-5 h-56">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-3"
              >
                <JbIcon iconName="Search" />
              </div>
              <div class="text-sm text-gray-1">No search results</div>
            </div>
          </slot>
        </ul>
      </div>
    </div>
    <div
      v-if="props.modelValue && props.options"
      class="fixed inset-0 bg-black opacity-0 z-1"
      @click="handleCloseDropdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import JbIcon from './JbIcon.vue';
import { computed, ref, watch } from 'vue';

type JbSearchBarProps = {
  hasBorder?: boolean;
  hasBackgroundColor?: boolean;
  showDropdown: boolean;
  isDropdownCenterAlign?: boolean;
  modelValue?: string;
  placeholder?: string;
  type?: string;
  options?: any[];
  isApiLoading?: boolean;
};

const isFocused = ref<boolean>(false);
const isDropdownOpen = ref<boolean>(false);

const props = withDefaults(defineProps<JbSearchBarProps>(), {
  hasBorder: true,
  hasBackgroundColor: false,
  showDropdown: false,
  placeholder: '',
  type: 'text',
  isApiLoading: false,
  isDropdownCenterAlign: true,
});

const emits = defineEmits<{
  (e: 'update:modelValue', text: string): void;
  (e: 'item-clicked', option: any): void;
}>();

const computeIsCloseIconVisible = computed(() => {
  if (props.modelValue) {
    return props.modelValue.length > 0;
  } else {
    return false;
  }
});

const computeHasDropdownValues = computed(() => {
  if (props.options) {
    return props.options.length > 0;
  } else {
    return false;
  }
});

const clearSearch = () => {
  emits('update:modelValue', '');
};

const handleCloseDropdown = () => {
  if (isDropdownOpen.value && props.showDropdown) {
    clearSearch();
  }
};

const closeDropdown = () => {
  setTimeout(() => (isFocused.value = false), 200);
};

const toggleDropdown = () => {
  isFocused.value = !isFocused.value;
};

watch(computeIsCloseIconVisible, (newVal) => {
  if (newVal) {
    isDropdownOpen.value = true;
  }
});

const handleItemClick = (option: any) => {
  emits('item-clicked', option);
  toggleDropdown();
  clearSearch();
};
</script>
