<script setup lang="ts">
import BookmarkNode from './bookmark-node.vue'
import { parseBookmarks } from './bookmark.service';
import type { Bookmark } from './bookmark.types';

let loading = ref(false);
let bookmarkTree = ref<Bookmark[]>([]);
// let flattenedBookmarks = ref<any[]>([]);

function handleFileUpload(file: File) {
  loading.value = true

  const reader = new FileReader()

  reader.onload = (e: any) => {
    const content = e.target.result
    const result = parseBookmarks(content);
    if (result) {
      bookmarkTree.value = result.treeBookmarks;
      // flattenedBookmarks.value = result.flattenedBookmarks;
    }
    loading.value = false
  }

  reader.readAsText(file)
}

</script>

<template>
  <div>
    <c-file-upload title="上传从浏览器中下载书签文件" @file-upload="handleFileUpload"
      :accept="'.html'" />

    <div v-if="bookmarkTree.length > 0">
      <!-- <h3 class="font-red">书签树状结构</h3> -->
      <ul class="bookmark-tree">
        <li v-for="(item, index) in bookmarkTree" :key="index">
          <component :is="BookmarkNode" :node="item" />
        </li>
      </ul>

      <!-- <n-divider />

      <h3 class="font-red">扁平化书签列表 (共 {{ flattenedBookmarks.length }} 个)</h3>
      <ul>
        <li v-for="(bookmark, index) in flattenedBookmarks" :key="index">
          <a :href="bookmark.url" target="_blank">{{ bookmark.title }}</a>
          <span v-if="bookmark.path"> - {{ bookmark.path.join(' > ') }}</span>
        </li>
      </ul> -->
    </div>

  </div>
</template>
