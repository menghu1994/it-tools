<template>
  <div class="bead-pattern" flex flex-col gap-2>
    <c-card title="拼豆图生成">
      <div class="inputbtn">
        <c-file-upload title="上传图片" @file-upload="handleUpload" />
      </div>

      <n-form-item label="尺寸预设" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-select v-model:value="preset" :options="presetOptions" @update:value="handlePresetChange" />
      </n-form-item>

      <n-form-item label="宽度(格)" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-input-number v-model:value="gridWidth" :min="8" :max="200" @update:value="onWidthChange" />
      </n-form-item>

      <n-form-item label="高度(格)" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-input-number v-model:value="gridHeight" :min="8" :max="200" @update:value="onHeightChange" />
      </n-form-item>

      <n-form-item label="保持比例" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-switch v-model:value="keepAspectRatio" />
      </n-form-item>

      <n-form-item label="颜色数量" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-slider v-model:value="paletteSize" :min="4" :max="36" />
      </n-form-item>

      <n-form-item label="豆粒大小" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-slider v-model:value="beadSize" :min="8" :max="26" />
      </n-form-item>

      <n-form-item label="显示网格" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-switch v-model:value="showGrid" />
      </n-form-item>

      <div class="actions">
        <c-button class="nya-btn" :disabled="!canRender" @click="renderPattern">生成拼豆图</c-button>
        <c-button class="nya-btn" :disabled="!resultUrl" @click="downloadPng">导出 PNG</c-button>
        <c-button class="nya-btn" :disabled="!resultUrl" @click="printA4">导出打印</c-button>
      </div>
    </c-card>

    <c-card v-if="sourceUrl || resultUrl" title="预览">
      <div class="preview-wrap">
        <div v-if="sourceUrl" class="preview-item">
          <div class="nya-subtitle">原图</div>
          <img :src="sourceUrl" alt="原图" />
        </div>
        <div v-if="resultUrl" class="preview-item">
          <div class="nya-subtitle">拼豆图</div>
          <img :src="resultUrl" alt="拼豆图" />
        </div>
      </div>

      <div v-if="colorStats.length" class="stats">
        <div class="nya-subtitle">颜色统计（共 {{ totalBeads }} 粒）</div>
        <div class="chips">
          <div v-for="item in colorStats" :key="item.hex" class="chip">
            <span class="swatch" :style="{ backgroundColor: item.hex }"></span>
            <span>{{ item.hex }} × {{ item.count }}</span>
          </div>
        </div>
      </div>
    </c-card>

    <canvas ref="hiddenCanvas" class="hidden-canvas"></canvas>

    <c-card title="说明">
      <ul class="nya-list">
        <li>预设提供 A4 竖版（42 x 59）和 A4 横版（59 x 42）拼豆尺寸。</li>
        <li>导出打印会按 A4 页面排版，并携带尺寸与颜色数量信息。</li>
        <li>全部处理均在本地浏览器内完成，不会上传图片内容。</li>
      </ul>
    </c-card>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const hiddenCanvas = ref(null);
const sourceUrl = ref('');
const sourceImage = ref(null);
const resultUrl = ref('');

const preset = ref('a4-portrait');
const gridWidth = ref(42);
const gridHeight = ref(59);
const keepAspectRatio = ref(true);
const paletteSize = ref(18);
const beadSize = ref(14);
const showGrid = ref(true);
const isSyncing = ref(false);

const totalBeads = computed(() => gridWidth.value * gridHeight.value);
const canRender = computed(() => !!sourceImage.value && gridWidth.value > 0 && gridHeight.value > 0);

const colorStats = ref([]);

const presetOptions = [
  { label: 'A4 竖版（42 x 59）', value: 'a4-portrait' },
  { label: 'A4 横版（59 x 42）', value: 'a4-landscape' },
  { label: '方形（48 x 48）', value: 'square' },
  { label: '自定义', value: 'custom' },
];

watch([paletteSize, beadSize, showGrid], () => {
  if (resultUrl.value && canRender.value) {
    renderPattern();
  }
});

