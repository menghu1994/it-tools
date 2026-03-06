<!-- src/components/DynamicMarkdown.vue -->
<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

interface Props {
  filePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  filePath: ''
});

const route = useRoute();
const MarkdownComponent = ref();
const loading = ref(false);
const error = ref('');

// 根据文件路径动态加载 Markdown 组件
const loadMarkdown = async (path: string) => {
  if (!path) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // 动态导入 Markdown 文件
    const module = await import(/* @vite-ignore */ `../../public/blog/${path}`);
    MarkdownComponent.value = defineAsyncComponent(() =>
      Promise.resolve(module.default || module)
    );
  } catch (err) {
    error.value = `无法加载文档: ${path}`;
    MarkdownComponent.value = null;
  } finally {
    loading.value = false;
  }
};

// 获取要加载的文件路径
const getFilePath = () => {
  return props.filePath || route.meta.filePath as string || route.params.path as string;
};

// 初始加载
onMounted(() => {
  const filePath = getFilePath();
  if (filePath) {
    loadMarkdown(filePath);
  }
});

// 监听路由变化
watch(() => route.fullPath, () => {
  const filePath = getFilePath();
  if (filePath) {
    loadMarkdown(filePath);
  }
});

// 监听 props 变化
watch(() => props.filePath, (newPath) => {
  if (newPath) {
    loadMarkdown(newPath);
  }
});
</script>

<template>
  <div class="dynamic-markdown">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <component v-else-if="MarkdownComponent" :is="MarkdownComponent" />
  </div>
</template>

<style scoped>
.dynamic-markdown {
  min-height: 400px;
}

.loading, .error, .no-content {
  padding: 40px;
  text-align: center;
  color: #666;
}

.error {
  color: #f56c6c;
}
</style>
