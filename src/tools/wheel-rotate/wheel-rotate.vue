<template>
  <div class="wheel-container">
    <canvas ref="canvas" width="400" height="400"></canvas>
    <div class="arrow">▼</div>
    <div class="center"></div>
<!--    <button @click="spin">开始抽奖</button>-->
  </div>
</template>

<script setup lang="ts">
import { useWheel } from "./useWheel";

const sectors = [
  { label: "奖品A", color: "#f44336", ratio: 1 },
  { label: "奖品B", color: "#4caf50", ratio: 2 },
  { label: "谢谢参与", color: "#ff9800", ratio: 1 },
  { label: "奖品C", color: "#2196f3", ratio: 3 },
  { label: "奖品D", color: "#ad21f3", ratio: 2 },
];

const { canvas } = useWheel(sectors);
</script>

<style scoped>
.wheel-container {
  position: relative;
  width: 400px;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  cursor: grab;
  border: 5px solid rgba(0, 0, 0, 0.87);
}
.arrow {
  position: absolute;
  top: -30px;
  font-size: 32px;
  color: red;
}
.center {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  width: 24px;
  height: 24px;
  background-color: #444444;
  border-radius: 50%;
  box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.3);
}
button {
  margin-top: 20px;
  padding: 8px 16px;
}
</style>
