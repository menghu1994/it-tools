import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginModalStore = defineStore('loginModal', () => {
  const show = ref(false)
  let _resolver: ((value: boolean) => void) | null = null

  function open(): Promise<boolean> {
    show.value = true
    return new Promise((resolve) => {
      _resolver = resolve
    })
  }
  function close() {
    show.value = false
    _resolver?.(false)   // 用户主动关闭弹窗
    _resolver = null
  }

  function successLogin() {
    show.value = false
    _resolver?.(true)   // 登录成功
    _resolver = null
  }

  return { show, open, close, successLogin }
})
