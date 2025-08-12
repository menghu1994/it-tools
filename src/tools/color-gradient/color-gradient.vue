<script setup lang="ts">
import { ref } from 'vue';
import chroma from 'chroma-js';
import _ from 'lodash';
import { Plus, Trash } from '@vicons/tabler';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
// https://gka.github.io/chroma.js/

const colorElement = ref();
const basicColorArray = ref<string[]>(['#49D1E3', '#9f40f6']);
const bgGradient = ref<string>('');

const debouncedUpdate = _.debounce(() => updateGradientValue(), 200);

const updateColorValue = (v: string, index: number) => {
  basicColorArray.value[index] = v;
};

const updateGradientValue = () => {
  const gradient = chroma.scale(basicColorArray.value).mode('lch').colors(basicColorArray.value.length === 2 ? 5 : 12);
  bgGradient.value = `linear-gradient(90deg, ${gradient.join(', ')})`;
};

updateGradientValue()
</script>

<template>
  <c-card flex flex-col>
    <div flex gap-2>
      <div v-for="(color, colorIndex) in basicColorArray" flex flex-col flex-1 gap-1>
        <n-color-picker :value="color" @update:value="(v) => {updateColorValue(v, colorIndex);debouncedUpdate()}" />
        <div text-center>
          <c-button v-if="basicColorArray.length === 3" :type="'default'" round
                    @click="basicColorArray.splice(colorIndex, 1);updateGradientValue()">
            <n-icon :component="Trash" round depth="3" mr-2 size="18" />
            删除
          </c-button>
          <c-button v-if="basicColorArray.length == 2" :type="'default'" round
                    @click="basicColorArray.splice(colorIndex + 1, 0, '#fff');updateGradientValue()">
            <n-icon :component="Plus" depth="3" mr-2 size="18" />
            添加
          </c-button>
        </div>
      </div>
    </div>
    <n-divider />
    <div class="container" :style="{ backgroundImage: bgGradient }" ref="colorElement"></div>
    <textarea-copyable :value="`background-image: ${bgGradient}`" :follow-height-of="colorElement" copyPlacement="bottom-right"/>
  </c-card>
</template>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100px;
  border-radius: 12px;
}
</style>
