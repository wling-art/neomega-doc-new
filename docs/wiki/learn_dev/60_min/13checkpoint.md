# Step 13. Checkpoint

到这步为止，一个合格的组件就制作完了。

在这篇教程里还准备了一点别的，比如如何从 QQ、命令块、或者从别的组件唤起。

这些内容将写在 [Step 14](#step-14-从命令块封禁玩家) 文末

为了防止你漏掉了什么，到目前为止，整个代码应该看起来像这样：

```lua
local omega = require("omega")
local json = require("json")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:print("config of 玩家封禁：", json.encode(coromega.config))

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
    if not ban_time or ban_time == "" then
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
        return coromega:now() + time_seconds
    end
    return nil
end

local player_banned_db = coromega:key_value_db("玩家封禁信息")

if coromega.config.Version == "0.0.1" then
    coromega.config["触发词"] = { "ban", "玩家封禁", "封禁玩家" }
    coromega.config.Version = "0.0.2"
    coromega:update_config(coromega.config)
end
local triggers = coromega.config["触发词"]

if coromega.config.Version == "0.0.2" then
    coromega.config["被踢出时的提示信息"] = "您因为 [ban_reason] 被封禁到 [ban_until]"
    coromega.config["日期显示格式"] = "%Y-%m-%d %H:%M:%S"
    coromega.config.Version = "0.0.3"
    coromega:update_config(coromega.config)
end
local hint_format = coromega.config["被踢出时的提示信息"]
local date_time_format = coromega.config["日期显示格式"]
local function unix_time_to_date_time_str(unix_time)
    return os.date(date_time_format, unix_time)
end
local function ban_info_to_hint_str(ban_until, ban_reason)
    local hint_str = hint_format
    hint_str = hint_str:gsub("%[ban_reason%]", ban_reason)
    hint_str = hint_str:gsub("%[ban_until%]", unix_time_to_date_time_str(ban_until))
    return hint_str
end

if coromega.config.Version == "0.0.3" then
    coromega.config["延迟踢出玩家的时间以保证原因正确显示"] = true
    coromega.config.Version = "0.0.4"
    coromega:update_config(coromega.config)
end
local ensure_hint_display = coromega.config["延迟踢出玩家的时间以保证原因正确显示"]

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

coromega:when_called_by_terminal_menu({
    triggers = triggers,
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
}):start_new(function(input)
    local player_name = input[1]
    local ban_until = ban_time_to_ban_until_time(input[2])
    local ban_reason = input[3]
    while not player_name or player_name == "" do
        local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) coromega:print(info) end)
        player_name = resolver(coromega:input("请输入要封禁的玩家名, 或输入序号: "))
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
    coromega:log(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name, unix_time_to_date_time_str(ban_until),
        ban_reason))
    player_banned_db:set(player_name, {
        ban_until = ban_until,
        ban_reason = ban_reason,
    })
    coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
end)

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
        local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) coromega:print(info) end)
        player_name = resolver(coromega:input("请输入要解封的玩家名, 或输入序号: "))
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


coromega:when_called_by_game_menu({
    triggers = triggers,
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从游戏内封禁玩家",
}):start_new(function(chat)
    -- 如果你希望, 可以这样查看chat内包含的信息:
    -- print(json.encode(chat))
    local caller_name = chat.name
    local input = chat.msg
    -- print(("%s 在游戏内唤起了封禁功能，参数：%s"):format(caller_name, json.encode(input)))
    local caller = coromega:get_player_by_name(caller_name)
    -- if caller:is_op() then
    --     print("调用者是 OP")
    -- else
    --     -- 实际没必要, 因为菜单已经做了权限控制, 这里只是为了向你展示 coromega 的 player 对象可以做到命令做不到的事
    --     caller:say("抱歉，你不是 OP")
    -- end
    local ban_player_name = input[1]
    local ban_until = ban_time_to_ban_until_time(input[2])
    local ban_reason = input[3]
    while not ban_player_name or ban_player_name == "" do
        -- ban_player_name = caller:ask("请输入要封禁的玩家名：")
        local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) caller:say(info) end)
        ban_player_name = resolver(caller:ask("请输入要封禁的玩家名, 或输入序号: "))
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
        -- ban_player_name = caller:ask("请输入要解封的玩家名: ")
        local resolver = display_candidates_and_get_selection_resolver_enclosure(function(info) caller:say(info) end)
        ban_player_name = resolver(caller:ask("请输入要解封的玩家名, 或输入序号: "))
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


coromega:when_player_change():start_new(function(player, action)
    if action == "offline" then
        return
    end
    local player_name = player:name()
    local ban_info = player_banned_db:get(player_name)
    if ban_info then
        local ban_until = ban_info.ban_until
        local ban_reason = ban_info.ban_reason
        if ban_until > coromega:now() then
            if ensure_hint_display then
                coromega:sleep(4.0)
            end
            coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
        else
            player_banned_db:delete(player_name)
        end
    end
end)

coromega:run()

```