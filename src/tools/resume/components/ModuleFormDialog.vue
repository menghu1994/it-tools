<template>
  <n-modal v-model:show="show" >
    <n-card
      style="width: 680px"
      :title="title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-space>
          <n-button size="small" tertiary @click="addEntry" v-if="isMultiple">新增</n-button>
        </n-space>
      </template>

      <n-form :model="form" ref="formRef" label-placement="left" label-width="100">
        <template v-if="moduleKey === 'personal'">
          <n-form-item label="姓名">
            <n-input v-model:value="form.name" />
          </n-form-item>
          <n-form-item label="城市">
            <n-input v-model:value="form.city" />
          </n-form-item>
          <n-form-item label="邮箱">
            <n-input v-model:value="form.email" />
          </n-form-item>
          <n-form-item label="电话">
            <n-input v-model:value="form.phone" />
          </n-form-item>
          <!-- avatar upload 简略：实际请用文件上传接口 -->
        </template>

        <template v-if="moduleKey === 'work'">
          <div v-for="(it, idx) in formList" :key="it.id" style="border:1px dashed #eee; padding:12px; margin-bottom:8px;">
            <n-form-item label="公司">
              <n-input v-model:value="it.company" />
            </n-form-item>
            <n-form-item label="职位">
              <n-input v-model:value="it.position" />
            </n-form-item>
            <n-form-item label="起止">
              <n-space>
                <n-input v-model:value="it.from" placeholder="YYYY-MM" />
                <n-input v-model:value="it.to" placeholder="YYYY-MM or 至今" />
              </n-space>
            </n-form-item>
            <n-form-item label="工作内容">
              <textarea v-model="it.contentsRaw" placeholder="每行一项" rows="4" />
            </n-form-item>
            <div style="text-align:right;">
              <n-button size="small" status="danger" @click="removeEntry(idx)">删除</n-button>
            </div>
          </div>
        </template>

        <!-- 其他模块按需添加表单字段 -->
      </n-form>
      <template #footer>
        <n-space>
          <n-button @click="onCancel">取消</n-button>
          <n-button @click="onSave" type="primary">保存</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useResumeStore } from '@/stores/resume.store';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  moduleKey: { type: String, default: '' },
  initial: { type: [Object, Array, null], default: null }
});
const emit = defineEmits(['update:show','save']);

const store = useResumeStore();
const show = ref(props.show);
watch(()=>props.show, v => show.value = v);
watch(show, v => emit('update:show', v));

const formRef = ref();
const form = ref<any>({});
const formList = ref<any[]>([]);

const isMultiple = computed(()=> ['education','work','project','campus','honor','custom'].includes(props.moduleKey));

watch(()=>props.initial, () => {
  if (props.moduleKey === 'personal') form.value = { ...(props.initial || store.resume.personal) };
  else if (props.moduleKey === 'work') {
    // editing whole list
    formList.value = (store.resume.work || []).map(it => ({ ...it, contentsRaw: (it.contents||[]).join('\n') }));
  }
}, { immediate:true });

function addEntry(){
  const id = Date.now().toString();
  formList.value.push({ id, from:'', to:'', company:'', position:'', contentsRaw:'' });
}
function removeEntry(i:number){
  formList.value.splice(i,1);
}

function onCancel(){
  show.value = false;
}

async function onSave(){
  if (props.moduleKey === 'personal'){
    await store.saveModuleData('personal', form.value);
    emit('save', { moduleKey: 'personal', payload: form.value });
  } else if (props.moduleKey === 'work'){
    // transform contentsRaw -> contents[]
    const payload = formList.value.map(it => ({ id: it.id, from: it.from, to: it.to, company: it.company, position: it.position, contents: (it.contentsRaw||'').split('\n').map((s:string)=>s.trim()).filter(Boolean) }));
    await store.saveModuleData('work', payload);
    emit('save', { moduleKey:'work', payload });
  }
  // other modules...
  show.value = false;
}
</script>
