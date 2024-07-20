# Step 5. 数据库

但是，你应该也已经发现一个问题，就是，当 NeOmega 重启时，好像...欸？封禁又失效了？

这是当然的，因为刚刚只是把封禁信息存储到一个变量里，然而变量会因为 NeOmega 的关闭或重载丢失。

所以 NeOmega 有一个简单类似数据库的玩意儿，可以帮你完成数据存储。

首先，我们需要先创建或者打开一个数据库，我们希望这个数据库被存储在，磁盘中的：

- neomega_storage/data/玩家封禁信息

具体这么做：

```lua
local player_banned_db=coromega:key_value_db("玩家封禁信息")
```

符合直觉的，既然我们已经使用了数据库替代了 **player_banned** 这个变量，那么自然我们也应该在其他地方用数据库操作进行替代：

```diff
- player_banned[player_name]={
-     ban_until=ban_until,
-     ban_reason=ban_reason,
- }

+ player_banned_db:set(player_name,{
+     ban_until=ban_until,
+     ban_reason=ban_reason,
+ })
```

```diff
- local ban_info=player_banned[player_name]

+ local ban_info=player_banned_db:get(player_name)
```

```diff
- player_banned[player_name]=nil

+ player_banned_db:delete(player_name)
```

现在，即使 neoemga 重启了，封禁信息依然有效，不是吗？

为了防止你漏掉什么步骤，到目前为止，代码看起来应该像这样：

```lua
local omega = require("omega")
local json = require("json")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:print("config of 玩家封禁：",json.encode(coromega.config))

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
    if not ban_time or ban_time=="" then
        return nil
    end
    -- time string can be a single number, or a string like "1d2h3m4s", or chinese like "1天2小时3分钟4秒"
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

local player_banned_db=coromega:key_value_db("玩家封禁信息")

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
    coromega:log(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name,  os.date("%Y-%m-%d %H:%M:%S", ban_until), ban_reason))
    player_banned_db:set(player_name,{
        ban_until=ban_until,
        ban_reason=ban_reason,
    })
    coromega:send_ws_cmd(("kick %s %s"):format(player_name,ban_reason),false)
end)

coromega:when_player_change():start_new(function(player, action)
    if action=="offline" then
        return
    end
    local player_name=player:name()
    local ban_info=player_banned_db:get(player_name)
    if ban_info then
        local ban_until = ban_info.ban_until
        local ban_reason=ban_info.ban_reason
        if ban_until>coromega:now() then
            coromega:send_ws_cmd(("kick %s %s"):format(player_name,ban_reason),false)
        else
            player_banned_db:delete(player_name)
        end
    end
end)

coromega:run()
```