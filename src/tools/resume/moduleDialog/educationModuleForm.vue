<template>
  <n-card style="width: 428px" title="添加教育经历" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <n-form :model="form" ref="formRef" label-placement="top" label-width="100">
      <n-form-item label="起止日期(必填)">
        <n-date-picker v-model:value="form.eduDuring" type="daterange" clearable size="small" />
      </n-form-item>
      <n-form-item label="学校(必填)">
        <c-input-text v-model:value="form.school" placeholder="填写学校名称" />
      </n-form-item>
      <n-form-item label="专业">
        <c-input-text v-model:value="form.major" placeholder="填写你的专业" />
      </n-form-item>
      <n-form-item label="学历">
        <c-select v-model:value="form.education" :options="EducationSelection" placeholder="请选择" size="small" clearable />
      </n-form-item>
      <div flex gap-2>
        <n-form-item label="绩点" flex-1>
          <c-input-text v-model:value="form.gpa" placeholder="填写绩点" />
        </n-form-item>
        <n-form-item label="成绩排名" flex-1>
          <c-input-text v-model:value="form.ranking" placeholder="填写成绩排名" />
        </n-form-item>
      </div>
    </n-form>
    <template #footer>
      <div flex flex-row-reverse gap-2>
        <c-button @click="onSave" type="primary">保存</c-button>
        <c-button @click="onCancel">取消</c-button>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useResumeStore } from '@/stores/resume.store';

const store = useResumeStore();
const emit = defineEmits(['updateData']);

const formRef = ref();
const form = ref<any>({});

onMounted(() => {
form.value = {...store.resume.data['education']}
console.error(form.value, '1')
})

const EducationSelection = [
{ label: '大专', value: '大专' },
{ label: '本科', value: '本科' },
{ label: '硕士', value: '硕士' },
{ label: '博士', value: '博士' },
{ label: '其他', value: '其他' },
]

const onCancel = () => {
emit('updateData')
}
const onSave = () => {
emit('updateData', form.value)
}
</script>

<style scoped lang="less">
.avatar {
width: 65px;
height: 90px;
border: 1px solid rgba(0,0,0,0.07);
box-sizing: content-box;
border-radius: 3px;
overflow: hidden;
}
</style>
