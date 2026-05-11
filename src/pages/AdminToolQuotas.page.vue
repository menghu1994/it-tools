<script setup lang="ts">
import { itToolsService } from '@/api/it-tools.service';
import { tools } from '@/tools';
import type { DataTableColumns, SelectOption } from 'naive-ui';

interface ToolAccessRow {
  toolKey: string
  controlled: boolean
  loginRequired: boolean
  dailyLimit: number
  costPerUse: number
  advancedCost: number
}

interface ToolQuotaRow extends ToolAccessRow {
  userId: string
  usageDate?: string
  todayUsedCount?: number
  spentCoins?: number
  advancedSpentCoins?: number
}

const message = useMessage();
const loading = ref(false);
const saving = ref(false);
const selectedUserId = ref<string | null>(null);
const selectedToolKey = ref<string | null>(null);
const usageDate = ref(new Date().toISOString().slice(0, 10));
const accessRows = ref<ToolAccessRow[]>([]);
const quotaRows = ref<ToolQuotaRow[]>([]);
const users = ref<SelectOption[]>([]);

const toolOptions = computed<SelectOption[]>(() =>
  tools.map(tool => ({ label: tool.name, value: tool.path })),
);

const accessDraft = reactive<ToolAccessRow>({
  toolKey: '',
  controlled: false,
  loginRequired: false,
  dailyLimit: 5,
  costPerUse: 1,
  advancedCost: 1,
});

const quotaDraft = reactive<Omit<ToolQuotaRow, 'userId' | 'toolKey'>>({
  controlled: false,
  loginRequired: false,
  dailyLimit: 5,
  costPerUse: 1,
  advancedCost: 1,
});

const accessColumns: DataTableColumns<ToolAccessRow> = [
  { title: '工具', key: 'toolKey', render: row => toolLabel(row.toolKey) },
  { title: '管控', key: 'controlled', render: row => row.controlled ? '是' : '否' },
  { title: '需登录', key: 'loginRequired', render: row => row.loginRequired ? '是' : '否' },
  { title: '日额度', key: 'dailyLimit' },
  { title: '超额单价', key: 'costPerUse' },
  { title: '高级单价', key: 'advancedCost' },
];

const quotaColumns: DataTableColumns<ToolQuotaRow> = [
  { title: '用户', key: 'userId', render: row => userLabel(row.userId) },
  { title: '工具', key: 'toolKey', render: row => toolLabel(row.toolKey) },
  { title: '管控', key: 'controlled', render: row => row.controlled ? '是' : '否' },
  { title: '需登录', key: 'loginRequired', render: row => row.loginRequired ? '是' : '否' },
  { title: '日额度', key: 'dailyLimit' },
  { title: '当天已用', key: 'todayUsedCount' },
  { title: '已花费', key: 'spentCoins' },
  { title: '高级花费', key: 'advancedSpentCoins' },
];

async function loadUsers() {
  const res = await itToolsService.adminUsers({ pageSize: 200 });
  users.value = (res.data || []).map((user: any) => ({
    label: `${user.username}${user.name ? ` (${user.name})` : ''}`,
    value: user._id,
  }));
}

async function loadAccessRows() {
  const res = await itToolsService.adminToolAccess();
  accessRows.value = res.data || [];
}

async function loadQuotaRows() {
  loading.value = true;
  try {
    const res = await itToolsService.adminToolQuotas({
      userId: selectedUserId.value || undefined,
      toolKey: selectedToolKey.value || undefined,
      date: usageDate.value,
    });
    quotaRows.value = res.data || [];
  } finally {
    loading.value = false;
  }
}

async function loadAll() {
  loading.value = true;
  try {
    await Promise.all([loadUsers(), loadAccessRows(), loadQuotaRows()]);
  } finally {
    loading.value = false;
  }
}

async function saveAccess() {
  if (!accessDraft.toolKey) {
    message.warning('请选择工具');
    return;
  }

  saving.value = true;
  try {
    await itToolsService.saveToolAccess(accessDraft);
    message.success('工具访问规则已保存');
    await loadAccessRows();
  } finally {
    saving.value = false;
  }
}

async function saveQuota() {
  if (!selectedUserId.value || !selectedToolKey.value) {
    message.warning('请选择用户和工具');
    return;
  }

  saving.value = true;
  try {
    await itToolsService.saveToolQuota({
      userId: selectedUserId.value,
      toolKey: selectedToolKey.value,
      ...quotaDraft,
    });
    message.success('用户额度已保存');
    await loadQuotaRows();
  } finally {
    saving.value = false;
  }
}

