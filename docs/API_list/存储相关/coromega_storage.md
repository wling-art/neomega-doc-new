# 存储相关 API

## 获取 config 文件 (插件) 路径

### `config_path_of(...)`

- **范围**: 任意
- **说明**: 获取 `config` 文件 (插件) 路径
- **参数**:
  - 任意数量的路径部分，添加在 `config` 后面
    > 参数可以是想要加上的子目录或文件名，参数会直接加在 `config` 路径后面
- **返回值**: 返回 `config` 加参数的文件存储路径

**示例**:

```lua
coromega:config_path_of("test") -- ${neomega_storage}/config/test
coromega:config_path_of("插件", "配置.json") -- ${neomega_storage}/config/插件/配置.json
```

## 获取代码文件 (插件) 路径

### `code_path_of(...)`

- **范围**: 任意
- **说明**: 获取代码文件 (插件) 路径
- **参数**:
  - 任意数量的路径部分，添加在 `code` 后面
    > 参数可以是想要加上的子目录或文件名，参数会直接加在 `code` 路径后面
- **返回值**: 返回代码文件路径加上参数路径后的新路径字符串

**示例**:

```lua
coromega:code_path_of("LuaLoader", "test") -- ${storage}/lang/LuaLoader/test
```

## 获取 data 文件路径

### `data_path_of(...)`

- **范围**: 任意
- **说明**: 获取 `data` 文件路径
- **参数**:
  - 任意数量的路径部分，添加在 `data` 后面
    > 参数可以是想要加上的子目录或文件路径，参数会直接加在 `data` 路径后面
- **返回值**: 返回 `data` 加参数的文件存储路径

**示例**:

```lua
coromega:data_path_of("test") -- ${storage}/data/test
coromega:data_path_of("小说文件夹", "雪国冒险奇谭.txt") -- ${storage}/data/小说文件夹/雪国冒险奇谭.txt
```

## 获取 cache 加上参数后的路径

### `cache_path_of(...)`

- **范围**: 任意
- **说明**: 获取 `cache` 加上参数后的路径
  - `neomega` 不会清除此路径下的文件
  - 如果此路径下的文件被清除，相关程序应当能正常工作
  - 应检查 `cache` 下的文件是否存在，而不能假设它存在
- **参数**:
  - 任意数量的路径部分，添加在 `cache` 后面
    > 参数可以是想要加上的子目录或文件路径，通常用于网络缓存，参数会直接加在 `cache` 路径后面
- **返回值**: 返回 `cache` 加参数的文件存储路径

**示例**:

```lua
coromega:cache_path_of("test") -- ${storage}/cache/test
```

## 创建临时目录

### `make_temp_dir()`

- **范围**: 任意
- **说明**: 新建一个临时文件夹，并返回该文件夹的路径，每次 `neomega` 重启时都会移除该文件夹
  :::tip
  该文件夹支持正常的读写和执行权限，而非类似安卓 `Downloads` 文件夹 (neomega 默认路径) 那样没有执行权限
  :::
- **返回值**: 临时文件夹的路径

**示例**:

```lua
coromega:make_temp_dir() -- 返回临时文件夹路径
```

## 路径拼接

### `path_join(...)`

- **范围**: 任意
- **说明**: 将多个路径字符串拼接成新路径
- **参数**:
  - 任意数量的路径字符串
- **返回值**: 返回拼接后的路径

**示例**:

```lua
local path = coromega:path_join("storage", "test") -- storage/test
```

## 列出目录下所有文件/文件夹

### `path_list(path)`

- **范围**: 任意
- **说明**: 列出指定路径下的所有文件或目录
- **参数**:
  - `path`: 指定路径
- **返回值**: 文件或目录的列表

**示例**:

```lua
local all_files = coromega:path_list("storage")
local all_files = coromega:path_list("path/to/dir")
local all_files = coromega:path_list(coromega:path_join("storage", "test"))
```

## 获取绝对路径

### `path_abs(path)`

- **范围**: 任意
- **说明**: 获取路径的绝对路径
- **参数**:
  - `path`: 需要获取绝对路径的路径
- **返回值**: 返回路径的绝对路径

**示例**:

```lua
local abs_path = coromega:path_abs("storage")
```

## 获取文件扩展名

### `path_ext(path)`

- **范围**: 任意
- **说明**: 获取路径文件的扩展名
- **参数**:
  - `path`: 需要获取扩展名的文件路径
- **返回值**: 返回路径的扩展名

**示例**:

```lua
local ext = coromega:path_ext("test.lua") -- .lua
```

## 移动文件

### `path_move(src, dst)`

