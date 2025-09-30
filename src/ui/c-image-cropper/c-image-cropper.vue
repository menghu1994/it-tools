<template>
  <div class="cropper-root">
    <!-- <div class="toolbar">
      <label class="btn">
        选择图片
        <input type="file" accept="image/*" @change="onFileChange" />
      </label>
      <input v-model.number="outputWidth" type="number" min="1" /> x
      <input v-model.number="outputHeight" type="number" min="1" />
      <button class="btn" @click="rotate(90)">旋转 90°</button>
      <button class="btn" @click="zoom(1.1)">放大</button>
      <button class="btn" @click="zoom(0.9)">缩小</button>
      <label><input type="checkbox" v-model="lockAspect" /> 固定长宽比</label>
      <button class="btn primary" @click="exportCrop">导出裁剪图</button>
    </div> -->
    <input type="file" accept="image/*" @change="onFileChange" hidden ref="fileInputRef"/>

    <div class="editor-wrap" ref="wrapRef">
      <canvas ref="canvasRef" class="canvas" @pointerdown="onPointerDown" @wheel.prevent="onWheel" @dblclick="fileInputRef?.click()"></canvas>

      <!-- 裁剪框 (在画布上渲染，但额外渲染一个可交互的层，用来拖拽控制点) -->
      <div
        class="crop-layer"
        :style="cropLayerStyle"
        @dblclick.stop="fileInputRef?.click()"
        @pointerdown.stop.prevent="onCropPointerDown($event, 'move')"
      >
        <!-- handles -->
        <div v-for="h in handles" :key="h" :class="['handle', h]" @pointerdown.stop.prevent="onCropPointerDown($event, h)"></div>
      </div>
    </div>

    <div class="preview-area">
      <h4>实时预览</h4>
      <canvas ref="previewRef" :width="previewSize" :height="previewSize" class="preview-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

/**
 * Simple image cropper composable inside component.
 * Key concepts:
 *  - image: actual Image object
 *  - transform: scale/translate/rotate to show image in canvas
 *  - cropRect: rectangle in canvas coordinates (x,y,width,height) representing crop area
 *
 * Pointer model:
 *  - single pointer drag for moving image or moving/resizing crop box depending on target
 */

type Point = { x: number; y: number };

const props = withDefaults(
  defineProps<{ 
    // 固定长宽比
    lockAspect: boolean,
    ratio: number,
    outputWidth: number,
    outputHeight: number
  }>(), 
  {
    lockAspect: false,
    ratio: 1,
    outputWidth: 800,
    outputHeight: 800
  }
)

const fileInputRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapRef = ref<HTMLElement | null>(null);
const previewRef = ref<HTMLCanvasElement | null>(null);

// component state
const state = reactive({
  img: null as HTMLImageElement | null,
  imgNaturalW: 0,
  imgNaturalH: 0,
  // transform applied to image when drawing to canvas
  translate: { x: 0, y: 0 },
  scale: 1,
  rotateDeg: 0, // 0, 90, 180, 270 ...
  // crop rectangle in canvas pixel coordinates
  cropRect: { x: 50, y: 50, w: 200, h: 200 },
  dragging: false,
  dragMode: '' as '' | 'img' | 'crop-move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e',
  activePointerId: -1,
  pointerStart: { x: 0, y: 0 } as Point,
  translateStart: { x: 0, y: 0 },
  cropStart: { x: 0, y: 0, w: 0, h: 0 },
});

const outputWidth = ref(800);
const outputHeight = ref(800);
const previewSize = ref(200);
const lockAspect = ref(false);

// handles list for template
const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

// convenience computed style for overlay crop layer (positioned absolute over canvas)
const cropLayerStyle = computed(() => {
  // ensure wrapRef and canvasRef sizes used
  const c = canvasRef.value;
  if (!c) return {};
  const rect = c.getBoundingClientRect();
  const scale = c.width / rect.width; // canvas CSS -> pixel scale
  // convert canvas pixel coords to css coords
  const x = state.cropRect.x / scale;
  const y = state.cropRect.y / scale;
  const w = state.cropRect.w / scale;
  const h = state.cropRect.h / scale;
  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    height: `${h}px`,
  };
});

