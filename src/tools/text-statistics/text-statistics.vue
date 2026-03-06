<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline placeholder="文本内容..." rows="5" />
    <div mt-5 flex>
      <n-statistic :value="text.length" flex-1 >
        <template #label>
          字符数量
        </template>
      </n-statistic>
      <n-statistic :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 >
        <template #label>
          词汇数量
        </template>
      </n-statistic>
      <n-statistic :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 >
        <template #label>
          段落数量
        </template>
      </n-statistic>
      <n-statistic :value="formatBytes(getStringSizeInBytes(text))" flex-1 >
        <template #label>
          字节大小
        </template>
      </n-statistic>
    </div>
  </c-card>
</template>