- **范围**: 任意
- **说明**: 将源路径文件或目录移动到目标路径，相当于剪切
- **参数**:
  - `src`: 需要移动的路径
  - `dst`: 移动后的路径
- **返回值**: 无

**示例**:

```lua
coromega:path_move("test", "test2")
```

## 删除文件/目录

### `path_remove(path)`

- **范围**: 任意
- **说明**: 删除路径下的文件或目录
- **参数**:
  - `path`: 需要删除的文件路径或目录
- **返回值**: 无

**示例**:

```lua
coromega:path_remove("test")
```

## 判断路径是否存在

### `path_exist(path)`

- **范围**: 任意
- **说明**: 判断路径是否存在
- **参数**:
  - `path`: 需要判断的路径
- **返回值**: 返回路径是否存在的布尔值

**示例**:

```lua
local is_exist = coromega:path_exist("test")
```

## 字符串保存至文件

### `save_text(path, data)`

- **范围**: 任意
- **说明**: 将文本或字符串保存到路径指定的文件中
- **参数**:
  - `path`: 需要保存的文件路径
  - `data`: 需要保存的文本或字符串
- **返回值**: 无

**示例**:

```lua
coromega:save_text(coromega:data_path_of("test.txt"), "Hello World!")
```

## 读取文件字符串

### `load_text(path)`

- **范围**: 任意
- **说明**: 从路径指定的文件中读取文本数据
- **参数**:
  - `path`: 需要读取的文件路径
- **返回值**: 返回读取的文本数据

**示例**:

```lua
local data = coromega:load_text(coromega:data_path_of("test.txt"))
```

## 数据保存至文件

### `save_data(path, data)`

- **范围**: 任意
- **说明**: 将数据以 JSON 形式保存到路径指定的文件中
- **参数**:
  - `path`: 需要保存的文件路径
  - `data`: 需要保存的数据
- **返回值**: 无

**示例**:

```lua
coromega:save_data(coromega:data_path_of("test.json"), { greeting = "Hello World!" })
```

## 读取文件数据

### `load_data(path)`

- **范围**: 任意
- **说明**: 从路径指定的文件中读取 JSON 数据
- **参数**:
  - `path`: 需要读取的文件路径
- **返回值**: 返回读取的数据

**示例**:

```lua
local data = coromega:load_data(coromega:data_path_of("test.json"))
```

---

# 数据库相关 API

> 以下均为 `db` 对象的方法
> 注意： `neomega` 使用的是键值对数据库，即 `key:value` 的形式，`key` 和 `value` 都是字符串。

## 打开或创建一个 键-值 数据库

### `key_value_db(path,db_type)`
  - **范围**: 任意
  - **说明**: 根据 path 路径的数据库文件创建一个 `key_value_db` 对象<br>
    也就是 db 对象 如果不含有该文件 则自动创建 然后返回 db 对象
    数据库类型可以为以下三种之一:  
    1. "","text_log" 默认的实现   
       折中的实现，不会因为意外关闭导致数据库完全损坏，而且也是以可读方式存在的   
       手动修改数据库文件的时候需要先改log文件，log 文件内容必须遵循特定规则   
       每次启动时都会把数据保存内存中，因此正式使用时只有少量数据时适合使用这个数据   
    2. "level"  
       leveldb, 显然是最好的实现，然而，内部数据都是以二进制存储，无法阅读   
       leveldb 的 file lock 被移除，因此需要用其他手段保证不会同时写一个文件   
       适合在正式使用时使用   
    3. "json"   
       最慢的最不安全的实现，每次启动时都会把数据保存内存中，当数据变更时更新 json 文件    
       若在保存的时候程序被关闭，可能导致数据库完全损坏   
       好处是内容便于阅读和修改，只建议在开发和调试时使用   
  - **参数**:
    - `path`: 数据库的路径
    - `db_type`: 数据库类型: 应该为 "","text_log","level","json" 之一或空(等效于 "text_log")
  - **返回值**：返回一个 `key_value_db` 对象

**示例**:

```lua
  local textlog_db=coromega:key_value_db("text_db","text_log")
  local also_textlog_db=coromega:key_value_db("text_db")
  local json_db=coromega:key_value_db("json_db","json")
  local level_db=coromega:key_value_db("level_db","level")
```


## 获取数据对象

### `get(key)`

- **范围**: 任意
- **说明**: 获取指定 `key` 的值
- **参数**:
  - `key`: 需要查询的键值
- **返回值**: 返回 `key` 的值，如果没有则返回空字符串 `""` 或 `nil`

**示例**:

```lua
local value = db:get("test")
if not value then
    coromega:print("不存在该字符串")
end
```

