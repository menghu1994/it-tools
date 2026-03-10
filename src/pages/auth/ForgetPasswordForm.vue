<template>
  <div class="space-y-6">
    <!-- 邮箱输入 -->
    <div>
      <n-input
        v-model:value="form.email"
        type="email"
        placeholder="请输入注册邮箱"
        :input-props="{ autocomplete: 'email' }"
        class="w-full"
        @blur="validateEmail"
      >
        <template #prefix>
          <n-icon><i-ep-message /></n-icon>
        </template>
      </n-input>
      <n-alert
        v-if="errors.email"
        type="error"
        :content="errors.email"
        class="mt-2"
        show-icon
      />
    </div>

    <!-- 验证码输入 -->
    <div>
      <div class="flex space-x-4">
        <n-input
          v-model:value="form.verificationCode"
          type="text"
          placeholder="请输入验证码"
          class="flex-1"
          @blur="validateVerificationCode"
        >
          <template #prefix>
            <n-icon><i-ep-mobile /></n-icon>
          </template>
        </n-input>
        <n-button
          type="primary"
          :disabled="!canSendCode || sendingCode"
          @click="sendVerificationCode"
          class="whitespace-nowrap"
        >
          {{ sendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s后重发` : '发送验证码') }}
        </n-button>
      </div>
      <n-alert
        v-if="errors.verificationCode"
        type="error"
        :content="errors.verificationCode"
        class="mt-2"
        show-icon
      />
    </div>

    <!-- 新密码输入 -->
    <div>
      <n-input
        v-model:value="form.newPassword"
        type="password"
        placeholder="请输入新密码 (至少6位)"
        :input-props="{ autocomplete: 'new-password' }"
        class="w-full"
        show-password-on="mousedown"
        @blur="validateNewPassword"
      >
        <template #prefix>
          <n-icon><i-ep-lock /></n-icon>
        </template>
      </n-input>
      <n-alert
        v-if="errors.newPassword"
        type="error"
        :content="errors.newPassword"
        class="mt-2"
        show-icon
      />
      
      <!-- 密码强度指示器 -->
      <div v-if="form.newPassword" class="mt-2">
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

    <!-- 确认新密码输入 -->
    <div>
      <n-input
        v-model:value="form.confirmNewPassword"
        type="password"
        placeholder="请再次输入新密码"
        :input-props="{ autocomplete: 'new-password' }"
        class="w-full"
        show-password-on="mousedown"
        @blur="validateConfirmNewPassword"
      >
        <template #prefix>
          <n-icon><i-ep-check /></n-icon>
        </template>
      </n-input>
      <n-alert
        v-if="errors.confirmNewPassword"
        type="error"
        :content="errors.confirmNewPassword"
        class="mt-2"
        show-icon
      />
    </div>

    <!-- 提交按钮 -->
    <n-button
      type="primary"
      @click="handleResetPassword"
      :loading="loading"
      class="w-full h-12 text-base font-medium"
      :disabled="!isFormValid"
    >
      {{ loading ? '重置中...' : '重置密码' }}
    </n-button>
  </div>
</template>

<script>
import { ref, computed, watch, onUnmounted } from 'vue'
import { NIcon } from 'naive-ui'
import { EpMessage, EpMobile, EpLock, EpCheck } from '@vicons/ep'

export default {
  name: 'ForgotPasswordForm',
  components: {
    NIcon,
    EpMessage,
    EpMobile,
    EpLock,
    EpCheck
  },
  emits: ['close'],
  setup(props, { emit }) {
    const form = ref({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: ''
    })

    const errors = ref({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: ''
    })

    const loading = ref(false)
    const sendingCode = ref(false)
    const countdown = ref(0)
    const countdownTimer = ref(null)

    // 密码强度相关
    const passwordStrength = ref(0) // 0-3: 弱、中、强、很强

    // 监听密码变化，更新强度
    watch(() => form.value.newPassword, (newPassword) => {
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

    // 是否可以发送验证码
    const canSendCode = computed(() => {
      return form.value.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
    })

    // 表单验证
    const isFormValid = computed(() => {
      return form.value.email.trim() && 
             form.value.verificationCode.trim() && 
             form.value.newPassword.trim() && 
             form.value.confirmNewPassword.trim() && 
             form.value.newPassword === form.value.confirmNewPassword &&
             !Object.values(errors.value).some(error => error)
    })

    // 验证邮箱
    const validateEmail = () => {
      const email = form.value.email.trim()
      errors.value.email = ''

      if (!email) {
        errors.value.email = '请输入邮箱'
        return false
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.value.email = '请输入有效的邮箱地址'
        return false
      }

      return true
    }

    // 验证验证码
    const validateVerificationCode = () => {
      const code = form.value.verificationCode.trim()
      errors.value.verificationCode = ''

      if (!code) {
        errors.value.verificationCode = '请输入验证码'
        return false
      }

      if (!/^\d{6}$/.test(code)) {
        errors.value.verificationCode = '验证码应为6位数字'
        return false
      }

      return true
    }

    // 验证新密码
    const validateNewPassword = () => {
      const password = form.value.newPassword
      errors.value.newPassword = ''

      if (!password) {
        errors.value.newPassword = '请输入新密码'
        return false
      }

      if (password.length < 6) {
        errors.value.newPassword = '密码长度不能少于6位'
        return false
      }

      return true
    }

    // 验证确认新密码
    const validateConfirmNewPassword = () => {
      const confirmPassword = form.value.confirmNewPassword
      errors.value.confirmNewPassword = ''

      if (!confirmPassword) {
        errors.value.confirmNewPassword = '请再次输入新密码'
        return false
      }

      if (confirmPassword !== form.value.newPassword) {
        errors.value.confirmNewPassword = '两次输入的密码不一致'
        return false
      }

      return true
    }

    // 验证整个表单
    const validateForm = () => {
      const isEmailValid = validateEmail()
      const isCodeValid = validateVerificationCode()
      const isPasswordValid = validateNewPassword()
      const isConfirmPasswordValid = validateConfirmNewPassword()

      return isEmailValid && isCodeValid && isPasswordValid && isConfirmPasswordValid
    }

    // 发送验证码
    const sendVerificationCode = async () => {
      if (!validateEmail()) return

      sendingCode.value = true

      try {
        // 模拟发送验证码请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 这里应该是实际的发送验证码API调用
        console.log('发送验证码到:', form.value.email)
        
        // 显示成功消息
        ElMessage.success(`验证码已发送至 ${form.value.email}`)
        
        // 开始倒计时
        startCountdown()
      } catch (error) {
        console.error('发送验证码失败:', error)
        ElMessage.error('发送验证码失败，请稍后重试')
      } finally {
        sendingCode.value = false
      }
    }

    // 开始倒计时
    const startCountdown = () => {
      countdown.value = 60
      
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
      
      countdownTimer.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(countdownTimer.value)
        }
      }, 1000)
    }

    // 处理重置密码
    const handleResetPassword = async () => {
      if (!validateForm()) return

      loading.value = true

      try {
        // 模拟重置密码请求
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 这里应该是实际的重置密码API调用
        console.log('重置密码请求:', form.value)
        
        // 模拟重置成功
        ElMessage.success('密码重置成功！即将跳转到登录页面')
        
        // 延迟关闭弹窗
        setTimeout(() => {
          emit('close')
        }, 1500)
      } catch (error) {
        console.error('重置密码失败:', error)
        ElMessage.error('重置密码失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 清理倒计时
    onUnmounted(() => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
    })

    return {
      form,
      errors,
      loading,
      sendingCode,
      countdown,
      isFormValid,
      canSendCode,
      passwordStrength,
      passwordStrengthText,
      passwordStrengthClass,
      passwordStrengthWidth,
      validateEmail,
      validateVerificationCode,
      validateNewPassword,
      validateConfirmNewPassword,
      sendVerificationCode,
      handleResetPassword
    }
  }
}
</script>

<style scoped>
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