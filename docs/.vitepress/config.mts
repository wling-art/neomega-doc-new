import { defineConfig } from "vitepress";
import { InlineLinkPreviewElementTransform } from "@nolebase/vitepress-plugin-inline-link-preview/markdown-it";
import pkg from "../../package.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: [
        "@nolebase/ui",
        "@nolebase/vitepress-plugin-enhanced-readabilities/client",
        "@nolebase/vitepress-plugin-inline-link-preview",
        "@nolebase/vitepress-plugin-highlight-targeted-heading",
      ],
    },
    ssr: {
      noExternal: [
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
        "@nolebase/ui",
        "@nolebase/vitepress-plugin-enhanced-readabilities",
        "@nolebase/vitepress-plugin-inline-link-preview",
        "@nolebase/vitepress-plugin-highlight-targeted-heading",
      ],
    },
  },
  lastUpdated: true,
  lang: "zh-CN",
  title: "NeOmega",
  description: "NeOmega 文档",
  ignoreDeadLinks: true,
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["script", { async: "", src: "/m.js" }],
    ["script", { async: "true", src: "/cursor.js" }],
  ],

  sitemap: {
    hostname: "https://neomega-wiki.tblstudio.cn",
  },
  themeConfig: {
    search: {
      provider: "local",
      options: {
        _render(src, env, md) {
          const html = md.render(src, env);
          if (env.frontmatter?.search === false) {
            return "";
          }
          return html;
        },
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    // logo: { src: "/logo.png", width: 23, height: 15 },
    editLink: {
      pattern:
        "https://github.com/wling-art/neomega-doc-new/tree/main/docs/:path",
    },
    nav: [
      { text: "主界面", link: "/" },
      { text: "百科", link: "/wiki/introl" },
      {
        text: "API 参考",
        link: "/API_list/introl",
      },
      {
        text: "关于",
        items: [{ text: "关于本 Wiki", link: "/about/intro" }],
      },
    ],

    sidebar: {
      "/wiki": [
        { text: "👋 欢迎来到 NeOmega Wiki", link: "/wiki/introl" },
        { text: "📘 项目介绍", link: "/wiki/jieshao" },
        { text: "🌹 FAQ", link: "/wiki/FAQ" },
        {
          text: "📖 使用教程",
          items: [
            {
              text: "🔨 下载，安装！",
              link: "/wiki/learn_use/install",
            },
            { text: "🛹 NeOmega 启动！", link: "/wiki/learn_use/use" },
          ],
        },
        {
          text: "✨ NeOmega 插件开发",
          items: [
            {
              text: "🔧 60 分钟闪电战",
              collapsed: true,
              items: [
                { text: "教程介绍", link: "/wiki/learn_dev/60_min/introl" },
                { text: "创建插件", link: "/wiki/learn_dev/60_min/1create" },
                {
                  text: "获取玩家输入",
                  link: "/wiki/learn_dev/60_min/2get_std",
                },
                {
                  text: "处理参数并计算封禁信息",
                  link: "/wiki/learn_dev/60_min/3solve_time_info",
                },
                {
                  text: "监听玩家在线状态变化",
                  link: "/wiki/learn_dev/60_min/4listen_change",
                },
                { text: "数据库", link: "/wiki/learn_dev/60_min/5db" },
                {
                  text: "配置文件优化",
                  link: "/wiki/learn_dev/60_min/6config_opz",
                },
                { text: "终端菜单", link: "/wiki/learn_dev/60_min/7cmd_cd" },
                { text: "游戏内菜单", link: "/wiki/learn_dev/60_min/8game_cd" },
                { text: "游戏控制", link: "/wiki/learn_dev/60_min/9game_ctrl" },
                { text: "X", link: "/wiki/learn_dev/60_min/10small_bb" },
                {
                  text: "第二个游戏存档",
                  link: "/wiki/learn_dev/60_min/11double_cd",
                },
                {
                  text: "优化玩家输入",
                  link: "/wiki/learn_dev/60_min/12opz_player_write",
                },
                { text: "检查", link: "/wiki/learn_dev/60_min/13checkpoint" },
                {
                  text: "使用游戏内命令快",
                  link: "/wiki/learn_dev/60_min/14use_cb",
                },
                { text: "开放 API", link: "/wiki/learn_dev/60_min/15open_api" },
                {
                  text: "QQ 操作",
                  link: "/wiki/learn_dev/60_min/16qq_ban_unban",
                },
                { text: "最后", link: "/wiki/learn_dev/60_min/last_say" },
              ],
            },
            {
              text: "📻 调试 Lua 代码",
              link: "/wiki/learn_dev/debuglua/debuglua",
            },
          ],
        },
      ],
      "/API_list": [
        {
          text: "📦 Coromega API 列表",
          link: "/API_list/introl",
          items: [
            {
              text: "命令收发",
              link: "/API_list/命令收发api/coromega_cmd",
            },
            {
              text: "机器人",
              link: "/API_list/机器人和服务器信息/coromega_botUq",
            },
            {
              text: "系统功能",
              link: "/API_list/system/coromega_system",
            },
            {
              text: "菜单",
              link: "/API_list/菜单相关API/菜单相关API",
            },
            {
              text: "数据包",
              link: "/API_list/数据包监听相关API/数据包监听相关API",
            },
            {
              text: "http",
              link: "/API_list/http相关/http",
            },
            {
              text: "存储",
              link: "/API_list/存储相关/coromega_storage",
            },
            {
              text: "cqhttp",
              link: "/API_list/cqhttp相关API/cqhttp相关API",
            },
            {
              text: "玩家与命令",
              link: "/API_list/玩家交互与命令方块API/cmd_player",
            },
            {
              text: "建造",
              link: "/API_list/方块和命令块放置相关/coromega_place_command_block",
            },

            {
              text: "Bot Action",
              link: "/API_list/botAction/botAction",
            },
            {
              text: "websocket",
              link: "/API_list/websocket/websocket",
            },
            {
              text: "跨插件通信",
              link: "/API_list/跨插件api调用/跨插件api调用",
            },
            {
              text: "导入器",
              link: "/API_list/导入器_strucure_canvas相关API/导入器_strucure_canvas相关API",
            },
            {
              text: "读取配置",
              link: "/API_list/配置读取和升级相关API/配置读取和升级",
            },
            {
              text: "保护代码在分发时的安全性",
              link: "/API_list/保护代码在分发时的安全性/保护代码在分发时的安全性",
            },
            {
              text: "密码 | 哈希 | base64",
              link: "/API_list/密码_哈希_base64/密码_哈希_base64",
            },
            {
              text: "软API",
              link: "/API_list/软API/软API",
            },
            {
              text: "其他",
              link: "/API_list/其他/common",
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/OmineDev/neomega-core" },
    ],
    externalLinkIcon: true, // 展示站外链接箭头 ↗
    footer: {
      message: `基于 GPL-3.0 license 许可发布 | 文档版本 ${pkg.version}`,
      copyright: `版权所有 © 2023-${new Date().getFullYear()} NeOmega`,
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
  markdown: {
    config(md) {
      // 其他 markdown-it 配置...
      md.use(InlineLinkPreviewElementTransform);
    },
    lineNumbers: true,
    image: {
      // 图片懒加载
      lazyLoading: true,
    },
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
});
