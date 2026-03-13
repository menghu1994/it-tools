<template>
  <div class="watermark" flex flex-col gap-2>
    <c-card title="图片加水印">
      <div class="inputbtn">
        <c-file-upload title="请选择要添加水印的图片" @file-upload="handleChange" multiple />
      </div>

      <n-form-item label="水印文字" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <c-input-text v-model:value="options.text" placeholder="Hello" autocomplete="off" autofocus fullwidth />
      </n-form-item>


      <n-form-item label="字体大小" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-slider v-model:value="options.fontSize" :min="10" :max="30" />
      </n-form-item>

      <n-form-item label="透明度" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-slider v-model:value="options.alpha" :min="0" :max="10" />
      </n-form-item>

      <n-form-item label="旋转角度" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-slider v-model:value="options.rotate" :min="0" :max="360" />
      </n-form-item>

      <n-form-item label="文本间距" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-slider v-model:value="options.width" :min="0" :max="100" />
      </n-form-item>

      <n-form-item label="文字颜色" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-color-picker v-model:value="options.color" />
      </n-form-item>

      <!-- 新增时间水印配置 -->
      <n-form-item label="显示拍摄时间水印" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-switch v-model:value="options.showTimeWatermark" />
      </n-form-item>
      <n-form-item label="时间水印位置" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-select v-model:value="options.timePosition" :options="positionOptions" />
      </n-form-item>
      <n-form-item label="开始日期" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-date-picker v-model:value="options.startDate" type="date" />
      </n-form-item>
      <n-form-item label="显示间隔时间" label-width="110" label-placement="left" :show-feedback="false" mb-2>
        <n-switch v-model:value="options.showIntervalTime" />
      </n-form-item>

    </c-card>

    <!-- <c-card title="预览" v-if="previewUrl">
      <div class="preview">
        <img :src="previewUrl" alt="图片预览">
        <div class="watermark" :style="{ background: `url(${svg})` }"></div>
      </div>
      <c-button @click="downloadWatermarked()">下载</c-button>
    </c-card> -->

    <c-card title="预览" v-if="files.length > 0">
      <div class="preview-list">
        <div class="preview-item" v-for="(file, index) in files" :key="index">
          <div class="preview">
            <img :src="previewUrls[index]" alt="图片预览">
            <div class="watermark" :style="{ background: `url(${svg})` }"></div>
          </div>
          <c-button @click="downloadSingleWatermarked(index)" size="small" mt-2>下载该图片</c-button>
        </div>
      </div>
    </c-card>

    <c-card title="说明">
      <ul class="nya-list">
        <li><b>主要用于某些需要实名认证的情况下，避免将您的一些信息泄露出去</b></li>
        <li><b>全部过程均在本地进行，不会在云端存储您的任何信息</b></li>
        <li>如果生成时间过长或生成失败，请使用其他浏览器，推荐使用 Chrome</li>
        <li>支持批量上传图片/文件夹，自动识别图片文件</li>
        <li>可显示图片拍摄时间及与指定日期的间隔时间</li>
      </ul>
    </c-card>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import ExifReader from 'exifreader';

const options = ref({
  fontSize: 13,
  text: '仅供 xxx 验证使用',
  alpha: 5,
  color: '#000000',
  rotate: 23,
  width: 10,
  showTimeWatermark: false, // 是否显示时间水印
  timePosition: 'bottom-right', // 时间水印位置
  startDate: '', // 开始日期
  showIntervalTime: false, // 是否显示间隔时间
});
const files = ref([]);
const previewUrls = ref([]);
const fileExifs = ref([]); // 存储图片的EXIF信息（含拍摄时间）

// 位置选项
const positionOptions = [
  { label: '左上角', value: 'top-left' },
  { label: '右上角', value: 'top-right' },
  { label: '左下角', value: 'bottom-left' },
  { label: '右下角', value: 'bottom-right' },
];

const svg = computed(() => {
  // 重新计算SVG尺寸，保证平铺时位置一致
  const textLength = options.value.text.length;
  const baseWidth = options.value.fontSize * textLength;
  const spacing = (options.value.width / 100) * baseWidth;
  const width = baseWidth + spacing;

  // 转义XML特殊字符，避免SVG解析错误
  const escapedText = escapeXml(options.value.text);

  const svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${width}px">
                <text x="50%" y="50%"
                    alignment-baseline="middle"
                    text-anchor="middle"
                    fill="${options.value.color}"  <!-- 改用fill而非stroke，避免文字空心 -->
                    opacity="${options.value.alpha / 10}"
                    transform="rotate(${options.value.rotate} ${width / 2} ${width / 2})" <!-- 简化旋转中心计算 -->
                    font-weight="100"
                    font-size="${options.value.fontSize}"
                    font-family="Microsoft YaHei, sans-serif"
                >
                    ${escapedText}
                </text>
            </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
});

