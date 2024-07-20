# Step 12. 优化玩家输入体验

想必你一定注意到了，总是有玩家会用一些非常讨厌的，无法输入的名字。那么有没有办法优化玩家名输入体验捏？

很简单，我们可以添加这么一个函数

> 不懂也没关系，这是可选的

```lua
local function display_candidates_and_get_selection_resolver_enclosure(disp)
    local candidates = coromega:get_all_online_players()
    local selectable_candidates = {}
    for i, candidate in pairs(candidates) do
        local idx = ("%s"):format(i)
        local name = candidate:name()
        selectable_candidates[idx] = name
        disp(("%s: %s"):format(idx, name))
    end
    return function(selection)
        local seleted_candidate = selectable_candidates[selection]
        if seleted_candidate then
            return seleted_candidate
        else
            return selection
        end
    end
end
```

然后修改对应的部分：

```diff
- player_name = coromega:input("请输入要封禁的玩家名：")
+ local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) coromega:print(info) end)
+ player_name = resolver(coromega:input("请输入要封禁的玩家名, 或输入序号: "))
+ if not player_name or player_name == "" then
+     coromega:print("玩家名不能为空")
+ end
```

```diff
- player_name = coromega:input("请输入要解封的玩家名: ")
+ local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) coromega:print+ (info) end)
+ player_name = resolver(coromega:input("请输入要解封的玩家名, 或输入序号: "))
+ if not player_name or player_name == "" then
+     coromega:print("玩家名不能为空")
+ end
```

```diff
- ban_player_name = caller:ask("请输入要封禁的玩家名：")
+ local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) caller:say(info) end)
+ ban_player_name = resolver(caller:ask("请输入要封禁的玩家名, 或输入序号: "))
+ if not ban_player_name or ban_player_name == "" then
+     caller:say("玩家名不能为空")
+ end
```

```diff
- ban_player_name = caller:ask("请输入要解封的玩家名: ")
+ local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) caller:say(info) end)
+ ban_player_name = resolver(caller:ask("请输入要解封的玩家名, 或输入序号: "))
+ if not ban_player_name or ban_player_name == "" then
+     caller:say("玩家名不能为空")
+ end
```

输入 `reload` 然后观察变化，是不是挺好使的？