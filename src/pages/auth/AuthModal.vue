<script>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'

export default {
  name: 'AuthModal',
  setup() {
    const message = useMessage()
    const timer = ref(null)
    const countdown = ref(0)
    
    // 状态管理
    const showLoginModal = ref(false)
    const showForgotModal = ref(false)
    const activeTab = ref('login')
    const isLoading = ref(false)
    const isAuthenticated = ref(false)
    const username = ref('')
    const userAvatar = ref('')
    
    // 表单引用
    const loginFormRef = ref(null)
    const registerFormRef = ref(null)
    const forgotFormRef = ref(null)
    
    // 登录表单
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const loginRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    })
    
    // 注册表单
    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const registerRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请设置密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator(rule, value) {
            if (!value) return new Error('请确认密码')
            if (value !== registerForm.password) return new Error('两次输入的密码不一致')
            return true
          },
          trigger: 'blur'
        }
      ]
    })
    
    // 忘记密码表单
    const forgotForm = reactive({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    
    const forgotRules = reactive({
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请设置新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
      ],
      confirmNewPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator(rule, value) {
            if (!value) return new Error('请确认新密码')
            if (value !== forgotForm.newPassword) return new Error('两次输入的密码不一致')
            return true
          },
          trigger: 'blur'
        }
      ]
    })
    
    // 处理登录
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        await loginFormRef.value.validate()
        isLoading.value = true
        
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟成功响应
        isAuthenticated.value = true
        username.value = loginForm.username
        userAvatar.value = `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginForm.username}`
        
        message.success('登录成功')
        showLoginModal.value = false
        
        // 重置表单
        loginForm.username = ''
        loginForm.password = ''
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    // 处理注册
    const handleRegister = async () => {
      if (!registerFormRef.value) return
      
      try {
        await registerFormRef.value.validate()
        isLoading.value = true
        
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        message.success('注册成功，请登录')
        activeTab.value = 'login'
        
        // 填充用户名到登录表单
        loginForm.username = registerForm.username
        
        // 重置注册表单
        registerForm.username = ''
        registerForm.email = ''
        registerForm.password = ''
        registerForm.confirmPassword = ''
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    // 发送验证码
    const sendVerificationCode = () => {
      if (!forgotForm.email) {
        message.error('请输入邮箱')
        return
      }
      
      // 模拟发送验证码
      message.success(`验证码已发送至 ${forgotForm.email}`)
      
      // 开始倒计时
      countdown.value = 60
      startCountdown()
    }
    
    // 开始倒计时
    const startCountdown = () => {
      if (timer.value) clearInterval(timer.value)
      
      timer.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(timer.value)
        }
      }, 1000)
    }
    
    // 处理重置密码
    const handleResetPassword = async () => {
      if (!forgotFormRef.value) return
      
      try {
        await forgotFormRef.value.validate()
        isLoading.value = true
        
        // 模拟重置密码请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        message.success('密码重置成功，请使用新密码登录')
        showForgotModal.value = false
        showLoginModal.value = true
        
        // 重置表单
        forgotForm.email = ''
        forgotForm.verificationCode = ''
        forgotForm.newPassword = ''
        forgotForm.confirmNewPassword = ''
      } catch (error) {
        console.error('重置密码失败:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    // 退出登录
    const logout = () => {
      isAuthenticated.value = false
      username.value = ''
      userAvatar.value = ''
      message.success('已退出登录')
    }
    
    // 清理定时器
    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })
    
    return {
      showLoginModal,
      showForgotModal,
      activeTab,
      isLoading,
      isAuthenticated,
      username,
      userAvatar,
      loginFormRef,
      registerFormRef,
      forgotFormRef,
      loginForm,
      loginRules,
      registerForm,
      registerRules,
      forgotForm,
      forgotRules,
      countdown,
      rememberMe: ref(false),
      handleLogin,
      handleRegister,
      sendVerificationCode,
      handleResetPassword,
      logout
    }
  }
}
</script>