function handlePresetChange(value) {
  isSyncing.value = true;
  if (value === 'a4-portrait') {
    gridWidth.value = 42;
    gridHeight.value = 59;
  } else if (value === 'a4-landscape') {
    gridWidth.value = 59;
    gridHeight.value = 42;
  } else if (value === 'square') {
    gridWidth.value = 48;
    gridHeight.value = 48;
  }
  isSyncing.value = false;
}

function onWidthChange(value) {
  if (!value) return;
  if (preset.value !== 'custom')
    preset.value = 'custom';
  if (!keepAspectRatio.value || !sourceImage.value || isSyncing.value)
    return;
  isSyncing.value = true;
  gridHeight.value = Math.max(8, Math.min(200, Math.round(value / (sourceImage.value.width / sourceImage.value.height))));
  isSyncing.value = false;
}

function onHeightChange(value) {
  if (!value) return;
  if (preset.value !== 'custom')
    preset.value = 'custom';
  if (!keepAspectRatio.value || !sourceImage.value || isSyncing.value)
    return;
  isSyncing.value = true;
  gridWidth.value = Math.max(8, Math.min(200, Math.round(value * (sourceImage.value.width / sourceImage.value.height))));
  isSyncing.value = false;
}

function handleUpload(fileInput) {
  const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;
  if (!file || !file.type?.startsWith('image/'))
    return;

  if (sourceUrl.value) {
    URL.revokeObjectURL(sourceUrl.value);
  }
  sourceUrl.value = URL.createObjectURL(file);
  resultUrl.value = '';
  colorStats.value = [];

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    sourceImage.value = img;
    if (keepAspectRatio.value && preset.value === 'custom') {
      gridHeight.value = Math.max(8, Math.min(200, Math.round(gridWidth.value / (img.width / img.height))));
    }
    renderPattern();
  };
  img.src = sourceUrl.value;
}

function renderPattern() {
  if (!sourceImage.value || !hiddenCanvas.value)
    return;

  const cols = Math.max(8, Math.floor(gridWidth.value));
  const rows = Math.max(8, Math.floor(gridHeight.value));

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  const sampleCtx = sampleCanvas.getContext('2d');
  if (!sampleCtx)
    return;

  sampleCtx.fillStyle = '#ffffff';
  sampleCtx.fillRect(0, 0, cols, rows);

  const fit = getContainRect(sourceImage.value.width, sourceImage.value.height, cols, rows);
  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.drawImage(sourceImage.value, fit.x, fit.y, fit.width, fit.height);

  const sampledData = sampleCtx.getImageData(0, 0, cols, rows).data;
  const sampledColors = [];
  for (let i = 0; i < sampledData.length; i += 4) {
    sampledColors.push([sampledData[i], sampledData[i + 1], sampledData[i + 2]]);
  }

  const palette = buildPalette(sampledColors, paletteSize.value);
  const mapped = sampledColors.map(color => nearestColor(color, palette));

  const canvas = hiddenCanvas.value;
  const size = beadSize.value;
  canvas.width = cols * size;
  canvas.height = rows * size;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const statsMap = new Map();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = y * cols + x;
      const color = mapped[index];
      const hex = rgbToHex(color[0], color[1], color[2]);

      statsMap.set(hex, (statsMap.get(hex) || 0) + 1);
      drawBead(ctx, x * size, y * size, size, color, showGrid.value);
    }
  }

  colorStats.value = [...statsMap.entries()]
    .map(([hex, count]) => ({ hex, count }))
    .sort((a, b) => b.count - a.count);

  resultUrl.value = canvas.toDataURL('image/png');
}

