<template>
    <n-card style="width: 428px" title="我的个人信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form :model="form" ref="formRef" label-placement="top" label-width="100">
        <n-grid cols="4" item-responsive x-gap="12">
          <n-grid-item span="3">
            <n-form-item label="姓名(必填)">
              <c-input-text v-model:value="form.name"  placeholder="输入姓名" />
            </n-form-item>
            <n-form-item label="性别">
              <c-select v-model:value="form.sex" :options="[
                { label: '男', value: '男' },
                { label: '女', value: '女' }
               ]" placeholder="请选择" size="small" clearable />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <div class="n-form-item-label__text" style="margin-bottom: 8px;">avatar</div>
            <div class="avatar"></div>
          </n-grid-item>
        </n-grid>
        <div flex gap-2>
          <n-form-item label="出生年月" flex-1>
            <n-date-picker v-model:value="form.birth" type="date" placeholder="请选择" size="small" />
          </n-form-item>
          <n-form-item label="参加工作时间" flex-1>
            <n-date-picker v-model:value="form.firstWorking" type="date" placeholder="请选择" size="small" />
          </n-form-item>
        </div>
        <n-form-item label="手机号">
          <c-input-text v-model:value="form.company" placeholder="输入手机号" />
        </n-form-item>
        <n-form-item label="邮箱(必填)">
          <c-input-text v-model:value="form.position" placeholder="输入邮箱" />
        </n-form-item>
        <div flex gap-2>
          <n-form-item label="籍贯" flex-1>
            <c-input-text v-model:value="form.home" placeholder="输入籍贯" />
          </n-form-item>
          <n-form-item label="政治面貌" flex-1>
            <c-select v-model:value="form.political" :options="PoliticalOutlookSelection" placeholder="请选择" size="small" clearable />
          </n-form-item>
        </div>
        <div flex gap-2>
          <n-form-item label="所在地" flex-1>
            <c-input-text v-model:value="form.address" placeholder="输入所在地" />
          </n-form-item>
          <n-form-item label="最高学历" flex-1>
            <c-select v-model:value="form.highestEducation" :options="EducationSelection" placeholder="请选择" size="small" clearable />
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
  form.value = {...store.resume.data['personal']}
  console.error(form.value, '1')
})

const PoliticalOutlookSelection = [
  { label: '群众', value: '群众' },
  { label: '党员', value: '党员' },
  { label: '团员', value: '团员' },
  { label: '其他', value: '其他' },
]

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
