<template>
  <div class="coin-scene" @click="flipCoin">
    <div class="coin-wrapper">
      <div class="coin" ref="coin">
        <div class="front">正</div>
        <div class="back">反</div>
      </div>
      <div class="shadow" ref="shadow"></div>
    </div>
    <p v-if="result">结果: {{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import gsap from "gsap";

const coin = ref<HTMLElement | null>(null);
const shadow = ref<HTMLElement | null>(null);
const result = ref("");

const flipCoin = () => {
  if (!coin.value || !shadow.value) return;

  const isHeads = Math.random() > 0.5;
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
    ease: "bounce.out"
  }, 0.6);
};
</script>

<style scoped>
.coin-scene {
  perspective: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  cursor: pointer;
}

.coin-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.coin {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  z-index: 2;
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
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
