<script setup lang="ts">
import { useModule } from './useModule';
const props = defineProps({
	value: { type: Object || Array, default: () => { } }
});

const { data, hasValue } = useModule(props)
</script>

<template>
  <section>
    <div class="module-title">
      <span>求职意向</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" class="module-body">
      <div flex gap-2>
        <span v-if="data.post">求职岗位：{{ data.post }}</span>|
        <span v-if="data.intendedCities">意向城市：{{ data.intendedCities }}</span>|
        <span>期望薪资：{{ data.lowest === 0 ? '面议' : (data.lowest + '-' + data.highest + 'k') }}</span>|
        <span v-if="data.arrivalTime">到岗时间：{{ data.arrivalTime }}</span>
      </div>
    </div>
    <div v-else class="example module-body" flex gap-2>
      <span>求职岗位：保洁</span>|
      <span>意向城市：苏州</span>|
      <span>期望薪资：2.2-2.4k</span>|
      <span>到岗时间：面议</span>
    </div>
  </section>
</template>

<style scoped lang="less"></style>
