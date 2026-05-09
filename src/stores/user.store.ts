import { defineStore } from 'pinia';
import { authService } from '@/api/auth/auth.service';
import { useStorage } from '@vueuse/core';
import type { Ref } from 'vue';

export interface IUser {
  _id: string;
  name: string;
  nickname?: string;
  username?: string;
  email?: string;
  avatar?: string;
  coinBalance?: number;
  roles?: any[];
  favoriteTools?: string[];
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
      const res = await authService.getAccount();
      this.user = res.data;
    }
  },
});
