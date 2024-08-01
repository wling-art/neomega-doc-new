# Step 6. 配置文件和显示优化

在我们进行下一步前，让我们针对这几个小问题进行一点小小的优化：

- 我不想定死触发词，我希望它的触发词像其他的 NeOmega 组件那样可以修改，因为那样很酷！
- 被封禁的玩家在被踢出时，显示的仅仅是 **“您已被踢出游戏”** 如果显示更多的细节那会更好。
- 当被封禁玩家上线时，它们看到的仅仅是 **“服务器断开连接”** 而不是具体的封禁信息，那样不好。

当然，如果你能一路看到这边，然后写出这一百多行代码，你还算的上有点耐心。

也许你会觉得，啊？我以为很简单的这点功能写起来这么麻烦？

~~哈哈，这才哪儿到哪儿啊。~~

上述这三个问题都是非常细节的问题，而一个组件是否好用往往取决于细节方面处理的细致程度。

让我们从第一个问题开始，如何从配置中获得触发词并应用触发词捏？

很简单，配置文件（就是那个 JSON）中的配置会被 NeOmega 自动转换并放在 **coromega.config** 中以供调用。

所以我们只要：

```lua
local triggers = coromega.config["触发词"]

coromega:when_called_by_terminal_menu({
    triggers = triggers,
    argument_hint = "[玩家名] [时间] [原因]",
    usage = "从终端封禁玩家",
})
```

好的，让我们输入 `reload` 使配置立即生效。

阿勒？什么情况？

```log
lua 插件：玩家封禁.lua 出现错误：interface conversion: lua.LValue islua.LNilType, not *lua.LTable
```

很显然，config 中并没有这一项 (触发词)。你也许会说，那在配置文件中填充这一项不就得了嘛？

这当然是可以的，但是如果你以后代码要升级，需要新的配置，或用户粗心大意，漏了这个配置要怎么办捏？

因此，我们可以在缺少这个配置的情况下，主动写入这个配置：

```lua
if coromega.config.Version == "0.0.1" then
    coromega.config["触发词"] = { "ban", "玩家封禁", "封禁玩家" }
    coromega.config.Version = "0.0.2"
    coromega:update_config(coromega.config)
end
local triggers = coromega.config["触发词"]
```

这一段的含义是，如果配置文件的版本号为 0.0.1 就写入新的配置项，并升级版本号

让我们输入 `reload` 看看配置文件发生了什么变化：

这是之前的配置文件：

```json
{
  "名称": "玩家封禁.lua",
  "描述": "从终端封禁玩家",
  "是否禁用": false,
  "来源": "LuaLoader",
  "配置": {
    "Version": "0.0.1"
  }
}
```

这是 reload 之后，自动升级的配置文件：

```json
{
  "名称": "玩家封禁.lua",
  "配置": {
    "Version": "0.0.2",
    "触发词": ["ban", "玩家封禁", "封禁玩家"]
  },
  "描述": "从终端封禁玩家",
  "是否禁用": false,
  "来源": "LuaLoader"
}
```

让我们输入 `?` 看看菜单有没有正确的修改捏？

```
ban (玩家封禁, 封禁玩家) [玩家名] [时间] [原因]: 从终端封禁玩家
```

good, 怎么样，还是很方便的吧？

那么接下来第二个问题，还是类似的

我们留出一个配置项让用户自己决定被踢出玩家的提示 (注意不要撞上网易的敏感词了) :

```lua
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
```

然后

```diff
- coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_reason), false)

+ coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until,ban_reason)), false)
```

好的，让我们输入 `reload` 使修改立刻生效，现在再试试，正常显示了吧？

最后，是第三个问题：为什么当被封禁玩家上线时，他们看到的仅仅是“服务器断开连接”而不是具体的封禁信息？

这是因为 NeOmega 的反应过于迅速，这使得玩家被踢得过早，以至于无法显示出封禁提示信息。想要解决这个问题也很简单，只需要等待被封禁的玩家上线几秒钟，再踢出即可。

但是，问题在于，有的用户希望被封禁玩家立刻被踢掉，而不是只为了显示一个原因冒着风险等几秒再踢。

这个问题也很好解决，我们只需要再添加一个配置项，让用户自行决定即可：

```lua
if coromega.config.Version == "0.0.3" then
    coromega.config["延迟踢出玩家的时间以保证原因正确显示"] = true
    coromega.config.Version = "0.0.4"
    coromega:update_config(coromega.config)
end
local ensure_hint_display = coromega.config["延迟踢出玩家的时间以保证原因正确显示"]
```

```lua
if ensure_hint_display then
    coromega:sleep(4.0)
end
coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
```

好的，让我们现在输入 `reload` 使修改立刻生效。如何？显示正常了吧？吧？

为了防止你错过其中的某个步骤，到目前为止，代码看起来应该是这样：

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

coromega:when_called_by_terminal_menu({
    triggers = triggers,
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
    coromega:log_and_print(("封禁玩家：%s 到 %s, 原因：%s"):format(player_name, unix_time_to_date_time_str(ban_until),
        ban_reason))
    player_banned_db:set(player_name, {
        ban_until = ban_until,
        ban_reason = ban_reason,
    })
    coromega:send_ws_cmd(("kick %s %s"):format(player_name, ban_info_to_hint_str(ban_until, ban_reason)), false)
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