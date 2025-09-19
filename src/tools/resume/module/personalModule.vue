<script setup lang="ts">
import { useResumeStore } from '@/stores/resume.store';

const { data } = defineProps({
  data: { type: Object, default: () => {} }
});

const store = useResumeStore();
// store.template

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
  <section cursor-pointer flex justify-between v-if="hasValue(data)">
    <div flex flex-col class="module-body">
      <h1>{{ data?.name }}</h1>
      <div flex flex-1>
        <span>{{ data?.city }}</span> | <span>{{ data?.email }}</span> | <span>{{ data?.phone }}</span>
      </div>
      <div flex>
        <span>{{ data?.email }}</span>
        <span>{{ data?.phone }}</span>
      </div>
    </div>
    <div>
      <img v-if="data?.avatarUrl" :src="data.avatarUrl" class="avatar" />
    </div>
  </section>
  <section v-else class="example module-body" flex justify-between>
    <div flex flex-col gap-2>
      <h3>姓名</h3>
      <div flex gap-2>
        <span>男</span> |  <span>23岁</span>  |  <span>党员</span>  |  <span>广州</span>  |  <span>本科</span>
      </div>
      <div flex gap-2>
        <span>mail.com</span>
        <span>13001001000</span>
      </div>
    </div>
    <div class="avatar"></div>
  </section>
</template>

<style scoped lang="less">

</style>
