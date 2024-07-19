# CQHTTP 相关 API

## 向 CQHTTP 发送消息

### `send_cqhttp_message(target, message)`

- **范围**: 任意
- **描述**: 向 CQHTTP 发送消息。
- **参数**:
  - `target` (string): 消息目标，格式为 `群聊:xxxxx`, `频道:xxx(频道名):xxx(聊天室名)`。
  - `message` (string): 消息内容。
- **返回值**: 无。

```lua
coromega:send_cqhttp_message("群聊:548589654", "hello world 1")
```

## 向默认发送列表发送 CQHTTP 消息

### `send_cqhttp_message_to_default(message)`

- **范围**: 任意
- **描述**: 向默认发送列表发送 CQHTTP 消息。
- **参数**:
  - `message` (string): 消息内容。
- **返回值**: 无。

```lua
coromega:send_cqhttp_message_to_default("hello world 2")
```

## 向指定 QQ 号发送私聊消息

### `send_cqhttp_message_to_id(id, message)`

- **范围**: 协程内
- **描述**: 向指定 QQ 号发送私聊消息。
- **参数**:
  - `id` (number): QQ 号。
  - `message` (string): 消息内容。
- **返回值**: boolean，是否发送（仅表示已发送，但不一定成功）。

```lua
coromega:send_cqhttp_message_to_id(1634268014, "hello world 3")
```

## 向指定群号发送群聊消息

### `send_cqhttp_message_to_group(group_id, message)`

- **范围**: 协程内
- **描述**: 向指定群号发送群聊消息。
- **参数**:
  - `group_id` (number): 群号。
  - `message` (string): 消息内容。
- **返回值**: boolean，是否发送（仅表示已发送，但不一定成功）。

```lua
coromega:send_cqhttp_message_to_group(548589654, "hello world 4")
```

## 向指定频道号的指定聊天室发送消息

### `send_cqhttp_message_to_guild(guild_id, channel_id, message)`

- **范围**: 协程内
- **描述**: 向指定频道号的指定聊天室发送消息。
- **参数**:
  - `guild_id` (number): 频道号。
  - `channel_id` (number): 聊天室号。
  - `message` (string): 消息内容。
- **返回值**: boolean，是否发送（仅表示已发送，但不一定成功）。

```lua
coromega:send_cqhttp_message_to_guild(671889153994807378, 606767554, "hello world 5")
```

## 获取指定群号的群成员信息

### `get_cqhttp_group_members_info(group_id)`

- **范围**: 协程内
- **描述**: 获取指定群号的群成员信息。
- **参数**:
  - `group_id` (number): 群号。
- **返回值**: table，群成员信息。

```lua
local group_members_info = coromega:get_cqhttp_group_members_info(548589654)
```

## 获取已加入的频道信息

### `get_cqhttp_joined_guilds()`

- **范围**: 协程内
- **描述**: 获取已加入的频道信息。
- **参数**: 无
- **返回值**: table，频道信息。

```lua
local joined_guilds = coromega:get_cqhttp_joined_guilds()
```

## 获取指定频道号的频道信息

### `get_cqhttp_guild_channels(guild_id)`

- **范围**: 协程内
- **描述**: 获取指定频道号的频道信息。
- **参数**:
  - `guild_id` (number): 频道号。
- **返回值**: table，频道信息。

```lua
local guild_channels = coromega:get_cqhttp_guild_channels(671889153994807378)
```

## 获取指定频道号指定成员的信息

### `get_cqhttp_guild_member(guild_id, member_id)`

- **范围**: 协程内
- **描述**: 获取指定频道号的指定成员的信息。
- **参数**:
  - `guild_id` (number): 频道号。
  - `member_id` (string): 成员号。
- **返回值**: table，成员信息。

```lua
local owner_info = coromega:get_cqhttp_guild_member(671889153994807378, "xxxxxxxxxxx")
```

## 监听 CQHTTP 消息

### `when_receive_cqhttp_message()`

- **范围**: 事件端点，协程起点
- **描述**: 监听 CQHTTP 消息。
- **参数**: 无
- **返回值**: 监听器。<br>监听器的回调函数参数为：
  - `message_type` (string): 消息类型。
  - `message` (string): 消息。
  - `raw_message_string` (string): 原始消息。

```lua
coromega:when_receive_cqhttp_message():start_new(function(message_type, message, raw_message_string)
    print(("CQHTTP 消息 > 类型: %s, 消息: %s, 原始消息: %s"):format(message_type, message, raw_message_string))
end)
```

## 监听默认发送列表的 CQHTTP 消息

### `when_receive_filtered_cqhttp_message_from_default()`

- **范围**: 事件端点，协程起点
- **描述**: 监听默认发送列表的 CQHTTP 消息。
- **参数**: 无
- **返回值**: 监听器。<br>监听器的回调函数参数为：
  - `source` (string): 消息来源。
  - `name` (string): 名字（昵称#QQ 号）。
  - `message` (string): 消息。

```lua
coromega:when_receive_filtered_cqhttp_message_from_default():start_new(function(source, name, message)
    print(("默认发送列表消息 > 来源: %s, 名字: %s, 消息: %s"):format(source, name, message))
end)
```

## 综合使用示例

```lua
local omega = require("omega")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)
local json = require("json")

coromega:start_new(function()
    local group_members_info = coromega:get_cqhttp_group_members_info(548589654)
    print(json.encode(group_members_info))

    local joined_guilds = coromega:get_cqhttp_joined_guilds()
    print(json.encode(joined_guilds))

    for _, guild in ipairs(joined_guilds) do
        local guild_id = guild.GuildID
        local guild_name = guild.GuildName
        local guild_display_id = guild.GuildDisplayID
        print(("频道 ID: %d, 名称: %s, 显示 ID: %d"):format(guild_id, guild_name, guild_display_id))

        local guild_channels = coromega:get_cqhttp_guild_channels(guild_id)
        print(json.encode(guild_channels))

        -- 示例: 获取频道成员信息
        -- local owner_info = coromega:get_cqhttp_guild_member(guild_id, "xxxxxxxxxxx")
        -- print(json.encode(owner_info))
    end

    coromega:send_cqhttp_message("群聊:548589654", "hello world 1")
    coromega:send_cqhttp_message_to_default("hello world 2")
    coromega:send_cqhttp_message_to_id(1634268014, "hello world 3")
    coromega:send_cqhttp_message_to_group(548589654, "hello world 4")
    coromega:send_cqhttp_message_to_guild(671889153994807378, 606767554, "hello world 5")
end)

coromega:when_receive_cqhttp_message():start_new(function(message_type, message, raw_message_string)
    print(("CQHTTP 消息 > 类型: %s, 消息: %s, 原始消息: %s"):format(message_type, message, raw_message_string))
end)

coromega:when_receive_filtered_cqhttp_message_from_default():start_new(function(source, name, message)
    print(("默认发送列表消息 > 来源: %s, 名字: %s, 消息: %s"):format(source, name, message))
end)

coromega:run()
```
