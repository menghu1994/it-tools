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
      <span>个人技能</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" class="module-body">
      {{ data.contents }}
    </div>
    <div v-else class="example module-body" flex flex-col gap-1>
      <div>
        语言技能：英语CET6、粤语
        办公技能：熟练使用Office 办公软件、Axure RP、Visio
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
