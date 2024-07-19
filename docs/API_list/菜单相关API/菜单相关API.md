# 菜单相关 API

## 设置后台 (终端) 菜单

### `when_called_by_terminal_menu(options)`

- **范围**: 协程外
- **说明**: 在后台 (终端) 中添加一个菜单入口，当菜单被触发时，启动一个新的协程并运行指定处理函数
- **参数**:
  - `options`(table): 配置选项，其结构为：
    - `triggers` (table): 触发词字符串列表，当输入符合其中任意一个时，菜单被触发，在后台输入 `?` 时显示第一个字符串
    - `argument_hint` (string): 参数提示字符串，无实际影响，只在渲染中起提示作用
    - `usage` (string): 功能提示字符串，无实际影响，只在渲染中起提示作用
- **返回值**: 监听器，监听器的处理函数的参数为被切割 (按空格切割) 后且去除触发词的输入

```lua
coromega:when_called_by_terminal_menu({
    triggers = { "coro", "coro_cmd", "coro_term_cmd" },
    argument_hint = "[cmd]",
    usage = "coro_test",
}):start_new(function(input)
    local cmd = table.concat(input, " ")
    if cmd == "" then
        cmd = coromega:backend_input("please input cmd: ")
    end
    coromega:log(("cmd: %s"):format(cmd))
    local result = coromega:send_ws_cmd(cmd, true)
    coromega:log(("cmd result: %s"):format(json.encode(result)))
end)
```

## 设置游戏菜单

### `when_called_by_game_menu(options)`

- **范围**: 协程外
- **说明**: 在游戏中 neomega 菜单中添加一个菜单入口，当菜单被触发时，启动一个新的协程并运行指定处理函数
- **参数**:
  - `options`(table): 配置选项，其结构为：
    - `triggers` (table): 触发词字符串列表，当输入符合其中任意一个时，菜单被触发，当唤起游戏菜单时显示第一个字符串
    - `argument_hint` (string): 参数提示字符串，无实际影响，只在渲染中起提示作用
    - `usage` (string): 功能提示字符串，无实际影响，只在渲染中起提示作用
- **返回值**: 监听器，监听器的处理函数的参数为 chat 对象

```lua
coromega:when_called_by_game_menu({
    triggers = { "coro", "coro_cmd", "coro_game_cmd" },
    argument_hint = "[cmd]",
    usage = "coro_test",
}):start_new(function(chat)
    local cmd = table.concat(chat.msg, " ")
    print(json.encode(chat))
    local player = coromega:get_player(chat.name)
    while (cmd == "") do
        local chat = player:ask("请输入命令：")
        cmd = chat.raw_msg
        if cmd == "" then
            player:say("命令不能为空")
        end
    end
    coromega:log(("cmd: %s"):format(cmd))
    local result = coromega:send_ws_cmd(cmd, true)
    player:say(("cmd result: %s"):format(json.encode(result)))
end)
```

## 综合使用示例

```lua
local omega = require("omega")
local json = require("json")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:when_called_by_terminal_menu({
    triggers = { "coro","命令", "coro_cmd", "coro_term_cmd" },
    argument_hint = "[cmd]",
    usage = "发送命令",
}):start_new(function(input)
    local cmd = table.concat(input, " ")
    if cmd == "" then
        cmd = coromega:backend_input("please input cmd: ")
    end
    coromega:log(("cmd: %s"):format(cmd))
    local result = coromega:send_ws_cmd(cmd, true)
    coromega:log(("cmd result: %s"):format(json.encode(result)))
end)

coromega:when_called_by_game_menu({
    triggers = { "coro","命令", "coro_cmd", "coro_game_cmd" },
    argument_hint = "[cmd]",
    usage = "发送命令",
}):start_new(function(chat)
    local cmd = table.concat(chat.msg, " ")
    print(json.encode(chat))
    local player = coromega:get_player(chat.name)
    while (cmd == "") do
        local chat = player:ask("请输入命令: ")
        cmd = chat.raw_msg
        if cmd == "" then
            player:say("命令不能为空")
        end
    end
    coromega:log(("cmd: %s"):format(cmd))
    local result = coromega:send_ws_cmd(cmd, true)
    player:say(("cmd result: %s"):format(json.encode(result)))
end)

coromega:run()
```
