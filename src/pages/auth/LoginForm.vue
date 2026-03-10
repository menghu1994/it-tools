<template>
  <div class="space-y-6">
    <!-- 用户名输入 -->
    <div>
      <n-input
        v-model:value="form.username"
        type="text"
        placeholder="请输入用户名"
        :input-props="{ autocomplete: 'username' }"
        class="w-full"
      >
        <template #prefix>
          <n-icon><i-ep-user /></n-icon>
        </template>
      </n-input>
      <n-alert
        v-if="errors.username"
        type="error"
        :content="errors.username"
        class="mt-2"
        show-icon
      />
    </div>

    <!-- 密码输入 -->
    <div>
      <n-input
        v-model:value="form.password"
        type="password"
        placeholder="请输入密码"
        :input-props="{ autocomplete: 'current-password' }"
        class="w-full"
        show-password-on="mousedown"
      >
        <template #prefix>
          <n-icon><i-ep-lock /></n-icon>
        </template>
      </n-input>
      <n-alert
        v-if="errors.password"
        type="error"
        :content="errors.password"
        class="mt-2"
        show-icon
      />
    </div>

    <!-- 记住我和忘记密码 -->
    <div class="flex items-center justify-between">
      <n-checkbox v-model:checked="form.rememberMe">记住我</n-checkbox>
      <n-button
        text
        type="primary"
        @click="$emit('forgot-password')"
        class="text-primary hover:text-primary/80"
      >
        忘记密码？
      </n-button>
    </div>

    <!-- 登录按钮 -->
    <n-button
      type="primary"
      @click="handleLogin"
      :loading="loading"
      class="w-full h-12 text-base font-medium"
      :disabled="!isFormValid"
    >
      {{ loading ? '登录中...' : '登录' }}
    </n-button>

    <!-- 第三方登录 -->
    <div>
      <div class="flex items-center justify-center space-x-4 mb-4">
        <div class="h-px bg-gray-600 flex-1"></div>
        <span class="text-gray-400 text-sm">其他登录方式</span>
        <div class="h-px bg-gray-600 flex-1"></div>
      </div>
      <div class="flex justify-center space-x-6">
        <n-button quaternary circle @click="handleThirdPartyLogin('wechat')">
          <template #icon>
            <i-ep-chat-dot-round style="font-size: 20px;" />
          </template>
        </n-button>
        <n-button quaternary circle @click="handleThirdPartyLogin('qq')">
          <template #icon>
            <i-ep-star style="font-size: 20px;" />
          </template>
        </n-button>
        <n-button quaternary circle @click="handleThirdPartyLogin('weibo')">
          <template #icon>
            <i-ep-fire style="font-size: 20px;" />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { EpUser, EpLock, EpChatDotRound, EpStar, EpFire } from '@vicons/ep'

export default {
  name: 'LoginForm',
  components: {
    NIcon,
    EpUser,
    EpLock,
    EpChatDotRound,
    EpStar,
    EpFire
  },
  emits: ['forgot-password'],
  setup() {
    const form = ref({
      username: '',
      password: '',
      rememberMe: false
    })

    const errors = ref({
      username: '',
      password: ''
    })

    const loading = ref(false)

    // 表单验证
    const isFormValid = computed(() => {
      return form.value.username.trim() && form.value.password.trim()
    })

    // 验证函数
    const validateForm = () => {
      let isValid = true
      errors.value = { username: '', password: '' }

      if (!form.value.username.trim()) {
        errors.value.username = '请输入用户名'
        isValid = false
      }

      if (!form.value.password.trim()) {
        errors.value.password = '请输入密码'
        isValid = false
      } else if (form.value.password.length < 6) {
        errors.value.password = '密码长度不能少于6位'
        isValid = false
      }

      return isValid
    }

    // 处理登录
    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true

      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 这里应该是实际的登录API调用
        console.log('登录请求:', form.value)
        
        // 模拟登录成功
        if (form.value.username && form.value.password) {
          // 保存登录状态
          if (form.value.rememberMe) {
            localStorage.setItem('rememberedUser', form.value.username)
          } else {
            localStorage.removeItem('rememberedUser')
          }
          
          // 显示成功消息
          ElMessage.success('登录成功')
          
          // 这里应该是登录成功后的跳转逻辑
          console.log('登录成功，准备跳转...')
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查用户名和密码')
      } finally {
        loading.value = false
      }
    }

    // 处理第三方登录
    const handleThirdPartyLogin = (platform) => {
      console.log(`使用${platform}登录`)
      ElMessage.info(`正在跳转到${platform}授权页面...`)
    }

    // 从localStorage读取记住的用户
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      form.value.username = rememberedUser
      form.value.rememberMe = true
    }

    return {
      form,
      errors,
      loading,
      isFormValid,
      handleLogin,
      handleThirdPartyLogin
    }
  }
}
</script>

<style scoped>
.text-primary {
  color: var(--primary);
}

.text-primary\/80 {
  color: rgba(0, 255, 217, 0.8);
}

/* 输入框聚焦样式 */
.n-input:focus-within {
  box-shadow: 0 0 0 2px rgba(0, 255, 217, 0.2);
}

/* 按钮悬停效果 */
.n-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 255, 217, 0.3);
}

.n-button--primary:active {
  transform: translateY(0);
}

/* 第三方登录按钮悬停效果 */
.n-button--quaternary:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transform: scale(1.1);
}
</style>