<script setup lang="ts">
import { itToolsService } from '@/api/it-tools.service';
import { useUserStore } from '@/stores/user.store';
import type { FormInst } from 'naive-ui';

const userStore = useUserStore();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const saving = ref(false);
const recharging = ref(false);
const rechargeAmount = ref(1);

const profileForm = ref({
  name: '',
  email: '',
  avatar: '',
});

const coinBalance = computed(() => Number(userStore.user?.coinBalance || 0));

watch(
  () => userStore.user,
  (user) => {
    profileForm.value = {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    };
  },
  { immediate: true },
);

async function loadAccount() {
  const res = await itToolsService.account();
  userStore.user = res.data;
}

async function saveProfile() {
  saving.value = true;
  try {
    const res = await itToolsService.updateAccount(profileForm.value);
    userStore.user = res.data;
    message.success('个人信息已更新');
  } finally {
    saving.value = false;
  }
}

async function recharge() {
  recharging.value = true;
  try {
    const res = await itToolsService.recharge(rechargeAmount.value);
    userStore.user = res.data;
    message.success(`充值成功，获得 ${rechargeAmount.value * 10} 金币`);
  } finally {
    recharging.value = false;
  }
}

onMounted(loadAccount);
</script>

<template>
  <main class="user-page">
    <section class="profile-panel">
      <div class="page-head">
        <div>
          <h1>个人中心</h1>
          <p>{{ userStore.user?.username }}</p>
        </div>
        <div class="coin-box">
          <span>金币余额</span>
          <strong>{{ coinBalance }}</strong>
        </div>
      </div>

      <n-grid :cols="1" :x-gap="24" :y-gap="24" responsive="screen">
        <n-gi>
          <n-card title="个人信息" :bordered="false">
            <n-form ref="formRef" :model="profileForm" label-placement="top">
              <n-form-item label="昵称" path="name">
                <n-input v-model:value="profileForm.name" placeholder="昵称" />
              </n-form-item>
              <n-form-item label="邮箱" path="email">
                <n-input v-model:value="profileForm.email" placeholder="邮箱" />
              </n-form-item>
              <n-form-item label="头像地址" path="avatar">
                <n-input v-model:value="profileForm.avatar" placeholder="https://..." />
              </n-form-item>
              <c-button :disabled="saving" @click="saveProfile">保存</c-button>
            </n-form>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="金币充值" :bordered="false">
            <div class="recharge-row">
              <n-input-number v-model:value="rechargeAmount" :min="1" :precision="0" />
              <span>元 = {{ rechargeAmount * 10 }} 金币</span>
              <c-button :disabled="recharging" @click="recharge">充值</c-button>
            </div>
          </n-card>
        </n-gi>
      </n-grid>
    </section>
  </main>
</template>

<style scoped lang="less">
.user-page {
  width: min(960px, calc(100vw - 32px));
  margin: 32px auto;
}

.profile-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  h1 {
    margin: 0;
    font-size: 28px;
  }

  p {
    margin: 8px 0 0;
    color: var(--n-text-color-3);
  }
}

.coin-box {
  min-width: 160px;
  padding: 16px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  text-align: right;

  span {
    display: block;
    color: var(--n-text-color-3);
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 30px;
  }
}

.recharge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .page-head {
    align-items: stretch;
    flex-direction: column;
  }

  .coin-box {
    text-align: left;
  }
}
</style>
