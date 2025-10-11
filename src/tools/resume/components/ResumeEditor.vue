<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <!--    <div style="display:flex; gap:8px; align-items:center;">-->
    <!--      <n-button @click="exportPdf">导出 PDF</n-button>-->
    <!--    </div>-->

    <div class="resume-page">
      <component :is="templateMap[activeTemplate]" :data="resumeData" @editModule="openEdit" />
    </div>
    <ModuleFormDialog v-model:show="formVisible" :moduleKey="editingModule" :initial="editingData" @save="onSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import StandardLayout from './layouts/StandardLayout.vue';
import SimpleLayout from './layouts/SimpleLayout.vue';
import ModuleFormDialog from './ModuleFormDialog.vue';
import { useResumeStore } from '@/stores/resume.store';
import type { ModuleKey } from '@/tools/resume/resume.type';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

const store = useResumeStore();
store.init();

const resumeData = ref<{ key: ModuleKey, value: any }[]>([]);
const activeTemplate = computed(() => store.resume.template);

const templateMap: Record<string, any> = {
  standard: StandardLayout,
  simple: SimpleLayout,
  elegant: StandardLayout
}

async function renders() {
  const r = store.resume;

  resumeData.value = r.modulesOrder.filter(m => m ==='personal' || r.modulesVisible[m]).map(moduleKey => ({
    key: moduleKey,
    value: r.data[moduleKey]
  }))

}


onMounted(async () => {
  await renders();
  console.error(resumeData.value, '123')
});

watch(() => store.resume, async () => {
  await renders();
}, { deep: true });

/* 表单弹窗相关 */
const formVisible = ref(false);
const editingModule = ref('');
const editingData = ref<any>(null);
function openEdit(moduleKey: string, data: any) {
  editingModule.value = moduleKey;
  editingData.value = data;
  formVisible.value = true;
}
async function onSave({ moduleKey, payload }: any) {
  // await store.saveModuleData(moduleKey, payload);
  store.saveData(moduleKey, payload)
  formVisible.value = false;
  await renders();
}

/* PDF 导出：把每个 page DOM 转为 canvas 然后合并到 PDF */
async function exportPdf() {
  // const pagesEls = Array.from(document.querySelectorAll('.resume-page')) as HTMLElement[];
  // const pdf = new jsPDF('p', 'pt', 'a4'); // a4 size
  // for(let i=0;i<pagesEls.length;i++){
  //   const el = pagesEls[i];
  //   const canvas = await html2canvas(el, { scale:2 });
  //   const imgData = canvas.toDataURL('image/png');
  //   const imgProps = (pdf as any).getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //   if (i>0) pdf.addPage();
  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  // }
  // pdf.save(`resume-${store.resume.id || 'me'}.pdf`);
}
</script>

<style lang="less">
.resume-page {
  width: 700px;
  min-height: 990px;
  border: 1px solid #e6e6e6;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  position: relative;

  font-family: 'PingFang SC', 'Helvetica Neue', Arial;
  color: #222;
  font-size: 13px;

  h3 {
    margin: 0;
  }

  section {
    cursor: pointer;

    .second-color {
      color: #5c6166
    }

    .module-title {
      color: #2f5785;
      display: flex;
      align-items: center;
      font-weight: bold;
      line-height: 21px;
      letter-spacing: 0;
      margin-bottom: 10px;
      padding: 2px 20px;

      .split-line {
        display: inline-block;
        flex: 1;
        width: 100%;
        height: 1px;
        margin-left: 28px;
        background: #bdd2ea;
        opacity: 0.7;
      }
    }
  }

  .example {
    color: #999
  }

  .module-body {
    padding: 10px 20px;
    border-radius: 5px;

    &:hover {
      background: #f5f6f7;
    }
  }

  .avatar {
    width: 65px;
    height: 90px;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-sizing: content-box;
    border-radius: 3px;
    overflow: hidden;
  }
}

.resume_preview_work_info_date {
  display: inline-block;
  flex: 1;
  min-width: 150px;
  color: #4a90e2;
  font-weight: normal;
  letter-spacing: 0;
  text-align: right;
}
</style>
