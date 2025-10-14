<script setup lang="ts">
import { DeleteOutlineRound, AddCircleOutlineTwotone, ArrowBackIosNewSharp } from '@vicons/material';
// import htmlParser from 'prettier/plugins/html';
import Editor from '@/tools/html-wysiwyg-editor/editor/editor.vue';
import _, { add } from 'lodash';

interface Note {
  noteName: string,
  content: string,
  category?: string
}

const showCateGoryItem = ref(false);
const cateGorys = ref(['未分类', '日记', '书签'])

const searchNoteTitle = ref<string>('');
const curNote = ref<Note>({ noteName: '', content: '', category: '未分类' });

const cateGorysSource = ref<Note[]>([])
const notes = ref<Note[]>([])

const page = ref(1);
const itemPerPage = 10;

const filterNotes = ref<Note[]>([]);
const showNotes = computed(() => filterNotes.value.slice((page.value - 1) * itemPerPage, page.value * itemPerPage))
const totalPages = computed(() => Math.ceil(filterNotes.value.length / itemPerPage));

watchEffect(() => {
  filterNotes.value = notes.value.filter(note => note.noteName.includes(searchNoteTitle.value));
})

const getCateLength = (cate: string) => {
  return notes.value.filter(note => note.category === cate).length
}

const switchNotePage = ($event: any) => {
  console.error($event)
  return false
}

const newNote = () => {
  curNote.value = {
    noteName: '',
    content: '',
    category: '未分类'
  }
}

const onShowCategory = (cate: string) => {
  const filterNotes = notes.value.filter(note => note.category === cate);
  if (filterNotes.length === 0) {
    return;
  }
  showCateGoryItem.value = true;
  cateGorysSource.value = filterNotes;
}

const switchNote = ($event: Note) => {
  curNote.value = {
    noteName: $event.noteName,
    content: $event.content,
    category: $event.category
  }
}

const removeNote = (noteIndex: number) => {
  const curIndex = (page.value - 1) * itemPerPage + noteIndex;
  notes.value.splice(curIndex, 1);
}

const saveNote = () => {
  notes.value.push({ ...curNote.value! });
  curNote.value = { noteName: '', content: '', category: '未分类' };
}

const deleteCategory = (category: string, cateIndex: number) => {
  notes.value.filter(note => note.category === category)?.forEach(note => note.category = '未分类');
  cateGorys.value.splice(cateIndex, 1);
}

// const formattedHtml = asyncComputed(() => format(html.value, { parser: 'html', plugins: [htmlParser] }), '');
</script>

<template>
  <div flex gap-2 justify-center class="w-full">
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
                      {{ note.noteName }}
                    </span>
                  </n-ellipsis>
                  <c-button circle @click="removeNote(noteIndex)">
                    <n-icon :component="DeleteOutlineRound" size="18"></n-icon>
                  </c-button>
                </div>
              </div>
            </div>
            <div flex justify-between items-center>
              <span>共 {{ notes.length }} 篇</span>
              <n-pagination v-model:page="page" :page-count="totalPages" simple
                @on-update:page="switchNotePage($event)" />
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="module" tab="分类">
          <template v-if="!showCateGoryItem">
            <div v-for="(cate, cateIndex) in cateGorys" :key="cate" flex justify-between items-center cursor-pointer
              @click="onShowCategory(cate)" class="note-item">
              <div flex flex-col p-2 border-2px border-gray-300>
                <span font-bold>{{ cate }}</span>
                <span>{{ getCateLength(cate) }}篇记事</span>
              </div>
              <c-button circle v-if="cate !== '未分类'" @click="deleteCategory(cate, cateIndex)">
                <n-icon :component="DeleteOutlineRound" size="18"></n-icon>
              </c-button>
            </div>
            <c-button @click="addCategory">
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
              <n-ellipsis :line-clamp="1" flex-1 cursor-pointer >
                <span @click="switchNote(value)">{{ value.noteName }}</span>
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
    <c-card style="width: 700px;">
      <div flex justify-between items-center>
        <c-input-text v-model:value="curNote.noteName" placeholder="标题" style="width: 300px;" />
        <div flex gap-2 items-center>
          <c-select  v-model:value="curNote.category" searchable :options="cateGorys" />
          <c-button :disabled="!curNote?.noteName" @click="saveNote">保存</c-button>
        </div>
      </div>
      <Editor v-model:html="curNote.content"/>
      <!-- <TextareaCopyable :value="formattedHtml" language="html" /> -->
    </c-card>
  </div>
</template>

<style scoped lang="less">
.note-item {
  padding: 0.4rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background-color: #f5f5f5;
    color: #333
  }
}
</style>
