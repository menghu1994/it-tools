<script setup lang="ts">
import { authService } from '@/api/auth/auth.service';
import { userService } from '@/api/auth/user.service';
import { useUserStore } from '@/stores/user.store';
import { ref, toRefs } from 'vue';
import { useLoginModalStore } from '@/stores/login-modal.store'

const userStore = useUserStore();
const modalStore = useLoginModalStore()
const { user } = toRefs(userStore);
const loading = ref(false)

const form = ref({
  username: '',
  password: '',
  rePassword: '',
  email: ''
})

const formRules = {
  username: [{ message: '用户名不能为空', validator: (value: string) => value !== '' }],
  password: [{ message: '密码不能为空', validator: (value: string) => value !== '' }],
  rePassword: [{ message: '密码不一致', validator: (value: string) => value === form.value.password }],
  email: [{ message: '邮箱不能为空', validator: (value: string) => value !== '' }],
}

watch(() => modalStore.show, (value) => {
  if (value) {
    form.value = {
      username: '',
      password: '',
      rePassword: '',
      email: ''
    }
  }
})

const login = async () => {
  loading.value = true;
  const res = await authService.login({
    username: form.value.username,
    password: form.value.password,
    withoutCaptcha: true
  });
  user.value = res.data;
  loading.value = false;
  modalStore.close()
}

const regist = async () => {
  loading.value = true;
  const { rePassword, ...formData } = form.value;
  const res = await userService.create(formData);
  user.value = res.data;
  loading.value = false;
  modalStore.close()
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
              <form class="form" @submit.prevent="login">
                <c-input-text v-model:value="form.username" :validation-rules="formRules.username" placeholder="用户名"
                  raw-text mb-2 />
                <c-input-text v-model:value="form.password" :validation-rules="formRules.password" placeholder="密码"
                  raw-text mb-2 />
                <c-button w-full :disabled="loading">登录</c-button>
              </form>
            </div>
            <div class="sign-up-htm">
              <form class="form" @submit.prevent="regist">
                <c-input-text v-model:value="form.username" :validation-rules="formRules.username" placeholder="用户名"
                  raw-text mb-2 />
                <c-input-text v-model:value="form.password" :validation-rules="formRules.password" placeholder="密码"
                  type="password" raw-text mb-2 />
                <c-input-text v-model:value="form.rePassword" :validation-rules="formRules.rePassword"
                  placeholder="再次输入密码" type="password" raw-text mb-2 />
                <c-input-text v-model:value="form.email" :validation-rules="formRules.password" placeholder="邮箱"
                  raw-text mb-2 />
                <c-button w-full :disabled="loading">注册</c-button>
              </form>
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

.wrapper {
  //background: #50a3a2;
  //background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  //background: -moz-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  //background: -o-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  //background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
  //background-image: conic-gradient(#f0d9b5 25%, #b58863 0% 50%, #f0d9b5 50% 75%, #b58863 75%);
  //background-image: conic-gradient(#50a3a2 25%, #53e3a6 0% 50%, #50a3a2 50% 75%, #53e3a6 75%);
  //background-size: 300px 300px;
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

  .sign-in:checked+.tab,
  .sign-up:checked+.tab {
    font-weight: bold;
    border-color: #1161ee;
  }

  .sign-in:checked+.tab+.sign-up+.tab+.login-form .sign-in-htm {
    transform: rotate(0);
  }

  .sign-up:checked+.tab+.login-form .sign-up-htm {
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
