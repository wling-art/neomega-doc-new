# 方块和命令块放置相关 API

## 立即方块放置

### `place_block(pos, block_name, block_data)`

- **范围**: 任意
- **说明**: 在 `pos` 位置放置一个方块。
- **参数**:
  - `pos` (table)：放置的位置，包含 `x`、`y`、`z` 三个坐标。
  - `block_name` (string)：方块的名字。
  - `block_data` (string)：方块的数据。
- **返回值**: 无。

**示例**:

```lua
-- 在 1,2,3 位置放置一个状态为 0 的石头方块
coromega:place_block({ x = 1, y = 2, z = 3 }, "stone", "0")
```

### `place_command_block(pos, block_name, block_data, option)`

- **范围**: 任意
- **说明**: 在 `pos` 位置放置一个命令方块。
- **参数**:
  - `pos` (table)：放置的位置，包含 `x`、`y`、`z` 三个坐标。
  - `block_name` (string)：方块的名字。
  - `block_data` (number)：方块的状态。
  - `option` (table)：命令方块的配置，包括：
    - `need_red_stone` (boolean)：是否需要红石激活。
    - `conditional` (boolean)：是否有条件。
    - `command` (string)：方块的命令。
    - `name` (string)：方块的名称。
    - `tick_delay` (number)：延迟（tick 数）。
    - `track_output` (boolean)：是否显示输出。
    - `execute_on_first_tick` (boolean)：是否在第一次 tick 时执行。
- **返回值**: 错误信息 (string)。

**示例**:

```lua
-- 在 884.73.829 位置放置一个重复命令方块，命令为 list @a 10tick 后执行，并且需要红石激活 条件为真 名字为：列出所有玩家 延迟为 10 tick 输出结果 并且在第一次 tick 时执行
local err = coromega:place_command_block(
    { x = 884, y = 73, z = 829 },       -- 坐标
    "repeating_command_block",          -- command_block/chain_command_block/repeating_command_block
    0,                                  -- 方块数据，影响朝向
    {
        need_red_stone = true,          -- 红石激活
        conditional = true,             -- 有条件
        command = "list @a",            -- 命令
        name = "列出所有玩家",           -- 方块名
        tick_delay = 10,                -- 延迟
        track_output = true,            -- 显示输出
        execute_on_first_tick = true,   -- 执行第一个对象
    }
)
if err then
    coromega:print(err)
end
```

### `place_sign(pos, block_name, text, lighting)`

- **范围**: 任意
- **说明**: 在 `pos` 位置放置一个告示牌。
- **参数**:
  - `pos` (table)：放置的位置，包含 `x`、`y`、`z` 三个坐标。
  - `block_name` (string)：方块的名字。
  - `text` (string)：告示牌上的字。
  - `lighting` (boolean)：是否发光。
- **返回值**: 错误信息 (string)。

**示例**:

```lua
-- 在 1,-60,0 位置放置一个告示牌，上面写着 240! 同时发光
local err = coromega:place_sign(
    { x = 1, y = -60, z = 0 }, -- 坐标
    "jungle_standing_sign 0",
    "§a§l240!",
    true
)
if err then
    coromega:print(err)
end
```

## 区块构建 API

### `when_progress_increased_by_build(aread_chunk, start_pos, end_pos, target_pos, option)`

- **范围**: 任意
- **说明**: 导入结构或画布并实时获取构建进度。
- **参数**:
  - `aread_chunk` (Structure/Canvas)：需要导入的数据。
  - `start_pos` (table)：被导入的数据的起始位置，包含 `x`、`y`、`z` 三个坐标。
  - `end_pos` (table)：被导入的数据的结束位置，包含 `x`、`y`、`z` 三个坐标。
  - `target_pos` (table)：导入到的位置，包含 `x`、`y`、`z` 三个坐标。
  - `option` (table)：导入选项，包括：
    - `speed` (number)：导入速度。
    - `incremental` (boolean)：是否增量构建。
    - `force_use_block_state` (boolean)：是否强制使用 block state。
    - `ignore_nbt_block` (boolean)：是否忽略 NBT 方块。
    - `clear_target_block` (boolean)：导入时是否清除目标位置的方块。
    - `clear_dropped_item` (boolean)：导入时是否清理掉落物。
    - `auto_reverse` (boolean)：是否在重新开始时回退跃点。
    - `start_hop` (number)：开始跃点。
- **返回值**: 监听器 (Listener)，监听器的回调函数参数包括：
  - `total` (number)：任务总数。
  - `current` (number)：当前进度。
  - 当 `total == current` 时，导入完成。

**示例**:

```lua
coromega:when_progress_increased_by_build(
    target_structure_or_canvas,                  -- 需要被导的东西
    target_structure_or_canvas:get_start_pos(),  -- 被导的东西的起始位置
    target_structure_or_canvas:get_end_pos(),    -- 被导的东西的结束位置
    { x = 31000, y = 100, z = 11000 },           -- 导入到的位置
    {
        speed = 2000,                            -- 导入速度
        incremental = false,                     -- 增量构建 (false)
        force_use_block_state = false,           -- 强制使用 block state (false)
        ignore_nbt_block = false,                -- 是否忽略 NBT 方块 (false)
        clear_target_block = false,              -- 导入时是否清除目标位置的方块 (false)
        clear_dropped_item = false,              -- 导入时是否清理掉落物 (false)
        auto_reverse = true,                      -- 是否在重新开始时回退跃点 (true)
        start_hop = 0,                            -- 开始跃点 (0)
    }
):start_new(function(total, current)
    coromega:print(("progress: %d/%d"):format(total, current))
end)
```
