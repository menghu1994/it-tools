<script setup lang="ts">
import { ref, watch } from 'vue';
import personalModuleForm from '../moduleDialog/personalModuleForm.vue';
import workModuleForm from '../moduleDialog/workModuleForm.vue';
import skillModuleForm from '../moduleDialog/skillModuleForm.vue';
import honorModuleForm from '../moduleDialog/honorModuleForm.vue';
import campusModuleForm from '../moduleDialog/campusModuleForm.vue';
import projectModuleForm from '../moduleDialog/projectModuleForm.vue';
import objectiveModuleForm from '../moduleDialog/objectiveModuleForm.vue';
import educationModuleForm from '../moduleDialog/educationModuleForm.vue';
import type { ModuleKey } from '@/tools/resume/resume.type';
import { useResumeStore } from '@/stores/resume.store';

const props = defineProps<{
  show: boolean
  moduleKey: ModuleKey | ''
}>();

const emit = defineEmits<{
  'update:show': [value: boolean]
}>();

const compFormMap: Record<ModuleKey, any> = {
  personal: personalModuleForm,
  work: workModuleForm,
  skills: skillModuleForm,
  project: projectModuleForm,
  honor: honorModuleForm,
  campus: campusModuleForm,
  education: educationModuleForm,
  objective: objectiveModuleForm,
};

const store = useResumeStore();
const show = ref(props.show);

watch(() => props.show, value => show.value = value);
watch(show, value => emit('update:show', value));

function updateResumeModule(data: any, key: ModuleKey) {
  if (data) {
    store.saveData(key, data);
  }
  show.value = false;
}
</script>

<template>
  <n-modal v-model:show="show">
    <component
      :is="compFormMap[props.moduleKey]"
      v-if="props.moduleKey && compFormMap[props.moduleKey]"
      @updateData="updateResumeModule($event, props.moduleKey)"
    />
  </n-modal>
</template>
