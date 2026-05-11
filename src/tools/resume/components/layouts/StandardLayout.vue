<script setup lang="ts">
import PersonalModule from '../../module/personalModule.vue';
import campusModule from '../../module/campusModule.vue';
import educationModule from '../../module/educationModule.vue';
import honorModule from '../../module/honorModule.vue';
import objectiveModule from '../../module/objectiveModule.vue';
import projectModule from '../../module/projectModule.vue';
import skillModule from '../../module/skillModule.vue';
import workModule from '../../module/workModule.vue';

const props = defineProps({
  data: { type: Array, default: () => [] },
});

defineEmits<{
  editModule: [moduleKey: string]
}>();

const compMap: Record<string, any> = {
  work: workModule,
  skills: skillModule,
  project: projectModule,
  honor: honorModule,
  campus: campusModule,
  education: educationModule,
  objective: objectiveModule,
};

const personData = computed(() => props.data.find((item: any) => item.key === 'personal')?.value);
const modules = computed(() => props.data.filter((item: any) => !!compMap[item.key]));
</script>

<template>
  <div class="resume-standard">
    <PersonalModule :value="personData" @click="$emit('editModule', 'personal')" />
    <template v-for="moduleItem in modules" :key="moduleItem.key">
      <component :is="compMap[moduleItem.key]" :value="moduleItem.value" @click="$emit('editModule', moduleItem.key)" />
    </template>
  </div>
</template>

<style lang="less" scoped>
.resume-standard {
  padding: 18px;
}
</style>