// load image from file input
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  loadImage(url);
}

// allow programmatic load
async function loadImage(src: string) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
    img.src = src;
  });
  state.img = img;
  state.imgNaturalW = img.naturalWidth;
  state.imgNaturalH = img.naturalHeight;
  // reset transform to center fit
  resetView();
  requestAnimationFrame(draw);
}

// center and fit image into canvas
function resetView() {
  const c = canvasRef.value;
  if (!c || !state.img) return;
  const cw = c.width;
  const ch = c.height;
  // fit image into canvas with initial scale
  const scale = Math.min(cw / state.imgNaturalW, ch / state.imgNaturalH);
  state.scale = scale;
  state.rotateDeg = 0;
  // center translate
  state.translate.x = (cw - state.imgNaturalW * scale) / 2;
  state.translate.y = (ch - state.imgNaturalH * scale) / 2;
  // default crop box centered and smaller than canvas
  state.cropRect.w = Math.min( Math.floor(cw * 0.6), Math.floor(state.imgNaturalW * scale * 0.8) );
  state.cropRect.h = Math.min( Math.floor(ch * 0.6), Math.floor(state.imgNaturalH * scale * 0.8) );
  state.cropRect.x = Math.floor((cw - state.cropRect.w) / 2);
  state.cropRect.y = Math.floor((ch - state.cropRect.h) / 2);
}

