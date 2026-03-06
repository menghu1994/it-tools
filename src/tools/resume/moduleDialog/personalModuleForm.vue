<template>
    <n-card style="width: 428px" title="我的个人信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form :model="form" ref="formRef" label-placement="top" label-width="100" :rules="rules">
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
            <div class="n-form-item-label__text" style="margin-top: 8px;">avatar</div>
            <div class="avatar" >
              <n-image v-if="form.avatar" width="65" height="90" :src="form.avatar" preview-disabled/>
              <div class="avatar-action" v-if="form.avatar" flex flex-col justify-center items-center>
                <span style="margin-bottom: 16px;" @click="showAvatorCropper = true">替换</span>
                <span @click="form.avatar = null">删除</span>
              </div>
              <div class="avatar-empty" v-else @click="showAvatorCropper = true"></div>
            </div>
          </n-grid-item>
        </n-grid>
        <div flex gap-2>
          <n-form-item label="出生年月" flex-1>
            <n-checkbox v-model:checked="form.showAge" class="extra-condition">简历中以年龄显示</n-checkbox>
            <n-date-picker v-model:value="form.birth" type="date" placeholder="请选择" size="small" :is-date-disabled="disablePreviousDate"/>
          </n-form-item>
          <n-form-item label="参加工作时间" flex-1>
            <n-checkbox v-model:checked="form.fresh" class="extra-condition">应届毕业生</n-checkbox>
            <n-date-picker v-model:value="form.firstWorking" :disabled="form.fresh" type="date" placeholder="请选择" size="small" :is-date-disabled="disablePreviousDate"/>
          </n-form-item>
        </div>
        <n-form-item label="手机号">
          <c-input-text v-model:value="form.phoneNumber" placeholder="输入手机号" />
        </n-form-item>
        <n-form-item label="邮箱(必填)">
          <c-input-text v-model:value="form.email" placeholder="输入邮箱" />
        </n-form-item>
        <div flex gap-2>
          <n-form-item label="籍贯" flex-1>
            <c-input-text v-model:value="form.originPlace" placeholder="输入籍贯" />
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
      <n-modal v-model:show="showAvatorCropper" preset="card"
        style="width: 600px"
        title="头像裁剪"
        size="huge"
        :bordered="false"
        @after-enter="resizeCopper">
          <c-image-cropper v-if="showAvatorCropper" ratio="1.385" lock-aspect outputWidth="270" outputHeight="195" ref="cropper"></c-image-cropper>
          <template #footer>
            <div flex flex-row-reverse gap-2>
              <c-button @click="onSaveAvator" type="primary">保存</c-button>
              <c-button @click="showAvatorCropper = false">取消</c-button>
            </div>
          </template>
      </n-modal>
    </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useResumeStore } from '@/stores/resume.store';

const store = useResumeStore();
const emit = defineEmits(['updateData']);

const formRef = ref();
const form = ref<any>({});

const cropper = ref<any>(null);
const showAvatorCropper = ref(false);

onMounted(() => {
  form.value = {...store.resume.data['personal']}
  console.error(form.value, 'form value')
})

const rulesRequired = ['name', 'phoneNumber', 'email']

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
  const passRule = rulesRequired.every(key => form.value[key] !== null && form.value[key] !== '' && form.value[key] !== undefined);
  if(!passRule) { return }
  emit('updateData', form.value)
}

const resizeCopper = () => {
  if(cropper.value) {
    cropper.value.resizeCanvas();
  }
}

const onSaveAvator = async () => {
  form.value.avatar = await cropper.value.saveCropper();
  showAvatorCropper.value = false;
}

function disablePreviousDate(ts: number) {
  return ts > Date.now()
}
</script>

<style scoped lang="less">
.avatar {
  width: 65px;
  height: 90px;
  border: 1px solid rgba(0,0,0,0.07);
  background-color: #F5F6F7;
  box-sizing: content-box;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  &:hover {
    .avatar-action {
      display: flex;
    }
  }
  .avatar-empty {
    width: 100%;
    height: 100%;
  }
  .avatar-action {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: none;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    span {
      color: white;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
