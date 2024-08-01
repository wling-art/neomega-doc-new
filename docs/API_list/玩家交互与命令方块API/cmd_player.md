# 玩家交互&聊天和命令块消息监听相关 API

## 获取玩家对象

### `get_player(uuid_string_or_name)`

- **范围**: 任意
- **说明**: 获取指定名字或 UUID 的玩家对象。
- **参数**:
  - `uuid_string_or_name` (string)：玩家名或 UUID 字符串。
- **返回值**: 玩家对象 (Player)。

**示例**:

```lua
local player = coromega:get_player("2401pt")
local player = coromega:get_player("xxxxxxxx")
```

### `get_player_by_name(player_name)`

- **范围**: 任意
- **说明**: 获取指定名字的玩家对象。
- **参数**:
  - `player_name` (string)：玩家名。
- **返回值**: 玩家对象 (Player)。

**示例**:

```lua
local player = coromega:get_player_by_name("2401pt")
```

### `get_player_by_uuid_string(uuid_string)`

- **范围**: 任意
- **说明**: 获取指定 UUID 的玩家对象。
- **参数**:
  - `uuid_string` (string)：UUID 字符串。
- **返回值**: 玩家对象 (Player)。

**示例**:

```lua
local player = coromega:get_player_by_uuid_string("xxxxxxxx")
```

## 获取所有在线玩家对象

### `get_all_online_players()`

- **范围**: 任意
- **说明**: 获取所有在线玩家的玩家对象。
- **参数**: 无
- **返回值**: 玩家对象数组 (Player[])。

**示例**:

```lua
local players = coromega:get_all_online_players()
```

## 接收命令消息事件

### `when_receive_msg_from_command_block_named(command_block_name)`

- **范围**: 任意
- **说明**: 当收到指定命令块的消息时，启动一个新协程并执行指定函数。
- **参数**:
  - `command_block_name` (string)：命令块名字。
- **返回值**: 监听器 (Listener) - 含有方法 `start_new(function)`，允许在监听器触发时启动函数并且放入新的协程。

**示例**:

```lua
-- 命令块命名为 "扫地机"，指令为 tell 机器人名字 去扫地
-- 当收到命令块的消息时，执行回调
coromega:when_receive_msg_from_command_block_named("扫地机"):start_new(function(chat)
    coromega:log_and_print(("command block (%s) chat: %s"):format("扫地机", json.encode(chat)))
end)
```

## 实体消息事件

### `when_receive_msg_from_sender_named(name)`

- **范围**: 任意
- **说明**: 当收到指定名字的消息时，这个名字可以是物品名，启动一个新协程并执行指定函数。
- **参数**:
  - `name` (string)：发送者名字。
- **返回值**: 监听器 (Listener) - 含有方法 `start_new(function)`，允许在监听器触发时启动函数并且放入新的协程。

**示例**:

```lua
-- 命令块指令为 execute @e[type=snowball] ~ ~ ~ tell 机器人名字 @p[r=3]
-- 当收到命令块的消息时，执行回调
coromega:when_receive_msg_from_sender_named("雪球"):start_new(function(chat)
    coromega:log_and_print(("item (%s) chat: %s"):format("雪球", json.encode(chat)))
end)
```

## 聊天消息事件

### `when_chat_msg()`

- **范围**: 任意
- **说明**: 当收到聊天消息时，启动一个新协程并执行指定函数。
- **返回值**: 监听器 (Listener) - 含有方法 `start_new(function)`，允许在监听器触发时启动函数并且放入新的协程。

**示例**:

```lua
coromega:when_chat_msg():start_new(function(chat)
    coromega:log_and_print(("chat sender: %s > %s"):format(chat.name, json.encode(chat)))
end)
```

## 玩家在线状态变化事件

### `when_player_change()`

- **范围**: 任意
- **说明**: 当玩家的在线情况发生变化时，启动一个新协程并执行指定函数。
- **返回值**: 监听器 (Listener) - 含有方法 `start_new(function)`，允许在监听器触发时启动函数并且放入新的协程。`player` 是一个玩家对象 (Player)。

**示例**:

