<script setup lang="ts">
import { useModule } from './useModule';
const props = defineProps({
	value: { type: Object || Array, default: () => { } }
});

const { data, hasValue,formatDate, layout } = useModule(props)
</script>

<template>
  <section>
    <div class="module-title">
      <span>教育经历</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data) && layout === 'standard'" class="module-body">
      <div flex gap-2 font-bold items-center flex-wrap>
        <span v-if="data.school">{{ data.school }}</span>
        <span v-if="data.education">{{ data.education }}</span>
        <span v-if="data.major">{{ data.major }}</span>
        <span class="resume_preview_work_info_date" v-if="data.eduDuring">{{ formatDate(data.eduDuring[0]) }} - {{ formatDate(data.eduDuring[1]) }}</span>
      </div>
      <div flex gap-6 items-center>
        <span v-if="data.gpa">绩点: {{ data.gpa }}</span>
        <span v-if="data.ranking">成绩排名: {{ data.ranking }}</span>
      </div>
    </div>
    <div v-else-if="hasValue(data) && layout === 'simple'" class="module-body">
      <div flex flex-col gap-1>
        <span v-if="data.eduDuring">{{ formatDate(data.eduDuring[0]) }} - {{ formatDate(data.eduDuring[1]) }}</span>
        <div flex gap-2 font-bold items-center flex-wrap>
          <span v-if="data.school">{{ data.school }}</span>
          <span v-if="data.education">{{ data.education }}</span>
          <span v-if="data.major">{{ data.major }}</span>
        </div>
        <span v-if="data.gpa">绩点: {{ data.gpa }}</span>
          <span v-if="data.ranking">成绩排名: {{ data.ranking }}</span>
        </div>
    </div>
    <div v-else-if="layout === 'standard'" class="example module-body" flex flex-col gap-1>
      <div flex gap-2 font-bold items-center>
        <span>腾讯大学·计算机</span>
        <span>本科</span>
        <span class="resume_preview_work_info_date">2018.9 - 2020.3</span>
      </div>
      <div flex gap-6 items-center>
        <span>绩点: 3.8/4.0</span>
        <span>成绩排名: 前30%</span>
      </div>
    </div>
    <div v-else-if="layout === 'simple'" class="example module-body" flex flex-col gap-1>
      <div flex flex-col gap-1>
        <span class="" style="margin-bottom: 0.4rem;">2018.9 - 2020.3</span>
        <div flex gap-2 font-bold items-center class="second-color">
          <span>腾讯大学</span>
          <span>计算机</span>
          <span>本科</span>
        </div>
        <span class="second-color">绩点: 3.8/4.0</span>
        <span class="second-color">成绩排名: 前30%</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
