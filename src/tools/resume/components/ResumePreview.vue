<template>
  <div class="resume-root">
    <!-- 个人信息头部 -->
    <section @click="$emit('editModule','personal')" cursor-pointer flex justify-between v-if="data && data.personal">
      <div flex flex-col>
        <h1>{{ data.personal?.name }}</h1>
        <div flex flex-1>
          <span>{{ data.personal?.city }}</span> | <span>{{ data.personal?.email }}</span> | <span>{{ data.personal?.phone }}</span>
        </div>
        <div flex>
          <span>{{ data.personal?.email }}</span>
          <span>{{ data.personal?.phone }}</span>
        </div>
      </div>
      <div>
        <img v-if="data.personal?.avatarUrl" :src="data.personal.avatarUrl" class="avatar" />
      </div>
    </section>
    <section v-else class="example" flex space-between>
      <div flex flex-col gap-2>
        <h3>姓名</h3>
        <div flex gap-2>
          <span>男</span> |  <span>23岁</span>  |  <span>党员</span>  |  <span>广州</span>  |  <span>本科</span>
        </div>
        <div flex gap-2>
          <span>mail.com</span>
          <span>13001001000</span>
        </div>
      </div>
      <div class="avatar"></div>
    </section>

    <!-- 渲染模块列表 -->
    <section v-for="(m, idx) in modules" :key="idx" class="module" @click="$emit('editModule', m.type)">
      <template v-if="m.type === 'education'">
        <div v-if="m.value">
          <div flex gap-2>
            <div class="time">{{ m.value.from }} — {{ m.value.to }}</div>
            <div class="body">
              <div class="title">{{ m.value.school }} · {{ m.value.major }}</div>
              <div class="sub">{{ m.value.degree }} · GPA: {{ m.value.gpa || '--' }}</div>
            </div>
          </div>
        </div>
        <div v-else class="sample">教育经历示例（灰色）</div>
      </template>

      <template v-if="m.type === 'work'">
        <div v-if="m.value">
          <div flex gap-2>
            <div class="time">{{ m.value.from }} — {{ m.value.to }}</div>
            <div class="body">
              <div class="title">{{ m.value.company }} · {{ m.value.position }}</div>
              <ul>
                <li v-for="(c, i) in m.value.contents" :key="i">{{ c }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="sample">工作经历示例（灰色）</div>
      </template>

      <!-- 其他模块类似 -->
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: { type: Array, default: () => [] }
});

const modules = props.data;
</script>

<style scoped lang="less">
.resume-root {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial;
  color:#222;
  font-size: 13px;
  h3 {
    margin: 0;
  }
  .example {
    color:#999
  }
  .avatar {
    width: 65px;
    height: 90px;
    border: 1px solid rgba(0,0,0,0.07);
    box-sizing: content-box;
    border-radius: 3px;
    overflow: hidden;
  }
}
.time { width:120px; color:#666; font-size:13px; }
.title { font-weight:600; }
.sample { color:#999; background:#f5f5f5; padding:8px; border-radius:6px; }


</style>
