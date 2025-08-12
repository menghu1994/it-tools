<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import _ from 'lodash';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' });
const { value } = toRefs(props);

const initialText = 'entity.action.copyToClipboard';

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? 'entity.action.copied' : initialText);
</script>

<template>
  <c-tooltip :tooltip="$t(tooltipText)">
    <span cursor-pointer font-mono @click="copy()">{{ value }}</span>
  </c-tooltip>
</template>
