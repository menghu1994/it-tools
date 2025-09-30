<script setup lang="ts">
import { useModule } from './useModule';
const props = defineProps({
	value: { type: Object || Array, default: () => { } }
});

const { data, hasValue,formatDate } = useModule(props)

const getAge = (birth: number) => {
  return new Date().getFullYear() - new Date(birth).getFullYear();
}
</script>

<template>
  <section cursor-pointer flex justify-between  class="module-body" v-if="hasValue(data)">
    <div flex flex-col>
      <h3>{{ data?.name }}</h3>
      <div flex flex-1 gap-2>
        <span>{{ data?.highestEducation }}</span>|
        <span>{{ data?.political }}</span>|
        <span>{{ getAge(data.birth) }}</span>|
        <span>{{ data?.phone }}</span>|
        <span>{{ data?.sex }}</span>
      </div>
      <div flex gap-2>
        <span>所在地： {{ data?.address }}</span>
        <span>籍贯： {{ data?.originPlace }}</span>
      </div>
      <div flex gap-2>
        <span>{{ data?.email }}</span>
        <span>{{ data?.phoneNumber }}</span>
      </div>
    </div>
    <div class="avatar" >
      <img v-if="data?.avatarUrl" :src="data.avatarUrl" />
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
.avatar {
  width: 65px;
  height: 90px;
  border: 1px solid rgba(0,0,0,0.07);
  background-color: #F5F6F7;
  box-sizing: content-box;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
}
</style>
