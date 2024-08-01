# Step 2. 处理和获取终端输入

现在，让我们审视一下自动生成的代码，很显然，这一段：

```lua
coromega:when_called_by_terminal_menu({
    triggers = { "玩家封禁" },
    argument_hint = "[arg1] [arg2] ...",
    usage = "从终端封禁玩家",
})
```

描述了一个终端菜单项，所谓终端菜单项就是输入 `?` 唤出的菜单的每一项一项

其中 **triggers** 为触发词，一个终端菜单可以具有多个不同的触发词，满足任意一个都可触发菜单。<br>
虽然 **argument_hint** 和 **usage** 并无实际作用，但可以提示如何使用这个菜单项。<br>

现在，我们将这部分修改如下：

```lua
coromega:when_called_by_terminal_menu({
    triggers = { "ban","封禁","玩家封禁" },
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
})
```

输入 reload, 让修改立即生效，此时，再次输入 `?` 可以发现，菜单项变成了

- **ban (封禁，玩家封禁) [玩家名] [时间] [原因]: 从终端封禁玩家**

同时，当输入 ban 或 封禁 时，菜单项也可被激活

现在，让我们从输入中读取 玩家名、时间、原因 这三个要素，将代码扩充为：

```lua
coromega:when_called_by_terminal_menu({
    triggers = { "ban", "封禁", "玩家封禁" },
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
}):start_new(function(input)
    local player_name=input[1]
    local ban_time=input[2]
    local ban_reason=input[3]
    coromega:log_and_print(("封禁玩家 %s %s, 原因: %s"):format(player_name,ban_time,ban_reason))
end)
```

然后，输入 `reload`, 使修改立即生效

此时，输入 `ban 2401PT 1 天 测试`可以发现，插件正确的获得并显示了我们的指令，并在日志中记录了该操作：

- **21:10:122 [玩家封禁]封禁玩家 2401PT 1 天，原因：测试**

但是如果有一个不开眼的用户只输入了 `ban` 但没有按提示输入 `[玩家名] [时间] [原因]` 这样就会出现：

- **21:11:55 [玩家封禁]封禁玩家 nil nil, 原因：nill**

很显然，如果用户只输入了 `ban` 那我们可以进一步通过 **交互式** 的方式询问用户要封禁谁？封禁多久？原因是什么？

而不是简单的报一个错完事，因为每个人每天都有很多事要做，记住每一条指令应该长啥样太苛刻了。

> 符合直觉的使用方式，并获得符合直觉的结果<br>

这是 NeOmega 的一个重要的设计准则。

回到这里，在用户没有输入必要的信息时，我们要向用户询问缺少的信息，现在，将代码扩充为：

```lua
coromega:when_called_by_terminal_menu({
    triggers = { "ban", "封禁", "玩家封禁" },
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
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
    if not ban_reason or ban_reason == "" then
        ban_reason = coromega:input("请输入封禁原因：")
        if not ban_reason or ban_reason == "" then
            coromega:print("将封禁原因设置为：未设定")
            ban_reason = "未设定"
        end
    end
    coromega:log_and_print(("封禁玩家 %s %s, 原因: %s"):format(player_name, ban_time, ban_reason))
end)
```

然后，输入 `reload` 使修改立即生效<br>
看看现在试试输入 `ban` 是不是好使多了？?