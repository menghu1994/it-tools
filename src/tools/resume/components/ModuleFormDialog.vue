<template>
  <n-modal v-model:show="show">
      <component :is="compFormMap[props.moduleKey]" @updateData="updateResumeModule($event, props.moduleKey)">
      </component>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useResumeStore } from '@/stores/resume.store';
import personalModuleForm from '../moduleDialog/personalModuleForm.vue'
import workModuleForm from '../moduleDialog/workModuleForm.vue'
import skillModuleForm from '../moduleDialog/skillModuleForm.vue'
import honorModuleForm from '../moduleDialog/honorModuleForm.vue'
import campusModuleForm from '../moduleDialog/campusModuleForm.vue'
import projectModuleForm from '../moduleDialog/projectModuleForm.vue'
import objectiveModuleForm from '../moduleDialog/objectiveModuleForm.vue'
import educationModuleForm from '../moduleDialog/educationModuleForm.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  moduleKey: { type: String, default: '' }
});
const emit = defineEmits(['update:show', 'save']);

const compFormMap: any = {
  personal: personalModuleForm,
  work: workModuleForm,
  skills: skillModuleForm,
  project: projectModuleForm,
  honor: honorModuleForm,
  campus: campusModuleForm,
  education: educationModuleForm,
  objective: objectiveModuleForm
}

const store = useResumeStore();
const show = ref(props.show);
watch(() => props.show, v => show.value = v);
watch(show, v => emit('update:show', v));

const updateResumeModule = (data: any, key: any) => {
  if (data) {
    store.resume.data[key] = data;
  }
  show.value = false;
}

</script>

<style lang="less">
.n-card {
  .n-card-header {
    padding: 24px;

    .n-card-header__main {
      font-size: 18px;
      font-weight: 700;
    }
  }

  .n-card__content {
    padding: 0 24px
  }

  .n-card__footer {
    padding: 24px !important;
  }
}

.n-form {
  font-size: 11px;

  .n-form-item.n-form-item--top-labelled .n-form-item-label {
    align-items: flex-end;
  }

  .n-form-item {
    position: relative;

    .n-form-item-label {
      padding: 0;
    }

    .extra-condition {
      position: absolute;
      top: -50%;
      right: 0;
      width: auto;
      font-size: 11px;
      color: #2e3033
    }
  }

  .n-form-item-label__text {
    width: max-content;
    margin-left: 2px;
    color: #959da6;
    font-size: 11px;
    line-height: 18px;
  }

  .n-form-item-feedback-wrapper {
    display: none;
  }

  .n-form-item-blank {
    &>div {
      width: -webkit-fill-available;
    }
  }
}
</style>
