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
      <span>工作经历</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" flex flex-col gap-1  class="module-body">
      <div flex gap-2 font-bold items-center>
        <div flex gap-2 flex-wrap>
          <span v-if="data.company">{{ data.company }}</span>
          <span v-if="data.department">{{ data.department }}</span>
          <span v-if="data.position">{{ data.position }}</span>
        </div>
        <span class="resume_preview_work_info_date" v-if="data.workDuring">
          {{formatDate(data.workDuring[0])}} - {{ formatDate(data.workDuring[1]) }}
        </span>
      </div>
      <template v-if="data.projectExperience">
        <div v-for="project of data.projectExperience" flex flex-col>
          <div>{{ project.title }}</div>
          <div>{{ project.content }}</div>
        </div>
      </template>
    </div>
    <div v-else class="example module-body" flex flex-col gap-1>
      <div flex gap-2 font-bold items-center>
        <div flex gap-2 flex-wrap>
          <span>腾讯科技广州有限公司</span>
          <span>QQ邮箱产品部</span>
          <span>产品实习生</span>
        </div>
        <span class="resume_preview_work_info_date">2018.9 - 2020.3</span>
      </div>
      <div>QQ邮箱用户运营</div>
      <div>
        负责版本上线后的推广工作，通过微博、博客和论坛等渠道将新功能触达用户
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