function userLabel(userId: string) {
  return users.value.find(user => user.value === userId)?.label?.toString() || userId;
}

function toolLabel(toolKey: string) {
  return toolOptions.value.find(tool => tool.value === toolKey)?.label?.toString() || toolKey;
}

watch(() => accessDraft.toolKey, (toolKey) => {
  const current = accessRows.value.find(row => row.toolKey === toolKey);
  Object.assign(accessDraft, current || {
    toolKey: toolKey || '',
    controlled: false,
    loginRequired: false,
    dailyLimit: 5,
    costPerUse: 1,
    advancedCost: 1,
  });
});

watch([selectedUserId, selectedToolKey, quotaRows], () => {
  const current = quotaRows.value.find(row => row.userId === selectedUserId.value && row.toolKey === selectedToolKey.value);
  Object.assign(quotaDraft, current || {
    controlled: false,
    loginRequired: false,
    dailyLimit: 5,
    costPerUse: 1,
    advancedCost: 1,
  });
});

onMounted(loadAll);
</script>

<template>
  <main class="admin-page">
    <section class="admin-head">
      <h1>工具访问与额度管理</h1>
      <p>未配置的工具默认开放、无需登录、无限制。只有开启“需登录”或“管控”后，前台才会拦截并记录使用。</p>
    </section>

    <section class="editor">
      <h2>全局工具规则</h2>
      <div class="editor-grid">
        <n-select v-model:value="accessDraft.toolKey" filterable :options="toolOptions" placeholder="工具" />
        <n-switch v-model:value="accessDraft.loginRequired">
          <template #checked>需要登录</template>
          <template #unchecked>无需登录</template>
        </n-switch>
        <n-switch v-model:value="accessDraft.controlled">
          <template #checked>管控</template>
          <template #unchecked>不管控</template>
        </n-switch>
        <n-input-number v-model:value="accessDraft.dailyLimit" :min="0" :precision="0" placeholder="日额度" />
        <n-input-number v-model:value="accessDraft.costPerUse" :min="0" :precision="0" placeholder="超额单价" />
        <n-input-number v-model:value="accessDraft.advancedCost" :min="0" :precision="0" placeholder="高级单价" />
        <c-button :disabled="saving" @click="saveAccess">保存全局规则</c-button>
      </div>
    </section>

    <n-data-table :columns="accessColumns" :data="accessRows" :pagination="{ pageSize: 10 }" :bordered="false" />

    <section class="editor">
      <h2>用户工具额度</h2>
      <div class="filters">
        <n-select v-model:value="selectedUserId" clearable filterable :options="users" placeholder="用户" />
        <n-select v-model:value="selectedToolKey" clearable filterable :options="toolOptions" placeholder="工具" />
        <n-date-picker v-model:formatted-value="usageDate" value-format="yyyy-MM-dd" type="date" />
        <c-button :disabled="loading" @click="loadQuotaRows">查询</c-button>
      </div>
      <div class="editor-grid">
        <n-switch v-model:value="quotaDraft.loginRequired">
          <template #checked>需要登录</template>
          <template #unchecked>无需登录</template>
        </n-switch>
        <n-switch v-model:value="quotaDraft.controlled">
          <template #checked>管控</template>
          <template #unchecked>不管控</template>
        </n-switch>
        <n-input-number v-model:value="quotaDraft.dailyLimit" :min="0" :precision="0" placeholder="日额度" />
        <n-input-number v-model:value="quotaDraft.costPerUse" :min="0" :precision="0" placeholder="超额单价" />
        <n-input-number v-model:value="quotaDraft.advancedCost" :min="0" :precision="0" placeholder="高级单价" />
        <c-button :disabled="saving" @click="saveQuota">保存用户额度</c-button>
      </div>
    </section>

    <n-data-table
      :loading="loading"
      :columns="quotaColumns"
      :data="quotaRows"
      :pagination="{ pageSize: 20 }"
      :bordered="false"
    />
  </main>
</template>

<style scoped lang="less">
.admin-page {
  width: min(1280px, calc(100vw - 32px));
  margin: 28px auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.admin-head {
  h1 {
    margin: 0;
    font-size: 28px;
  }

  p {
    margin: 8px 0 0;
    color: var(--n-text-color-3);
  }
}

.editor {
  padding: 16px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;

  h2 {
    margin: 0 0 12px;
    font-size: 18px;
  }
}

.filters,
.editor-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 12px;
  align-items: center;
}

.filters {
  margin-bottom: 12px;
}

@media (max-width: 840px) {
  .filters,
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