```lua
coromega:when_player_change():start_new(function(player, action)
    if action == "exist" then
        coromega:log_and_print(("player %s 已经在线"):format(player:name()))
    elseif action == "online" then
        coromega:log_and_print(("player %s 新上线"):format(player:name()))
    elseif action == "offline" then
        coromega:log_and_print(("player %s 下线"):format(player:name()))
    end
end)
```

## player 对象的函数

### `say(msg)`

- **范围**: 任意
- **说明**: 向指定玩家发送消息。
- **参数**:
  - `msg` (string)：机器人要说的话。
- **返回值**: 无。

**示例**:

```lua
player:say("hello")
```

### `raw_say(msg)`

- **范围**: 任意
- **说明**: 向指定玩家发送 tell raw 消息，这个消息应当是一个对象。
- **参数**:
  - `msg` (table)：对象，被 `json.encode` 之后应该符合 tell raw 的规范。
- **返回值**: 无。

**示例**:

```lua
player:raw_say({rawtext={{text="hello world"}}})
```

### `ask(hint, timeout)`

- **范围**: 协程内
- **说明**: 获取指定玩家的输入。
- **参数**:
  - `hint` (string)：提示给玩家的信息。
  - `timeout` (number)：输入超时，超时时返回为 `nil`。
- **返回值**: 输入的内容 (string) 或者超时返回 `nil`。

**示例**:

```lua
local input = player:ask("请输入：")
local input = player:ask("请输入：", 6.2)
if input == nil then
    coromega:print("timeout!")
else
    coromega:print(input)
end
```

### `title(title, subtitle)`

- **范围**: 任意
- **说明**: 发送标题。
- **参数**:
  - `title` (string)：标题。
  - `subtitle` (string)：副标题。
- **返回值**: 无。

**示例**:

```lua
player:title("hello", "world")
```

### `subtitle(subtitle, title)`

- **范围**: 任意
- **说明**: 发送副标题。如果主标题为 `nil` 则不会显示 `subtitle`。
- **参数**:
  - `subtitle` (string)：副标题。
  - `title` (string)：标题。
- **返回值**: 无。

**示例**:

```lua
player:subtitle("world", "hello")
```

### `action_bar(msg)`

- **范围**: 任意
- **说明**: 发送 actionbar。
- **参数**:
  - `msg` (string)：消息。
- **返回值**: 无。

**示例**:

```lua
player:action_bar("hi")
```

### `get_pos()`

- **范围**: 协程内
- **说明**: 获取玩家坐标和维度（实际上是 `query player` 的包装）。
- **返回值**:
  - `position` (table): 玩家位置，包含 `x` (number), `y` (number), `z` (number)。
  - `dimension` (number): 维度。

**示例**:

```lua
local pos = player:get_pos().position
local x = math.floor(pos.x)
local y = math.floor(pos.y)
local z = math.floor(pos.z)
local dimension = player:get_pos().dimension
coromega:print(dimension)
```

### `check(conditions)`

- **范围**: 协程内
- **说明**: 检查玩家是否满足条件，为条件限制器效果：`@a[xxxxxxxx]`。
- **参数**:
  - `conditions` (table)：条件字符串数组，例如 `{ "m=c", "tag=!no_omega", "tag=!ban" }`。这些条件会被拼装为指令 `querytarget @a[name=玩家名, m=c, tag=!no_omega, tag=!ban]`。
- **返回值**: 是否满足条件 (boolean)。

**示例**:

```lua
local result = player:check({ "m=c", "tag=!ban" })
local result = player:check({ "m=c" })
```

### `uuid_string()`

- **范围**: 协程内
- **说明**: 获取玩家的 UUID

字符串。

- **返回值**: UUID 字符串 (string)。

**示例**:

```lua
local uuid = player:uuid_string()
```

### `name()`

- **范围**: 协程内
- **说明**: 获取玩家的名字。
- **返回值**: 玩家名字 (string)。

**示例**:

```lua
local name = player:name()
```

### `send(json_msg)`

- **范围**: 协程内
- **说明**: 向玩家发送原始消息。
- **参数**:
  - `json_msg` (table)：原始消息（需为 JSON 格式）。
- **返回值**: 无。

**示例**:

```lua
player:send({rawtext={{text="hello world"}}})
```
