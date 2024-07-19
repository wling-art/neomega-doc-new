# WebSocket 相关 API

## 连接到一个 WebSocket 服务器

### `connect_to_websocket(addr, optional_header)`

- **范围**: 协程内
- **说明**: 连接到指定的 WebSocket 服务器。
- **参数**:
  - `addr` (string)：服务器地址，例如 `ws://127.0.0.1:1042` 或 `ws://127.0.0.1:1042/path/to/ws_api`。
  - `optional_header` (table, 可选)：可选的 HTTP header，可以忽略。
- **返回值**: 返回一个 `WebSocketConn` 对象。

**示例**:

```lua
-- 不使用 header
coromega:start_new(function()
    local conn = coromega:connect_to_websocket("ws://127.0.0.1:1042")
    if conn == nil then
        coromega:print("connect fail")
        return
    end
    conn:when_new_msg(function(msg)
        if msg == nil then
            print("websocket connection closed!", msg)
        else
            print("websocket client received (not intercepted): ", msg)
        end
    end)
    conn:send_message("client hello")
    local received = conn:receive_message()
    if received == nil then
        print("websocket connection closed!")
    else
        print("websocket client received (first message): ", received)
    end
end)

-- 使用 header
coromega:start_new(function()
    local headers = {
        header1 = { "a", 2, "c" }, -- 可以是多个 (2 会变成 "2")
        header2 = { "some headers" },
        header3 = "header3,some values" -- 可以是单个 string
    }
    local conn = coromega:connect_to_websocket("ws://127.0.0.1:1042", headers)
end)
```

## 创建一个 WebSocket 服务器

### `create_websocket_server(host, port)`

- **范围**: 任意
- **说明**: 创建一个 WebSocket 服务器，并监听指定的主机和端口。
- **参数**:
  - `host` (string)：服务器主机地址，一般为 `"127.0.0.1"`（仅本机可访问）或 `"0.0.0.0"`（可被其他主机访问）。
  - `port` (number)：端口号。
- **返回值**: 监听器 (Listener)，监听器目前包含两个方法：
  - `when_new_conn(func)`：当有客户端连接到服务器时，一个新协程被创建并启动指定的函数，函数的参数为 `WebSocketConn` 对象。
  - `when_dead(func)`：当服务器关闭时，一个新协程被创建并启动指定的函数，函数的参数为字符串形式的服务器关闭原因。

**示例**:

```lua
coromega:create_websocket_server("0.0.0.0", 1042):when_new_conn(function(conn)
    conn:when_new_msg(function(msg)
        if msg == nil then
            print("websocket connection closed!")
        else
            print("websocket server received (not intercepted): ", msg)
            conn:send_message("server echo: " .. msg)
        end
    end)
    conn:send_message("server hello")
    local received = conn:receive_message()
    if received == nil then
        print("websocket connection closed!")
    else
        print("websocket server received (first message): ", received)
    end
end):when_dead(function(deadReason)
    print("websocket server dead, reason: ", deadReason)
end)
```

## WebSocketConn 对象的方法

### 发送消息 (字符串)

#### `send_message(message)`

- **范围**: 协程内
- **说明**: 发送一条字符串消息。
- **参数**:
  - `message` (string)：待发送的字符串数据，以 TextMessage 形式发送。
- **返回值**: 是否有错误，无错误时为 `nil`。

**示例**:

```lua
err = conn:send_message("hello")
```

### 发送消息 (数据)

#### `send(message)`

- **范围**: 协程内
- **说明**: 发送一条数据消息。数据会被 `json.encode` 后作为 TextMessage 形式发送。
- **参数**:
  - `message` (table)：待发送的数据。
- **返回值**: 是否有错误，无错误时为 `nil`。

**示例**:

```lua
err = conn:send({author="somebody", age=18})
```

### 接收到消息时的回调

#### `when_new_msg(func)`

- **范围**: 协程内
- **说明**: 设置一个回调函数，当新消息到来且未被 `receive_message` 拦截时触发。
- **参数**:
  - `func` (function)：回调函数，参数为字符串形式的消息，如果连接断开，则获得 `nil`。
- **返回值**: 无。

**示例**:

```lua
conn:when_new_msg(function(msg)
    if msg == nil then
        print("websocket connection closed!")
    else
        print("websocket received (not intercepted): ", msg)
    end
end)
```

### 接收下一条消息

#### `receive_message()`

- **范围**: 协程内
- **说明**: 接收下一条消息，下一条消息会作为该函数的返回值出现，而不会被 `when_new_msg` 处理。
- **参数**: 无
- **返回值**: 下一条即将收到的消息，如果连接断开，则获得 `nil`。

**示例**:

```lua
local received = conn:receive_message()
if received == nil then
    print("websocket connection closed!")
else
    print("websocket received: ", received)
end
```

## 综合使用

**示例**:

```lua
local omega = require("omega")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:create_websocket_server("0.0.0.0", 1042):when_new_conn(function(conn)
    conn:when_new_msg(function(msg)
        print("websocket server received (not intercepted): ", msg)
        conn:send_message("server echo: " .. msg)
    end)

    conn:send_message("server hello")
    local received = conn:receive_message()
    print("websocket server received (first message): ", received)
end):when_dead(function(deadReason)
    print("websocket server dead, reason: ", deadReason)
end)

coromega:start_new(function()
    coromega:sleep(1.0)
    local conn = coromega:connect_to_websocket("ws://127.0.0.1:1042")
    if conn == nil then
        coromega:print("connect fail")
        return
    end
    conn:when_new_msg(function(msg)
        print("websocket client received (not intercepted): ", msg)
    end)
    conn:send_message("client hello")
    local received = conn:receive_message()
    print("websocket client received (first message): ", received)
    conn:send_message("client hello 1")
    coromega:sleep(1.0)
    conn:send_message("client hello 2")
    coromega:sleep(1.0)
    conn:send_message("client hello 3")
    local received = conn:receive_message()
    print("websocket client received: ", received)
    coromega:sleep(1.0)
    conn:send_message("client hello 4")
    local received = conn:receive_message()
    print("websocket client received: ", received)
end)
coromega:run()
```
