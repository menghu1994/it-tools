<script setup lang="ts">
import { authService } from '@/api/auth/auth.service';
import { userService } from '@/api/auth/user.service';
import { setAuthTokens } from '@/api/request';
import { useLoginModalStore } from '@/stores/login-modal.store';
import { useUserStore } from '@/stores/user.store';
import { useToolStore } from '@/tools/tools.store';
import type { FormInst, FormItemInst, FormItemRule } from 'naive-ui';

const userStore = useUserStore();
const toolStore = useToolStore();
const modalStore = useLoginModalStore();
const { user } = toRefs(userStore);
const loading = ref(false);

const loginForm = ref({
  username: '',
  password: '',
});

const registForm = ref({
  username: '',
  password: '',
  rePassword: '',
  email: '',
});

const loginFormRef = ref<FormInst | null>(null);
const registFormRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);

const loginRules = {
  username: { required: true, trigger: ['input', 'blur'], message: '请输入用户名' },
  password: { required: true, trigger: ['input', 'blur'], message: '请输入密码' },
};

const registRules = {
  username: { required: true, trigger: ['input', 'blur'], message: '请输入用户名' },
  password: { required: true, trigger: ['input', 'blur'], message: '请输入密码' },
  rePassword: [
    { required: true, message: '请再次输入密码', trigger: ['input', 'blur'] },
    { validator: validatePasswordStartWith, message: '两次密码输入不一致', trigger: 'input' },
    { validator: validatePasswordSame, message: '两次密码输入不一致', trigger: ['blur', 'password-input'] },
  ],
  email: { required: true, trigger: ['input', 'blur'], message: '请输入邮箱' },
};

watch(() => modalStore.show, (value) => {
  if (value) {
    loginForm.value = { username: '', password: '' };
    registForm.value = { username: '', password: '', rePassword: '', email: '' };
  }
});

function normalizeLoginUser(data: any) {
  return data?.userInfo || data;
}

function persistLogin(data: any) {
  setAuthTokens(data);
  user.value = normalizeLoginUser(data);
}

function login() {
  loading.value = true;
  loginFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const res = await authService.login({
          username: loginForm.value.username,
          password: loginForm.value.password,
          withoutCaptcha: true,
        });
        persistLogin(res.data);
        await toolStore.ensureUserFavoritesLoaded();
        modalStore.successLogin();
      } catch (error) {
        console.error('登录失败', error);
      }
    }
    loading.value = false;
  });
}

function regist() {
  loading.value = true;
  registFormRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const { rePassword, ...formData } = registForm.value;
        await userService.create({ ...formData, name: formData.username });
        const res = await authService.login({
          username: formData.username,
          password: formData.password,
          withoutCaptcha: true,
        });
        persistLogin(res.data);
        await toolStore.ensureUserFavoritesLoaded();
        modalStore.successLogin();
      } catch (error) {
        console.error('注册失败', error);
      }
    }
    loading.value = false;
  });
}

function handlePasswordInput() {
  if (registForm.value.rePassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
  }
}

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!registForm.value.password
    && registForm.value.password.startsWith(value)
    && registForm.value.password.length >= value.length
  );
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === registForm.value.password;
}
</script>

<template>
  <c-modal v-if="!user" v-model:open="modalStore.show" shadow-xl important:max-w-512px important:pa-0px>
    <div class="wrapper">
      <div class="login-wrap">
        <div class="login-html">
          <input id="tab-1" type="radio" name="tab" class="sign-in" cursor-pointer checked>
          <label for="tab-1" class="tab">登录</label>
          <input id="tab-2" type="radio" name="tab" class="sign-up" cursor-pointer>
          <label for="tab-2" class="tab">注册</label>
          <div class="login-form">
            <div class="sign-in-htm">
              <h1>Welcome</h1>
              <n-form
                ref="loginFormRef"
                class="form"
                :model="loginForm"
                :rules="loginRules"
                :disabled="loading"
                label-placement="left"
              >
                <n-form-item path="username">
                  <n-input v-model:value="loginForm.username" placeholder="用户名" />
                </n-form-item>
                <n-form-item path="password">
                  <n-input v-model:value="loginForm.password" type="password" placeholder="密码" />
                </n-form-item>
                <c-button w-full :disabled="loading" @click.prevent="login" attr-type="button">登录</c-button>
              </n-form>
            </div>
            <div class="sign-up-htm">
              <n-form
                ref="registFormRef"
                class="form"
                :model="registForm"
                :rules="registRules"
                :disabled="loading"
                label-placement="left"
              >
                <n-form-item path="username">
                  <n-input v-model:value="registForm.username" placeholder="用户名" />
                </n-form-item>
                <n-form-item path="password">
                  <n-input
                    v-model:value="registForm.password"
                    type="password"
                    placeholder="密码"
                    @input="handlePasswordInput"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-form-item ref="rPasswordFormItemRef" first path="rePassword">
                  <n-input
                    v-model:value="registForm.rePassword"
                    :disabled="!registForm.password"
                    type="password"
                    placeholder="确认密码"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-form-item path="email">
                  <n-input v-model:value="registForm.email" placeholder="邮箱" />
                </n-form-item>
                <c-button w-full :disabled="loading" @click.prevent="regist" attr-type="button">注册</c-button>
              </n-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </c-modal>
</template>

<style scoped lang="less">
h1 {
  font-size: 40px;
  text-align: center;
}

.login-wrap {
  margin: 0 auto;
  max-width: 400px;
  min-height: 500px;
  position: relative;
  z-index: 10;
}

form {
  padding: 20px 0;
  position: relative;
  z-index: 2;
  height: -webkit-fill-available;
}

.login-html {
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 2rem 0;

  .sign-in,
  .sign-up {
    display: none;
  }

  .tab {
    font-size: 22px;
    padding-bottom: 5px;
    margin: 0 15px 10px 0;
    display: inline-block;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }

  .sign-in:checked + .tab,
  .sign-up:checked + .tab {
    font-weight: bold;
    border-color: #1161ee;
  }

  .sign-in:checked + .tab + .sign-up + .tab + .login-form .sign-in-htm {
    transform: rotate(0);
  }

  .sign-up:checked + .tab + .login-form .sign-up-htm {
    transform: rotate(0);
  }
}

.login-html .sign-in-htm,
.login-html .sign-up-htm {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  transition: all .4s linear;
}

.login-form {
  height: inherit;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
