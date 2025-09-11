import { defineStore } from 'pinia';
import { authService } from '@/api/auth/auth.service';
import { useStorage } from '@vueuse/core';
import type { Ref } from 'vue';

interface IUser {
  _id: string;
  name: string;
  nickname?: string;
  username?: string;
}

export const useUserStore = defineStore('user', {
  state: () => {
    const user = useStorage('user', null) as Ref<null | IUser>;
    return {
      user
    }
  },
  actions: {
    async fetchMe() {
      this.user = await authService.getAccount();
    }
  },
});
