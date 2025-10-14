<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotes, type Note } from './useNotes';
import { DeleteOutlineRound, AddCircleOutlineTwotone, ArrowBackIosNewSharp } from '@vicons/material';
import Editor from '@/tools/html-wysiwyg-editor/editor/editor.vue';

const {
  notes,
  cateGorys,
  searchNoteTitle,
  showNotes,
  totalPages,
  page,
  addNote,
  deleteNote,
  addCategory,
  deleteCategory,
  getCateLength,
  fetchNotes,
  fetchCategories
} = useNotes();

const showCateGoryItem = ref(false);
const cateGorysSource = ref<Note[]>([]);
const curNote = ref<Note>({ title: '', content: '', category: '未分类' });

onMounted(() => {
  fetchNotes();
  fetchCategories();
});

const switchNote = (note: Note) => {
  curNote.value = { ...note };
};

const newNote = () => {
  curNote.value = { title: '', content: '', category: '未分类' };
};

const saveNote = async () => {
  await addNote(curNote.value);
  curNote.value = { title: '', content: '', category: '未分类' };
  await fetchNotes();
};

const onShowCategory = (cate: string) => {
  cateGorysSource.value = notes.value.filter(note => note.category === cate);
  showCateGoryItem.value = true;
};
</script>

<template>
  <div flex gap-2 justify-center class="w-full">
    <!-- 左侧分类/列表 -->
    <c-card style="width: 300px;">
      <n-tabs type="line" animated class="h-full" :pane-wrapper-style="{ height: '100%' }">

        <n-tab-pane name="config" tab="全部" :display-directive="'show'" h-full>
          <div flex flex-col justify-between h-full>
            <div flex flex-col>
              <c-input-text v-model:value="searchNoteTitle" mb-2 placeholder="搜索" clearable></c-input-text>
              <div style="min-height: 300px" flex flex-col gap-1>
                <div v-for="(note, noteIndex) in showNotes" flex justify-between items-center gap-2 class="note-item">
                  <n-ellipsis :line-clamp="1" flex-1 cursor-pointer>
                    <span @click="switchNote(note)">
                      {{ note.title }}
                    </span>
                  </n-ellipsis>
                  <c-button circle @click="deleteNote(noteIndex)">
                    <n-icon :component="DeleteOutlineRound" size="18"></n-icon>
                  </c-button>
                </div>
              </div>
            </div>
            <div flex justify-between items-center>
              <span>共 {{ notes.length }} 篇</span>
              <n-pagination v-model:page="page" :page-count="totalPages" simple />
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="module" tab="分类">
          <template v-if="!showCateGoryItem">
            <div v-for="cate in cateGorys" :key="cate" flex justify-between items-center cursor-pointer
              @click="onShowCategory(cate)" class="note-item">
              <div flex flex-col p-2 border-2px border-gray-300>
                <span font-bold>{{ cate }}</span>
                <span>{{ getCateLength(cate) }}篇记事</span>
              </div>
              <c-button circle v-if="cate !== '未分类'" @click.stop="deleteCategory(cate)">
                <n-icon :component="DeleteOutlineRound" size="18"></n-icon>
              </c-button>
            </div>
            <c-button @click="addCategory(prompt('请输入分类名') || '')">
              <n-icon :component="AddCircleOutlineTwotone" size="18"></n-icon>
              新增分类
            </c-button>
          </template>

          <div v-else flex flex-col gap-1>
            <c-button @click="showCateGoryItem = false;" mb2>
              <n-icon :component="ArrowBackIosNewSharp" size="18"></n-icon>
              返回
            </c-button>
            <div v-for="value in cateGorysSource" flex justify-between items-center class="note-item">
              <n-ellipsis :line-clamp="1" flex-1 cursor-pointer>
                <span @click="switchNote(value)">{{ value.title }}</span>
              </n-ellipsis>
              <c-button circle>
                <n-icon :component="DeleteOutlineRound" size="18"></n-icon>
              </c-button>
            </div>
          </div>
        </n-tab-pane>

        <template #suffix>
          <c-button @click="newNote">
            <n-icon :component="AddCircleOutlineTwotone" size="18" circle></n-icon>
          </c-button>
        </template>
      </n-tabs>
    </c-card>

    <!-- 右侧编辑区 -->
    <c-card style="width: 700px;">
      <div flex justify-between items-center>
        <c-input-text v-model:value="curNote.title" placeholder="标题" style="width: 300px;" />
        <div flex gap-2 items-center>
          <c-select v-model:value="curNote.category" searchable :options="cateGorys" placeholder="选择分类"/>
          <c-button :disabled="!curNote?.title" @click="saveNote">保存</c-button>
        </div>
      </div>
      <Editor v-model:html="curNote.content" />
    </c-card>
  </div>
</template>

<style scoped lang="less">
.note-item {
  padding: 0.4rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
}
</style>
