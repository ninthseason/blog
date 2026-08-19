import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "katex/dist/katex.min.css";
import TwoColumnList from "./components/TwoColumnList.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("TwoColumnList", TwoColumnList);
  },
} satisfies Theme;
