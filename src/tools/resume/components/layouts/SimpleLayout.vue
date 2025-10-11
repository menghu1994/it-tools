<template>
  <div class="resume-simple">
    <!-- 个人信息头部 -->
    <div class="left-container container-common">
      <PersonalModule :value="personData" @click="$emit('editModule', 'personal')"></PersonalModule>
      <template v-for="m in props.data" :key="m.key">
        <component :is="leftCompMap[m.key]" :value="m.value" @click="$emit('editModule', m.key)"></component>
      </template>
    </div>
    <div class="right-container container-common">
      <template v-for="m in props.data" :key="m.key">
        <component :is="rightCompMap[m.key]" :value="m.value" @click="$emit('editModule', m.key)"></component>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonalModule from '../../module/personalModule.vue'
import workModule from '../../module/workModule.vue'
import skillModule from '../../module/skillModule.vue'
import honorModule from '../../module/honorModule.vue'
import campusModule from '../../module/campusModule.vue'
import projectModule from '../../module/projectModule.vue'
import objectiveModule from '../../module/objectiveModule.vue'
import educationModule from '../../module/educationModule.vue'

const props = defineProps({
  data: { type: Array, default: () => [] }
});

const leftCompMap: any = {
  skills: skillModule,
  honor: honorModule,
  education: educationModule,
  objective: objectiveModule
}

const rightCompMap: any = {
  work: workModule,
  project: projectModule,
  campus: campusModule,
}

const personData = computed(() => {
  return props.data.find(m => m.key === 'personal')?.value
})

</script>

<style lang="less">
.resume-simple {
  display: flex;
  height: 100%;

  .left-container {
    min-width: 250px;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
    background-color: #f7f9fa;
  }

  .right-container {
    padding: 30px 20px;
  }

  .container-common {
    section {
      &:last-child {
        .module-body {
          border-bottom: none;
        }
      }
    }

    .module-title {
      .split-line {
        display: none;
      }
    }

    .module-body {
      border-bottom: 1px solid #e6e8eb;
      margin-bottom: 1rem;
    }
  }
}
</style>
