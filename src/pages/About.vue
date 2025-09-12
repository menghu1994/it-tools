<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({ title: 'About - IT Tools' });
const content = `>
    # 关于 IT-Tools

    IT-Tools 由 [Corentin Thomasset](https://corentin.tech?utm_source=it-tools&utm_medium=about) 用 ❤ 开发，IT-Tools 永久免费且开源（GPL-3.0 许可证）

    ## 技术

    IT-Tools 采用 Vue.js（Vue 3）和 Naive UI 组件库开发.
    `
</script>

<template>
  <c-markdown :markdown="content" mx-auto mt-50px max-w-600px />
</template>
