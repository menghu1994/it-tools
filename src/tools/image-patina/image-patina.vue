<template>
  <div class="image_patina">
    <c-card title="图片加包浆">
      <div class="inputbtn">
        <c-file-upload title="请选择要处理的图片" @file-upload="handleChange" />
      </div>

      <n-form-item label="图片质量" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-slider v-model:value="quality" :min="0" :max="100" />
      </n-form-item>

      <n-form-item label="包浆次数" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-input-number v-model:value="iterations" min="0"  @update:value="update" />
      </n-form-item>

    </c-card>

    <c-card v-if="preview" title="预览">
      <div class="preview">
        <div>
          <div class="nya-subtitle">处理前</div>
          <img :src="preview" alt="image" />
        </div>
        <div>
          <div class="nya-subtitle">处理后</div>
          <img :src="resultsImg" alt="image" />
        </div>
      </div>
      <c-button class="nya-btn" @click="download">
        {{ loading ? `${(progress / iterations * 100).toFixed(0)} %` : '保存' }}
      </c-button>
    </c-card>

    <c-card title="说明">
      <ul class="nya-list">
        <li>
          为什么要写这个功能可以参考：
          <a
            href="https://www.zhihu.com/question/29345490"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.zhihu.com/question/29345490
          </a>
        </li>
        <li>
          新做的表情包没人用？表情包没有年代感？这时即可使用本工具把图片做旧，让表情包看起来传播次数更多，更有收藏价值
        </li>
        <li>
          如果处理时间过长或处理失败，请使用其他浏览器，推荐使用 Chrome
        </li>
      </ul>
    </c-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const n = ref(null);
const file = ref(null);
const progress = ref(0);
const iterations = ref(16);
const quality = ref(75);
const image = ref(null);
const preview = ref("");
const resultsImg = ref("");
const loading = ref(false);

function handleChange(newFile) {
  file.value = newFile;
  const reader = new FileReader();
  reader.readAsDataURL(newFile);
  reader.addEventListener("load", () => {
    preview.value = reader.result;
    resetProcess();
  });
}

function download() {
  if (image.value?.src) {
    const dotIndex = n.value?.lastIndexOf(".") ?? -1;
    const dname =
      (dotIndex === -1 ? n.value : n.value.substring(0, dotIndex)) +
      (quality.value <= 100 ? "_JPEGreen.jpg" : "_JPEGreen.png");
    // createDownload(image.value.src, dname);
  }
}

function cover() {
  image.value = new Image();
  image.value.addEventListener("load", () => {
    requestAnimationFrame(processImage);
  });
}

function update() {
  if (progress.value <= iterations.value) {
    requestAnimationFrame(processImage);
  } else {
    resetProcess();
  }
}

function resetProcess() {
  progress.value = 0;
  if (preview.value) {
    image.value.src = preview.value;
  }
}

function processImage() {
  loading.value = true;
  const clamp = (x) => (x >= 0 ? (x <= 255 ? x : 255) : 0);
  const clampuv = (x) => (x >= -128 ? (x <= 127 ? x : 127) : -128);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (progress.value === iterations.value) {
    loading.value = false;
    return;
  }
  progress.value++;
  canvas.width = image.value.width;
  canvas.height = image.value.height;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, image.value.width, image.value.height);
  ctx.drawImage(image.value, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.value.width, image.value.height);
  const data = imageData.data;

  for (let p = 0; p < data.length / 4; ++p) {
    const r = data[p * 4];
    const g = data[p * 4 + 1];
    const b = data[p * 4 + 2];
    const y = clamp((77 * r + 150 * g + 29 * b) >> 8);
    const u = clampuv(((-43 * r - 85 * g + 128 * b) >> 8) - 1);
    const v = clampuv(((128 * r - 107 * g - 21 * b) >> 8) - 1);
    const r1 = clamp((65536 * y + 91881 * v) >> 16);
    const g1 = clamp((65536 * y - 22553 * u - 46802 * v) >> 16);
    const b1 = clamp((65536 * y + 116130 * u) >> 16);
    data[p * 4] = r1;
    data[p * 4 + 1] = g1;
    data[p * 4 + 2] = b1;
  }

  ctx.putImageData(imageData, 0, 0);
  const dataURL =
    quality.value <= 100
      ? canvas.toDataURL("image/jpeg", quality.value * 0.01)
      : canvas.toDataURL("image/png");
  resultsImg.value = dataURL;
  image.value.src = dataURL;
}

// watch 监听 quality 改变，重置处理
watch(quality, () => {
  resetProcess();
});

// mounted 生命周期
onMounted(() => {
  cover();
});
</script>

<style lang="less">
.image_patina {
  .nya-subtitle {
    margin-top: 15px;
  }
  .vue-slider {
    margin-bottom: 15px;
  }
  .preview {
    width: 100%;
    font-size: 0;
    display: flex;
    justify-content: space-between;
    .nya-subtitle {
      padding: 0;
    }
    div {
      width: 50%;
      padding: 0 20px;
      box-sizing: border-box;
      display: inline-block;
    }
    @media (max-width: 600px) {
      div {
        width: 100%;
        display: block;
      }
      display: block;
    }
    img {
      width: 100%;
    }
  }
}
</style>
