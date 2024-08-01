# Step 3. 处理参数并计算封禁信息

好的，既然已经知道了要封禁的时间，也知道了要封禁谁，那么让我们开始封禁吧！让我们发出一条 kick 命令，把这个玩家踢出去：

```lua
coromega:log_and_print(("封禁玩家 %s %s, 原因: %s"):format(player_name, ban_time, ban_reason))
coromega:send_ws_cmd(("kick %s %s"):format(player_name,ban_reason),false)
```

等一下！是不是哪边好像不太对？这只是把那个玩家踢出去了而已，那他要是再进来该怎么办？

很简单啊，把那个玩家再踢出去不就得了？

那他要是隔一天，隔一个星期，隔一年再进来，还要踢吗？

那你肯定要问了，我们刚刚不是已经获得 **ban_time** 这个参数了吗？照着 **ban_time** 封不就得了？

是的，确实获得了 **ban_time** 这个参数，但是 **ban_time** 究竟是什么？

"35000", "1 天 3 小时", "3d 6h 19min" 还还是别的什么？显然无论它是什么，它都没有指明到什么时候为止封禁才算结束。

因此我们需要定义一个函数，完成 **ban_time** 到具体封禁结束时间的转换：

```lua
local take_num_from_string = function(str, unit_names)
    -- convert "1d2h3m4s" -> 2 by take_num_from_string("1d2h3m4s",{ "h", "H", "小时", "时"})
    for _, unit_name in pairs(unit_names) do
        local num = str:match("(%d+)" .. unit_name)
        if num then
            return tonumber(num)
        end
    end
    return 0
end

local function ban_time_to_ban_until_time(ban_time)
    -- time string can be a single number, or a string like "1d2h3m4s", or chinese like "1 天 2 小时 3 分钟 4 秒"
    local time_seconds = 0
    -- try to parse as a single number
    local time_num = tonumber(ban_time)
    if time_num then
        time_seconds = time_num
    else
        time_seconds = time_seconds + take_num_from_string(ban_time, { "d", "D", "天" }) * 86400
        time_seconds = time_seconds + take_num_from_string(ban_time, { "h", "H", "小时", "时" }) * 3600
        time_seconds = time_seconds + take_num_from_string(ban_time, { "m", "M", "分钟", "分" }) * 60
        time_seconds = time_seconds + take_num_from_string(ban_time, { "s", "S", "秒" })
    end
    if time_seconds > 0 then
        return coromega:now()+time_seconds
    end
    return nil
end
```

当参数 **ban_time** 为一个有效的时间时，函数 **ban_time_to_ban_until_time** 的返回为一个时间戳。

如果是一个无效的时间，那么返回为 nil。

:::tip
nil 是 Lua 中的一个特殊值，表示没有值。
:::

接着，让我们调用这个函数完成封禁时间到封禁截止时间的转换：

```lua
coromega:when_called_by_terminal_menu({
    triggers = { "ban", "封禁", "玩家封禁" },
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
}):start_new(function(input)
    local player_name = input[1]
    local ban_until = ban_time_to_ban_until_time(input[2])
    local ban_reason = input[3]
    while not player_name or player_name == "" do
        player_name = coromega:input("请输入要封禁的玩家名：")
        if not player_name or player_name == "" then
            coromega:print("玩家名不能为空")
        end
    end
    while not ban_until do
        ban_until = ban_time_to_ban_until_time(coromega:input("请输入要封禁的时间: "))
        if not ban_until then
            coromega:print("封禁时间不能为空")
        end
    end
    if not ban_reason or ban_reason == "" then
        ban_reason = coromega:input("请输入封禁原因：")
        if not ban_reason or ban_reason == "" then
            coromega:print("将封禁原因设置为：未设定")
            ban_reason = "未设定"
        end
    end
    coromega:log_and_print(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name,  os.date("%Y-%m-%d %H:%M:%S", ban_until), ban_reason))
    coromega:send_ws_cmd(("kick %s %s"):format(player_name,ban_reason))
end)
```

好的，现在输入 `reload` 使修改立刻生效

让我们尝试一下：

```text
> ban
> 请输入要封禁的玩家名：2401PT
> 请输入要封禁的时间: 3天2小时
> 请输入封禁原因：测试
16:57:10 [玩家封禁] 封禁玩家：2401PT 到 2023-09-06 18:57:08, 原因：测试
```

看起来已经顺利工作了