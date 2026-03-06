<script setup lang="ts">
import { ref } from 'vue';
import chroma from 'chroma-js';
import _ from 'lodash';
// https://gka.github.io/chroma.js/

const basicColor = ref<string>('#49D1E3');
const convertColors = ref<any>(new Map());

const debouncedUpdate = _.debounce((v) => updateColorValue(v), 200);

const updateColorValue = (colorValue: string) => {
  const complementary = chroma(colorValue).set('hsl.h', '+180').hex();
  convertColors.value.set('Generic Gradient', chroma.scale([colorValue, complementary]).mode('lch').colors(6));

  const analogous1 = chroma(colorValue).set('hsl.h', '+30').hex();
  const analogous2 = chroma(colorValue).set('hsl.h', '-30').hex();
  convertColors.value.set('Matching Gradient', chroma.scale([analogous1, analogous2]).mode('lch').colors(6));


  const triadic1 = chroma(colorValue).set('hsl.h', '+120').hex();
  const triadic2 = chroma(colorValue).set('hsl.h', '+240').hex();
  convertColors.value.set('Classy Palette', chroma.scale([triadic1, triadic2]).mode('lch').colors(6));
};

updateColorValue(basicColor.value);
</script>

<template>
  <div flex flex-col>
    <div>
      <input-copyable
        v-model:value="basicColor"
        :label="`基础色:`"
        label-position="left"
        label-width="100px"
        label-align="right"
        raw-text
        clearable
        @update:value="debouncedUpdate"
      />
      <n-color-picker
        v-model:value="basicColor"
        @update:value="debouncedUpdate"
      />
    </div>
    <div class="" overflow-auto flex-1>
      <ul v-for="([key, value]) in convertColors" :key="key">
        <li>
          <h2>{{ key }}</h2>
          <ul flex gap-2>
            <li text-center v-for="(color, index) in value" :key="index">
              <div class="color-item" :style="{ 'backgroundColor': color }"></div>
              <span-copyable :value="color" readonly />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.color-item {
  width: 115px;
  height: 115px;
  border-radius: 7px;
  margin: 0 auto;
}
</style>
