<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
<!--    <div style="display:flex; gap:8px; align-items:center;">-->
<!--      <n-button @click="exportPdf">导出 PDF</n-button>-->
<!--    </div>-->

    <div ref="pagesContainer" class="pages-wrapper">
      <div v-for="(page, idx) in pages" :key="idx" class="resume-page">
        <ResumePreview
          :data="page"
          @editModule="openEdit"
        />
        <div class="page-split-line">— Page {{ idx+1 }} —</div>
      </div>
    </div>
    <ModuleFormDialog v-model:show="formVisible" :moduleKey="editingModule" :initial="editingData" @save="onSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import ResumePreview from './ResumePreview.vue';
import ModuleFormDialog from './ModuleFormDialog.vue';
import { useResumeStore } from '@/stores/resume.store';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

const store = useResumeStore();
store.init(); // no id -> new

const pagesContainer = ref<HTMLElement | null>(null);
const pages = ref<any[]>([]);

// 分页高度：页面高度990px（你要求），加上页边距
const PAGE_HEIGHT = 990;

// 简单新增示例
function addSampleWork(){
  const id = Date.now().toString();
  const item = { id, from:'2020-01', to:'2022-01', company:'示例公司', dept:'研发', position:'工程师', contents:['负责A','负责B'] };
  store.resume.work.push(item);
  store.saveModuleData('work', store.resume.work);
  renderPages();
}

/**
 * 渲染并分页逻辑：
 * 将 ResumePreview 渲染到一个 hidden 容器，再测量每个模块高度，按 PAGE_HEIGHT 切分成页（粗略算法）
 */
async function renderPages(){
  // 把整个 resume 数据当作一个“内容流”，我们要把模块拆分到多页
  const allModules = buildModuleRenderList();
  // 简单实现：将模块按高度累加分配到 pages
  // 我们需要先渲染一个 invisible container 来测量每个模块高度
  await nextTick();
  const measureRoot = document.createElement('div');
  measureRoot.style.position = 'fixed';
  measureRoot.style.left = '-9999px';
  measureRoot.style.top = '0';
  document.body.appendChild(measureRoot);

  const moduleHeights: { key:string; html: string; h:number; data:any }[] = [];

  console.error(allModules, 'mo');
  for(const m of allModules){
    const el = document.createElement('div');
    el.style.width = '700px';
    el.style.fontSize = '14px';
    el.style.lineHeight = '1.4';
    el.style.padding = '12px';
    el.innerHTML = renderModuleHtml(m);
    measureRoot.appendChild(el);
    const h = el.offsetHeight || PAGE_HEIGHT/4;
    moduleHeights.push({ key:m.key, html: el.innerHTML, h, data:m.data });
  }

  // split into pages
  const resultPages: any[] = [];
  let curPage: any[] = [];
  let curH = 0;
  for(const mh of moduleHeights){
    if (curH + mh.h > PAGE_HEIGHT && curPage.length>0){
      resultPages.push(curPage.slice());
      curPage = [];
      curH = 0;
    }
    curPage.push(mh);
    curH += mh.h;
  }
  if (curPage.length) resultPages.push(curPage);

  // convert pages to data structure that ResumePreview can render (array of modules)
  pages.value = resultPages.map(p => p.map(x => x.data));
  document.body.removeChild(measureRoot);
}

function buildModuleRenderList(){
  const r = store.resume;
  const list: any[] = [];
  for(const key of r.modulesOrder){
    if (!r.modulesVisible[key]) continue;
    if (key === 'personal') list.push({ key, data: { type:'personal', value: r.personal }});
    if (key === 'objective') list.push({ key, data: { type:'objective', value: r.objective }});
    if (key === 'education') {
      if (r.education.length===0) list.push({ key, data:{ type:'education', value: null, sample:true }});
      else r.education.forEach(it=> list.push({ key, data:{type:'education', value:it}}));
    }
    if (key === 'work') {
      if (r.work.length===0) list.push({ key, data:{ type:'work', value:null, sample:true }});
      else r.work.forEach(it=> list.push({ key, data:{type:'work', value:it}}));
    }
    if (key === 'skills') list.push({ key, data:{type:'skills', value: r.skills.length? r.skills:null, sample: r.skills.length===0 }});
  }
  return list;
}

function renderModuleHtml(m:any){
  // 极简 HTML 渲染，仅用于测量高度（preview 里有更漂亮的样式）
  if (m.type === 'personal') {
    const v = m.value || {};
    return `<div class="module personal"><h3>${v.name||'姓名'}</h3><div>${v.city||'城市'} ${v.email||'邮箱'}</div></div>`;
  }
  if (m.type === 'education'){
    if (m.value) return `<div class="module education"><b>${m.value.from} - ${m.value.to}</b> ${m.value.school} ${m.value.major}</div>`;
    return `<div class="module education sample">教育经历示例内容（灰色）</div>`;
  }
  if (m.type === 'work'){
    if (m.value) return `<div class="module work"><b>${m.value.from}-${m.value.to}</b> ${m.value.company}<div>${(m.value.contents||[]).join('<br/>')}</div></div>`;
    return `<div class="module work sample">工作经历示例</div>`;
  }
  return `<div class="module">示例模块</div>`;
}

onMounted(async () => {
  await renderPages();
});

watch(() => store.resume, async () => {
  await renderPages();
}, { deep:true });

/* 表单弹窗相关 */
const formVisible = ref(false);
const editingModule = ref('');
const editingData = ref<any>(null);
function openEdit(moduleKey:string, data:any){
  editingModule.value = moduleKey;
  editingData.value = data;
  formVisible.value = true;
  console.error('open dialog')
}
async function onSave({ moduleKey, payload }: any){
  await store.saveModuleData(moduleKey, payload);
  formVisible.value = false;
  await renderPages();
}

/* PDF 导出：把每个 page DOM 转为 canvas 然后合并到 PDF */
async function exportPdf(){
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

<style scoped>
.pages-wrapper {
  display:flex;
  flex-direction:column;
  gap:12px;
}
.resume-page {
  width:700px;
  min-height:990px;
  border:1px solid #e6e6e6;
  padding:18px;
  background:white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  position:relative;
}
.page-split-line {
  text-align:center;
  color:#999;
  font-size:12px;
  margin-top:6px;
}
</style>