// draw main canvas: image + overlay dim + crop rect border
function draw() {
  const c = canvasRef.value;
  if (!c) return;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, c.width, c.height);

  if (state.img) {
    ctx.save();
    // apply translate + rotation + scale correctly around canvas origin
    // We draw image with current translate and scale; rotation is handled by rotating the context around canvas center
    // For simplicity, we only support rotation multiples of 90°.
    const cx = c.width / 2;
    const cy = c.height / 2;

    // apply rotation around center
    ctx.translate(cx, cy);
    ctx.rotate((state.rotateDeg * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    // draw image
    ctx.drawImage(
      state.img,
      state.translate.x,
      state.translate.y,
      state.imgNaturalW * state.scale,
      state.imgNaturalH * state.scale
    );

    ctx.restore();
    // darken outside crop rect
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    // left
    ctx.fillRect(0, 0, state.cropRect.x, c.height);
    // right
    ctx.fillRect(state.cropRect.x + state.cropRect.w, 0, c.width - (state.cropRect.x + state.cropRect.w), c.height);
    // top
    ctx.fillRect(state.cropRect.x, 0, state.cropRect.w, state.cropRect.y);
    // bottom
    ctx.fillRect(state.cropRect.x, state.cropRect.y + state.cropRect.h, state.cropRect.w, c.height - (state.cropRect.y + state.cropRect.h));
    ctx.restore();

    // border
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(state.cropRect.x + 1, state.cropRect.y + 1, state.cropRect.w - 2, state.cropRect.h - 2);
    ctx.restore();

    // small handles (drawn on canvas for nicer look, but drag events handled via overlay)
    const hs = 8;
    ctx.save();
    ctx.fillStyle = '#fff';
    const corners = [
      [state.cropRect.x, state.cropRect.y],
      [state.cropRect.x + state.cropRect.w, state.cropRect.y],
      [state.cropRect.x + state.cropRect.w, state.cropRect.y + state.cropRect.h],
      [state.cropRect.x, state.cropRect.y + state.cropRect.h],
    ];
    for (const [x, y] of corners) {
      ctx.fillRect(x - hs / 2, y - hs / 2, hs, hs);
    }
    ctx.restore();
  } else {
    // placeholder
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#999';
    ctx.font = '30px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText('双击选择/替换图片', 320, 240);
  }

  updatePreview();
}

// update preview canvas with current crop
function updatePreview() {
  const p = previewRef.value;
  const c = canvasRef.value;
  if (!p || !c) return;
  const ctx = p.getContext('2d')!;
  ctx.clearRect(0, 0, p.width, p.height);
  if (!state.img) return;

  // create temp canvas and draw the visible rotated image, then copy crop rect
  const temp = document.createElement('canvas');
  temp.width = c.width;
  temp.height = c.height;
  const tctx = temp.getContext('2d')!;
  // replicate initial drawing (without overlay)
  tctx.save();
  const cx = temp.width / 2;
  const cy = temp.height / 2;
  tctx.translate(cx, cy);
  tctx.rotate((state.rotateDeg * Math.PI) / 180);
  tctx.translate(-cx, -cy);
  tctx.drawImage(state.img!, state.translate.x, state.translate.y, state.imgNaturalW * state.scale, state.imgNaturalH * state.scale);
  tctx.restore();

  // draw cropped region into preview canvas
  const sx = state.cropRect.x;
  const sy = state.cropRect.y;
  const sw = state.cropRect.w;
  const sh = state.cropRect.h;
  // scale to fit preview canvas
  ctx.drawImage(temp, sx, sy, sw, sh, 0, 0, p.width, p.height);
}

// export cropped image - returns blob or triggers download
async function exportCrop() {
  if (!state.img) return;
  const blob = await getCroppedBlob(outputWidth.value, outputHeight.value, 'image/png', 0.92);
  // download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crop_${Date.now()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

// produce Blob with specified output size and mime
async function getCroppedBlob(outW: number, outH: number, mime = 'image/png', quality = 0.92): Promise<Blob> {
  const c = canvasRef.value!;
  // temp canvas holding drawn rotated+transformed image identical to main canvas
  const temp = document.createElement('canvas');
  temp.width = c.width;
  temp.height = c.height;
  const tctx = temp.getContext('2d')!;
  tctx.save();
  const cx = temp.width / 2;
  const cy = temp.height / 2;
  tctx.translate(cx, cy);
  tctx.rotate((state.rotateDeg * Math.PI) / 180);
  tctx.translate(-cx, -cy);
  tctx.drawImage(state.img!, state.translate.x, state.translate.y, state.imgNaturalW * state.scale, state.imgNaturalH * state.scale);
  tctx.restore();

  // now crop from temp canvas using cropRect in canvas coordinates and draw into out canvas
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const octx = out.getContext('2d')!;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(temp, state.cropRect.x, state.cropRect.y, state.cropRect.w, state.cropRect.h, 0, 0, outW, outH);

  return await new Promise<Blob>((resolve) => out.toBlob((b) => resolve(b!), mime, quality));
}

// rotate image by degrees (multiples of 90)
function rotate(delta: number) {
  state.rotateDeg = (state.rotateDeg + delta + 360) % 360;
  // after rotation, we may want to re-center; simple approach: keep translate as-is and redraw
  draw();
}

// zoom centered on canvas center (factor >1 zoom in)
function zoom(factor: number) {
  const c = canvasRef.value!;
  // zoom around canvas center => adjust translate so image zooms toward center
  const cx = c.width / 2;
  const cy = c.height / 2;
  const oldScale = state.scale;
  const newScale = state.scale * factor;
  // image point corresponding to canvas center
  const imgCenterX = (cx - state.translate.x) / oldScale;
  const imgCenterY = (cy - state.translate.y) / oldScale;
  // new translate so that same image point stays at center
  state.translate.x = cx - imgCenterX * newScale;
  state.translate.y = cy - imgCenterY * newScale;
  state.scale = newScale;
  draw();
}

/* ---------- pointer handling for image drag & crop box ---------- */

function onPointerDown(e: PointerEvent) {
  // if clicked on crop overlay, overlay handlers prevent bubbling; this handler means user clicked canvas background -> move image
  const t = e.currentTarget as Element;
  (t as Element).setPointerCapture(e.pointerId);
  state.dragging = true;
  state.dragMode = 'img';
  state.activePointerId = e.pointerId;
  state.pointerStart = { x: e.clientX, y: e.clientY };
  state.translateStart = { ...state.translate };
}

function onCropPointerDown(e: PointerEvent, mode: string) {
  // mode: 'move' or handle name like 'nw','n','e'...
  const el = e.currentTarget as Element;
  el.setPointerCapture(e.pointerId);
  state.dragging = true;
  state.dragMode = mode as any;
  state.activePointerId = e.pointerId;
  state.pointerStart = { x: e.clientX, y: e.clientY };
  state.cropStart = { x: state.cropRect.x, y: state.cropRect.y, w: state.cropRect.w, h: state.cropRect.h } as any;
}

// pointer move global
function onPointerMove(e: PointerEvent) {
  if (!state.dragging || e.pointerId !== state.activePointerId) return;
  const dx = e.clientX - state.pointerStart.x;
  const dy = e.clientY - state.pointerStart.y;
  if (state.dragMode === 'img') {
    state.translate.x = state.translateStart.x + dx;
    state.translate.y = state.translateStart.y + dy;
    draw();
    return;
  }
  // crop move or resize
  let nx = state.cropStart.x;
  let ny = state.cropStart.y;
  let nw = state.cropStart.w;
  let nh = state.cropStart.h;
  // if CSS scale between canvas pixels and CSS pixels exists, pointer movement uses client coords which map to css coords.
  // We must convert client dx/dy into canvas pixels:
  const c = canvasRef.value!;
  const rect = c.getBoundingClientRect();
  const cssToCanvas = c.width / rect.width;
  const cdx = dx * cssToCanvas;
  const cdy = dy * cssToCanvas;

  switch (state.dragMode) {
    case 'crop-move':
    case 'move':
      nx = state.cropStart.x + cdx;
      ny = state.cropStart.y + cdy;
      break;
    case 'nw':
      nx = state.cropStart.x + cdx;
      ny = state.cropStart.y + cdy;
      nw = state.cropStart.w - cdx;
      nh = state.cropStart.h - cdy;
      break;
    case 'ne':
      ny = state.cropStart.y + cdy;
      nw = state.cropStart.w + cdx;
      nh = state.cropStart.h - cdy;
      break;
    case 'sw':
      nx = state.cropStart.x + cdx;
      nw = state.cropStart.w - cdx;
      nh = state.cropStart.h + cdy;
      break;
    case 'se':
      nw = state.cropStart.w + cdx;
      nh = state.cropStart.h + cdy;
      break;
    case 'n':
      ny = state.cropStart.y + cdy;
      nh = state.cropStart.h - cdy;
      break;
    case 's':
      nh = state.cropStart.h + cdy;
      break;
    case 'w':
      nx = state.cropStart.x + cdx;
      nw = state.cropStart.w - cdx;
      break;
    case 'e':
      nw = state.cropStart.w + cdx;
      break;
  }

  // keep min size
  const minSize = 20;
  if (nw < minSize) nw = minSize;
  if (nh < minSize) nh = minSize;

  // if lockAspect, maintain aspect ratio
  if (lockAspect.value) {
    const ratio = state.cropStart.w / state.cropStart.h || 1;
    if (['nw', 'ne', 'sw', 'se', 'w', 'e', 'n', 's'].includes(state.dragMode)) {
      // prefer adjusting both based on the larger delta
      if (nw / nh > ratio) {
        nw = nh * ratio;
      } else {
        nh = nw / ratio;
      }
      // fix positions for resizing sides
      if (['nw', 'w', 'sw'].includes(state.dragMode)) {
        nx = state.cropStart.x + (state.cropStart.w - nw);
      }
      if (['nw', 'n', 'ne'].includes(state.dragMode)) {
        ny = state.cropStart.y + (state.cropStart.h - nh);
      }
    }
  }

  // apply
  state.cropRect.x = Math.round(nx);
  state.cropRect.y = Math.round(ny);
  state.cropRect.w = Math.round(nw);
  state.cropRect.h = Math.round(nh);

  // clamp to canvas bounds
  clampCropRect();

  draw();
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== state.activePointerId) return;
  state.dragging = false;
  state.dragMode = '';
  state.activePointerId = -1;
  // release all pointer captures if any
  try {
    const node = document;
    // no-op; individual elements released automatically on pointerup
  } catch {}
}

// clamp crop rect to canvas bounds
function clampCropRect() {
  const c = canvasRef.value!;
  if (state.cropRect.x < 0) state.cropRect.x = 0;
  if (state.cropRect.y < 0) state.cropRect.y = 0;
  if (state.cropRect.x + state.cropRect.w > c.width) state.cropRect.x = c.width - state.cropRect.w;
  if (state.cropRect.y + state.cropRect.h > c.height) state.cropRect.y = c.height - state.cropRect.h;
  if (state.cropRect.w > c.width) state.cropRect.w = c.width;
  if (state.cropRect.h > c.height) state.cropRect.h = c.height;
}

// wheel zoom (centered at cursor)
function onWheel(e: WheelEvent) {
  if (!state.img) return;
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  // zoom around cursor location
  const c = canvasRef.value!;
  const rect = c.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;
  const oldScale = state.scale;
  const newScale = state.scale * delta;
  // image point corresponding to cursor
  const imgX = (cx - state.translate.x) / oldScale;
  const imgY = (cy - state.translate.y) / oldScale;
  state.translate.x = cx - imgX * newScale;
  state.translate.y = cy - imgY * newScale;
  state.scale = newScale;
  draw();
}

/* lifecycle: setup canvas size and pointer listeners */
onMounted(() => {
  // init canvas size to container size * devicePixelRatio
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('pointermove', onPointerMove as any);
  window.addEventListener('pointerup', onPointerUp as any);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('pointermove', onPointerMove as any);
  window.removeEventListener('pointerup', onPointerUp as any);
});

function resizeCanvas() {
  const wrap = wrapRef.value;
  const c = canvasRef.value;
  if (!wrap || !c) return;
  const rect = wrap.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.max(300, Math.floor(rect.width * dpr));
  c.height = Math.max(300, Math.floor(rect.height * dpr));
  c.style.width = `${rect.width}px`;
  c.style.height = `${rect.height}px`;
  // adjust cropRect if necessary
  if (!state.img) {
    state.cropRect = { x: 20 * dpr, y: 20 * dpr, w: Math.floor(c.width * 0.6), h: Math.floor(c.height * 0.6) };
  }
  // redraw
  nextTick(draw);
}

// small helper to load external image by url (exposed)
function setImageUrl(url: string) {
  loadImage(url);
}

// small helper to set output size
// function setOutputSize(w:number,h:number){ outputWidth.value=w; outputHeight.value=h; }

</script>

<style scoped>
.cropper-root {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
.toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.btn {
  padding: 6px 10px;
  background: #eee;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
.btn.primary {
  background: #0b76ff;
  color: white;
}
.btn input[type="file"] {
  display: none;
}
.editor-wrap {
  position: relative;
  width: 640px;
  height: 480px;
  border: 1px solid #ddd;
  overflow: hidden;
  background: #f7f7f7;
}
.canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}
.crop-layer {
  position: absolute;
  border: 2px dashed transparent; /* invisible: we draw dashed border in canvas */
  box-sizing: border-box;
  cursor: move;
  /* display handles */
}
.handle {
  position: absolute;
  width: 14px;
  height: 14px;
  background: rgba(255,255,255,0.9);
  border: 1px solid #333;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
}
.handle.nw { left: 0%; top: 0%; cursor: nwse-resize; }
.handle.n { left: 50%; top: 0%; cursor: ns-resize; }
.handle.ne { left: 100%; top: 0%; cursor: nesw-resize; }
.handle.e { left: 100%; top: 50%; cursor: ew-resize; }
.handle.se { left: 100%; top: 100%; cursor: nwse-resize; }
.handle.s { left: 50%; top: 100%; cursor: ns-resize; }
.handle.sw { left: 0%; top: 100%; cursor: nesw-resize; }
.handle.w { left: 0%; top: 50%; cursor: ew-resize; }

.preview-area {
  width: 220px;
}
.preview-canvas {
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  display: block;
}
</style>
