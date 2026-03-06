<template>
  <div class="watermark" flex flex-col gap-2>
    <c-card title="图片加水印">
      <div class="inputbtn">
        <c-file-upload title="请选择要添加水印的图片" @file-upload="handleChange" />
      </div>

      <n-form-item label="水印文字" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <c-input-text v-model:value="options.text" placeholder="Hello" autocomplete="off" autofocus fullwidth />
      </n-form-item>


      <n-form-item label="字体大小" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-slider v-model:value="options.fontSize" :min="10" :max="30" />
      </n-form-item>

      <n-form-item label="透明度" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-slider v-model:value="options.alpha" :min="0" :max="10" />
      </n-form-item>

      <n-form-item label="旋转角度" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-slider v-model:value="options.rotate" :min="0" :max="360" />
      </n-form-item>

      <n-form-item label="文本间距" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-slider v-model:value="options.width" :min="0" :max="100" />
      </n-form-item>

      <n-form-item label="文字颜色" label-width="110" label-placement="left" :show-feedback="false" mb-2 >
        <n-color-picker v-model:value="options.color" />
      </n-form-item>

    </c-card>

    <c-card title="预览" v-if="previewUrl">
      <div class="preview">
        <img :src="previewUrl" alt="图片预览">
        <div class="watermark" :style="{ background: `url(${svg})` }"></div>
      </div>
      <c-button @click="downloadWatermarked()">下载</c-button>
    </c-card>

    <c-card title="说明">
      <ul class="nya-list">
        <li><b>主要用于某些需要实名认证的情况下，避免将您的一些信息泄露出去</b></li>
        <li><b>全部过程均在本地进行，不会在云端存储您的任何信息</b></li>
        <li>如果生成时间过长或生成失败，请使用其他浏览器，推荐使用 Chrome</li>
      </ul>
    </c-card>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';

const options = ref({
  fontSize: 13,
  text: '仅供 xxx 验证使用',
  alpha: 5,
  color: '#000000',
  rotate: 23,
  width: 10,
});
const file = ref();
const previewUrl = ref();

const svg = computed(() => {
  let width = options.value.fontSize * options.value.text.split('').length;
  width = width + (options.value.width / 100) * width;

  let svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${width}px">
                <text x="50%" y="50%"
                    alignment-baseline="middle"
                    text-anchor="middle"
                    stroke="${options.value.color}"
                    opacity="${options.value.alpha / 10}"
                    transform="translate(${width / 2}, ${width / 2}) rotate(${options.value.rotate
  }) translate(-${width / 2}, -${width / 2})"
                    font-weight="100"
                    font-size="${options.value.fontSize}"
                    font-family="Microsoft YaHei, sans-serif"
                    >
                    ${options.value.text}
                </text>
            </svg>`;
  return (
    'data:image/svg+xml;base64,' +
    btoa(unescape(encodeURIComponent(svgText)))
  );
});

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function handleChange(newFile) {
  file.value = newFile;
  previewUrl.value = URL.createObjectURL(newFile);
}

function downloadWatermarked() {
  const img = new Image();
  img.src = previewUrl.value;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    // 画原图
    ctx.drawImage(img, 0, 0);

    // 设置背景为 SVG 平铺
    canvas.style.backgroundImage = `url(${svg.value})`;

    // 用 <pattern> 的方式覆盖
    const patternImg = new Image();
    patternImg.src = svg.value;
    patternImg.onload = () => {
      ctx.fillStyle = ctx.createPattern(patternImg, "repeat");
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 下载
      const link = document.createElement("a");
      link.download = "watermarked.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    try { URL.revokeObjectURL(previewUrl.value) } catch (e) {}
  }
})

</script>

<style scoped lang="less">
.watermark {
  .preview {
    position: relative;
    max-width: 800px;

    img {
      width: 100%;
      height: 100%;
    }

    .watermark {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .results {
    max-width: 100%;
  }

  .inputbtn {
    margin-bottom: 15px;
  }
}
</style>
