<template>
  <n-card>
    <n-tabs type="line" animated>
      <n-tab-pane name="config" tab="模块配置">
        <div class="list-item" style="padding-left: 24px;">个人信息</div>
        <Draggable :list="modules" v-bind="dragOptions" class="flex flex-col" item-key="label" handle=".handle"
          @end="onUpdateModuleSort">
          <template #item="{ element: tool }">
            <n-space class="list-item" align="center" justify="space-between">
              <n-checkbox v-model:checked="tool.visible" :label="tool.label" @update:checked="onToggle(tool.key, $event)" v-if="tool.key !== 'personal'" />
              <icon-mdi-view-list cursor-move class="handle" v-if="tool.key !== 'personal'"/>
            </n-space>
          </template>
        </Draggable>
        <!--        <n-button @click="saveConfig" type="primary">保存配置</n-button>-->
      </n-tab-pane>
      <n-tab-pane name="module" tab="模板选择">
        <n-radio-group v-model:value="template">
          <n-radio value="default">标准</n-radio>
          <n-radio value="simple">简约</n-radio>
          <n-radio value="compact">紧凑样式</n-radio>
        </n-radio-group>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { resumeModuleLabelMap, useResumeStore } from '@/stores/resume.store';
import Draggable from 'vuedraggable';
import type { ModuleKey } from '@/tools/resume/resume.type';

const store = useResumeStore();
const modules = ref<{ key: ModuleKey, label: string, visible: boolean }[]>([]);

watch(
  () => store.resume,
  () => {
    modules.value = store.resume.modulesOrder.filter(m => m !== 'personal').map(module => ({
      key: module,
      label: resumeModuleLabelMap[module],
      visible: store.resume.modulesVisible[module]
    }))
  },
  { immediate: true }
)

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}

const template = computed({
  get: () => store.resume.template,
  set: v => store.resume.template = v
});

function onToggle(key: string, val: boolean) {
  store.resume.modulesVisible[key] = val;
}

const onUpdateModuleSort = () => {
  store.resume.modulesOrder = modules.value.map(item => item.key)
}

function saveConfig() {
  store.saveMeta();
}
</script>

<style lang="less">
.list-item {
  padding: 12px 0;
  border-bottom: 1px solid rgb(239, 239, 245);
}
</style>
