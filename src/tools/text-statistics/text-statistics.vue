<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline :placeholder="$t('global.textContent')" rows="5" />
    <div mt-5 flex>
      <n-statistic :value="text.length" flex-1 >
        <template #label>
          {{ $t('tools.text-statistics.characterCount') }}
        </template>
      </n-statistic>
      <n-statistic :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 >
        <template #label>
          {{ $t('tools.text-statistics.wordCount') }}
        </template>
      </n-statistic>
      <n-statistic :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 >
        <template #label>
          {{ $t('tools.text-statistics.lineCount') }}
        </template>
      </n-statistic>
      <n-statistic :value="formatBytes(getStringSizeInBytes(text))" flex-1 >
        <template #label>
          {{ $t('tools.text-statistics.byteSize') }}
        </template>
      </n-statistic>
    </div>
  </c-card>
</template>
