# Step 9. 与玩家交互

首先，需要明确的一点是，如果你用命令的形式和玩家交互（比如 tellraw）之类的是没有一点问题的。

但是，你无法通过这个途径获得关于玩家的更多信息，比如他的 id、上线时间、权限等等信息。
::: tip
关于具体有哪些 API 和功能，你稍后可以自行查看玩家交互相关文档
:::
这里我们演示如何与玩家交流：

```lua
coromega:when_called_by_game_menu({
    triggers = triggers,
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从游戏内封禁玩家",
}):start_new(function(chat)
    -- 如果你希望，可以这样查看 chat 内包含的信息:
    print(json.encode(chat))
    local caller_name = chat.name
    local input = chat.msg
    print(("%s 在游戏内唤起了封禁功能，参数：%s"):format(caller_name, json.encode(input)))
    local caller = coromega:get_player_by_name(caller_name)
    if caller:is_op() then
        print("调用者是 OP")
    else
        -- 实际没必要，因为菜单已经做了权限控制，这里只是为了向你展示 coromega 的 player 对象可以做到命令做不到的事
        caller:say("抱歉，你不是 OP")
    end
    local ban_player_name = input[1]
    local ban_until = ban_time_to_ban_until_time(input[2])
    local ban_reason = input[3]
    while not ban_player_name or ban_player_name == "" do
        ban_player_name = caller:ask("请输入要封禁的玩家名：")
        if not ban_player_name or ban_player_name == "" then
            caller:say("玩家名不能为空")
        end
    end
    while not ban_until do
        ban_until = ban_time_to_ban_until_time(caller:ask("请输入要封禁的时间: "))
        if not ban_until then
            caller:say("封禁时间不能为空")
        end
    end
    if not ban_reason or ban_reason == "" then
        ban_reason = caller:ask("请输入封禁原因：")
        if not ban_reason or ban_reason == "" then
            caller:say("将封禁原因设置为：未设定")
            ban_reason = "未设定"
        end
    end
    coromega:log(("封禁玩家：%s 到 %s, 原因：%s"):format(ban_player_name, unix_time_to_date_time_str(ban_until),
        ban_reason))
    caller:say(("封禁玩家：%s 到 %s, 原因：%s"):format(ban_player_name, unix_time_to_date_time_str(ban_until),
        ban_reason))
    player_banned_db:set(ban_player_name, {
        ban_until = ban_until,
        ban_reason = ban_reason,
    })
    coromega:send_ws_cmd(("kick %s %s"):format(ban_player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
end)
```

现在，输入 `reload` 测试一下。

很方便也很直观，不是吗？

> NeOmega 和 CorOmega 在背后做了大量的工作，使得可以轻易的编写出符合直觉且功能强大的代码