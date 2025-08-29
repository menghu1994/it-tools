<template>
  <div class="coin-scene" >
    <div class="coin-wrapper">
      <div class="coin" ref="coin">
        <div class="front">正</div>
        <div class="back">反</div>
      </div>
      <div class="shadow" ref="shadow"></div>
    </div>
    <div flex flex-col gap-1 justify-center items-center>
      <button role="button" @click="flipCoin" :disabled="!hasEnd">开始</button>
      <p >结果: <span ref="resultRef">{{ result }}</span></p>
      <div flex items-center gap-2>
        <p>累计</p>
        <p>正面: {{ frontCount }}</p>
        <p>反面: {{ backCount }}</p>
        <button @click="frontCount = 0;backCount = 0">重置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import gsap from "gsap";

const coin = ref<HTMLElement | null>(null);
const shadow = ref<HTMLElement | null>(null);
const resultRef = ref<HTMLElement | null>(null);
const result = ref("");
const frontCount = ref(0);
const backCount = ref(0);
const hasEnd = ref(true);

const flipCoin = () => {
  if (!coin.value || !shadow.value || !hasEnd.value) return;
  hasEnd.value = false;

  const isHeads = Math.random() > 0.5;
  gsap.to(resultRef.value, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out"
  })
  result.value = isHeads ? "正面" : "反面";

  const spins = Math.floor(Math.random() * 3) + 3; // 随机3~5圈
  const finalRotation = isHeads ? 0 : 180;

  const tl = gsap.timeline();

  // 初始状态
  gsap.set(coin.value, { y: 0, rotateY: 0, rotateX: 0, rotateZ: 0 });
  gsap.set(shadow.value, { scale: 1, opacity: 0.4 });

  // 抛起
  tl.to(coin.value, {
    y: -200, // 向上抛
    duration: 0.6,
    ease: "power2.out"
  }, 0);

  // 落下
  tl.to(coin.value, {
    y: 0,
    duration: 0.8,
    ease: "bounce.out"
  }, 0.6);

  // 旋转
  tl.to(coin.value, {
    rotateX: 360 * spins + finalRotation,
    rotateY: Math.random() * 30 - 15, // 小幅抖动
    rotateZ: Math.random() * 30 - 15,
    duration: 1.4,
    ease: "power2.out"
  }, 0);

  // 阴影缩放/透明度
  tl.to(shadow.value, {
    scale: 0.6,
    opacity: 0.1,
    duration: 0.6,
    ease: "power2.out"
  }, 0);
  tl.to(shadow.value, {
    scale: 1,
    opacity: 0.4,
    duration: 0.8,
    ease: "bounce.out",
  }, 0.6);

  tl.eventCallback('onComplete', () => {
    if(isHeads) {
      frontCount.value ++
    } else {
      backCount.value ++
    }
    hasEnd.value = true;
    gsap.to(resultRef.value, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    });
  })
};
</script>

<style scoped>
.coin-scene {
  perspective: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}

.coin-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
}

.coin {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  z-index: 2;
  border-radius: 50%;
  overflow: hidden;
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: white;
}

.front {
  background: gold;
}

.back {
  background: silver;
  transform: rotateX(180deg);
}

/* 阴影 */
.shadow {
  position: absolute;
  bottom: 0;
  left: calc(50% + 20px);
  width: 100px;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  transform: translateX(-50%);
  filter: blur(2px);
}
</style>
