<script lang="ts" setup>
import { useTheme } from './c-card.theme';

const props = defineProps<{
  title?: string
}>();

const { title } = toRefs(props);

const theme = useTheme();
</script>

<template>
  <div class="c-card">
    <div v-if="title" class="c-card-title">
      {{ title }}
    </div>
    <slot />
  </div>
</template>

<style lang="less" scoped>
.c-card {
  background-color: v-bind('theme.backgroundColor');
  border: 1px solid v-bind('theme.borderColor');
  border-radius: 4px;
  padding: 20px 24px;
  position: relative;
  margin-top: 1.5rem;

  &-title {
    font-size: 16px;
    font-weight: 500;
    position: absolute;
    top: -1rem;
    left: 1rem;
    padding: 0.2rem 1rem;
    height: 2rem;
    background-color: v-bind('theme.switchBackgroundColor');
    border: 1px solid v-bind('theme.switchBorderColor');
    color: v-bind('theme.borderColor');
    border-radius: 4px;
    z-index: 1;
  }
}
</style>
