# Step 1. 创建插件

NeOmega 里自带了插件创建工具，当您在终端输入 `?` 时，可以看到弹出的菜单中存在选项：

- **create [plugin_name] [describe]: 创建新插件**

在终端中输入 `create`，当询问插件名时，输入 `玩家封禁`，当询问插件描述的时候，输入 **从终端、游戏菜单、或通过 QQ 封禁、解封玩家**

此时，终端的显示应该类似于：

```bash
开始创建插件 玩家封禁:
        代码文件位于：<路径>/neomega_storage/lang/LuaLoader/玩家封禁.lua
        配置文件夹位于：<路径>/neomega_storage/config/玩家封禁[lua]
插件 玩家封禁 创建成功，输入 reload 使之生效生效
```

:::warning
如果你的终端报错了，请按终端提示排除错误
:::
现在，输入 `reload` 插件将立刻生效，此时输入 `?` 菜单中应该出现

- **玩家封禁 [arg1] [arg2] ...: 从终端、游戏菜单、或通过 QQ 封禁、解封玩家**

如果在终端中输入 `玩家封禁` 可以看到显示 `hello from 玩家封禁!` 恭喜，插件已经创建成功了。

现在，打开 `<路径>/neomega_storage/lang/LuaLoader/玩家封禁.lua`<br>
您应该能看到自动生成的初始代码，它看起来应该像这样：

```lua
local omega = require("omega")
local json = require("json")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:print("config of 玩家封禁：", json.encode(coromega.config))

coromega:when_called_by_terminal_menu({
    triggers = { "玩家封禁" },
    argument_hint = "[arg1] [arg2] ...",
    usage = "从终端、游戏菜单、或通过 QQ 封禁、解封玩家",
}):start_new(function(input)
    coromega:print("hello from 玩家封禁!")
end)

coromega:run()
```
