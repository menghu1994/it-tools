<template>
  <div class="app-root" flex gap-2 p-2>
    <ResumeEditor class="left" />
    <ModuleConfigPanel class="right" style="width:360px;" />
  </div>
</template>

<script setup lang="ts">
import ResumeEditor from './components/ResumeEditor.vue';
import ModuleConfigPanel from './components/ModuleConfigPanel.vue';
</script>
