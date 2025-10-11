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
      <span>项目经历</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" flex flex-col gap-1 class="module-body">
      <div flex gap-2 font-bold items-center>
        <div flex gap-2 flex-wrap>
          <span v-if="data.organization">{{ data.organization }}</span>
          <span v-if="data.project">{{ data.project }}</span>
          <span v-if="data.role">{{ data.role }}</span>
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
          <span>腾讯大学</span>
          <span>“最亮的明天”暖灯行动</span>
          <span>项目负责人</span>
        </div>
        <span class="resume_preview_work_info_date">2018.9 - 2020.3</span>
      </div>
      <div>引导释放邮箱空间，帮助贫困山区</div>
      <div>
        1、引导用户删除旧邮件，倡导资源节约和合理利用。将节约下来的运营成本投入公益项目，帮助贫困山区的教室改善照明环境
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
