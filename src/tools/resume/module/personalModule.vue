<script setup lang="ts">
import { useModule } from './useModule';
const props = defineProps({
	value: { type: Object || Array, default: () => { } }
});

const { data, hasValue,formatDate, layout } = useModule(props)

const getAge = (birth: number) => {
  return new Date().getFullYear() - new Date(birth).getFullYear();
}

const getExperience = (data: any) => {
  return data.fresh ? '应届毕业生' : ''
}
</script>

<template>
  <section cursor-pointer flex justify-between  class="module-body" v-if="hasValue(data) && layout === 'standard'">
    <div flex flex-col>
      <h3>{{ data?.name }}</h3>
      <div flex flex-1 gap-2>
        <span>{{ getExperience(data) }}</span>|
        <span>{{ data?.highestEducation }}</span>|
        <span>{{ data?.political }}</span>|
        <span>{{ getAge(data.birth) }}</span>|
        <span>{{ data?.sex }}</span>
      </div>
      <div flex gap-2>
        <span v-if="data?.address">所在地： {{ data?.address }}</span>
        <span v-if="data?.originPlace">籍贯： {{ data?.originPlace }}</span>
      </div>
      <div flex gap-2>
        <span>{{ data?.email }}</span>
        <span>{{ data?.phoneNumber }}</span>
      </div>
    </div>
    <div class="avatar" >
      <n-image v-if="data.avatar" width="65" height="90" :src="data.avatar" preview-disabled/>
    </div>
  </section>
  <section cursor-pointer flex justify-between  class="module-body" v-else-if="hasValue(data) && layout === 'simple'">
    <div flex flex-col gap-1>
      <div class="avatar" >
        <n-image v-if="data.avatar" width="65" height="90" :src="data.avatar" preview-disabled/>
      </div>
      <h3>{{ data?.name }}</h3>
      <div flex flex-1 gap-1 class="second-color">
        <span>{{ getExperience(data) }}</span>|
        <span>{{ data?.highestEducation }}</span>|
        <span>{{ data?.political }}</span>|
        <span>{{ getAge(data.birth) }}</span>|
        <span>{{ data?.sex }}</span>
      </div>
      <span v-if="data?.address" class="second-color">所在地： {{ data?.address }}</span>
      <span v-if="data?.originPlace" class="second-color">籍贯： {{ data?.originPlace }}</span>
      <span class="second-color">{{ data?.email }}</span>
      <span class="second-color">{{ data?.phoneNumber }}</span>
    </div>
  </section>
  <section v-else-if="layout === 'standard'" class="example module-body" flex justify-between>
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
  <section v-else-if="layout === 'simple'" class="example module-body" flex flex-col gap-1>
    <div class="avatar"></div>
    <h3>姓名</h3>
    <div flex gap-2>
      <span>男</span> |  <span>23岁</span>  |  <span>本科</span>
    </div>
    <span>13001001000</span>
    <span>mail.com</span>
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
