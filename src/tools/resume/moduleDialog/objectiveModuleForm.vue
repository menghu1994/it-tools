<template>
  <n-card style="width: 428px" title="求职意向" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <n-form :model="form" ref="formRef" label-placement="top" label-width="100">
      <div flex gap-2>
        <n-form-item label="求职岗位(必填)" flex-1>
          <c-input-text v-model:value="form.post" placeholder="请输入目标岗位" />
        </n-form-item>
        <n-form-item label="意向城市" flex-1>
          <c-input-text v-model:value="form.intendedCities" placeholder="输入意向城市" />
        </n-form-item>
      </div>
      <div flex>
        <n-form-item label="期望薪资" flex-1>
          <n-select v-model:value="form.lowest" size="small" placeholder="最低" :options="SalarySelection" clearable
            @update:value="changeLowestSalary($event)" />
        </n-form-item>
        <n-form-item flex-1>
          <n-select v-model:value="form.highest" size="small" placeholder="最高" :options="HighestSalarySection"
            :disabled="!form.lowest" clearable />
        </n-form-item>
      </div>
      <n-form-item label="到岗时间" flex-1>
        <c-select v-model:value="form.arrivalTime" :options="ArrivalTimeSelection" placeholder="请选择" size="small"
          clearable />
      </n-form-item>
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
  form.value = { ...store.resume.data['objective'] }
  console.error(form.value, '1')
})

const ArrivalTimeSelection = [
  { label: '随时到岗', value: '随时到岗' },
  { label: '周内到岗', value: '周内到岗' },
  { label: '月内到岗', value: '月内到岗' },
  { label: '面议', value: '面议' },
]

const SalarySelection: { label: string; value: number }[] = [
  { label: '面议', value: 0 },
  ...[].constructor(100).fill(null)
    .map((_, index: number) => (index < 99 ? { label: `${index + 1}k`, value: index + 1 } : { label: `${index + 1}k以上`, value: index + 1 })),
]

const HighestSalarySection = ref<{ label: string; value: number }[]>([])

const changeLowestSalary = ($event: any) => {
  switch (true) {
    case ($event === 0):
      HighestSalarySection.value = [{ label: '面议', value: 0 }];
      form.value.highest = 0;
      break;
    case ($event < 9):
      HighestSalarySection.value = getSalaryRange($event, $event + 4)
      break;
    default:
      HighestSalarySection.value = getSalaryRange($event, $event * 2 - 1)
  }
  const hasHighest = HighestSalarySection.value.some(item => item.value === form.value.highest);
  if (($event > form.value.highest && $event !== 0) || !hasHighest) {
    form.value.highest = $event + 1;
  }
}

const getSalaryRange = (lowest: number, highest: number): { label: string; value: number }[] => {
  return Array.from(new Array(highest + 1).keys()).slice(lowest).map((item: number) => ({ label: `${item + 1}k`, value: item + 1 }))
}

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
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-sizing: content-box;
  border-radius: 3px;
  overflow: hidden;
}
</style>