function escapeXml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 解析图片EXIF信息（获取拍摄时间）
async function getImageExif(file) {
  return new Promise(async (resolve) => {
    // 仅处理图片文件
    if (!file.type || !file.type.startsWith('image/')) {
      resolve({ shootTime: '' });
      return;
    }

    try {
      // 读取文件为 ArrayBuffer（ExifReader 推荐格式）
      const arrayBuffer = await new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target.result);
        reader.readAsArrayBuffer(file);
      });

      // 解析 EXIF 数据
      const tags = ExifReader.load(arrayBuffer);
      
      // 获取拍摄时间（优先取 DateTimeOriginal，备用 CreateDate）
      let shootTime = '';
      if (tags.DateTimeOriginal) {
        shootTime = tags.DateTimeOriginal.value;
      } else if (tags.CreateDate) {
        shootTime = tags.CreateDate.value;
      }

      // 格式化时间：YYYY:MM:DD HH:MM:SS → YYYY-MM-DD HH:MM:SS
      if (shootTime) {
        shootTime = shootTime.replace(/:/g, '-', 2); // 仅替换前两个冒号
      }

      resolve({ shootTime });
    } catch (error) {
      console.warn(`解析 ${file.name} 的EXIF失败:`, error);
      resolve({ shootTime: '' }); // 解析失败返回空字符串
    }
  });
}


// 计算两个日期的间隔（n年n月n天）
function calculateDateInterval (startDate, endDate) {
  if (!startDate || !endDate) return '';

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // 调整负数的情况
  if (days < 0) {
    months--;
    const tempDate = new Date(end.getFullYear(), end.getMonth(), 0);
    days += tempDate.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  let result = '';
  if (years > 0) result += `${years}年`;
  if (months > 0) result += `${months}月`;
  if (days > 0) result += `${days}天`;

  return result || '0天';
}


// 处理文件上传（支持批量/文件夹）
async function handleChange (newFiles) {
  // 处理文件夹上传的文件列表
  const fileList = [];
  const exifList = [];
  const previewList = [];

  // 递归处理文件夹中的文件
  function processFiles (items) {
    return Promise.all(
      Array.from(items).map(async (item) => {
        if (item.isDirectory) {
          const dirReader = item.createReader();
          return new Promise((resolve) => {
            dirReader.readEntries((entries) => {
              processFiles(entries).then(resolve);
            });
          });
        } else {
          // 仅处理图片文件
          if (item.type && item.type.startsWith('image/')) {
            const file = await item.getFile();
            fileList.push(file);
            previewList.push(URL.createObjectURL(file));
            const exif = await getImageExif(file);
            exifList.push(exif);
          }
        }
      })
    );
  }

  // 兼容普通上传和文件夹上传
  if (newFiles.length && newFiles[0].webkitRelativePath) {
    await processFiles(newFiles);
  } else {
    for (const file of newFiles) {
      if (file.type.startsWith('image/')) {
        fileList.push(file);
        previewList.push(URL.createObjectURL(file));
        const exif = await getImageExif(file);
        exifList.push(exif);
      }
    }
  }

  files.value = fileList;
  previewUrls.value = previewList;
  fileExifs.value = exifList;
}

// 绘制水印（修复位置不一致问题）
function drawWatermark (img, canvas, ctx, index) {
  // 绘制原图
  ctx.drawImage(img, 0, 0);

  // 绘制文字水印（平铺）
  const patternImg = new Image();
  patternImg.src = svg.value;
  patternImg.onload = () => {
    const pattern = ctx.createPattern(patternImg, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制时间水印
    if (options.value.showTimeWatermark && fileExifs.value[index]?.shootTime) {
      const shootTime = fileExifs.value[index].shootTime;
      let intervalText = '';

      // 计算间隔时间
      if (options.value.showIntervalTime && options.value.startDate) {
        intervalText = ` (${calculateDateInterval(options.value.startDate, shootTime)})`;
      }

      // 设置时间水印样式
      ctx.fillStyle = options.value.color;
      ctx.font = `${options.value.fontSize + 2}px Microsoft YaHei`;
      ctx.globalAlpha = options.value.alpha / 10;

      // 根据位置绘制
      const padding = 20;
      const text = `${shootTime}${intervalText}`;
      const textWidth = ctx.measureText(text).width;
      const textHeight = options.value.fontSize + 2;

      switch (options.value.timePosition) {
        case 'top-left':
          ctx.fillText(text, padding, padding + textHeight);
          break;
        case 'top-right':
          ctx.fillText(text, canvas.width - padding - textWidth, padding + textHeight);
          break;
        case 'bottom-left':
          ctx.fillText(text, padding, canvas.height - padding);
          break;
        case 'bottom-right':
          ctx.fillText(text, canvas.width - padding - textWidth, canvas.height - padding);
          break;
      }

      // 恢复透明度
      ctx.globalAlpha = 1;
    }
  };
}

// 单文件下载
function downloadSingleWatermarked (index) {
  const file = files.value[index];
  const img = new Image();
  img.src = previewUrls.value[index];
  img.crossOrigin = 'anonymous'; // 解决跨域问题
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // 绘制水印
    drawWatermark(img, canvas, ctx, index);

    // 下载
    const link = document.createElement('a');
    link.download = `watermarked_${file.name}`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
}

// 批量下载
function batchDownloadWatermarked () {
  // 依次处理每个文件
  files.value.forEach((_, index) => {
    setTimeout(() => {
      downloadSingleWatermarked(index);
    }, index * 500); // 间隔500ms避免浏览器阻塞
  });
}

// 清理URL对象
onBeforeUnmount(() => {
  previewUrls.value.forEach(url => {
    try { URL.revokeObjectURL(url) } catch (e) { }
  });
});

</script>

<style scoped lang="less">
.watermark {
  .preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 10px;
  }

  .preview-item {
    width: calc(50% - 10px);
    min-width: 300px;
  }

  .preview {
    position: relative;
    max-width: 800px;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      display: block;
    }

    .watermark {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; // 避免遮挡点击
      background-repeat: repeat !important; // 强制平铺
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
