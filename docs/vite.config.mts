import { defineConfig } from "vite";

import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from "@nolebase/vitepress-plugin-git-changelog/vite";
import {
  PageProperties,
  PagePropertiesMarkdownSection,
} from "@nolebase/vitepress-plugin-page-properties/vite";
import { ThumbnailHashImages } from "@nolebase/vitepress-plugin-thumbnail-hash/vite";
import UnoCSS from "unocss/vite";

export default defineConfig(async () => {
  return {
    assetsInclude: ["**/*.mov"],
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: ["vitepress"],
    },
    plugins: [
      ThumbnailHashImages(),
      PageProperties(),
      PagePropertiesMarkdownSection(),
      GitChangelog({
        // 填写在此处填写您的仓库链接
        repoURL: () => "https://github.com/wling-art/neomega-doc-new",
      }),
      GitChangelogMarkdownSection(),
      UnoCSS(),
    ],
    ssr: {
      noExternal: [
        "@nolebase/ui",
        "@nolebase/vitepress-plugin-enhanced-readabilities",
        "@nolebase/vitepress-plugin-highlight-targeted-heading",
        "@nolebase/vitepress-plugin-inline-link-preview",
      ],
    },
  };
});
