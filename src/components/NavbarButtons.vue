<script setup lang="ts">
import { IconBrandGithub, IconBrandX, IconInfoCircle, IconMoon, IconSun } from '@tabler/icons-vue';
import { useStyleStore } from '@/stores/style.store';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import { onMounted } from 'vue';
import { authService } from '@/api/auth/auth.service';

const router = useRouter();
const userStore = useUserStore();
const { user } = toRefs(userStore);

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);

onMounted(() => {

})

const logout = async () => {
  user.value = null;
  await authService.logout();
  router.push('/login');
}
</script>

<template>
  <div flex items-center gap-1>
  <!-- <c-tooltip :tooltip="$t('home.nav.github')" position="bottom">
    <c-button
      circle
      variant="text"
      href="https://github.com/CorentinTh/it-tools"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="$t('home.nav.githubRepository')"
    >
      <n-icon size="25" :component="IconBrandGithub" />
    </c-button>
  </c-tooltip>

  <c-tooltip :tooltip="$t('home.nav.twitterX')" position="bottom">
    <c-button
      circle
      variant="text"
      href="https://x.com/ittoolsdottech"
      rel="noopener"
      target="_blank"
      :aria-label="$t('home.nav.twitterXAccount')"
    >
      <n-icon size="25" :component="IconBrandX" />
    </c-button>
  </c-tooltip> -->
    <c-tooltip :tooltip="$t('home.nav.about')" position="bottom">
      <c-button circle variant="text" to="/about" :aria-label="$t('home.nav.aboutLabel')">
        <n-icon size="25" :component="IconInfoCircle" />
      </c-button>
    </c-tooltip>
    <c-tooltip :tooltip="isDarkTheme ? $t('home.nav.lightMode') : $t('home.nav.darkMode')" position="bottom">
      <c-button circle variant="text" :aria-label="$t('home.nav.mode')" @click="() => styleStore.toggleDark()">
        <n-icon v-if="isDarkTheme" size="25" :component="IconSun" />
        <n-icon v-else size="25" :component="IconMoon" />
      </c-button>
    </c-tooltip>
    <n-popover placement="bottom" trigger="hover" v-if="user">
      <template #trigger >
        <n-badge value="0">
          <n-avatar round>{{user?.username}}</n-avatar>
        </n-badge>
      </template>
      <div>
        <div flex flex-col items-center justify-center>
          <span>{{user?.username}}</span>
        </div>
        <n-divider />
        <ul>
          <li class="cursor-pointer" @click="logout()">退出</li>
        </ul>
      </div>
    </n-popover>
    <div v-else>
      <router-link to="/login">登录</router-link>
    </div>
  </div>
</template>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}
ul,li {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
