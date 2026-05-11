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

const leftCompMap: Record<string, any> = {
  skills: skillModule,
  honor: honorModule,
  education: educationModule,
  objective: objectiveModule,
};

const rightCompMap: Record<string, any> = {
  work: workModule,
  project: projectModule,
  campus: campusModule,
};

const personData = computed(() => props.data.find((item: any) => item.key === 'personal')?.value);
const leftModules = computed(() => props.data.filter((item: any) => !!leftCompMap[item.key]));
const rightModules = computed(() => props.data.filter((item: any) => !!rightCompMap[item.key]));
</script>

<template>
  <div class="resume-simple">
    <div class="left-container container-common">
      <PersonalModule :value="personData" @click="$emit('editModule', 'personal')" />
      <template v-for="moduleItem in leftModules" :key="moduleItem.key">
        <component :is="leftCompMap[moduleItem.key]" :value="moduleItem.value" @click="$emit('editModule', moduleItem.key)" />
      </template>
    </div>
    <div class="right-container container-common">
      <template v-for="moduleItem in rightModules" :key="moduleItem.key">
        <component :is="rightCompMap[moduleItem.key]" :value="moduleItem.value" @click="$emit('editModule', moduleItem.key)" />
      </template>
    </div>
  </div>
</template>

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
