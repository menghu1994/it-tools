<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Draggable from 'vuedraggable';
import { resumeModuleLabelMap, useResumeStore } from '@/stores/resume.store';
import type { ModuleKey } from '@/tools/resume/resume.type';

const store = useResumeStore();
const modules = ref<{ key: ModuleKey; label: string; visible: boolean }[]>([]);

watch(
  () => [store.resume.modulesOrder, store.resume.modulesVisible],
  () => {
    modules.value = store.resume.modulesOrder
      .filter(moduleKey => moduleKey !== 'personal')
      .map(moduleKey => ({
        key: moduleKey,
        label: resumeModuleLabelMap[moduleKey],
        visible: store.resume.modulesVisible[moduleKey],
      }));
  },
  { immediate: true, deep: true },
);

const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: 'ghost',
};

const template = computed({
  get: () => store.resume.template,
  set: value => store.updateTemplate(value),
});

function onToggle(key: ModuleKey, value: boolean) {
  store.updateModulesVisible({
    ...store.resume.modulesVisible,
    [key]: value,
  });
}

function onUpdateModuleSort() {
  store.updateModulesOrder(['personal', ...modules.value.map(item => item.key)]);
}
</script>

<template>
  <n-card title="简历配置">
    <n-tabs type="line" animated>
      <n-tab-pane name="config" tab="模块配置">
        <div class="list-item--fixed list-item">
          个人信息
        </div>
        <Draggable
          :list="modules"
          v-bind="dragOptions"
          class="flex flex-col"
          item-key="key"
          handle=".handle"
          @end="onUpdateModuleSort"
        >
          <template #item="{ element: item }">
            <n-space class="list-item" align="center" justify="space-between">
              <n-checkbox
                v-if="item.key !== 'personal'"
                v-model:checked="item.visible"
                :label="item.label"
                @update:checked="onToggle(item.key, $event)"
              />
              <icon-mdi-view-list v-if="item.key !== 'personal'" cursor-move class="handle" />
            </n-space>
          </template>
        </Draggable>
      </n-tab-pane>

      <n-tab-pane name="template" tab="模板选择">
        <n-radio-group v-model:value="template">
          <n-space vertical>
            <n-radio value="standard">
              标准
            </n-radio>
            <n-radio value="simple">
              双栏
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style lang="less">
.list-item {
  padding: 12px 0;
  border-bottom: 1px solid rgb(239, 239, 245);
}

.list-item--fixed {
  padding-left: 4px;
  color: var(--n-text-color-2);
}
</style>
