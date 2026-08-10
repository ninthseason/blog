# Blog

一个由 Deno 管理、VitePress 构建的静态博客。

## 开发

```powershell
deno install
deno task dev
```

默认访问地址：<http://localhost:5173>

## 构建与预览

```powershell
deno task build
deno task preview
```

生产文件输出到 `docs/.vitepress/dist`。