<template>
  <div class="auth-modal-container">
    <!-- 登录按钮 -->
    <n-button type="primary" @click="showLoginModal = true" v-if="!isAuthenticated">
      登录 / 注册
    </n-button>
    
    <!-- 用户信息 -->
    <div v-else class="user-info">
      <n-avatar round :src="userAvatar" :size="40" />
      <span class="ml-2">{{ username }}</span>
      <n-button text @click="logout" class="ml-2">退出</n-button>
    </div>

    <!-- 登录弹窗 -->
    <n-modal
      v-model:show="showLoginModal"
      preset="card"
      title="登录"
      size="small"
      :bordered="false"
      class="auth-modal"
    >
      <div class="auth-tabs">
        <n-tabs v-model:value="activeTab" type="line">
          <n-tab name="login" tab="登录" />
          <n-tab name="register" tab="注册" />
        </n-tabs>
      </div>

      <!-- 登录表单 -->
      <n-form v-if="activeTab === 'login'" ref="loginFormRef" :model="loginForm" :rules="loginRules" label-placement="top">
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="loginForm.username"
            placeholder="请输入用户名"
            :input-props="{ autocomplete: 'username' }"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="mousedown"
            :input-props="{ autocomplete: 'current-password' }"
          />
        </n-form-item>
        <div class="flex justify-between items-center">
          <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
          <n-button text @click="showLoginModal = false; showForgotModal = true">忘记密码？</n-button>
        </div>
        <div class="mt-4">
          <n-button type="primary" block @click="handleLogin" :loading="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </n-button>
        </div>
      </n-form>

      <!-- 注册表单 -->
      <n-form v-else ref="registerFormRef" :model="registerForm" :rules="registerRules" label-placement="top">
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="registerForm.username"
            placeholder="请输入用户名"
            :input-props="{ autocomplete: 'username' }"
          />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input
            v-model:value="registerForm.email"
            type="email"
            placeholder="请输入邮箱"
            :input-props="{ autocomplete: 'email' }"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="registerForm.password"
            type="password"
            placeholder="请设置密码"
            show-password-on="mousedown"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password-on="mousedown"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </n-form-item>
        <div class="mt-4">
          <n-button type="primary" block @click="handleRegister" :loading="isLoading">
            {{ isLoading ? '注册中...' : '注册' }}
          </n-button>
        </div>
      </n-form>
    </n-modal>

    <!-- 忘记密码弹窗 -->
    <n-modal
      v-model:show="showForgotModal"
      preset="card"
      title="找回密码"
      size="small"
      :bordered="false"
      class="auth-modal"
    >
      <n-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" label-placement="top">
        <n-form-item label="邮箱" path="email">
          <n-input
            v-model:value="forgotForm.email"
            type="email"
            placeholder="请输入注册邮箱"
            :input-props="{ autocomplete: 'email' }"
          />
        </n-form-item>
        <n-form-item label="验证码" path="verificationCode">
          <div class="flex gap-2">
            <n-input
              v-model:value="forgotForm.verificationCode"
              placeholder="请输入验证码"
              class="flex-1"
            />
            <n-button
              type="info"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
            </n-button>
          </div>
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input
            v-model:value="forgotForm.newPassword"
            type="password"
            placeholder="请设置新密码"
            show-password-on="mousedown"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </n-form-item>
        <n-form-item label="确认新密码" path="confirmNewPassword">
          <n-input
            v-model:value="forgotForm.confirmNewPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password-on="mousedown"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </n-form-item>
        <div class="mt-4">
          <n-button type="primary" block @click="handleResetPassword" :loading="isLoading">
            {{ isLoading ? '重置中...' : '重置密码' }}
          </n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<style scoped>
.auth-modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  color: white;
}

.auth-modal :deep(.n-modal-card) {
  background-color: #1e1f21;
  border: 1px solid #33353a;
}

.auth-modal :deep(.n-tabs-tab) {
  color: #999;
}

.auth-modal :deep(.n-tabs-tab.n-tabs-tab--active) {
  color: #00ffd9;
}

.auth-modal :deep(.n-tabs-rail) {
  background-color: #33353a;
}

.auth-modal :deep(.n-tabs-indicator) {
  background-color: #00ffd9;
}

.auth-modal :deep(.n-input__border) {
  background-color: #2a2c2e;
  border-color: #33353a;
}

.auth-modal :deep(.n-input__border:hover) {
  border-color: #44464a;
}

.auth-modal :deep(.n-input__border:focus-within) {
  border-color: #00ffd9;
}

.auth-modal :deep(.n-input__input) {
  color: white;
}

.auth-modal :deep(.n-button--primary) {
  background-color: #00ffd9;
  color: #151617;
}

.auth-modal :deep(.n-button--primary:hover) {
  background-color: #00e6c5;
}

.auth-modal :deep(.n-button--info) {
  background-color: #75cfff;
  color: #151617;
}

.auth-modal :deep(.n-button--info:hover) {
  background-color: #5cb8ff;
}

.auth-modal :deep(.n-form-item-label) {
  color: #ccc;
}

.auth-modal :deep(.n-checkbox-label) {
  color: #ccc;
}

.auth-modal :deep(.n-checkbox-box) {
  border-color: #33353a;
}

.auth-modal :deep(.n-checkbox-box:hover) {
  border-color: #44464a;
}

.auth-modal :deep(.n-checkbox-box.n-checkbox-box--checked) {
  background-color: #00ffd9;
  border-color: #00ffd9;
}

.auth-modal :deep(.n-checkbox-icon) {
  color: #151617;
}
</style>