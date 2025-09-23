<template>
  <n-card style="width: 428px" title="个人技能" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <n-form :model="form" ref="formRef" label-placement="top" label-width="100">
      <n-input v-model:value="form.skill" :placeholder="placeholderContent" type="textarea" size="medium"
        :autosize="{ minRows: 5 }" />
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

const placeholderContent = `计算机能力：PPT（可制作模板）；Photoshop（可制作海报）
语言技能：英语（CET-6）；韩语（可读写）
专业证书：计算机等级考试证书`;

onMounted(() => {
  form.value = { ...store.resume.data['skills'] }
})


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
