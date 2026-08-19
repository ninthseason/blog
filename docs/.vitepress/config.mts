import { defineConfig } from "vitepress";
import { katex } from "@mdit/plugin-katex";

export default defineConfig({
  lang: "zh-CN",
  title: "Kl1nge5's Blog",
  description: "Kl1nge5's Blog",
  cleanUrls: true,
  markdown: {
    config(md) {
      md.use(katex);
    },
  },
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/posts/deno-vitepress-deployment" },

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
        text: "Book of Proof 习题答案",
        items: [
          {
            text: "es 1.1",
            link: "/book-of-proof/es1-1"
          },
          {
            text: "es 1.2",
            link: "/book-of-proof/es1-2"
          }
        ]
      }
    ],
    socialLinks: []
  }
});
