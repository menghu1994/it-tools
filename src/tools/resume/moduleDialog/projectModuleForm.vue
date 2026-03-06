<template>
  <n-card style="width: 428px" title="添加项目经历" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <n-form :model="form" ref="formRef" label-placement="top" label-width="100">
      <n-form-item label="起止日期(必填)">
        <n-date-picker v-model:value="form.workDuring" type="daterange" clearable size="small" />
      </n-form-item>
      <n-form-item label="所属组织">
        <c-input-text v-model:value="form.organization" placeholder="填写所属组织" />
      </n-form-item>
      <n-form-item label="项目名称(必填)">
        <c-input-text v-model:value="form.project" placeholder="填写项目名称" />
      </n-form-item>
      <n-form-item label="担任角色">
        <c-input-text v-model:value="form.role" placeholder="填写担任角色" />
      </n-form-item>
      <n-form-item v-for="(project, index) in form.projectExperience" :key="index" label="项目描述" flex flex-col>
        <div flex flex-col>
          <n-input v-model:value="project.title" clearable placeholder="总结主要负责内容，或描述项目的主要成果">
            <template #suffix>
              <n-icon :component="DeleteOutlineRound" size="20" color="#959da6" cursor-pointer
              @click="removeItem(index)" v-if="form.projectExperience.length > 1"/>
            </template>
          </n-input>
          <n-input v-model:value="project.content"
            placeholder="分点描述事项，例如：1.作为主要撰写人（职责），完成了8000字的数据分析报告（行动），从数据中总结出XXX问题，作为项目第二阶段的实施重点（成果）。" type="textarea"
            :autosize="{ minRows: 3 }" />
        </div>
      </n-form-item>
      <c-button @click="addItem" mt-12px>
        <n-icon :component="AddCircleOutlineTwotone" size="18" mr-4px></n-icon>
        增加项目
      </c-button>
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
import { DeleteOutlineRound , AddCircleOutlineTwotone} from '@vicons/material';

const store = useResumeStore();
const emit = defineEmits(['updateData']);

const formRef = ref();
const form = ref<any>({ projectExperience: [{}] });

onMounted(() => {
  form.value = { projectExperience: [{}], ...store.resume.data['project'] }
  console.error(form.value, '1')
})

const removeItem = (index: number) => {
  form.value.projectExperience.splice(index, 1)
}

const addItem = () => {
  if (!form.value.projectExperience) {
    form.value.projectExperience = [{}]
  } else {
    form.value.projectExperience = [...form.value.projectExperience, {}]
  }
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
