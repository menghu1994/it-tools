<script setup lang="ts">
import { toolCommentsService } from '@/api/tool-comments.service';
import { tools } from '@/tools';
import type { DataTableColumns, PaginationProps, SelectOption } from 'naive-ui';

interface CommentRow {
  _id: string
  toolKey: string
  content: string
  rawContent: string
  author?: { username?: string }
  createdAt: string
  isActive: boolean
  parentDeleted?: boolean
  children?: CommentRow[]
}

const message = useMessage();
const loading = ref(false);
const toolKey = ref<string | null>(null);
const keyword = ref('');
const status = ref<'all' | 'active' | 'deleted'>('all');
const rows = ref<CommentRow[]>([]);

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page;
    loadRows();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    loadRows();
  },
});

const toolOptions = computed<SelectOption[]>(() =>
  tools.map(tool => ({ label: tool.name, value: tool.path })),
);

const statusOptions: SelectOption[] = [
  { label: '全部状态', value: 'all' },
  { label: '显示中', value: 'active' },
  { label: '已删除', value: 'deleted' },
];

const columns: DataTableColumns<CommentRow> = [
  {
    title: '评论内容',
    key: 'content',
    minWidth: 280,
    render: row => row.content,
  },
  { title: '原内容', key: 'rawContent', minWidth: 220 },
  { title: '工具', key: 'toolKey', width: 180, render: row => toolLabel(row.toolKey) },
  { title: '用户', key: 'author', width: 120, render: row => row.author?.username || '-' },
  { title: '时间', key: 'createdAt', width: 180, render: row => new Date(row.createdAt).toLocaleString() },
  { title: '状态', key: 'isActive', width: 90, render: row => row.isActive ? '显示' : '已删除' },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row) {
      return h(
        'button',
        {
          class: row.isActive ? 'link-button danger' : 'link-button',
          disabled: !row.isActive && row.parentDeleted,
          onClick: () => row.isActive ? removeComment(row) : restoreComment(row),
        },
        row.isActive ? '删除' : row.parentDeleted ? '父级已删除' : '恢复',
      );
    },
  },
];

async function loadRows() {
  loading.value = true;
  try {
    const res = await toolCommentsService.adminList({
      toolKey: toolKey.value || undefined,
      keyword: keyword.value || undefined,
      isActive: status.value === 'all' ? undefined : status.value === 'active',
      page: Number(pagination.page || 1) - 1,
      size: Number(pagination.pageSize || 10),
    });
    rows.value = normalizeChildren(res.data || []);
    pagination.itemCount = Number(res.headers?.['x-total-count'] || 0);
  } finally {
    loading.value = false;
  }
}

async function search() {
  pagination.page = 1;
  await loadRows();
}

async function removeComment(row: CommentRow) {
  await toolCommentsService.remove(row._id);
  message.success('评论及其回复已删除');
  await loadRows();
}

async function restoreComment(row: CommentRow) {
  await toolCommentsService.restore(row._id);
  message.success('评论及其回复已恢复');
  await loadRows();
}

function normalizeChildren(items: CommentRow[]): CommentRow[] {
  return items.map(item => ({
    ...item,
    children: item.children && item.children.length > 0
      ? normalizeChildren(item.children).map(child => ({
          ...child,
          parentDeleted: !item.isActive || child.parentDeleted,
        }))
      : undefined,
  }));
}

function toolLabel(value: string) {
  return toolOptions.value.find(option => option.value === value)?.label?.toString() || value;
}

onMounted(loadRows);
</script>

<template>
  <main class="admin-page">
    <section class="admin-head">
      <h1>评论管理</h1>
      <p>评论按父子层级展示。删除父级会同时删除所有子级；恢复父级会同时恢复所有子级。</p>
    </section>

    <section class="filters">
      <n-select v-model:value="toolKey" clearable filterable :options="toolOptions" placeholder="工具" />
      <n-select v-model:value="status" :options="statusOptions" placeholder="状态" />
      <n-input v-model:value="keyword" clearable placeholder="内容关键字" @keyup.enter="search" />
      <c-button :disabled="loading" @click="search">查询</c-button>
    </section>

    <n-data-table
      remote
      :loading="loading"
      :columns="columns"
      :data="rows"
      :pagination="pagination"
      :bordered="false"
      :row-key="(row: CommentRow) => row._id"
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

.filters {
  display: grid;
  grid-template-columns: minmax(180px, 260px) minmax(120px, 160px) minmax(180px, 1fr) auto;
  gap: 12px;
  align-items: center;
}

:deep(.link-button) {
  border: 0;
  background: transparent;
  color: #18a058;
  cursor: pointer;
}

:deep(.link-button.danger) {
  color: #d03050;
}

:deep(.link-button:disabled) {
  color: var(--n-text-color-disabled);
  cursor: not-allowed;
}

@media (max-width: 860px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
