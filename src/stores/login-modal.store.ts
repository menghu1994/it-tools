import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginModalStore = defineStore('loginModal', () => {
  const show = ref(false)

  function open() {
    show.value = true
  }

  function close() {
    show.value = false
  }

  return { show, open, close }
})
