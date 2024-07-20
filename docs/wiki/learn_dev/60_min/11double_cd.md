# Step 11. 第二个游戏内菜单

有了之前的经验，这一步应该会很容易，插入这段代码即可：

```lua
coromega:when_called_by_game_menu({
    triggers = unban_triggers,
    argument_hint = "[玩家名]",
    usage = "从游戏内解封玩家",
}):start_new(function(chat)
    local caller_name = chat.name
    local input = chat.msg
    print(("%s 在游戏内唤起了封禁功能，参数：%s"):format(caller_name, json.encode(input)))
    local caller = coromega:get_player_by_name(caller_name)
    local ban_player_name = input[1]
    while not ban_player_name or ban_player_name == "" do
        ban_player_name = caller:ask("请输入要解封的玩家名: ")
        if not ban_player_name or ban_player_name == "" then
            caller:say("玩家名不能为空")
        end
    end
    local ban_info = player_banned_db:get(ban_player_name)
    if not ban_info then
        caller:say(("玩家 %s 目前并未被封禁"):format(ban_player_name))
    else
        coromega:log(("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(ban_player_name,
            unix_time_to_date_time_str(ban_info.ban_until),
            ban_info.ban_reason))
        caller:say(("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(ban_player_name,
            unix_time_to_date_time_str(ban_info.ban_until),
            ban_info.ban_reason))
        player_banned_db:delete(ban_player_name)
    end
end)
```

让我们输入`reload` 然后再测试一下。

呐，很容易吧？？