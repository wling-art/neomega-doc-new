# 插件市场 PluginMarket Official

## 如何使用插件市场？

在最新版的 NeOmega 的控制台输入 `插件市场`或`plugin-market`, 然后按照提示操作即可

## 为什么选择插件市场？

- **共享** NeOmega 插件
- **便捷**的安装和使用
- 你可以在此**发布和分享**你所制作的 NeOmega 插件

::: info

- 上传到官方的插件市场都已经过审核，不会对用户的设备和私有信息造成损害。
- 对于非官方插件市场，我们无法保证所有插件的安全性，请自行检查部分插件有无恶意行为。

:::

## 上传的插件的规范格式和要求？

允许上传的文件类型：Python 脚本，文本文件 (包括 Markdown, TXT file 等)
插件需要放在 `plugin_market/your_plugin/` 目录下，主插件文件需要以 `__init__.py` 命名
合法的插件格式像这样：

```
plugin_market/
    your_plugin_name_format/
        __init__.py
        module1.py
        module2.py
```

为标明作者等信息，请在你的插件主类下重新定义一些标明插件信息的变量，例如：

```
@plugins.add_plugin
class NewPlugin(Plugin):
    name = "your_plugins_name"
    author = "your_name"
    version = (int, int, int) # e.g. (0, 0, 1)
```

上传之后，请务必同时更改 `plugin_market/market_tree.json` , 按照其格式添加上自己的插件信息，如下：
::: details `market_tree.json` 编写说明

这是一个标准的插件详情数据文件的例子

```json
    "聊天栏菜单": { // 插件的名字，创建插件文件夹的时候也将使用这个名字
        "author": "SuperScript", // 插件的作者
        "version": "0.0.4", // 插件的版本
        "description": "所有使用到聊天栏菜单的组件的前置组件", // 插件的简介 (功能摘要)
        "limit_launcher": null, // 限制插件只能在哪种启动器框架运行，通用即 null
        "pre-plugins": {}, // 前置插件的名称与最低需求版本的键值对，都为 string
        "plugin-type": "classic", // 插件的类别, 类式插件为 classic，注入式为 injected
        "plugin-id": "ChatbarMenu" // 插件ID，可以任意起不重复的名，但是之后都不能再改动，是插件唯一识别ID
    },
```

:::

上传内容若会对用户的设备造成损害，或会盗窃用户信息的插件，**将不予通过审核。**

## 如何上传你的插件？

在 `Pull Requests` 处提交请求即可
将插件文件夹以**正确的格式**上传到 `plugin_market/` 目录下