## 存储数据

### `set(key, value)`

- **范围**: 任意
- **说明**: 向数据库中存入一对数据
- **参数**:
  - `key`: 索引
  - `value`: 存入的值
- **返回值**: 无

**示例**:

```lua
db:set("test", "Hello World!")
db:set("age", "18")
db:set("author", "{name=\"somebody\",age=\"18\",keywords={\"machine_learning\",\"computer_version\",\"nlp\"}}")
```

## 删除数据

### `delete(key)`

- **范围**: 任意
- **说明**: 删除指定 `key` 对应的键值对
  - 本质上是将 `key` 对应的值设为 `nil`
- **参数**:
  - `key`: 需要删除的 `key`
- **返回值**: 无

**示例**:

```lua
db:delete("test")
```

## 遍历数据库

### `iter(fn)`

- **范围**: 任意
- **说明**: 遍历数据库，为每个键值对执行回调函数 `fn`
- **参数**:
  - `fn`: 遍历时的回调函数
- **返回值**: 无

**示例**:

```lua
db:iter(function(key, value)
    coromega:print(key, value)
    local next = true
    return next
end)
```

## 迁移数据库

### `migrate_to(new_db)`
  - **范围**: 任意
  - **说明**: 将现有数据库内容迁移到一个新的数据库中
  - **参数**:
    - `new_db`: 新的数据库
  - **返回值**: 无
  
**示例**:

``` lua
  local src_db=coroemag:key_value_db("src","json")
  local dst_db=coromega:key_value_db("dst","level")
  src_db:migrate_to(target_db)
```


## SQL 数据库 (sqlite)

这部分的实现基本就是   
https://github.com/vadv/gopher-lua-libs/tree/master/db   
的复制   

但是因为此链接指向的实现因为 build flag 的原因，无法在 linux,macos,android 平台上工作，所以我们拷贝了这个实现并对其进行修改  

你可以访问:
https://github.com/vadv/gopher-lua-libs/tree/master/db 进一步了解 api 和实现细节，在这里我们仅仅给出一个示例代码

```lua
local omega = require("omega")
local json = require("json")
--- @type Coromega
local coromega = require("coromega").from(omega)

local config = {
  shared = true, -- share connections between lua states
  max_connections = 1, -- max connection (if you open shared connection with different max_connections - first win)
  read_only = false,   -- must execute read-write query
}

local sqlite, err = omega.sync_sql.open("sqlite3", "file:test.db?cache=shared&mode=memory", config)
if err then error(err) end

local result, err = sqlite:query("select 1")
if err then error(err) end
if not(result.rows[1][1] == 1) then error("sqlite error") end

local _, err = sqlite:exec("CREATE TABLE t (id int, name string);")
if err then error(err) end

for i = 1, 10 do
    local query = "INSERT INTO t VALUES ("..i..", \"name-"..i.."\");"
    if i % 2 == 0 then query = "INSERT INTO t VALUES ("..i..", NULL);" end
    local _, err = sqlite:exec(query)
    if err then error(err) end
end

local result, err = sqlite:query("select * from t;")
if err then error(err) end

for i, v in pairs(result.columns) do
    if i == 1 then if not(v == "id") then error("error") end end
    if i == 2 then if not(v == "name") then error("error") end end
end

for _, row in pairs(result.rows) do
    for id, name in pairs(result.columns) do
        print(name, row[id])
    end
end

local _, err = sqlite:exec("CREATE TABLE t_stmt (id int, name string);")
if err then error(err) end

-- stmt exec
local stmt, err = sqlite:stmt("insert into t_stmt (id, name) values (?, ?)")
if err then error(err) end
local result, err = stmt:exec(1, 'name-1')
if err then error(err) end
if not(result.rows_affected == 1) then error("affted: "..tostring(result.rows_affected)) end
local err = stmt:close()
if err then error(err) end

-- stmt query
local stmt, err = sqlite:stmt("select name from t_stmt where id = ?")
if err then error(err) end
local result, err = stmt:query(1)
if err then error(err) end
if not(result.rows[1][1] == 'name-1') then error("must be 'name-1': "..tostring(result.rows[1][1])) end
local err = stmt:close()
if err then error(err) end

-- command (outside transaction)
local _, err = sqlite:command("PRAGMA journal_mode = OFF;")
if err then error(err) end

local err = sqlite:close()
if err then error(err) end
coromega:when_called_by_terminal_menu({
    triggers = { "sql" },
    argument_hint = "[arg1] [arg2] ...",
    usage = "sql",
}):start_new(function(input)
    coromega:print("hello from sql!")
end)

coromega:run()
```
