<script setup lang="ts">
import { generatePort } from './random-port-generator.model';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';

const min = ref<number>(1024)
const max = ref<number>(65535)
const [port, refreshPort] = computedRefreshable(() => String(generatePort(min.value, max.value)));

const { copy } = useCopy({ source: port, text: 'Port copied to the clipboard' });

</script>

<template>
  <c-card>
    <div mt-4 flex gap-10px>
      <div>
        <div>Min:</div>
        <n-input-number v-model:value="min" placeholder="min" :min="0" />
      </div>
      <div>
        <div>Max:</div>
        <n-input-number v-model:value="max" placeholder="max" :min="min" />
      </div>
    </div>
    <div class="port">
      {{ port }}
    </div>
    <div flex justify-center gap-3>
      <c-button @click="copy()">
        Copy
      </c-button>
      <c-button @click="refreshPort">
        Refresh
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.port {
  text-align: center;
  font-size: 26px;
  font-weight: 400;
  margin: 10px 0 25px;
}
</style>
