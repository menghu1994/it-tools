<template>
  <div class="" flex flex-col gap-2>
    <c-card title="屏幕录制">
      <n-form-item label="选择长宽比" label-placement="left" label-width="110" :show-feedback="false" mb-2>
        <c-select v-model="aspectRatio" fullwidth :options="aspectRatioList" />
      </n-form-item>
      <n-form-item label="选择帧率" label-placement="left" label-width="110" :show-feedback="false" mb-2>
        <c-select v-model="frameRate" fullwidth :options="frameRateList" />
      </n-form-item>
      <n-form-item label="选择分辨率" label-placement="left" label-width="110" :show-feedback="false" mb-2>
        <c-select v-model="resolutions" fullwidth :options="resolutionsList" />
      </n-form-item>
      <n-form-item label="是否显示光标" label-placement="left" label-width="110" :show-feedback="false" mb-2>
        <c-select v-model="cursor" fullwidth :options="cursorList" />
      </n-form-item>
      <c-button class="nya-btn" @click="recorde">
        {{ mediaStream ? '停 止' : '开 始' }}
      </c-button>
    </c-card>

    <c-card v-show="mediaStream" title="实时预览">
      <video ref="video" style="width:100%" autoplay download></video>
    </c-card>

    <c-card v-show="previewUrl && !mediaStream" title="预览">
      <video ref="preview" :src="previewUrl" style="width:100%" loop controls autoplay></video>
    </c-card>

    <c-card title="说明">
      <ul class="nya-list">
        <li>选项设置不生效？Chrome 了解一下！</li>
        <li>
          无法使用？
          <a
            href="https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getDisplayMedia"
            target="_blank"
            rel="noopener noreferrer"
          >点击</a>查询兼容性
        </li>
        <li>是的，不支持录制系统/麦克风音频。</li>
        <li>使用开源版本部署时请启用 SSL</li>
      </ul>
    </c-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// prop
const aspectRatio = ref("default");
const aspectRatioList = [
  { label: '默认', value: 'default' },
  { label: '16:9', value: '1.77' },
  { label: '4:3', value: '1.33' },
  { label: '21:9', value: '2.35' },
  { label: '14:10', value: '1.4' },
  { label: '19:10', value: '1.9' },
]

const frameRate = ref("default");
const frameRateList = [
  { label: '默认', value: 'default' },
  { label: '60', value: '60' },
  { label: '30', value: '30' },
  { label: '25', value: '25' },
  { label: '15', value: '15' },
  { label: '5', value: '5' },
]

const resolutions = ref("default");
const resolutionsList = [
  { label: '默认', value: 'default' },
  { label: '屏幕尺寸', value: 'fit-screen' },
  { label: '4k', value: '4K' },
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
]

const cursor = ref("default");
const cursorList = [
  { label: '默认', value: 'default' },
  { label: '是', value: 'always' },
  { label: '否', value: 'never' },
]

// data
const mediaRecorder = ref(null);
const mediaStream = ref(null);
const recordeBlods = ref([]);
const previewUrl = ref("");

const video = ref(null);
const preview = ref(null);

watch(mediaStream, (stream) => {
  if (video.value) {
    video.value.srcObject = stream;
  }
});

function recorde() {
  if (mediaStream.value) {
    stop();
  } else {
    start();
  }
}

async function start() {
  mediaRecorder.value = null;
  mediaStream.value = null;
  recordeBlods.value = [];
  try {
    const displayMediaOptions = getDisplayMediaOptions();

    mediaStream.value = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    mediaStream.value.oninactive = () => stop();

    mediaRecorder.value = new MediaRecorder(mediaStream.value);
    mediaRecorder.value.ondataavailable = handleDataAvailable;
    mediaRecorder.value.start();
  } catch (e) {
    alert(`${e.name}: ${e.message}`); // Vue3里没有 this.$modal，改成 alert 或者全局modal
  }
}

function stop() {
  if (mediaStream.value) {
    let tracks = mediaStream.value.getTracks();
    tracks.forEach((track) => track.stop());
    mediaStream.value = null;
    mediaRecorder.value && mediaRecorder.value.stop();
  }
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordeBlods.value.push(event.data);
    createPreviewVideo();
  }
}

function createPreviewVideo() {
  const blob = new Blob(recordeBlods.value, { type: "video/webm" });
  recordeBlods.value = [];
  previewUrl.value = URL.createObjectURL(blob);
}

function getDisplayMediaOptions() {
  let videoConstraints = {};

  if (aspectRatio.value !== "default") {
    videoConstraints.aspectRatio = aspectRatio.value;
  }

  if (frameRate.value !== "default") {
    videoConstraints.frameRate = frameRate.value;
  }

  if (cursor.value !== "default") {
    videoConstraints.cursor = cursor.value;
  }

  if (resolutions.value !== "default") {
    if (resolutions.value === "fit-screen") {
      videoConstraints.width = screen.width;
      videoConstraints.height = screen.height;
    }
    if (resolutions.value === "4K") {
      videoConstraints.width = 3840;
      videoConstraints.height = 2160;
    }
    if (resolutions.value === "1080p") {
      videoConstraints.width = 1920;
      videoConstraints.height = 1080;
    }
    if (resolutions.value === "720p") {
      videoConstraints.width = 1280;
      videoConstraints.height = 720;
    }
  }

  return {
    video: videoConstraints,
    audio: false,
  };
}
</script>

<style lang="less">
</style>
