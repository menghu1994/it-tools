// vite.config.ts
import { URL, fileURLToPath } from "node:url";
import vue from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/@vitejs+plugin-vue@4.3.2_vite@4.4.9_@types+node@18.15.11_less@4.1.3_terser@5.37.0__vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.2_vite@4.4.9_@types+node@18.15.11_less@4.1.3_terser@5.37.0__vue@3.3.4/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Unocss from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/unocss@0.65.1_postcss@8.4.49_rollup@2.79.2_vite@4.4.9_@types+node@18.15.11_less@4.1.3_terser@5.37.0__vue@3.3.4/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/unplugin-auto-import@0.16.4_@vueuse+core@10.3.0_vue@3.3.4__rollup@2.79.2/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/unplugin-icons@0.17.0_@vue+compiler-sfc@3.2.47_vue-template-compiler@2.7.16/node_modules/unplugin-icons/dist/resolver.mjs";
import Icons from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/unplugin-icons@0.17.0_@vue+compiler-sfc@3.2.47_vue-template-compiler@2.7.16/node_modules/unplugin-icons/dist/vite.mjs";
import { NaiveUiResolver } from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/unplugin-vue-components@0.25.0_@babel+parser@7.26.3_rollup@2.79.2_vue@3.3.4/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import Components from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/unplugin-vue-components@0.25.0_@babel+parser@7.26.3_rollup@2.79.2_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import { defineConfig } from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/vite@4.4.9_@types+node@18.15.11_less@4.1.3_terser@5.37.0/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/vite-plugin-pwa@0.16.0_vite@4.4.9_@types+node@18.15.11_less@4.1.3_terser@5.37.0__workbox-buil_wmc6tzphtagfgenhvww4ekfqeu/node_modules/vite-plugin-pwa/dist/index.js";
import markdown from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/vite-plugin-vue-markdown@0.23.5_rollup@2.79.2_vite@4.4.9_@types+node@18.15.11_less@4.1.3_terser@5.37.0_/node_modules/vite-plugin-vue-markdown/dist/index.mjs";
import svgLoader from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/vite-svg-loader@4.0.0/node_modules/vite-svg-loader/index.js";
import { configDefaults } from "file:///E:/_Luffy/WorkSpace/it-tools/node_modules/.pnpm/vitest@0.34.0_jsdom@22.0.0_less@4.1.3_terser@5.37.0/node_modules/vitest/dist/config.js";
var __vite_injected_original_import_meta_url = "file:///E:/_Luffy/WorkSpace/it-tools/vite.config.ts";
var baseUrl = process.env.BASE_URL ?? "/";
var vite_config_default = defineConfig({
  plugins: [
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
        }
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true
      }
    }),
    Icons({ compiler: "vue3" }),
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    vueJsx(),
    markdown(),
    svgLoader(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      manifest: {
        name: "IT Tools",
        description: "Aggregated set of useful tools for developers.",
        display: "standalone",
        lang: "zh-CN",
        start_url: `${baseUrl}?utm_source=pwa&utm_medium=pwa`,
        orientation: "any",
        theme_color: "#18a058",
        background_color: "#f1f5f9",
        icons: [
          {
            src: "/favicon-16x16.png",
            type: "image/png",
            sizes: "16x16"
          },
          {
            src: "/favicon-32x32.png",
            type: "image/png",
            sizes: "32x32"
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    Components({
      dirs: ["src/"],
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: "icon" })]
    }),
    Unocss()
  ],
  base: baseUrl,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(process.env.npm_package_version)
  },
  test: {
    exclude: [...configDefaults.exclude, "**/*.e2e.spec.ts"]
  },
  build: {
    target: "esnext"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxfTHVmZnlcXFxcV29ya1NwYWNlXFxcXGl0LXRvb2xzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxfTHVmZnlcXFxcV29ya1NwYWNlXFxcXGl0LXRvb2xzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9fTHVmZnkvV29ya1NwYWNlL2l0LXRvb2xzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XHJcbmltcG9ydCB7IFVSTCwgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcclxuXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcclxuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSc7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcic7XHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcclxuaW1wb3J0IHsgTmFpdmVVaVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcclxuaW1wb3J0IG1hcmtkb3duIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1tYXJrZG93bic7XHJcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJztcclxuaW1wb3J0IHsgY29uZmlnRGVmYXVsdHMgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcclxuXHJcbmNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmVudi5CQVNFX1VSTCA/PyAnLyc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICduYWl2ZS11aSc6IFsndXNlRGlhbG9nJywgJ3VzZU1lc3NhZ2UnLCAndXNlTm90aWZpY2F0aW9uJywgJ3VzZUxvYWRpbmdCYXInXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICBJY29ucyh7IGNvbXBpbGVyOiAndnVlMycgfSksXHJcbiAgICB2dWUoe1xyXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXHJcbiAgICB9KSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgbWFya2Rvd24oKSxcclxuICAgIHN2Z0xvYWRlcigpLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICBzdHJhdGVnaWVzOiAnZ2VuZXJhdGVTVycsXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogJ0lUIFRvb2xzJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FnZ3JlZ2F0ZWQgc2V0IG9mIHVzZWZ1bCB0b29scyBmb3IgZGV2ZWxvcGVycy4nLFxyXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcclxuICAgICAgICBsYW5nOiAnemgtQ04nLFxyXG4gICAgICAgIHN0YXJ0X3VybDogYCR7YmFzZVVybH0/dXRtX3NvdXJjZT1wd2EmdXRtX21lZGl1bT1wd2FgLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAnYW55JyxcclxuICAgICAgICB0aGVtZV9jb2xvcjogJyMxOGEwNTgnLFxyXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZjFmNWY5JyxcclxuICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICcvZmF2aWNvbi0xNngxNi5wbmcnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICcxNngxNicsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICcvZmF2aWNvbi0zMngzMi5wbmcnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICczMngzMicsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICcvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJy9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIGRpcnM6IFsnc3JjLyddLFxyXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxyXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxyXG4gICAgICByZXNvbHZlcnM6IFtOYWl2ZVVpUmVzb2x2ZXIoKSwgSWNvbnNSZXNvbHZlcih7IHByZWZpeDogJ2ljb24nIH0pXSxcclxuICAgIH0pLFxyXG4gICAgVW5vY3NzKCksXHJcbiAgXSxcclxuICBiYXNlOiBiYXNlVXJsLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5QQUNLQUdFX1ZFUlNJT04nOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcclxuICB9LFxyXG4gIHRlc3Q6IHtcclxuICAgIGV4Y2x1ZGU6IFsuLi5jb25maWdEZWZhdWx0cy5leGNsdWRlLCAnKiovKi5lMmUuc3BlYy50cyddLFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLEtBQUsscUJBQXFCO0FBRW5DLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZC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
