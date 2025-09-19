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
      <span>求职意向</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" class="module-body">
      <div flex gap-2>
        {{ data.from }} — {{ data.to }}
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

<style scoped lang="less">

</style>