function drawBead(ctx, x, y, size, rgb, grid) {
  const [r, g, b] = rgb;
  const radius = size * 0.44;
  const cx = x + size / 2;
  const cy = y + size / 2;

  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 255, 255, 0.22)`;
  ctx.beginPath();
  ctx.arc(x + size * 0.38, y + size * 0.36, size * 0.16, 0, Math.PI * 2);
  ctx.fill();

  if (grid) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
  }
}

function getContainRect(srcW, srcH, dstW, dstH) {
  const ratio = Math.min(dstW / srcW, dstH / srcH);
  const width = srcW * ratio;
  const height = srcH * ratio;
  return {
    width,
    height,
    x: (dstW - width) / 2,
    y: (dstH - height) / 2,
  };
}

function buildPalette(colors, limit) {
  const safeLimit = Math.max(2, Math.min(64, Math.floor(limit)));
  if (!colors.length)
    return [[0, 0, 0]];

  const centers = [];
  const step = Math.max(1, Math.floor(colors.length / safeLimit));
  for (let i = 0; i < safeLimit; i++) {
    centers.push(colors[(i * step) % colors.length].slice());
  }

  for (let round = 0; round < 8; round++) {
    const buckets = Array.from({ length: centers.length }, () => ({ sum: [0, 0, 0], count: 0 }));
    for (const color of colors) {
      let minDist = Infinity;
      let nearest = 0;
      for (let i = 0; i < centers.length; i++) {
        const dist = colorDistance(color, centers[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
      buckets[nearest].sum[0] += color[0];
      buckets[nearest].sum[1] += color[1];
      buckets[nearest].sum[2] += color[2];
      buckets[nearest].count += 1;
    }

    for (let i = 0; i < centers.length; i++) {
      if (!buckets[i].count)
        continue;
      centers[i] = [
        Math.round(buckets[i].sum[0] / buckets[i].count),
        Math.round(buckets[i].sum[1] / buckets[i].count),
        Math.round(buckets[i].sum[2] / buckets[i].count),
      ];
    }
  }

  return dedupeColors(centers);
}

function dedupeColors(colors) {
  const map = new Map();
  for (const color of colors) {
    map.set(rgbToHex(color[0], color[1], color[2]), color);
  }
  return [...map.values()];
}

function nearestColor(target, palette) {
  let nearest = palette[0];
  let minDist = Infinity;
  for (const color of palette) {
    const dist = colorDistance(target, color);
    if (dist < minDist) {
      minDist = dist;
      nearest = color;
    }
  }
  return nearest;
}

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(value) {
  return value.toString(16).padStart(2, '0').toUpperCase();
}

function downloadPng() {
  if (!resultUrl.value)
    return;
  const link = document.createElement('a');
  link.href = resultUrl.value;
  link.download = `bead-pattern-${gridWidth.value}x${gridHeight.value}.png`;
  link.click();
}

function printA4() {
  if (!resultUrl.value)
    return;

  const printWindow = window.open('', '_blank');
  if (!printWindow)
    return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>拼豆图打印</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; }
    .page {
      width: 100%;
      min-height: 277mm;
      display: flex;
      flex-direction: column;
      gap: 6mm;
    }
    .meta {
      font-size: 12px;
      line-height: 1.4;
      color: #222;
    }
    .meta strong { font-size: 14px; }
    .image-wrap {
      flex: 1;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4mm;
    }
    img {
      max-width: 100%;
      max-height: 250mm;
      object-fit: contain;
      image-rendering: pixelated;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="meta">
      <strong>拼豆图打印模板</strong><br/>
      尺寸：${gridWidth.value} x ${gridHeight.value}（共 ${totalBeads.value} 粒）<br/>
      颜色数：${colorStats.value.length}
    </div>
    <div class="image-wrap">
      <img src="${resultUrl.value}" alt="拼豆图" />
    </div>
  </div>
  <${''}>
    window.onload = function () {
      window.print();
    };
  </${''}script$>
</body>
</html>
`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

onBeforeUnmount(() => {
  if (sourceUrl.value) {
    URL.revokeObjectURL(sourceUrl.value);
  }
});
</script>

<style scoped lang="less">
.bead-pattern {
  .inputbtn {
    margin-bottom: 15px;
  }

  .actions {
    margin-top: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .preview-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .preview-item {
    width: calc(50% - 10px);
    min-width: 280px;
  }

  .preview-item img {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background-color: #fff;
  }

  .stats {
    margin-top: 14px;
  }

  .chips {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 12px;
    background-color: #fff;
  }

  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .hidden-canvas {
    display: none;
  }
}
</style>
