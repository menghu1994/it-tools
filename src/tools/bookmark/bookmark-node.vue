<script setup lang="ts">
import type { Bookmark } from './bookmark.types';

const { node } = defineProps<{ node: Bookmark }>();
</script>

<template>
  <div>
    <span v-if="node.type === 'folder'" class="folder">
      📁 {{ node.title }} ({{ node?.children?.length }})
    </span>
    <a v-else :href="node?.url" target="_blank" class="bookmark">
      🔗 {{ node.title }}
    </a>

    <ul v-if="node.children && node.children.length > 0" class="children">
      <li v-for="(child, index) in node.children" :key="index">
        <bookmark-node :node="child" />
      </li>
    </ul>
  </div>
</template>
