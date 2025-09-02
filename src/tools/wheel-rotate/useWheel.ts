import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

interface Sector {
  label: string;
  color: string;
  ratio: number;
}

export function useWheel(sectors: Sector[]) {
  const canvas = ref<HTMLCanvasElement | null>(null);
  const ctx = ref<CanvasRenderingContext2D | null>(null);

  const rotation = ref(0); // 当前旋转角度
  let isDragging = false;

  // 拖拽时的速度计算
  let lastAngle = 0;
  let lastTime = 0;
  let velocity = 0;

  const drawWheel = () => {
    if (!ctx.value) return;
    const c = ctx.value;
    const w = c.canvas.width;
    const r = w / 2;

    c.clearRect(0, 0, w, w);
    c.save();
    c.translate(r, r);
    c.rotate((rotation.value * Math.PI) / 180);

    const total = sectors.reduce((a, b) => a + b.ratio, 0);
    let start = 0;
    for (let sector of sectors) {
      const angle = (sector.ratio / total) * Math.PI * 2;
      c.beginPath();
      c.moveTo(0, 0);
      c.arc(0, 0, r, start, start + angle);
      c.fillStyle = sector.color;
      c.fill();
      c.save();
      c.fillStyle = "#fff";
      c.rotate(start + angle / 2);
      c.textAlign = "right";
      c.font = "16px Arial";
      c.fillText(sector.label, r - 10, 10);
      c.restore();
      start += angle;
    }
    c.restore();
  };

  const getAngle = (x: number, y: number, rect: DOMRect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
  };

  onMounted(() => {
    if (!canvas.value) return;
    ctx.value = canvas.value.getContext("2d");
    drawWheel();

    const c = canvas.value;

    const onDown = (e: MouseEvent) => {
      isDragging = true;
      gsap.killTweensOf(rotation); // 停止惯性动画
      const rect = c.getBoundingClientRect();
      lastAngle = getAngle(e.clientX, e.clientY, rect) - rotation.value;
      lastTime = Date.now();
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const rect = c.getBoundingClientRect();
      const angle = getAngle(e.clientX, e.clientY, rect);
      const now = Date.now();
      rotation.value = angle - lastAngle;
      velocity = (rotation.value - rotation.value) / (now - lastTime); // 占位，松手才算
      drawWheel();
    };

    const onUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const now = Date.now();
      const rect = c.getBoundingClientRect();
      const currentAngle = getAngle(e.clientX, e.clientY, rect) - lastAngle;

      const dt = (now - lastTime) / 1000; // 秒
      const delta = currentAngle - rotation.value;
      velocity = delta / dt; // 角速度 (deg/s)

      // === 惯性公式 ===
      const resistance = 50; // 摩擦力（调节）
      let distance = (velocity * velocity) / (2 * resistance); // 最终旋转角度
      if (velocity < 0) distance = -distance; // 方向

      const finalAngle = rotation.value + distance;

      gsap.to(rotation, {
        value: finalAngle,
        duration: Math.min(6, Math.abs(velocity) / 50), // 根据速度决定持续时间
        ease: "power3.out",
        onUpdate: drawWheel,
        onComplete: () => {
          checkResult();
        },
      });
    };

    c.addEventListener("mousedown", onDown);
    c.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    onUnmounted(() => {
      c.removeEventListener("mousedown", onDown);
      c.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    });
  });

  const checkResult = () => {
    const total = sectors.reduce((a, b) => a + b.ratio, 0);
    const angles = sectors.map((s) => (s.ratio / total) * 360);

    let current = (rotation.value % 360 + 360) % 360;
    let acc = 0;
    let result: Sector | null = null;
    for (let i = 0; i < sectors.length; i++) {
      acc += angles[i];
      if (current <= acc) {
        result = sectors[i];
        break;
      }
    }
    if (result) {
      console.log("中奖:", result.label);
    }
  };

  return {
    canvas,
    rotation,
    drawWheel,
    checkResult,
  };
}
