# Step 8. 添加游戏内菜单

经过上面的一系列步骤，这个玩家封禁组件已经是一个可用的组件了。但是从这一步开始，coromega 真正的秘密才刚刚要被揭开。

首先，让我们添加一个游戏内菜单。可以注意到，游戏内菜单的添加方法和终端菜单非常接近。这样设计的目的是让人更容易上手。

不过略有不同的是，输入的参数不再只是 `input`，而是一个复杂的结构：`chat`。`chat` 中包含了比较多的信息，你可以使用 `json.encode(chat)` 来查看。

不过，我们主要关心的是两个属性：`chat.msg`（类似于 `input`）和 `chat.name`（发送消息的玩家名）

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
end)
```

在你输入 `reload` 并测试这个菜单项的时候，你应该发现了两个现象：

- 这个菜单项并没有出现在默认菜单里，而是出现在默认菜单下的“创造菜单”中（如果你没有调整过 omega 的设置）。
  - 而且，这个菜单项不是所有人都可以调用的。<br>
    这是因为菜单项所在的位置和权限全部由 `neomega_storage/config/neomega 框架配置.json` 决定的。<br>

你应该在那个文件中调整菜单项的位置和配置。<br>

- print（当然 log 也一样）输出的信息仍然位于终端，而不是游戏里。
  - 但是你希望的是与玩家进行交互，比如询问玩家一些信息或者向他发送信息。

而这正是 NeOmega 一个重点支持的功能，请看**下一步**。