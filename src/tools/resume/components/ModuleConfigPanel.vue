<template>
  <n-card>
    <n-tabs type="line" animated>
      <n-tab-pane name="config" tab="模块配置">
        <Draggable
          :list="modules"
          v-bind="dragOptions"
          class="flex flex-col"
          item-key="label"
          handle=".handle"
          @end="onUpdateModuleSort"
        >
          <template #item="{ element: tool }">
            <n-space class="list-item" align="center" justify="space-between">
              <n-checkbox :checked="tool.visible" :label="tool.label" @update:checked="onToggle(tool.key,$event)" />
              <icon-mdi-view-list cursor-move class="handle"/>
            </n-space>
          </template>
        </Draggable>
<!--        <n-button @click="saveConfig" type="primary">保存配置</n-button>-->
      </n-tab-pane>
      <n-tab-pane name="module" tab="模板选择">
        <n-radio-group v-model:value="template">
          <n-radio value="default">默认</n-radio>
          <n-radio value="modern">现代样式</n-radio>
          <n-radio value="compact">紧凑样式</n-radio>
        </n-radio-group>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useResumeStore } from '@/stores/resume.store';
import Draggable from 'vuedraggable';

const store = useResumeStore();
const modules = ref([
  { key:'personal', label:'个人信息', visible: store.resume.modulesVisible.personal },
  { key:'objective', label:'求职意向', visible: store.resume.modulesVisible.objective },
  { key:'education', label:'教育经历', visible: store.resume.modulesVisible.education },
  { key:'work', label:'工作经历', visible: store.resume.modulesVisible.work },
  { key:'project', label:'项目经历', visible: store.resume.modulesVisible.project },
  { key:'campus', label:'校内经历', visible: store.resume.modulesVisible.campus },
  { key:'honor', label:'荣誉奖项', visible: store.resume.modulesVisible.honor },
  { key:'skills', label:'个人技能', visible: store.resume.modulesVisible.skills },
  { key:'custom', label:'自定义模块', visible: store.resume.modulesVisible.custom },
]);

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

function onToggle(key:string, val:boolean){
  store.resume.modulesVisible[key] = val;
}

const onUpdateModuleSort = () => {
  store.resume.modulesOrder = modules.value.map(item => item.key)
}

function saveConfig(){
  store.saveMeta();
}
</script>

<style lang="less">
.list-item {
  padding: 12px 0;
  border-bottom: 1px solid rgb(239, 239, 245);
}
</style>
