# 方块转换和 NBT 示例

## 方块转换 API

```lua
local blocks = omega.blocks
```

### 将传统格式方块转换为 runtime id 表示

- **`blocks.legacy_block_to_rtid`**: 将传统格式方块转换为 runtime id 表示 (注意，不应在文件中保存 runtime id，因为 runtime id 会随版本变化)
  ```lua
  local rtid, found = blocks.legacy_block_to_rtid("stained_glass", 1)
  print(found, rtid)
  ```

### 将 runtime id 表示的方块转为传统表示

- **`blocks.rtid_to_legacy_block`**
  ```lua
  local blockName, blockData, found = blocks.rtid_to_legacy_block(rtid)
  print(found, blockName, blockData)
  ```

### 将 runtime id 表示的方块转为 block name 和 block state 表示

- **`blocks.rtid_to_block_name_and_state`**
  ```lua
  local blockName, blockState, found = blocks.rtid_to_block_name_and_state(rtid)
  print(found, ("%s [%s]"):format(blockName, blockState))
  ```

### 将 block name 和 block state 表示转为 runtime id 表示

- **`blocks.block_name_and_state_to_rtid`**
  ```lua
  local rtid, found = blocks.block_name_and_state_to_rtid(blockName, blockState)
  print(found, rtid)
  ```

### 将 runtime id 表示的方块转为 Java 表示

- **`blocks.rtid_to_java_str`**
  ```lua
  local java_str, found = blocks.rtid_to_java_str(rtid)
  print(found, java_str)
  ```

### 将 Java 表示转为 runtime id 表示

- **`blocks.java_str_to_rtid`**
  ```lua
  local rtid, found = blocks.java_str_to_rtid(java_str)
  print(found, rtid)
  ```

## NBT 编辑与生成操作

```lua
local nbt = blocks.new_nbt()
```

### 从方块 NBT 中读取 ID

- **`nbt:get_id()`**
  ```lua
  local nbt_block_id = nbt:get_id()
  ```

### 从方块 NBT 中读取某个 key 的 string

- **`nbt:get_string(key)`**
  ```lua
  local value = nbt:get_string("name")
  ```

### 将方块 NBT 中某个 key 的值设置为指定 string

- **`nbt:set_string(key, value)`**
  ```lua
  local value = nbt:set_string("name", "#test")
  ```

### 复制 NBT 并获得副本

- **`nbt:copy()`**
  ```lua
  local copied_nbt = nbt:copy()
  ```

### 将 NBT 转为字符串表示

- **`nbt:to_str()`**
  ```lua
  local string_represent = nbt:to_str()
  ```

### 将字符串表示的内容恢复到此 NBT

- **`nbt:from_str(string_represent)`**
  ```lua
  local nbt = nbt:from_str(string_represent)
  ```

### 检查 NBT 是否为空

- **`nbt:is_empty()`**
  ```lua
  local is_empty = nbt:is_empty()
  ```

### 清除 NBT 内数据

- **`nbt:empty()`**
  ```lua
  nbt:empty()
  ```

## 建筑和画布操作

- **`structures.convert_file_to_structure(structure_path, structure_file_path)`**: 实现了 AreaChunk 和 Structure 概念，将文件转换为结构
  ```lua
  local structures = omega.structures
  local source_structure = structures.convert_file_to_structure(source_structure_dir, source_structure_file)
  ```

- **`structures.open_or_create_structure(path)`**: 打开或创建结构
  ```lua
  local structures = omega.structures
  local source_structure = structures.open_or_create_structure("some_dir")
  ```

- **`structures.new_canvas()`**: 创建一个新的 Canvas 对象
  ```lua
  local canvas = structures.new_canvas()
  ```

## Area Chunk 操作

### 复制和移动区域

- **`structures.copy(source, target, source_start_pos, source_end_pos, offset)`**
  ```lua
  local structures = omega.structures
  local source_start_pos = source_structure_or_canvas:get_start_pos()
  local source_end_pos = source_structure_or_canvas:get_end_pos()
  local offset = { x = 0, y = 0, z = 0 }
  structures.copy(source_structure_or_canvas, target_structure_or_canvas, source_start_pos, source_end_pos, offset)
  ```

### 调用 omega builder 构建区块范围的方块

