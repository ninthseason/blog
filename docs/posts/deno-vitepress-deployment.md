---
title: 使用 Deno 部署 VitePress：从空目录到可访问的博客
description: 记录在 Windows 上使用 Deno 安装、配置和构建 VitePress，以及解决 CLI 与 Vue 依赖解析问题的完整过程。
date: 2026-08-10
head:
  - - meta
    - name: keywords
      content: Deno,VitePress,Vue,Windows,静态博客
---

# 使用 Deno 部署 VitePress：从空目录到可访问的博客

> 这篇文章记录本站从一个空目录开始，使用 Deno 管理依赖和任务，最终完成 VitePress 生产构建的全过程。环境为 Windows、Deno 2.9.5、VitePress 1.6.4 和 Vue 3.5.41。

## 为什么选择 Deno + VitePress

VitePress 很适合用 Markdown 写博客和文档，而 Deno 自带依赖管理与任务运行能力，不需要另外安装 npm、pnpm 或 Yarn。最终仍然会得到一份普通的静态网站，可以部署到任意静态托管服务。

本次目标很明确：

- 项目放在 `C:\Users\ninth\Desktop\Blog`；
- 只使用 Deno 管理依赖和命令；
- 能启动开发服务器；
- 能生成生产环境静态文件；
- 能在本地通过 HTTP 正常访问构建结果。

## 一、确认开发环境

首先检查 Deno 是否已经安装：

```powershell
deno --version
```

本次使用的版本是：

```text
deno 2.9.5
v8 15.0.245.2-rusty
typescript 6.0.3
```

然后确认目标目录为空，避免覆盖已有项目文件。

## 二、创建项目结构

最终的主要目录如下：

```text
Blog/
├─ deno.json
├─ deno.lock
├─ README.md
└─ docs/
   ├─ .vitepress/
   │  └─ config.mts
   ├─ guide/
   │  └─ getting-started.md
   ├─ posts/
   │  └─ deno-vitepress-deployment.md
   └─ index.md
```

VitePress 把 `docs` 作为站点根目录，其中的 Markdown 文件会被转换成对应的 HTML 页面。配置文件位于 `docs/.vitepress/config.mts`。

## 三、配置 Deno

项目最终使用的 `deno.json` 如下：

```json
{
  "nodeModulesDir": "auto",
  "imports": {
    "vitepress": "npm:vitepress@^1.6.4",
    "vue": "npm:vue@^3.5.0"
  },
  "tasks": {
    "dev": "deno run -A npm:vitepress@1.6.4 dev docs",
    "build": "deno run -A npm:vitepress@1.6.4 build docs",
    "preview": "deno run -A npm:vitepress@1.6.4 preview docs"
  }
}
```

这里有两个关键点：

1. `nodeModulesDir: "auto"` 让 Deno 自动创建兼容 Node.js 工具链的依赖目录；
2. 任务通过 `deno run -A npm:vitepress@1.6.4` 显式运行 VitePress CLI，避免裸命令解析异常。

接着安装依赖：

```powershell
cd C:\Users\ninth\Desktop\Blog
deno install
```

Deno 会读取 `deno.json`，下载 npm 依赖并生成 `deno.lock`，用于锁定实际安装的版本。

## 四、配置 VitePress

在 `docs/.vitepress/config.mts` 中设置站点语言、标题、说明、导航栏和侧边栏：

```ts
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
    ]
  }
});
```

首页使用 VitePress 默认主题的 `home` 布局，并添加了站点介绍和文章入口。这样不需要编写 Vue 组件或 CSS，就能先得到一个简洁、响应式的首页。

## 五、启动与构建

开发时运行：

```powershell
deno task dev
```

默认可以通过 `http://localhost:5173` 访问，修改 Markdown 后页面会自动更新。

生成生产文件：

```powershell
deno task build
```

构建成功后，静态文件位于：

```text
docs/.vitepress/dist
```

本地预览生产构建：

```powershell
deno task preview
```

## 六、遇到的问题及解决方案

实际部署并不是一次成功，过程中遇到了两个依赖解析问题。

### 问题 1：VitePress 裸命令无法解析

最初的任务配置直接使用了 VitePress 命令：

```json
{
  "tasks": {
    "build": "vitepress build docs"
  }
}
```

运行 `deno task build` 时出现错误：

```text
TypeError: Could not find referrer npm package
.../vitepress/1.6.4/dist/node/cli.js
```

这说明当前 Deno 环境在解析 npm 包提供的 CLI 裸命令时没有正确找到包引用。

解决方法是显式告诉 Deno 从 npm 包运行 VitePress：

```json
{
  "tasks": {
    "build": "deno run -A npm:vitepress@1.6.4 build docs"
  }
}
```

`-A` 为 VitePress 构建过程授予所需的文件、环境和网络等权限。版本号被明确固定为 `1.6.4`，也避免任务命令与导入版本意外不一致。

### 问题 2：Rollup 找不到 `@vue/runtime-dom`

修复 CLI 后，VitePress 已经能够启动构建，但 Rollup 随后报错：

```text
Rollup failed to resolve import "@vue/runtime-dom"
from ".../vue/3.5.41/dist/vue.runtime.esm-bundler.js"
```

原因是 Vite、Rollup 和 Vue 的部分依赖解析逻辑仍然期待传统的 `node_modules` 目录布局，而 Deno 默认可以直接从自己的全局 npm 缓存加载包，两者的解析方式在这里没有完全对上。

在 `deno.json` 中加入下面的配置即可解决：

```json
{
  "nodeModulesDir": "auto"
}
```

再次执行：

```powershell
deno install
deno task build
```

这次 VitePress 成功完成了客户端、服务端 bundle 构建和页面渲染：

```text
✓ building client + server bundles...
✓ rendering pages...
build complete in 2.41s.
```

## 七、最终验证

构建成功并不一定代表页面能够正常提供服务，因此最后还启动了 VitePress 预览服务器，并请求首页进行冒烟测试。测试结果为：

```text
HTTP Status: 200
Content-Type: text/html; charset=utf-8
页面标题“我的博客”: 已找到
```

至此，开发、构建和生产预览三个环节都已验证通过。

## 总结

在 Deno 中运行 VitePress 的核心并不复杂，但 Node.js 生态工具的依赖解析仍可能需要兼容配置。本次能稳定工作的关键配置是：

```json
{
  "nodeModulesDir": "auto",
  "tasks": {
    "dev": "deno run -A npm:vitepress@1.6.4 dev docs",
    "build": "deno run -A npm:vitepress@1.6.4 build docs",
    "preview": "deno run -A npm:vitepress@1.6.4 preview docs"
  }
}
```

以后添加新文章，只需要在 `docs/posts` 中创建 Markdown 文件，再把它加入导航或侧边栏即可。Deno 负责依赖与任务，VitePress 负责把内容构建成静态页面，整个流程保持得相当轻量。
