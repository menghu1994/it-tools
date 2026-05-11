<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import StandardLayout from './layouts/StandardLayout.vue';
import SimpleLayout from './layouts/SimpleLayout.vue';
import ModuleFormDialog from './ModuleFormDialog.vue';
import { useUserStore } from '@/stores/user.store';
import { useResumeStore } from '@/stores/resume.store';
import type { ModuleKey } from '@/tools/resume/resume.type';

const store = useResumeStore();
const userStore = useUserStore();
const message = useMessage();
const dialog = useDialog();

const resumeData = ref<{ key: ModuleKey; value: any }[]>([]);
const activeTemplate = computed(() => store.resume.template);
const resumeOptions = computed(() => store.resumeList.map(item => ({
  label: item.title,
  value: item.id,
})));

const templateMap = {
  standard: StandardLayout,
  simple: SimpleLayout,
};

async function renderModules() {
  const currentResume = store.resume;
  resumeData.value = currentResume.modulesOrder
    .filter(moduleKey => moduleKey === 'personal' || currentResume.modulesVisible[moduleKey])
    .map(moduleKey => ({
      key: moduleKey,
      value: currentResume.data[moduleKey],
    }));
}

onMounted(async () => {
  await store.init();
  await renderModules();
});

watch(() => store.resume, renderModules, { deep: true });

const formVisible = ref(false);
const editingModule = ref<ModuleKey | ''>('');

function openEdit(moduleKey: ModuleKey) {
  editingModule.value = moduleKey;
  formVisible.value = true;
}

async function onSelectResume(value: string | null) {
  if (!value) {
    return;
  }
  await store.loadResume(value);
}

async function onCreateResume() {
  await store.createResume(`我的简历 ${store.resumeList.length + 1}`);
  message.success(userStore.user ? '已创建新简历' : '已创建本地草稿');
}

async function onSaveResume() {
  await store.saveCurrentResume();
  message.success(userStore.user ? '简历已保存' : '草稿已保存到本地');
}

async function onDeleteResume() {
  dialog.warning({
    title: '删除简历',
    content: `确认删除“${store.resume.title}”吗？`,
    positiveText: '删除',
    negativeText: '取消',
    async onPositiveClick() {
      await store.deleteCurrentResume();
      message.success('简历已删除');
    },
  });
}
</script>

<template>
  <div class="resume-editor">
    <n-card>
      <div class="toolbar">
        <div class="toolbar__left">
          <n-input
            :value="store.resume.title"
            placeholder="输入简历标题"
            class="toolbar__title"
            @update:value="store.updateTitle($event)"
          />
          <n-select
            v-if="userStore.user"
            :value="store.resume.id"
            :options="resumeOptions"
            placeholder="选择简历"
            clearable
            class="toolbar__select"
            @update:value="onSelectResume"
          />
          <span v-else class="toolbar__hint">未登录时仅保存在当前浏览器</span>
        </div>

        <div class="toolbar__actions">
          <c-button @click="onCreateResume">
            新建
          </c-button>
          <c-button :disabled="!store.isDirty || store.saving" type="primary" @click="onSaveResume">
            保存
          </c-button>
          <c-button v-if="userStore.user && store.resume.id" :disabled="store.deleting" @click="onDeleteResume">
            删除
          </c-button>
        </div>
      </div>
    </n-card>

    <div class="resume-page">
      <component :is="templateMap[activeTemplate]" :data="resumeData" @editModule="openEdit" />
    </div>

    <ModuleFormDialog v-model:show="formVisible" :module-key="editingModule" />
  </div>
</template>

<style lang="less">
.resume-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar__left,
.toolbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar__title {
  width: 220px;
}

.toolbar__select {
  width: 220px;
}

.toolbar__hint {
  color: var(--n-text-color-3);
  font-size: 13px;
}

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
      color: #5c6166;
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
    color: #999;
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
