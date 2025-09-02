<template>
  <div flex flex-col justify-center items-center gap-4>
    <span class="text-2xl">{{ food }}</span>
    <n-button @click="play()" strong secondary :type="isPlaying ? 'error' : 'primary'">
      {{ isPlaying ? '结束' : '开始' }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const foods = [
  '鱼香肉丝',
  '宫保鸡丁',
  '红烧肉',
  '麻婆豆腐',
  '水煮鱼',
  '酸辣土豆丝',
  '清蒸鲈鱼',
  '鱼香茄子',
  '红烧茄子',
  '鱼香肉丝',
  '宫保鸡丁'
];
const food = ref<string>('');
const isPlaying = ref<boolean>(true);
let timer: any;

onMounted(() => {
  autoPlay()
})

onBeforeUnmount(() => {
  if(timer) {
    clearInterval(timer);
  }
})

const play = () => {
  if(!isPlaying.value) {
    autoPlay()
  } else {
    if(timer) {
      clearInterval(timer);
    }
  }
  isPlaying.value = !isPlaying.value
}

const autoPlay = () => {
  timer = setInterval(() => {
    const index = Math.floor(Math.random() * foods.length);
    food.value = foods[index];
  }, 50);
}

</script>

<style scoped lang="less">

</style>
