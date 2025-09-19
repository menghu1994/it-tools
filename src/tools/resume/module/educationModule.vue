<script setup lang="ts">
const { data } = defineProps({
  data: { type: Object, default: () => {} }
});

const hasValue = (value: any): boolean => {
  if(!value) { return false }
  if(Array.isArray(value)) {
    return !!value.length
  }
  if(typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return true
}
</script>

<template>
  <section>
    <div class="module-title">
      <span>教育经历</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" class="module-body">
      <div flex gap-2>
        <div class="time">{{ data.from }} — {{ data.to }}</div>
        <div class="body">
          <div class="title">{{ data.school }} · {{ data.major }}</div>
          <div class="sub">{{ data.degree }} · GPA: {{ data.gpa || '--' }}</div>
        </div>
      </div>
    </div>
    <div v-else class="example module-body" flex flex-col gap-1>
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
  </section>
</template>

<style scoped lang="less">

</style>
