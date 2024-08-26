// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";

import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client";

import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css";

import type { Options } from "@nolebase/vitepress-plugin-enhanced-readabilities/client";
import { InjectionKey } from "@nolebase/vitepress-plugin-enhanced-readabilities/client";

import { NolebaseInlineLinkPreviewPlugin } from "@nolebase/vitepress-plugin-inline-link-preview/client";

import "@nolebase/vitepress-plugin-inline-link-preview/client/style.css";

import { NolebaseHighlightTargetedHeading } from "@nolebase/vitepress-plugin-highlight-targeted-heading/client";

import "@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css";

import vitepressNprogress from "vitepress-plugin-nprogress";
import "vitepress-plugin-nprogress/lib/css/index.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 为较宽的屏幕的导航栏添加阅读增强菜单
      "nav-bar-content-after": () => h(NolebaseEnhancedReadabilitiesMenu),
      // 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
      "nav-screen-content-after": () =>
        h(NolebaseEnhancedReadabilitiesScreenMenu),
      "layout-top": () => h(NolebaseHighlightTargetedHeading),
    });
  },
  enhanceApp: (ctx) => {
    vitepressNprogress(ctx);

    ctx.app.use(NolebaseInlineLinkPreviewPlugin);
    ctx.app.provide(InjectionKey, {
      layoutSwitch: {
        defaultMode: 1,
      },
      spotlight: {
        defaultToggle: true,
      },
    } as Options);
  },
} satisfies Theme;
