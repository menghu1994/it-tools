<template>
  <n-card style="width: 512px" title="荣誉奖项" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <n-form :model="form" ref="formRef" flex flex-col gap-1>
      <n-form-item v-for="(honor, index) in form.honors" :key="index" style="--n-label-height: 0;" >
        <div flex gap-2 justify-between items-center>
          <c-input-text v-model:value="honor.competitionAwards" placeholder="竞赛奖项、奖学金等" />
          <n-date-picker v-model:value="honor.date" type="date" clearable size="small" placeholder="时间" style="width: 250px;" />
          <c-button @click="addItem" v-if="form.honors.length === 0 || index === form.honors.length - 1">
            <n-icon :component="AddCircleOutlineTwotone" size="18"></n-icon>
          </c-button>
          <c-button @click="removeItem(index)" v-else>
            <n-icon :component="MinusOutlined" size="18"></n-icon>
          </c-button>
        </div>
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
import { AddCircleOutlineTwotone, MinusOutlined} from '@vicons/material';

const store = useResumeStore();
const emit = defineEmits(['updateData']);

const formRef = ref();
const form = ref<any>({});

onMounted(() => {
  form.value = { honors: [{}], ...store.resume.data['honor'] }
})

const addItem = () => {
  if (!form.value.honors) {
    form.value.honors = [{}]
  } else {
    form.value.honors = [...form.value.honors, {}]
  }
}

const removeItem = (index: number) => {
  form.value.honors.splice(index, 1)
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
