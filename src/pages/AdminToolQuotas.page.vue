<script setup lang="ts">
import { itToolsService } from '@/api/it-tools.service';
import { tools } from '@/tools';
import type { DataTableColumns, SelectOption } from 'naive-ui';

interface UserOption extends SelectOption {
  username?: string
}

interface ToolQuotaRow {
  userId: string
  toolKey: string
  controlled: boolean
  loginRequired: boolean
  dailyLimit: number
  costPerUse: number
  advancedCost: number
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
const rows = ref<ToolQuotaRow[]>([]);
const users = ref<UserOption[]>([]);

const toolOptions = computed<SelectOption[]>(() =>
  tools.map(tool => ({
    label: tool.name,
    value: tool.path,
  })),
);

const selectedUser = computed(() => users.value.find(user => user.value === selectedUserId.value));
const selectedTool = computed(() => toolOptions.value.find(tool => tool.value === selectedToolKey.value));

const draft = reactive({
  controlled: true,
  loginRequired: true,
  dailyLimit: 5,
  costPerUse: 1,
  advancedCost: 1,
});

const columns: DataTableColumns<ToolQuotaRow> = [
  { title: '用户', key: 'userId', render: row => userLabel(row.userId) },
  { title: '工具', key: 'toolKey', render: row => toolLabel(row.toolKey) },
  { title: '管控', key: 'controlled', render: row => row.controlled ? '是' : '否' },
  { title: '需登录', key: 'loginRequired', render: row => row.loginRequired ? '是' : '否' },
  { title: '日额度', key: 'dailyLimit' },
  { title: '当天已用', key: 'todayUsedCount' },
  { title: '超额单价', key: 'costPerUse' },
  { title: '高级单价', key: 'advancedCost' },
  { title: '已花费', key: 'spentCoins' },
  { title: '高级花费', key: 'advancedSpentCoins' },
];

async function loadUsers() {
  const res = await itToolsService.adminUsers({ pageSize: 200 });
  users.value = (res.data || []).map((user: any) => ({
    label: `${user.username}${user.name ? ` (${user.name})` : ''}`,
    value: user._id,
    username: user.username,
  }));
}

async function loadRows() {
  loading.value = true;
  try {
    const res = await itToolsService.adminToolQuotas({
      userId: selectedUserId.value || undefined,
      toolKey: selectedToolKey.value || undefined,
      date: usageDate.value,
    });
    rows.value = res.data || [];
  } finally {
    loading.value = false;
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
      ...draft,
    });
    message.success('配置已保存');
    await loadRows();
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

watch(rows, (value) => {
  const current = value.find(row => row.userId === selectedUserId.value && row.toolKey === selectedToolKey.value);
  if (!current) {
    return;
  }

  draft.controlled = current.controlled;
  draft.loginRequired = current.loginRequired;
  draft.dailyLimit = current.dailyLimit;
  draft.costPerUse = current.costPerUse;
  draft.advancedCost = current.advancedCost;
});

onMounted(async () => {
  await loadUsers();
  await loadRows();
});
</script>

<template>
  <main class="admin-page">
    <section class="admin-head">
      <div>
        <h1>工具额度管理</h1>
        <p>配置每个用户在每个工具上的日额度、登录要求和金币消耗规则。</p>
      </div>
    </section>

    <section class="filters">
      <n-select
        v-model:value="selectedUserId"
        clearable
        filterable
        :options="users"
        placeholder="用户"
      />
      <n-select
        v-model:value="selectedToolKey"
        clearable
        filterable
        :options="toolOptions"
        placeholder="工具"
      />
      <n-date-picker v-model:formatted-value="usageDate" value-format="yyyy-MM-dd" type="date" />
      <c-button :disabled="loading" @click="loadRows">查询</c-button>
    </section>

    <section class="editor">
      <div class="editor-title">
        <strong>{{ selectedUser?.label || '选择用户' }}</strong>
        <span>{{ selectedTool?.label || '选择工具' }}</span>
      </div>
      <div class="editor-grid">
        <n-switch v-model:value="draft.controlled">
          <template #checked>管控</template>
          <template #unchecked>不管控</template>
        </n-switch>
        <n-switch v-model:value="draft.loginRequired">
          <template #checked>需要登录</template>
          <template #unchecked>无需登录</template>
        </n-switch>
        日额度：<n-input-number v-model:value="draft.dailyLimit" :min="0" :precision="0" placeholder="日额度" />
        超额单价：<n-input-number v-model:value="draft.costPerUse" :min="0" :precision="0" placeholder="超额单价" />
        高级单价：<n-input-number v-model:value="draft.advancedCost" :min="0" :precision="0" placeholder="高级单价" />
        <c-button :disabled="saving" @click="saveQuota">保存配置</c-button>
      </div>
    </section>

    <n-data-table
      :loading="loading"
      :columns="columns"
      :data="rows"
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

.filters,
.editor-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 12px;
  align-items: center;
}

.editor {
  padding: 16px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
}

.editor-title {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;

  span {
    color: var(--n-text-color-3);
  }
}

@media (max-width: 840px) {
  .filters,
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
