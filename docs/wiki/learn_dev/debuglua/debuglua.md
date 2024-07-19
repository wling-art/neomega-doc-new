# 使用 VS Code 调试 Neomega 的 Lua 插件代码

本教程分为三个部分：

- 关键步骤
- 完整步骤
- 视频演示（在群文件中）

::: warning
只需关注关键步骤，不必完全按照完整步骤进行。不过，如果您还未上手，可能需要完整步骤和视频演示的帮助。
:::

## 关键步骤

1. 安装 `EmmyLua` 插件。
2. 启动配置选择 `EmmyLua New Debug`。
3. 在 `EmmyLua New Debug` 生成的配置中，将 `"ideConnectDebugger": true` 改为 `"ideConnectDebugger": false`。
4. 在代码的最外层（目前不能插入在协程中）插入以下代码片段：

    ```lua
    local dbg = require('emmy_core')
    dbg.tcpConnect('localhost', 9966)
    print("waiting...")
    for i = 1, 1000 do
        -- 调试器需要一些时间来建立连接并交换所有信息
        -- 如果始终无法命中断点，可以尝试将 1000 改大
        print(".")
    end
    ```

5. 在 `print("end")` 行的左侧打上断点。
6. 每次重启调试时，先启动或重启 `EmmyLua New Debug`，然后再进行 `reload`。

## 完整步骤

1. 打开 VS Code 并打开一个空目录。
2. 安装 `EmmyLua` 插件。
3. 配置 `EmmyLua` 调试器的启动选项：
    - 在 VS Code 中按下 `Ctrl + Shift + P`（macOS 用户使用 `Command + Shift + P`）。
    - 输入 `Open 'launch.json'` 并选择。
    - 在新页面的右下角点击“添加配置”（Add Configuration）。
    - 选择 `EmmyLua New Debug`。
    - 在自动生成的配置中，将 `"ideConnectDebugger": true` 改为 `"ideConnectDebugger": false`。
    - 此时，VS Code 左侧边栏的“运行和调试”上方会显示 `EmmyLua New Debug` 项目。
4. 目录下应该出现一个 `.vscode` 文件夹，内含 `launch.json` 文件，内容如下：

    ```json
    {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "emmylua_new",
                "request": "launch",
                "name": "EmmyLua New Debug",
                "host": "localhost",
                "port": 9966,
                "ext": [
                    ".lua",
                    ".lua.txt",
                    ".lua.bytes"
                ],
                "ideConnectDebugger": false
            }
        ]
    }
    ```

    您也可以手动创建该文件夹和文件，并填入上述内容。

5. 下载和启动 `neomega`（请参考安装说明），最好在 VS Code 中操作（终端可以从 VS Code 的右上角打开，或按下 `Ctrl + J`）。
6. 创建一个用于调试的插件：
    - 正常启动 `neomega`。正常情况下，`.vscode` 和 `neomega_storage` 应该处于同一级目录。
    - 在终端中输入 `create` 并创建一个新插件（假设创建了一个叫 `test` 的插件）。
    - 保持 `neomega` 运行，并打开新插件（应位于 `neomega_storage/lang/LuaLoader/test.lua`）。
    - 解除该文件第 8-15 行的注释，并在第 15 行左侧打上一个断点。文件应如下所示：

    ```lua
    local omega = require("omega")
    local json = require("json")
    local coromega = require("coromega").from(omega)

    coromega:print("config of test:  ",json.encode(coromega.config))

    -- 如果需要调试请将下面一段解除注释，关于调试的方法请参考文档
    local dbg = require('emmy_core')
    dbg.tcpConnect('localhost', 9966)
    print("waiting...")
    for i = 1, 1000 do
        -- 调试器需要一些时间来建立连接并交换所有信息
        -- 如果始终无法命中断点，可以尝试将 1000 改大
        print(".")
    end
    print("end")

    coromega:when_called_by_terminal_menu({
        triggers = { "test" },
        argument_hint = "[arg1] [arg2] ...",
        usage = "test",
    }):start_new(function(input)
        coromega:print("hello from test!")
    end)

    coromega:run()
    ```

7. 在 VS Code 左侧边栏的“运行和调试”上方启动 `EmmyLua New Debug`，右下角会出现一个提示框，无需理会。
8. 在终端中输入 `reload`，稍等片刻。如果成功，调试器应该停在第 15 行。

## 修改插件代码并继续调试

1. 在插件中进行修改，记得按下 `Ctrl + S` 保存修改。
2. 根据情况选择以下操作之一：
    - 上一个调试还未结束（VS Code 顶部还有调试栏）：点击调试栏的重启按钮。
    - 上一个调试已结束或未开始调试：在 VS Code 左侧边栏的“运行和调试”上方启动 `EmmyLua New Debug`，右下角会出现提示框，无需理会。
3. 输入 `reload` 即可继续调试（注意 `reload` 应在调试器启动后进行）。

## 视频教程

请移步 QQ 群：769061008 查看群文件。