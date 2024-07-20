# Step 4. 监听玩家在线状态变化

有心的人应该已经发现了，你这个玩家封禁有问题啊，你只是在输入 `ban` 指令的时候将玩家踢出去了一次，但是那个玩家要是再次上线你该怎么办捏？

当然，现在可以立刻求证一下是不是这么回事，那个被封禁的玩家，只要再上线，就可以逃过制裁。

那该怎么办捏？其实很简单，既然那个玩家重新上线可以逃过制裁，那再 kick 他一次不就完事了？

所以，我们现在需要让 NeOmega 在玩家在线状态发生变化的时候执行一段检查该玩家是否被封禁的代码：

```lua
coromega:when_player_change():start_new(function(player, action)
    -- if action == "exist" then
    --     coromega:log(("player %s 已经在线"):format(player:name()))
    -- elseif action == "online" then
    --     coromega:log(("player %s 新上线"):format(player:name()))
    -- elseif action == "offline" then
    --     coromega:log(("player %s 下线"):format(player:name()))
    -- end
    if action=="offline" then
        return
    end
    local player_name=player:name()
    -- coromega:log(("player %s 新上线"):format(player_name))
    local ban_info=player_banned[player_name]
    if ban_info then
        local ban_until = ban_info.ban_until
        local ban_reason=ban_info.ban_reason
        if ban_until>coromega:now() then
            coromega:send_ws_cmd(("kick %s %s"):format(player_name,ban_reason),false)
        else
            player_banned[player_name]=nil
        end
    end
end)
```

这段函数通过检查新上线的玩家名是否在 player_banned 中，如果在则进一步判断是否在指定的封禁时间内，并执行封禁和解封操作，而 player_banned 则是由终端设置的。

因此，我们需要定义 player_banned 并设置其值：

```lua
local player_banned={}
coromega:when_called_by_terminal_menu({
    triggers = { "ban", "封禁", "玩家封禁" },
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
}):start_new(function(input)

    ...

    coromega:log(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name,  os.date("%Y-%m-%d %H:%M:%S", ban_until), ban_reason))
    player_banned[player_name]={
        ban_until=ban_until,
        ban_reason=ban_reason,
    }
    coromega:send_ws_cmd(("kick %s %s"):format(player_name,ban_reason),false)
end)
```

好的，现在输入 `reload` 使修改立刻生效，这个时候，就算重新上线也会被立刻踢下线线