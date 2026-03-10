<template>
  <div class="space-y-6">
    <!-- 用户名输入 -->
    <div>
      <n-input
        v-model:value="form.username"
        type="text"
        placeholder="请输入用户名 (2-20个字符)"
        :input-props="{ autocomplete: 'username' }"
        class="w-full"
        @blur="validateUsername"
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
        placeholder="请输入密码 (至少6位)"
        :input-props="{ autocomplete: 'new-password' }"
        class="w-full"
        show-password-on="mousedown"
        @blur="validatePassword"
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
      
      <!-- 密码强度指示器 -->
      <div v-if="form.password" class="mt-2">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span>密码强度</span>
          <span>{{ passwordStrengthText }}</span>
        </div>
        <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-300"
            :class="passwordStrengthClass"
            :style="{ width: passwordStrengthWidth }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 确认密码输入 -->
    <div>
      <n-input
        v-model:value="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        :input-props="{ autocomplete: 'new-password' }"
        class="w-full"
        show-password-on="mousedown"
        @blur="validateConfirmPassword"
      >
        <template #prefix>
          <n-icon><i-ep-check /></n-icon>
        </template>
      </n-input>
      <n-alert
        v-if="errors.confirmPassword"
        type="error"
        :content="errors.confirmPassword"
        class="mt-2"
        show-icon
      />
    </div>

    <!-- 同意协议 -->
    <div class="flex items-start">
      <n-checkbox v-model:checked="form.agreeTerms" class="mt-1">
        我已阅读并同意
        <n-button text type="primary" class="text-primary hover:text-primary/80 p-0 h-auto">
          用户协议
        </n-button>
        和
        <n-button text type="primary" class="text-primary hover:text-primary/80 p-0 h-auto">
          隐私政策
        </n-button>
      </n-checkbox>
    </div>
    <n-alert
      v-if="errors.agreeTerms"
      type="error"
      :content="errors.agreeTerms"
      class="mt-2"
      show-icon
    />

    <!-- 注册按钮 -->
    <n-button
      type="primary"
      @click="handleRegister"
      :loading="loading"
      class="w-full h-12 text-base font-medium"
      :disabled="!isFormValid"
    >
      {{ loading ? '注册中...' : '注册' }}
    </n-button>

    <!-- 已有账号 -->
    <div class="text-center text-gray-400">
      已有账号？
      <n-button 
        text 
        type="primary" 
        class="text-primary hover:text-primary/80 p-0 h-auto"
        @click="$emit('switch-to-login')"
      >
        立即登录
      </n-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { NIcon } from 'naive-ui'
import { EpUser, EpLock, EpCheck } from '@vicons/ep'

export default {
  name: 'RegisterForm',
  components: {
    NIcon,
    EpUser,
    EpLock,
    EpCheck
  },
  emits: ['switch-to-login'],
  setup(props, { emit }) {
    const form = ref({
      username: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })

    const errors = ref({
      username: '',
      password: '',
      confirmPassword: '',
      agreeTerms: ''
    })

    const loading = ref(false)

    // 密码强度相关
    const passwordStrength = ref(0) // 0-3: 弱、中、强、很强

    // 监听密码变化，更新强度
    watch(() => form.value.password, (newPassword) => {
      updatePasswordStrength(newPassword)
    })

    // 更新密码强度
    const updatePasswordStrength = (password) => {
      if (!password) {
        passwordStrength.value = 0
        return
      }

      let strength = 0
      
      // 长度检查
      if (password.length >= 8) strength++
      
      // 包含数字
      if (/\d/.test(password)) strength++
      
      // 包含字母
      if (/[a-zA-Z]/.test(password)) strength++
      
      // 包含特殊字符
      if (/[^a-zA-Z0-9]/.test(password)) strength++

      passwordStrength.value = strength
    }

    // 密码强度文本
    const passwordStrengthText = computed(() => {
      const texts = ['弱', '中', '强', '很强']
      return texts[passwordStrength.value] || '弱'
    })

    // 密码强度样式类
    const passwordStrengthClass = computed(() => {
      const classes = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-green-500'
      ]
      return classes[passwordStrength.value] || classes[0]
    })

    // 密码强度宽度
    const passwordStrengthWidth = computed(() => {
      return `${(passwordStrength.value / 4) * 100}%`
    })

    // 表单验证
    const isFormValid = computed(() => {
      return form.value.username.trim() && 
             form.value.password.trim() && 
             form.value.confirmPassword.trim() && 
             form.value.password === form.value.confirmPassword &&
             form.value.agreeTerms &&
             !Object.values(errors.value).some(error => error)
    })

    // 验证用户名
    const validateUsername = () => {
      const username = form.value.username.trim()
      errors.value.username = ''

      if (!username) {
        errors.value.username = '请输入用户名'
        return false
      }

      if (username.length < 2 || username.length > 20) {
        errors.value.username = '用户名长度应在2-20个字符之间'
        return false
      }

      if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
        errors.value.username = '用户名只能包含字母、数字、下划线和中文'
        return false
      }

      return true
    }

    // 验证密码
    const validatePassword = () => {
      const password = form.value.password
      errors.value.password = ''

      if (!password) {
        errors.value.password = '请输入密码'
        return false
      }

      if (password.length < 6) {
        errors.value.password = '密码长度不能少于6位'
        return false
      }

      return true
    }

    // 验证确认密码
    const validateConfirmPassword = () => {
      const confirmPassword = form.value.confirmPassword
      errors.value.confirmPassword = ''

      if (!confirmPassword) {
        errors.value.confirmPassword = '请再次输入密码'
        return false
      }

      if (confirmPassword !== form.value.password) {
        errors.value.confirmPassword = '两次输入的密码不一致'
        return false
      }

      return true
    }

    // 验证整个表单
    const validateForm = () => {
      const isUsernameValid = validateUsername()
      const isPasswordValid = validatePassword()
      const isConfirmPasswordValid = validateConfirmPassword()

      // 验证协议勾选
      if (!form.value.agreeTerms) {
        errors.value.agreeTerms = '请阅读并同意用户协议和隐私政策'
      } else {
        errors.value.agreeTerms = ''
      }

      return isUsernameValid && isPasswordValid && isConfirmPasswordValid && form.value.agreeTerms
    }

    // 处理注册
    const handleRegister = async () => {
      if (!validateForm()) return

      loading.value = true

      try {
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 这里应该是实际的注册API调用
        console.log('注册请求:', form.value)
        
        // 模拟注册成功
        ElMessage.success('注册成功！即将跳转到登录页面')
        
        // 延迟切换到登录页面
        setTimeout(() => {
          emit('switch-to-login')
        }, 1500)
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error('注册失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      isFormValid,
      passwordStrength,
      passwordStrengthText,
      passwordStrengthClass,
      passwordStrengthWidth,
      validateUsername,
      validatePassword,
      validateConfirmPassword,
      handleRegister
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
</style>