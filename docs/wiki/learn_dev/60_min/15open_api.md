# Step 15. 暴露 解封/封禁 API 以供其他组件调用

如果你以前开发过 dotcs 的组件，那么对这个功能应该还是挺熟悉的，也就是所谓的 "前置组件"。

但是和 dotcs 的前置组件不同的是，在这里，所有组件都是平行而不分前后，组件之间可以平行的相互调用。

好的，首先让我们在组件内插入 api 暴露相关代码，api 名建议使用类似 url 的 / 来表示不同的功能划分：

```lua
coromega:when_called_by_api_named("/player/ban"):start_new(function(args, set_result)
    local player_name = args.player_name
    local ban_until = ban_time_to_ban_until_time(args.ban_time)
    local ban_reason = args.ban_reason
    if not player_name or player_name == "" then
        set_result(json.encode({ ok = false, err = "玩家名不能为空" }))
        return
    end
    if not ban_until then
        set_result(json.encode({ ok = false, err = "封禁时间不能为空" }))
        return
    end
    if not ban_reason or ban_reason == "" then
        ban_reason = "未设定"
    end
    coromega:log(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name, unix_time_to_date_time_str(ban_until),
        ban_reason))
    player_banned_db:set(player_name, {
        ban_until = ban_until,
        ban_reason = ban_reason,
    })
    coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
    set_result(json.encode({
        ok = true,
        detail = ("封禁玩家：%s 到 %s, 原因：%s"):format(player_name, unix_time_to_date_time_str(ban_until),
            ban_reason)
    }))
end)

coromega:when_called_by_api_named("/player/unban"):start_new(function(args, set_result)
    local player_name = args.player_name
    if not player_name or player_name == "" then
        set_result(json.encode({ ok = false, err = "玩家名不能为空" }))
        return
    end
    local ban_info = player_banned_db:get(player_name)
    if not ban_info then
        set_result(json.encode({ ok = true, detail = ("玩家 %s 目前并未被封禁"):format(player_name) }))
    else
        coromega:log(("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(player_name,
            unix_time_to_date_time_str(ban_info.ban_until),
            ban_info.ban_reason))
        set_result(json.encode({
            ok = true,
            detail = ("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(player_name,
                unix_time_to_date_time_str(ban_info.ban_until),
                ban_info.ban_reason)
        }))
        player_banned_db:delete(player_name)
    end
end)
```

为了测试和调用这两个 api, 我们还需要另外创建一个组件，现在输入：

- create check_ban 测试玩家封禁

以创建新组件，然后在新组件内部调用刚刚的接口：

```lua
local omega = require("omega")
local json = require("json")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:print("config of check_ban:  ", json.encode(coromega.config))

coromega:when_called_by_terminal_menu({
    triggers = { "check_ban" },
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "测试玩家封禁",
}):start_new(function(input)
    local player_name = input[1]
    local ban_time = input[2]
    local ban_reason = input[3]
    while not player_name or player_name == "" do
        player_name = coromega:input("请输入要封禁的玩家名：")
        if not player_name or player_name == "" then
            coromega:print("玩家名不能为空")
        end
    end
    while not ban_time or ban_time == "" do
        ban_time = coromega:input("请输入要的时间: ")
        if not ban_time or ban_time == "" then
            coromega:print("封禁时间不能为空")
        end
    end

    -- 调用其他插件的接口
    local result = coromega:call_other_plugin_api("/player/ban",
        { player_name = player_name, ban_time = ban_time, ban_reason = ban_reason })
    if result.ok then
        coromega:log(("调用成功: %s"):format(result.detail))
    else
        coromega:log(("调用失败: %s"):format(result.err))
    end
end)

coromega:run()
```