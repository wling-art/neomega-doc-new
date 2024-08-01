# Step 16. 从 QQ 解封和封禁玩家

QQ 最为麻烦之处在于，它有许多群、频道、私聊，有许多人。

不是所有人都有权限，有权限的人还要把普通聊天信息和指令区分开来。

因此，问题变得格外麻烦。

首先，我们需要先读取配置项，并转换其形式以便后续处理：

```lua
if coromega.config.Version == "0.0.5" then
    coromega.config["从QQ接受封禁指令"] = {
        ["2401PT#1634268014@好友:1634268014"] = "#ban 玩家名 秒数 原因",
        ["2401PT#1634268014@群聊:548589654"] = "#ban 玩家名 秒数 原因",
        ["频道成员-2401PT#31415926545872@频道:2401的频道:机器人测试聊天室"] = "[CQ:at,qq=144115219209376165] #ban 玩家名 秒数 原因"
    }
    coromega.config["从QQ接受解封指令"] = {
        ["2401PT#1634268014@好友:1634268014"] = "#unban 玩家名",
        ["2401PT#1634268014@群聊:548589654"] = "[CQ:at,qq=2041243708] #unban 玩家名",
        ["频道成员-2401PT#31415926545872@频道:2401的频道:机器人测试聊天室"] = "[CQ:at,qq=144115219209376165] #unban 玩家名"
    }
    coromega.config.Version = "0.0.6"
    coromega:update_config(coromega.config)
end

local qq_ban_permission = coromega.config["从QQ接受封禁指令"]
local qq_unban_permission = coromega.config["从QQ接受解封指令"]
local qq_ban_matcher = {}
for who, format in pairs(qq_ban_permission) do
    -- who is something like "2401PT@好友:1634268014"
    -- format is something like "#ban 玩家名 时间 原因"
    -- then replace 玩家名/时间/原因 with .+
    local matcher_str = who .. ">" .. format:gsub("玩家名", ""):gsub("时间", ""):gsub("秒数", ""):gsub("原因",
        ""):gsub("^%s*(.-)%s*$", "%1")
    -- 2401PT#1634268014@好友:1634268014 -> 好友:1634268014
    local resp_target = who:sub(who:find("@") + 1)
    qq_ban_matcher[#qq_ban_matcher + 1] = { matcher_str, resp_target }
end

local qq_unban_matcher = {}
for who, format in pairs(qq_unban_permission) do
    local matcher_str = who .. ">" .. format:gsub("玩家名", ""):gsub("^%s*(.-)%s*$", "%1")
    local resp_target = who:sub(who:find("@") + 1)
    qq_unban_matcher[#qq_unban_matcher + 1] = { matcher_str, resp_target }
end
```

其中，类似类似 [CQ:at,qq=2041243708] 代表 @机器人 的行为

接着，让我们监听 QQ 内的消息：

```lua
coromega:when_receive_filtered_cqhttp_message_from_default():start_new(function(source, name, message)
    print(("cqhttp 默认监听对象> 来源: %s, 名字: %s, 消息: %s"):format(source, name, message))
end)
```

其中：

- message：为用户发送的消息
- source：为消息的来源，其形式为 好友:qq 号 群聊：群号 或者 频道：频道名：聊天室名
- name：为发送者，形式为 昵称#qq 号/频道 id

最后，让我们处理 QQ 的消息，并执行相应的封禁和解封指令

```lua
coromega:when_receive_filtered_cqhttp_message_from_default():start_new(function(source, name, message)
    local who = ("%s@%s"):format(name, source)
    local matchers = qq_ban_matcher[who]
    if matchers then
        for _, matcher_str in pairs(matchers) do
            -- take 玩家名 秒数 原因 from qq_str by matcher_str
            if message:sub(1, matcher_str:len()) == matcher_str then
                local cmd = message:sub(matcher_str:len() + 1)
                -- trim space
                cmd = cmd:gsub("^%s*(.-)%s*$", "%1")
                -- split by space
                local args = {}
                for arg in cmd:gmatch("%S+") do
                    args[#args + 1] = arg
                end
                local player_name = args[1]
                local ban_until = ban_time_to_ban_until_time(args[2])
                local ban_reason = args[3]
                if not player_name then
                    coromega:send_cqhttp_message(source, "玩家名不能为空")
                    return
                end
                if not ban_until then
                    coromega:send_cqhttp_message(source, "封禁时间无效")
                    return
                end
                if not ban_reason then
                    ban_reason = "未设定"
                end
                coromega:log_and_print(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name,
                    unix_time_to_date_time_str(ban_until),
                    ban_reason))
                coromega:send_cqhttp_message(source, ("封禁玩家：%s 到 %s, 原因：%s"):format(
                    player_name,
                    unix_time_to_date_time_str(ban_until),
                    ban_reason))
                player_banned_db:set(player_name, {
                    ban_until = ban_until,
                    ban_reason = ban_reason,
                })
                coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)),
                    false)
            end
        end
    end
    local matchers = qq_unban_matcher[who]
    if matchers then
        for _, matcher_str in pairs(matchers) do
            -- take 玩家名 秒数 原因 from qq_str by matcher_str
            if message:sub(1, matcher_str:len()) == matcher_str then
                local cmd = message:sub(matcher_str:len() + 1)
                -- trim space
                cmd = cmd:gsub("^%s*(.-)%s*$", "%1")
                -- split by space
                local args = {}
                for arg in cmd:gmatch("%S+") do
                    args[#args + 1] = arg
                end
                local player_name = args[1]
                if not player_name then
                    coromega:send_cqhttp_message(source, "玩家名不能为空")
                    return
                end
                local ban_info = player_banned_db:get(player_name)
                if not ban_info then
                    coromega:send_cqhttp_message(source, ("玩家 %s 目前并未被封禁"):format(
                        player_name))
                else
                    coromega:log_and_print(("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(player_name,
                        unix_time_to_date_time_str(ban_info.ban_until),
                        ban_info.ban_reason))
                    coromega:send_cqhttp_message(source,
                        ("解封玩家：%s (原封禁时间 %s, 原因：%s)"):format(player_name,
                            unix_time_to_date_time_str(ban_info.ban_until),
                            ban_info.ban_reason))
                    player_banned_db:delete(player_name)
                end
            end
        end
    end
end)
```