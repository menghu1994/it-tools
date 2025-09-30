<script setup lang="ts">
import { useModule } from './useModule';
const props = defineProps({
	value: { type: Object || Array, default: () => { } }
});

const { data, hasValue, formatDate } = useModule(props)
</script>

<template>
  <section>
    <div class="module-title">
      <span>校内经历</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" flex flex-col gap-1 class="module-body">
      <div flex gap-2 font-bold items-center>
        <span v-if="data.organization">{{ data.organization }}</span>
        <span v-if="data.department">{{ data.department }}</span>
        <span v-if="data.position">{{ data.position }}</span>
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
        <span>腾讯大学产品协会</span>
        <span>产品研发部</span>
        <span>副主席</span>
        <span class="resume_preview_work_info_date">2018.9 - 2020.3</span>
      </div>
      <div>主导产品项目立项</div>
      <div>
        主导QQ邮箱超大附件、漂流瓶、记事本等多个产品的立项、资源协调、进度管理和对外合作工作
      </div>
    </div>
  </section>
</template>

<style scoped lang="less"></style>
