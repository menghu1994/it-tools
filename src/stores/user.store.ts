import { defineStore } from 'pinia';

interface IUser {
  _id: string;
  name: string;
  nickname?: string;
  username?: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | IUser,
  }),
  actions: {
    setUser(user: IUser) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});
