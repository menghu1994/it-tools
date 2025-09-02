<template>
  <div flex flex-col gap-2>
    <c-card>
      <c-input-text v-model:value="text" label="弹幕内容" placeholder="弹幕内容" label-position="left" label-width="110px" mb-2 label-align="right" />
      <n-form-item label="播放速度" label-placement="left" label-width="110" :show-feedback="false" mb-2>
        <n-input-number v-model:value="speed" max="300" min="10" :step="20" placeholder="弹幕滚动速度" w-full />
      </n-form-item>
      <n-form-item label="文字大小" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-slider v-model:value="fontSize" :min="12" :max="120" />
      </n-form-item>
      <n-form-item label="文字颜色" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-color-picker v-model:value="color" />
      </n-form-item>
      <n-form-item label="背景颜色" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-color-picker v-model:value="bgColor" />
      </n-form-item>
      <div flex flex-row-reverse>
        <n-button @click="isPlaying = true" secondary type="primary">播放</n-button>
      </div>
    </c-card>
    <div :style="{ background: bgColor }">
      <n-marquee :speed="speed"><span :style="{ fontSize: fontSize + 'px', color: color }">{{ text }}</span></n-marquee>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="isPlaying" class="marquee-cover" :style="{ background: bgColor }">
      <n-marquee :speed="speed"><span :style="{ fontSize: fontSize + 'px', color: color }">{{ text }}</span></n-marquee>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { NMarquee, useMessage } from 'naive-ui'
import { ref,onMounted,onBeforeUnmount  } from 'vue'

const message = useMessage()

const text = ref<string>('我是弹幕 我是弹幕')
const fontSize = ref<number>(20)
const speed = ref<number>(100)
const color = ref<string>('#d2d2d2')
const bgColor = ref<string>('#000')
const isPlaying = ref<boolean>(false)
const lastTap = ref(0)

const resetPlaying = () => isPlaying.value = false

const handleTap = () => {
  const now = Date.now()
  if (now - lastTap.value < 300) {
    resetPlaying()
  } else {
    message.info('双击可退出弹幕',{
      showIcon: false
    })
  }
  lastTap.value = now
}

onMounted(() => {
  window.addEventListener('click', handleTap)
})

onBeforeUnmount(() =>  window.removeEventListener('click', handleTap))
</script>

<style scoped lang="less">
.marquee-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  .n-marquee {
    width: 100vw;
    height: 100dvh;
  }
}
</style>
