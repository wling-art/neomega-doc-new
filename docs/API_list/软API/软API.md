# 软 API

由于版本控制、跨进程问题以及 API 提供者并非底层框架而是框架内组件等原因，一些 API 并未包装成函数形式供调用，而是以软 API 形式提供。这些软 API 类似于发往服务器的 JSON 请求。

事实上，使用 `when_called_by_api_named` 创建的跨插件 API 同样是一个跨进程的软 API。

## 示例

### HashedUserID

用户 Token 的哈希（若无 Token，此项为空。注意，可能随验证服务器密码改变而改变）。

```lua
local hashed_user_id, found = coromega:soft_get("HashedUserID")
coromega:print("hashed_user_id", hashed_user_id)
```

### HashedServerCode

用户服务器号的哈希。

```lua
local hashed_server_code, found = coromega:soft_get("HashedServerCode")
coromega:print("hashed_server_code", hashed_server_code)
```

### GetNameRecord

使用一个准确的名字请求与之关联的历史或当前名字。

- 输入：
  ```json
  {
    "current_name": "string"
  }
  ```

- 输出：
  ```json
  {
    "history_names": "string"
  }
  ```

示例代码：

```lua
local ret, err = coromega:call_other_plugin_api("GetNameRecord", {
    ["current_name"] = "FBot_cb7826",
})
coromega:print("ret: ", json.encode(ret))
coromega:print("err: ", json.encode(err))
```

### SearchForName

使用一个名字或名字片段（例如使用 "40" 搜索出 "2401PT"）搜索玩家的历史名字。

- 输入：
  ```json
  {
    "part_of_name": "string",
    "max_results": "int" // 最大返回数量
  }
  ```

- 输出：
  ```json
  {
    "possible_names": [
      {
        "current": "string", // 当前名
        "history": "string"  // 历史名（如果命中历史名）
      }
    ]
  }
  ```

示例代码：

```lua
local ret, err = coromega:call_other_plugin_api("SearchForName", {
    ["part_of_name"] = "401P",
    ["max_results"] = 4,
})
coromega:print("ret: ", json.encode(ret)) -- {"possible_names":[{"current":"2401PT","history":"2401PT"}]}
coromega:print("err: ", json.encode(err))
```