import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  compilerOptions: {
    types: ["element-plus/global"],// 告诉 TypeScript 编译器，element-plus 全局类型定义文件
  },
  base: "./",
  // 构建配置对象
  build: {
    // 输出目录
    outDir: "dist",
    // 静态资源目录
    assetsDir: "assets",
    // 构建前清空输出目录
    emptyOutDir: true,
    // Rollup 配置选项
    rollupOptions: {
      // 输入文件配置
      input: {
        // 主页面入口
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        // 应用入口
        app: fileURLToPath(new URL("./src/App.vue", import.meta.url)),
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 6155,
  },
});
