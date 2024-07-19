# HTTP 相关 API

## `http_request(method, url, option)`

- **范围**: 协程内
- **说明**: 发送 HTTP 请求
- **参数**:
  - `method` (string): 请求方法（如 "GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"）
  - `url` (string): 请求的 URL 地址
  - `option` (table, optional): 请求的选项，参考 [gluahttp](https://github.com/cjoudrey/gluahttp) 的选项
- **返回值**:
  - `response` (table): 请求结果对象，包括以下成员：
    - `status_code` (number): 状态码
    - `headers` (table): 响应头
    - `body_size` (number): 响应体长度
    - `body` (string): 响应体内容
    - `cookies` (table): 响应 cookies
    - `url` (string): 请求的 URL
  - `error_message` (string, optional): 错误信息

**示例**:

```lua
local response, error_message = coromega:http_request("GET", "http://example.com", {
    query = "page=1",
    timeout = "30s",
    headers = {
        Accept = "*/*"
    }
})
if error_message then
    print("request error: ", error_message)
else
    print("request response: ", response)
    print("status_code: ", response.status_code)
    print("headers: ", response.headers)
    print("body_size: ", response.body_size)
    print("body: ", response.body)
    print("cookies: ", response.cookies)
    print("url: ", response.url)
end
```

## `http_get(url, option)`

- **说明**: 执行 GET 请求，等效于 `http_request("GET", url, option)`

**示例**:

```lua
local response, error_message = coromega:http_get("http://example.com", {
    query = "page=1",
    timeout = "30s",
    headers = {
        Accept = "*/*"
    }
})
```

## `http_post(url, option)`

- **说明**: 执行 POST 请求，等效于 `http_request("POST", url, option)`

**示例**:

```lua
local response, error_message = coromega:http_post("http://example.com", {
    body = "key=value"
})
```

## `http_put(url, option)`

- **说明**: 执行 PUT 请求，等效于 `http_request("PUT", url, option)`

**示例**:

```lua
local response, error_message = coromega:http_put("http://example.com", {
    body = "key=value"
})
```

## `http_delete(url, option)`

- **说明**: 执行 DELETE 请求，等效于 `http_request("DELETE", url, option)`

**示例**:

```lua
local response, error_message = coromega:http_delete("http://example.com")
```

## `http_head(url, option)`

- **说明**: 执行 HEAD 请求，等效于 `http_request("HEAD", url, option)`

**示例**:

```lua
local response, error_message = coromega:http_head("http://example.com")
```

## `http_patch(url, option)`

- **说明**: 执行 PATCH 请求，等效于 `http_request("PATCH", url, option)`

**示例**:

```lua
local response, error_message = coromega:http_patch("http://example.com", {
    body = "key=value"
})
```

## 综合使用示例

```lua
local omega = require("omega")
package.path = ("%s;%s"):format(
    package.path,
    omega.storage_path.get_code_path("LuaLoader", "?.lua")
)
local coromega = require("coromega").from(omega)

coromega:start_new(function()
    local response, error_message = coromega:http_request("GET", "http://example.com", {
        query = "page=1",
        timeout = "30s",
        headers = {
            Accept = "*/*"
        }
    })
    if error_message then
        print("request error: ", error_message)
    else
        print("request response: ", response)
        print("status_code: ", response.status_code)
        print("headers: ", response.headers)
        print("body_size: ", response.body_size)
        print("body: ", response.body)
        print("cookies: ", response.cookies)
        print("url: ", response.url)
    end

    -- 使用 http_get:
    -- local response, error_message = coromega:http_get("http://example.com", {
    --     query = "page=1",
    --     timeout = "30s",
    --     headers = {
    --         Accept = "*/*"
    --     }
    -- })

    -- 使用 http_post:
    -- local response, error_message = coromega:http_post("http://example.com")
end)

coromega:run()
```

# 存储相关 API

## `config_path_of(...)`

- **范围**: 任意
- **说明**: 获取配置文件（插件）路径
- **参数**: 任意数量的路径片段，将被追加到配置路径后
- **返回值**: 返回配置文件路径加上参数后的新路径

**示例**:

```lua
coromega:config_path_of("test") -- ${neomega_storage}/config/test
coromega:config_path_of("插件", "配置.json") -- ${neomega_storage}/config/插件/配置.json
```

## `code_path_of(...)`

- **范围**: 任意
- **说明**: 获取代码文件（插件）路径
- **参数**: 任意数量的路径片段，将被追加到代码文件路径后
- **返回值**: 返回代码文件路径加上参数后的新路径字符串

**示例**:

```lua
coromega:code_path_of("LuaLoader", "test") -- {$storage$}/lang/LuaLoader/test
```

## `data_path_of(...)`

- **范围**: 任意
- **说明**: 获取数据文件路径
- **参数**: 任意数量的路径片段，将被追加到数据路径后
- **返回值**: 返回数据路径加上参数后的新路径

**示例**:

```lua
coromega:data_path_of("test") -- {$storage$}/data/test
coromega:data_path_of("小说文件夹", "雪国冒险奇谭.txt") -- {$storage$}/data/小说文件夹/雪国冒险奇谭.txt
```

## `cache_path_of(...)`

- **范围**: 任意
- **说明**: 获取缓存路径，neomega 不会清除此路径下的文件，但需要注意缓存文件的存在性
- **参数**: 任意数量的路径片段，将被追加到缓存路径后
- **返回值**: 返回缓存路径加上参数后的新路径

**示例**:

```lua
coromega:cache_path_of("test") -- {$storage$}/cache/test
```

## `make_temp_dir()`

- **范围**: 任意
- **说明**: 创建一个临时目录，并返回该目录的路径。neomega 重启时会自动删除此目录
- **返回值**: 临时目录的路径

**示例**:

```lua
coromega:make_temp_dir() -- 临时目录路径
```

## `path_join(...)`

- **范围**: 任意
- **说明**: 将多个路径字符串拼接成新路径
- **参数**: 任意数量的路径字符串
- **返回值**: 拼接后的路径

**示例**:

```lua
local path = coromega:path_join("storage", "test") -- storage/test
```

## `path_list(path)`

- **范围**: 任意
- **说明**: 列出指定路径下的所有文件和目录
- **参数**:
  - `path` (string): 指定的路径
- **返回值**: 文件/目录列表

**示例**:

```lua
local all_files = coromega:path_list("storage")
local all_files = coromega:path_list("path/to/dir")
local all_files = coromega:path_list(coromega:path_join("storage", "test"))
```

## `path_abs(path)`

- **范围**: 任意
- **说明**: 获取指定路径的绝对路径
- **参数**:
  - `path` (string): 需要获取绝对路径的路径
- **返回值**: 路径的绝对路径

**示例**:

```lua
local abs_path = coromega:path_abs("storage")
```

## `path_ext(path)`

- **范围**: 任意
- **说明**: 获取指定路径文件的扩展名
- **参数**:
  - `path` (string): 需要获取扩展名的文件路径
- **返回值**: 文件的扩展名

**示例**:

```lua
local ext = coromega:path_ext("test.lua") -- .lua
```

## `path_move(src, dst)`

- **范围**: 任意

- **说明**: 将文件或目录从 `src` 移动到 `dst`
- **参数**:
  - `src` (string): 源路径
  - `dst` (string): 目标路径
- **返回值**: 无

**示例**:

```lua
coromega:path_move("test", "test2")
```

## `path_remove(path)`

- **范围**: 任意
- **说明**: 删除指定路径的文件或目录
- **参数**:
  - `path` (string): 需要删除的路径
- **返回值**: 无

**示例**:

```lua
coromega:path_remove("test")
```

## `path_exist(path)`

- **范围**: 任意
- **说明**: 判断指定路径是否存在
- **参数**:
  - `path` (string): 需要判断的路径
- **返回值**: 布尔值，指示路径是否存在

**示例**:

```lua
local is_exist = coromega:path_exist("test")
```

## `save_text(path, data)`

- **范围**: 任意
- **说明**: 将文本/字符串保存到指定路径的文件中
- **参数**:
  - `path` (string): 需要保存的文件路径
  - `data` (string): 需要保存的文本/字符串
- **返回值**: 无

**示例**:

```lua
coromega:save_text(coromega:data_path_of("test.txt"), "Hello World!")
```

## `load_text(path)`

- **范围**: 任意
- **说明**: 从指定路径读取文本数据
- **参数**:
  - `path` (string): 需要读取的路径
- **返回值**: 读取的文本数据

**示例**:

```lua
local data = coromega:load_text(coromega:data_path_of("test.txt"))
```

## `save_data(path, data)`

- **范围**: 任意
- **说明**: 将数据以 JSON 形式保存到指定路径的文件中
- **参数**:
  - `path` (string): 需要保存的文件路径
  - `data` (any): 需要保存的数据
- **返回值**: 无

**示例**:

```lua
coromega:save_data(coromega:data_path_of("test.json"), { message = "Hello World!" })
```

## `load_data(path)`

- **范围**: 任意
- **说明**: 从指定路径读取 JSON 数据
- **参数**:
  - `path` (string): 需要读取的路径
- **返回值**: 读取的数据

**示例**:

```lua
local data = coromega:load_data(coromega:data_path_of("test.json"))
```

# 数据库相关 API

## `key_value_db(path)`

- **范围**: 任意
- **说明**: 创建一个键值对数据库对象，如果路径不存在则自动创建
- **参数**:
  - `path` (string): 数据库文件路径
- **返回值**: 返回一个 `key_value_db` 对象

**示例**:

```lua
local db = coromega:key_value_db("storage_file")
```

## `get(key)`

- **范围**: 任意
- **说明**: 获取指定键的值
- **参数**:
  - `key` (string): 需要查询的键
- **返回值**: 返回键的值，若不存在则返回 `nil`

**示例**:

```lua
local value = db:get("test")
if not value then
    coromega:print("不存在该字符串")
end
```

## `set(key, value)`

- **范围**: 任意
- **说明**: 向数据库中存入一对键值对
- **参数**:
  - `key` (string): 键
  - `value` (string): 值
- **返回值**: 无

**示例**:

```lua
db:set("test", "Hello World!")
db:set("age", "18")
db:set("author", "{name='somebody', age=18, keywords={'machine_learning', 'computer_vision', 'nlp'}}")
```

## `delete(key)`

- **范围**: 任意
- **说明**: 删除指定键的键值对
- **参数**:
  - `key` (string): 需要删除的键
- **返回值**: 无

**示例**:

```lua
db:delete("test")
```

## `iter(fn)`

- **范围**: 任意
- **说明**: 遍历数据库中的所有键值对，并对每个键值对执行回调函数 `fn`
- **参数**:
  - `fn` (function): 遍历时的回调函数，接受两个参数：`key` 和 `value`
- **返回值**: 无

**示例**:

```lua
db:iter(function(key, value)
    coromega:print(key, value)
    local next = true
    return next
end)
```
