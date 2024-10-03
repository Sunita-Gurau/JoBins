<template>
  <div>
    <div
      class="flex bg-white jb-scrollbar overflow-auto items-center pl-12 rounded-br-lg rounded-bl-lg jb-transition"
      :class="tabWrapperClass"
    >
      <div v-for="(tab, index) in props.tabs" :key="index" class="group">
        <div
          :class="{
            'border-blue-2 text-blue-2 ': activeTab === tab.label,
            'border-white text-gray-4 group-hover:border-gray-4 group-hover:text-gray-8 ':
              activeTab !== tab.label,
            [props.tabClass]: true,
          }"
          class="mr-1 p-4 flex items-center justify-center jb-transition cursor-pointer"
          @click="setActiveTab(tab.label)"
        >
          <div class="whitespace-nowrap text-[15px] font-normal">
            {{ tab.label }}
          </div>
          <div
            v-if="props.showCount"
            :class="{
              'bg-primary text-blue-2': activeTab === tab.label,
              'bg-gray-2 text-secondary-1 ': activeTab !== tab.label,
            }"
            class="ml-3 py-1 px-2 rounded-md flex text-xs font-bold items-center jb-transition justify-center group-hover:bg-primary group-hover:text-white"
          >
            0
          </div>
        </div>
      </div>
    </div>
    <div :class="componentWrapperClass">
      <component :is="activeTabComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
interface TabType {
  label: string;
  component: object;
}

type JbTabProps = {
  tabs: TabType[];
  showCount?: boolean;
  tabClass?: string;
  tabWrapperClass?: string;
  componentWrapperClass?: string;
};

const props = withDefaults(defineProps<JbTabProps>(), {
  showCount: false,
  tabClass: 'border-b-2',
  tabWrapperClass: 'border-b',
  componentWrapperClass: 'mt-4',
});

const activeTab = ref<string>(props.tabs[0].label);

const activeTabComponent = computed(() => {
  const activatedTab = props.tabs.find(
    (tab: TabType) => tab.label === activeTab.value,
  );
  return activatedTab ? activatedTab.component : props.tabs[0].component;
});

const setActiveTab = (tabLabel: string) => {
  activeTab.value = tabLabel;
};

watchEffect(() => {
  setActiveTab(activeTab.value);
});
</script>
<style scoped>
.jb-scrollbar::-webkit-scrollbar {
  height: 4px;
}
</style>
