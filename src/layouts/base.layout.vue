<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { Heart, Home2, Menu2 } from '@vicons/tabler';

import { storeToRefs } from 'pinia';
import HeroGradient from '../assets/hero-gradient.svg?component';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/config';
import type { ToolCategory } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import { useTracker } from '@/modules/tracker/tracker.services';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
const version = config.app.version;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const { tracker } = useTracker();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);


const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0 ? [{ name: '我的收藏', components: favoriteTools.value }] : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <MenuLayout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <div class="sider-wrapper">
        <RouterLink to="/" class="hero-wrapper">
          <HeroGradient class="gradient" />
          <div class="text-wrapper">
            <div class="title">
              IT - TOOLS
            </div>
            <div class="divider" />
            <!-- <div class="subtitle">
             助力开发人员和 IT 工作者
          </div>-->
          </div>
        </RouterLink>

        <div class="sider-content">
          <div v-if="styleStore.isSmallScreen" flex flex-col items-center>

            <div flex justify-center>
              <NavbarButtons />
            </div>
          </div>

          <CollapsibleToolMenu :tools-by-category="tools" />

        </div>
        <div class="footer">
          <div>
            Tools

            v{{ version }}

<!--            <template v-if="commitSha && commitSha.length > 0">-->
<!--              - -->
<!--              <c-link target="_blank" rel="noopener" type="primary"-->
<!--                :href="`https://github.com/CorentinTh/it-tools/tree/${commitSha}`">-->
<!--                {{ commitSha }}-->
<!--              </c-link>-->
<!--            </template>-->
          </div>
          <!-- <div>
            © {{ new Date().getFullYear() }}
            <c-link target="_blank" rel="noopener" href="#">
              Corentin Thomasset
            </c-link>
          </div> -->
        </div>
      </div>
    </template>

    <template #content>
      <div flex items-center justify-center gap-2>
        <c-button circle variant="text" aria-label="切换菜单"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed">
          <NIcon size="25" :component="Menu2" />
        </c-button>

        <c-tooltip tooltip="主页" position="bottom">
          <c-button to="/" circle variant="text" aria-label="主页">
            <NIcon size="25" :component="Home2" />
          </c-button>
        </c-tooltip>

        <c-tooltip tooltip="UI 库" position="bottom">
          <c-button v-if="config.app.env === 'development'" to="/c-lib" circle variant="text"
            aria-label="UI 库">
            <icon-mdi:brush-variant text-20px />
          </c-button>
        </c-tooltip>

        <command-palette />

        <div>
          <NavbarButtons v-if="!styleStore.isSmallScreen" />
        </div>

      </div>
<!--      <comment></comment>-->
      <slot />
    </template>
  </MenuLayout>
</template>

<style lang="less" scoped>
.support-button {
  background: rgb(37, 99, 108);
  background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.sider-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .footer {
    text-align: center;
    color: #838587;
    margin-top: auto;
    padding: 20px 0;
  }

  .sider-content {
    padding-top: 160px;
    padding-bottom: 20px;
  }
}

.hero-wrapper {
  position: absolute;
  display: block;
  left: 0;
  width: 100%;
  z-index: 10;
  overflow: hidden;

  .gradient {
    margin-top: -100px;
  }

  .text-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    top: 16px;
    color: #fff;

    .title {
      font-size: 25px;
      font-weight: 600;
    }

    .divider {
      width: 50px;
      height: 2px;
      border-radius: 4px;
      background-color: v-bind('themeVars.primaryColor');
      margin: 0 auto 5px;
    }

    .subtitle {
      font-size: 16px;
    }
  }
}
</style>
