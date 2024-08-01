# 跨插件 API 调用

## 跨插件写入值

### `soft_set(key, val)`

- **范围**: 任意
- **说明**: 向 Omega 写入值，值可以被跨进程、跨插件读取，且不会随着框架崩溃消失（只有在机器人退出时才会消失）。考虑到这是跨进程的，其速度可能较慢。
- **参数**:
  - `key` (string)：键名。
  - `val` (string)：值。
- **返回值**: 无。

**示例**:

```lua
coromega:soft_set("status/my_plugin", "start")
```

## 跨插件读取值

### `soft_get(key)`

- **范围**: 任意
- **说明**: 从 Omega 读取值，值可以被跨进程、跨插件读取，且不会随着框架崩溃消失（只有在机器人退出时才会消失）。考虑到这是跨进程的，其速度可能较慢。
- **参数**:
  - `key` (string)：键名。
- **返回值**: `val`, `found`。`val` 是读取的值，`found` 是一个布尔值，指示是否找到值。

**示例**:

```lua
local hashed_server_code, found = coromega:soft_get("HashedServerCode")
coromega:print("hashed_server_code", hashed_server_code)
coromega:print("found", found)

local status = coromega:soft_get("status/my_plugin")
coromega:print("status: ", status)
```

## 发送跨插件消息

### `publish_info(topic, data)`

- **范围**: 任意
- **说明**: 向指定的 topic 发送数据 (`data`)，topic 是跨插件的，所有订阅该 topic 的插件都能收到数据。
- **参数**:
  - `topic` (string)：话题名。
  - `data` (any)：任意数据，只要能被 `json.encode` 正确处理即可。
- **返回值**: 无。

**示例**:

```lua
coromega:publish_info("/send_time/1", {
    send_time = os.time(),
    disp = ("time 1: %d"):format(os.time())
})
```

## 接收/订阅跨插件消息

### `when_new_data_in_subscribed_topic_named(topic)`

- **范围**: 任意
- **说明**: 订阅指定的 topic，当该 topic 下有新消息时，一个协程被创建并运行指定的函数。
- **参数**:
  - `topic` (string)：话题名。
- **返回值**: 监听器。监听器内的处理函数的参数为 topic 下的新数据。

**示例**:

```lua
coromega:when_new_data_in_subscribed_topic_named("/send_time/1"):start_new(function(data)
    print(data.disp)
    print(data.send_time)
end)
```

## 暴露跨插件 API

### `when_called_by_api_named(api_name, set_result)`

- **范围**: 任意
- **说明**: 以 `api_name` 暴露一个跨插件 API，当该 API 被调用时，一个协程被创建并运行指定的 API 函数。
- **参数**:
  - `api_name` (string)：跨插件 API 名。
  - `set_result` (function)：设置返回结果和错误（若不使用则使用函数的返回值）。
- **返回值**: 监听器。监听器内的处理函数的参数为：
  - 调用参数。
  - 返回函数：当返回函数被调用时，调用者将收到调用结果，返回函数最多只能被调用一次。

**示例**:

```lua
coromega:when_called_by_api_named("/calculator/add"):start_new(function(args, set_result)
    local result = args[1] + args[2]
    set_result(result)
end)

-- 不使用 set_result 则函数的返回将作为结果
coromega:when_called_by_api_named("/calculator/add"):start_new(function(args)
    local result = args[1] + args[2]
    return result
end)

-- 可以设置错误
coromega:when_called_by_api_named("/calculator/div"):start_new(function(args, set_result)
    if args[2] == 0 then
        set_result(0, "divide by zero!")
    else
        local result = args[1] / args[2]
        set_result(result, nil)
    end
end)

-- 可以返回错误
coromega:when_called_by_api_named("/calculator/div"):start_new(function(args, set_result)
    if args[2] == 0 then
        return 0, "divide by zero!"
    else
        local result = args[1] / args[2]
        return result, nil
    end
end)
```

## 调用跨插件 API

### `call_other_plugin_api(api_name, args, timeout)`

- **范围**: 协程内
- **说明**: 调用具有 `api_name` 的跨插件 API，调用参数为 `args`，并返回调用结果。
- **参数**:
  - `api_name` (string)：跨插件 API 名。
  - `args` (any)：可以被 `json.encode` 处理的参数。
  - `timeout` (number)：超时时间。当超时，返回 `nil, "context deadline exceeded"`。
- **返回值**: 调用结果，错误。

**示例**:

```lua
local result, err = coromega:call_other_plugin_api("/calculator/add", { 1, 2 })
print(("result: %d"):format(result)) --3
print("err: ", err) --nil

-- 可以忽略错误
local result = coromega:call_other_plugin_api("/calculator/add", { 1, 2 })
print(("result: %d"):format(result)) --3

local result, err = coromega:call_other_plugin_api("/very/time/consuming", { 1, 2 }, 0.0001)
print("result: ", result) -- nil
print("error: ", err) -- "context deadline exceeded"

local result, err = coromega:call_other_plugin_api("/calculator/div", { 1, 0 }, 1)
print(("result: %d"):format(result)) --0
print("err: ", err) --"divide by zero!"
```

## 调用无返回的插件 API

### `call_other_plugin_api_no_result(api_name, args)`

- **范围**: 任意
- **说明**: 调用具有 `api_name` 的跨插件 API，调用参数为 `args`，但不等待调用结果。
- **参数**:
  - `api_name` (string)：跨插件 API 名。
  - `args` (any)：可以被 `json.encode` 处理的参数。

**示例**:

```lua
coromega:call_other_plugin_api_no_result("/time/set", 100)
```

## 综合使用

### Caller

**示例**:

```lua
local omega = require("omega")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)
local json = require("json")

coromega:when_new_data_in_subscribed_topic_named("/send_time/1"):start_new(function(data)
    print(data.disp, "now add money")
    coromega:call_other_plugin_api_no_result("/money/add", 1)
end)

coromega:when_new_data_in_subscribed_topic_named("/send_time/2"):start_new(function(data)
    print(data.disp, "now check and add money")

    local money = coromega:call_other_plugin_api("/money/check", nil)
    print(("money is [%d]"):format(tonumber(money)))

    local money = coromega:call_other_plugin_api("/money/add", 100)
    print(("after add 100 money, now money is %s"):format(money))

    local time_after5s = coromega:call_other_plugin_api("/calculator/add", { data.send_time, 3 })
    print(("will be called at [%d] next time"):format(tonumber(time_after5s)))
end)
coromega:run()
```

### Provider

**示例**:

```lua
local omega = require("omega")
local json = require("json")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:start_new(function()
    while true do
        coromega:publish_info("/send_time/1", {
            send_time = os.time(),
            disp = ("time 1: %d"):format(os.time())
        })
        coromega:sleep(3)
    end
end)

coromega:start_new(function()
    while true do
        coromega:publish_info("/send_time/2", {
            send_time = os.time(),
            disp = ("time 2: %d"):format(os.time())
        })
        coromega:sleep(5)
    end
end)

local total_money = 0

coromega:when_called_by_api_named("/money/check"):start_new(function(args, set_result)
    set_result

(total_money)
end)

coromega:when_called_by_api_named("/money/add"):start_new(function(args, set_result)
    total_money = total_money + args
    set_result(total_money)
end)

coromega:when_called_by_api_named("/calculator/add"):start_new(function(args, set_result)
    local result = args[1] + args[2]
    set_result(result)
end)
coromega:run()
```
