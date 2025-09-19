<template>
  <div class="resume-root">
    <!-- 个人信息头部 -->
    <PersonalModule :data="personData" @click="$emit('editModule','personal')"></PersonalModule>

    <template v-for="m in modules" :key="m.key">
      <component :is="compMap[m.key]" :value="m.value" @click="$emit('editModule', m.key)" ></component>
    </template>
  </div>
</template>

<script setup lang="ts">
import PersonalModule from '../module/personalModule.vue'
import workModule from '../module/workModule.vue'
import skillModule from '../module/skillModule.vue'
import honorModule from '../module/honorModule.vue'
import campusModule from '../module/campusModule.vue'
import projectModule from '../module/projectModule.vue'
import objectiveModule from '../module/objectiveModule.vue'
import educationModule from '../module/educationModule.vue'

const { data: modules } = defineProps({
  data: { type: Array, default: () => [] }
});

const compMap: any = {
  work: workModule,
  skills: skillModule,
  project: projectModule,
  honor: honorModule,
  campus: campusModule,
  education: educationModule,
  objective: objectiveModule
}

const personData = computed(() => {
  return modules.find(m => m.key === 'personal')?.value
})
</script>

<style lang="less">
.resume-root {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial;
  color:#222;
  font-size: 13px;
  h3 {
    margin: 0;
  }
  section {
    cursor: pointer;
    .module-title {
      color: #2f5785;
      display: flex;
      align-items: center;
      font-weight: bold;
      line-height: 21px;
      letter-spacing: 0;
      margin-bottom: 10px;
      padding: 2px 20px;
      .split-line {
        display: inline-block;
        flex: 1;
        width: 100%;
        height: 1px;
        margin-left: 28px;
        background: #bdd2ea;
        opacity: 0.7;
      }
    }
  }
  .example {
    color:#999
  }
  .module-body {
    padding: 10px 20px;
    border-radius: 5px;
    &:hover {
      background: #f5f6f7;
    }
  }
  .avatar {
    width: 65px;
    height: 90px;
    border: 1px solid rgba(0,0,0,0.07);
    box-sizing: content-box;
    border-radius: 3px;
    overflow: hidden;
  }
}
.resume_preview_work_info_date {
  display: inline-block;
  flex: 1;
  min-width: 150px;
  color: #4a90e2;
  font-weight: normal;
  letter-spacing: 0;
  text-align: right;
}

</style>
