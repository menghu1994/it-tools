<script setup lang="ts">
import { useModule } from './useModule';
const props = defineProps({
	value: { type: Object || Array, default: () => { } }
});

const { data, hasValue,formatDate } = useModule(props)
</script>

<template>
  <section>
    <div class="module-title">
      <span>荣誉奖项</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" flex flex-col gap-1 class="module-body">
      <div v-for="honor of data.honors" flex gap-2>
          <div>{{ formatDate(honor.date) }}</div>
          <div>{{ honor.competitionAwards }}</div>
        </div>
    </div>
    <div v-else class="example module-body" flex flex-col gap-1>
      <div flex flex-col gap-2>
        <span>2014.8 腾讯大学求是杯“腾讯文化奖”金奖</span>
        <span>2014.3 腾讯大学一等奖学金</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
