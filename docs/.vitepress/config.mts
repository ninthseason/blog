import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "我的博客",
  description: "使用 Deno 和 VitePress 构建的博客",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/posts/deno-vitepress-deployment" },
      { text: "指南", link: "/guide/getting-started" }
    ],
    sidebar: [
      {
        text: "文章",
        items: [
          {
            text: "使用 Deno 部署 VitePress",
            link: "/posts/deno-vitepress-deployment"
          }
        ]
      },
      {
        text: "开始",
        items: [
          { text: "快速开始", link: "/guide/getting-started" }
        ]
      }
    ],
    socialLinks: []
  }
});
