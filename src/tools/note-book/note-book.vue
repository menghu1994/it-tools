<script setup lang="ts">
import { AddCircleOutlineTwotone, DeleteOutlineRound } from '@vicons/material';
import Editor from '@/tools/html-wysiwyg-editor/editor/editor.vue';
import { useNotes, type Note, type NoteCategory } from './useNotes';

const message = useMessage();
const dialog = useDialog();

const {
  notes,
  categories,
  categoryNames,
  searchNoteTitle,
  selectedCategory,
  totalPages,
  totalCount,
  page,
  loading,
  fetchNotes,
  fetchCategories,
  saveNote: persistNote,
  deleteNote: removeNote,
  addCategory,
  deleteCategory,
} = useNotes();

const currentNote = ref<Note>(makeEmptyNote());
const categoryName = ref('');

const categoryOptions = computed(() =>
  categoryNames.value.map(name => ({ label: name, value: name })),
);

function makeEmptyNote(): Note {
  return {
    title: '',
    content: '',
    category: '未分类',
  };
}

async function loadData() {
  await Promise.all([fetchCategories(), fetchNotes()]);
}

function switchNote(note: Note) {
  currentNote.value = { ...note };
}

function newNote() {
  currentNote.value = makeEmptyNote();
}

async function saveNote() {
  if (!currentNote.value.title.trim()) {
    message.warning('请输入标题');
    return;
  }

  await persistNote(currentNote.value);
  message.success('笔记已保存');
  if (!currentNote.value._id && !currentNote.value.id) {
    newNote();
  }
}

function confirmDeleteNote(note: Note) {
  dialog.warning({
    title: '删除笔记',
    content: `确定删除「${note.title}」吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      await removeNote(note);
      if ((currentNote.value._id || currentNote.value.id) === (note._id || note.id)) {
        newNote();
      }
      message.success('笔记已删除');
    },
  });
}

async function createCategory() {
  if (!categoryName.value.trim()) {
    message.warning('请输入分类名称');
    return;
  }
  await addCategory(categoryName.value);
  categoryName.value = '';
  message.success('分类已添加');
}

function confirmDeleteCategory(category: NoteCategory) {
  dialog.warning({
    title: '删除分类',
    content: `确定删除「${category.name}」吗？该分类下的笔记会移动到未分类。`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteCategory(category);
      if (currentNote.value.category === category.name) {
        currentNote.value.category = '未分类';
      }
      message.success('分类已删除');
    },
  });
}

async function search() {
  page.value = 1;
  await fetchNotes();
}

watch(page, fetchNotes);
watch(selectedCategory, search);

onMounted(loadData);
</script>

<template>
  <div class="note-book w-full">
    <section class="side-panel">
      <div class="toolbar">
        <n-input v-model:value="searchNoteTitle" clearable placeholder="搜索标题" @keyup.enter="search" />
        <c-button @click="search">搜索</c-button>
        <c-button @click="newNote">
          <n-icon :component="AddCircleOutlineTwotone" />
        </c-button>
      </div>

      <n-tabs type="line" animated>
        <n-tab-pane name="notes" tab="全部笔记">
          <n-spin :show="loading">
            <div class="note-list">
              <div
                v-for="note in notes"
                :key="note._id || note.id"
                class="note-item"
                :class="{ active: (currentNote._id || currentNote.id) === (note._id || note.id) }"
                @click="switchNote(note)"
              >
                <div class="note-summary">
                  <strong>{{ note.title }}</strong>
                  <span>{{ note.category }}</span>
                </div>
                <c-button circle variant="text" @click.stop="confirmDeleteNote(note)">
                  <n-icon :component="DeleteOutlineRound" />
                </c-button>
              </div>

              <n-empty v-if="notes.length === 0" description="暂无笔记" />
            </div>
          </n-spin>

          <div class="pager">
            <span>共 {{ totalCount }} 条</span>
            <n-pagination v-model:page="page" :page-count="totalPages" simple />
          </div>
        </n-tab-pane>

        <n-tab-pane name="categories" tab="分类">
          <div class="category-create">
            <n-input v-model:value="categoryName" clearable placeholder="新分类名称" @keyup.enter="createCategory" />
            <c-button @click="createCategory">添加</c-button>
          </div>

          <div class="category-list">
            <div
              class="category-item"
              :class="{ active: selectedCategory === null }"
              @click="selectedCategory = null"
            >
              <span>全部</span>
            </div>
            <div
              v-for="category in categories"
              :key="category._id"
              class="category-item"
              :class="{ active: selectedCategory === category.name }"
              @click="selectedCategory = category.name"
            >
              <span>{{ category.name }}</span>
              <c-button
                v-if="category.name !== '未分类'"
                circle
                variant="text"
                @click.stop="confirmDeleteCategory(category)"
              >
                <n-icon :component="DeleteOutlineRound" />
              </c-button>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </section>

    <section class="editor-panel">
      <div class="editor-header">
        <n-input v-model:value="currentNote.title" placeholder="标题" />
        <n-select
          v-model:value="currentNote.category"
          filterable
          :options="categoryOptions"
          placeholder="选择分类"
        />
        <c-button :disabled="!currentNote.title" @click="saveNote">保存</c-button>
      </div>
      <Editor v-model:html="currentNote.content" />
    </section>
  </div>
</template>

<style scoped lang="less">
.note-book {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 760px);
  gap: 16px;
  justify-content: center;
}

.side-panel,
.editor-panel {
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 14px;
  background: var(--n-color);
}

.toolbar,
.editor-header,
.category-create {
  display: flex;
  gap: 8px;
  align-items: center;
}

.note-list,
.category-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 280px;
}

.note-item,
.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.note-item:hover,
.note-item.active,
.category-item:hover,
.category-item.active {
  background: rgba(24, 160, 88, 0.12);
}

.note-summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: var(--n-text-color-3);
    font-size: 12px;
  }
}

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  color: var(--n-text-color-3);
}

.editor-header {
  margin-bottom: 12px;

  .n-input {
    flex: 1;
  }

  .n-select {
    width: 180px;
  }
}

@media (max-width: 900px) {
  .note-book {
    grid-template-columns: 1fr;
  }
}
</style>
