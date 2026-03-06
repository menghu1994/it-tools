<template>
  <div class="resume-standard">
    <!-- 个人信息头部 -->
    <PersonalModule :value="personData" @click="$emit('editModule', 'personal')"></PersonalModule>
    <template v-for="m in props.data" :key="m.key">
      <component :is="compMap[m.key]" :value="m.value" @click="$emit('editModule', m.key)"></component>
    </template>
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
  return props.data.find(m => m.key === 'personal')?.value
})

</script>

<style lang="less" scoped>
.resume-standard {
  padding: 18px;
}
</style>
