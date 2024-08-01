# Step 14. 从命令块封禁玩家

用命令块调用机器人封禁玩家应该算是本教程中最简单的部分了。

准备两个命令块，名字填为 #ban (#最好不要丢)。

ban 命令块里面的内容填为 `tell @a[tag=omega_bot] 玩家名(例如 @p[tag=ban]) 时间(例如 1d) 原因(例如测试)`。

看起来像这样 `tell @a[tag=omega_bot] @p[tag=ban] 1d 测试`。

::: tip
需要注意的是，应该用 @p 而不是 @a，同时，如果用的是循环命令方块，频率不要太高，不然可能会卡 (40, 60, 80 等较为合适)。
:::

虽然因为机器人会把被封禁的玩家踢下线导致命令块无法用上述方式发送解封指令 (除非你把频率调得很高，但那样会卡)

但是如果你修改程序，使得机器人在玩家上线一会儿之后才踢人，那也是可以做的，只是没什么意义。

最后，如果命令块的内容类似于 `execute @e[type=snowball] ~ ~ ~ tell @a[tag=omega_bot] @p[r=3]`

那么应当监听物品名 (`coromega:when_receive_msg_from_sender_named`)

而不是命令方块名 (`coromega:when_receive_msg_from_command_block_named`)

因为 `execute` 改变了发送者。

好了，现在，在代码中为机器人自己添加 `omega_bot` 的 tag，并监听命令块的消息。

```lua
coromega:start_new(function()
    local result = coromega:send_ws_cmd("tag @s add omega_bot", true)
    -- coromega:print(json.encode(result)) 显示 tag add 指令结果, 注意, 如果是第二次add, 可能收到失败的回执
    coromega:print("已添加 omega_bot 的 tag")
end)

coromega:when_receive_msg_from_command_block_named("#ban"):start_new(function(chat)
    local input = chat.msg
    local player_name = input[1]
    local ban_until = ban_time_to_ban_until_time(input[2])
    local ban_reason = input[3]
    if not player_name or player_name == "" then
        coromega:print("玩家名不能为空")
    end
    if not ban_until then
        coromega:print("封禁时间不能为空")
    end
    if not ban_reason or ban_reason == "" then
        coromega:print("将封禁原因设置为：未设定")
        ban_reason = "未设定"
    end
    coromega:log_and_print(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name, unix_time_to_date_time_str(ban_until),
        ban_reason))
    player_banned_db:set(player_name, {
        ban_until = ban_until,
        ban_reason = ban_reason,
    })
    coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
end)
```

很显然，说命令块简单的原因是~~它没有询问参数这个步骤~~