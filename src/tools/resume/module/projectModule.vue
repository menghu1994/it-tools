<script setup lang="ts">
const { data } = defineProps({
  data: { type: Object, default: () => {} }
});

const hasValue = (value: any): boolean => {
  if(!value) { return false }
  if(Array.isArray(value)) {
    return !!value.length
  }
  if(typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return true
}
</script>

<template>
  <section>
    <div class="module-title">
      <span>项目经历</span>
      <span class="split-line"></span>
    </div>
    <div v-if="hasValue(data)" flex flex-col gap-1 class="module-body">
      <div flex gap-2 font-bold items-center>
        <span>{{ data.comp }}</span>
        <span>QQ邮箱产品部</span>
        <span>产品实习生</span>
        <span class="resume_preview_work_info_date">2018.9 - 2020.3</span>
      </div>
      <div>QQ邮箱用户运营</div>
      <div>
        负责版本上线后的推广工作，通过微博、博客和论坛等渠道将新功能触达用户
      </div>
    </div>
    <div v-else class="example module-body" flex flex-col gap-1>
      <div flex gap-2 font-bold items-center>
        <span>腾讯大学</span>
        <span>“最亮的明天”暖灯行动</span>
        <span>项目负责人</span>
        <span class="resume_preview_work_info_date">2018.9 - 2020.3</span>
      </div>
      <div>引导释放邮箱空间，帮助贫困山区</div>
      <div>
        1、引导用户删除旧邮件，倡导资源节约和合理利用。将节约下来的运营成本投入公益项目，帮助贫困山区的教室改善照明环境
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">

</style>
