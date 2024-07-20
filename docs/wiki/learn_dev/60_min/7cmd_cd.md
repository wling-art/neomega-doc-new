# Step 7. 添加第二个终端菜单

有了上述的知识之后，添加一个解封的终端菜单显然不是一件难事。

让我们添加这一段代码：

```lua
if coromega.config.Version == "0.0.4" then
    coromega.config["解封触发词"] = { "unban", "玩家解封", "解封玩家" }
    coromega.config.Version = "0.0.5"
    coromega:update_config(coromega.config)
end
local unban_triggers = coromega.config["解封触发词"]
coromega:when_called_by_terminal_menu({
    triggers = unban_triggers,
    argument_hint = "[玩家名]",
    usage = "从终端解封玩家",
}):start_new(function(input)
    local player_name = input[1]
    while not player_name or player_name == "" do
        player_name = coromega:input("请输入要解封的玩家名: ")
        if not player_name or player_name == "" then
            coromega:print("玩家名不能为空")
        end
    end
    local ban_info = player_banned_db:get(player_name)
    if not ban_info then
        coromega:print(("玩家 %s 目前并未被封禁"):format(player_name))
    else
        coromega:log(("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(player_name,
            unix_time_to_date_time_str(ban_info.ban_until),
            ban_info.ban_reason))
        player_banned_db:delete(player_name)
    end
end)
```

好的，输入 `reload` 让修改立刻生效。

> 如果你感到困难，你应该回头看看之前的步骤。