- **`when_progress_increased_by_build(aread_chunk, start_pos, end_pos, target_pos, option)`**
  ```lua
  coromega:when_progress_increased_by_build(
      target_structure_or_canvas,
      target_structure_or_canvas:get_start_pos(),
      target_structure_or_canvas:get_end_pos(),
      { x = 31000, y = 100, z = 11000 },
      {
          speed = 2000,
          incremental = false,
          force_use_block_state = false,
          ignore_nbt_block = false,
          clear_target_block = false,
          clear_dropped_item = false,
          auto_reverse = true,
          start_hop = 0,
      }
  ):start_new(function(total, current)
      coromega:log(("progress: %d/%d"):format(total, current))
  end)
  ```

### 获取和设置区域起点和终点

- **`structure/canvas:get_start_pos()`**
  ```lua
  local start_pos = structure/canvas:get_start_pos()
  ```

- **`structure/canvas:set_start_pos(pos)`**
  ```lua
  structure/canvas:set_start_pos(pos)
  ```

- **`structure/canvas:get_end_pos()`**
  ```lua
  local end_pos = structure/canvas:get_end_pos()
  ```

- **`structure/canvas:set_end_pos(pos)`**
  ```lua
  structure/canvas:set_end_pos(pos)
  ```

#### 检查和设置区域属性

- **`structure/canvas:get_must_block_state()`**
  ```lua
  local must_block_state = structure/canvas:get_must_block_state()
  ```

- **`structure/canvas:set_must_block_state(must_block_state)`**
  ```lua
  structure/canvas:set_must_block_state(true)
  ```

### 请求一个区域的所有方块

- **`request_structure(start_pos, region_size, move_bot)`**
  ```lua
  local start_pos = { x = 10001, y = 100, z = 10000 }
  local region_size = { x = 14, y = 3, z = 4 }
  local move_bot = true
  local canvas = coromega:request_structure(start_pos, region_size, move_bot)
  ```

### 对区域内所有方块应用读取函数

- **`structure/canvas:apply_reader_to_blocks(start_pos, end_pos, reader_fn, option_ignore_air_block, option_ignore_nbt_block, option_ignore_normal_block)`**
  ```lua
  local function dump_region_snbt(start_pos, region_size)
      local move_bot = true
      local canvas = coromega:request_structure(start_pos, region_size, move_bot)
      local start_pos = canvas:get_start_pos()
      local end_pos = canvas:get_end_pos()
      local option_ignore_air_block = true
      local option_ignore_nbt_block = false
      local option_ignore_normal_block = true

      local reader_fn = function(x, y, z, block_rtid, nbt)
          -- 实际读取和打印操作
      end

      canvas:apply_reader_to_blocks(
          start_pos, end_pos,
          reader_fn,
          option_ignore_air_block, option_ignore_nbt_block, option_ignore_normal_block
      )
  end

  coromega:start_new(function()
      coromega:sleep(1)
      dump_region_snbt({ x = 10001, y = 100, z = 10000 }, { x = 14, y = 3, z = 4 })
  end)

  coromega:run()
  ```

### 对区域内所有方块应用变换

- **`structure/canvas:apply_alter_to_blocks(start_pos, end_pos, alter_fn, option_ignore_air_block, option_ignore_nbt_block, option_ignore_normal_block)`**
  ```lua
  local alter_start_pos = source_structure:get_start_pos()
  local alter_end_pos = source_structure:get_end_pos()
  local option_ignore_air_block = true
  local option_ignore_nbt_block = false
  local option_ignore_normal_block = true

  local alter_fn = function(x, y, z, block_rtid, nbt)
      -- 实际变换操作
      return block_rtid, nbt
  end

  target_structure:apply_alter_to_blocks(
      alter_start_pos, alter_end_pos,
      alter_fn,
      option_ignore_air_block, option_ignore_nbt_block, option_ignore_normal_block
  )
  ```

## Structure 操作

### 获得

区域块

- **`structure:copy_area(source, start_pos, end_pos)`**
  ```lua
  local area = structure:copy_area(source_structure, start_pos, end_pos)
  ```

### 获得结构块的大小

- **`structure:get_area_size()`**
  ```lua
  local size = structure:get_area_size()
  ```

### 请求结构块

- **`request_structure(start_pos, region_size, move_bot)`**
  ```lua
  local start_pos = { x = 10001, y = 100, z = 10000 }
  local region_size = { x = 14, y = 3, z = 4 }
  local move_bot = true
  local canvas = coromega:request_structure(start_pos, region_size, move_bot)
  ```
