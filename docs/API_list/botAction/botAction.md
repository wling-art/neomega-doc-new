# 机器人操作相关 API

## 扔出指定快捷栏的物品

### `drop_item(slot)`

- **范围**：协程内
- **说明**：机器人扔出指定快捷栏中的物品
- **参数**：
  - `slot` (number)：要扔出的物品所在快捷栏的槽位号 (0~8)
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:drop_item(0)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 生成物品到指定快捷栏

### `make_item(item_info, slot_id, anvil_pos, container_pos)`

- **范围**：协程内
- **说明**：机器人根据数据制作物品放到自己的指定快捷栏中
- **参数**：
  - `item_info` (string)：物品 nbt 的 JSON 字符串
  - `slot_id` (number)：要放入的快捷栏的槽位号 (0~8)
  - `anvil_pos` (table)：铁砧坐标，形如 `{x=-6,y=-60,z=-24}`
  - `container_pos` (table)：容器坐标，形如 `{x=-6,y=-60,z=-24}`
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local item_data = [[{"name":"white_shulker_box","val":0,"is_block":true,"display_name":"示例盒子"}]]
local err = coromega:make_item(item_data, 0, {x=-6,y=-60,z=-24}, {x=-8,y=-60,z=-24})
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 移动物品

### `move_item(source_slot, target_slot, count)`

- **范围**：协程内
- **说明**：机器人将指定物品栏中的物品移动到其他物品栏中
- **参数**：
  - `source_slot` (number)：源槽位号 (0~44)
  - `target_slot` (number)：目标槽位号 (0~44)
  - `count` (number)：移动的物品数量
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:move_item(0, 9, 1) -- 将快捷栏第一格物品移动一个到背包第一格
coromega:print(("运行结果：%s"):format(err or "成功"))
```

### `move_item_to_container(container_pos, move_operations)`

- **范围**：协程内
- **说明**：机器人将指定物品栏中的物品放入指定容器的指定格子中
- **参数**：
  - `container_pos` (table)：容器坐标，形如 `{x=-6,y=-60,z=-24}`
  - `move_operations` (table)：背包格子号到容器格子号的映射
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local move_operations = {
    [0] = 0,  -- 快捷栏第1格移动到容器第1格
    [9] = 1,  -- 背包第1格移动到容器第2格
}
local err = coromega:move_item_to_container({x=-6,y=-60,z=-24}, move_operations)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 物品改名

### `rename_item(anvil_pos, slot, new_name, auto_gen_anvil)`

- **范围**：协程内
- **说明**：机器人将指定快捷栏中的物品改名
- **参数**：
  - `anvil_pos` (table)：铁砧坐标，形如 `{x=-6,y=-60,z=-24}`
  - `slot` (number)：快捷栏槽位号 (0~8)
  - `new_name` (string)：新名字
  - `auto_gen_anvil` (boolean)：是否自动生成铁砧
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:rename_item({x=-6,y=-60,z=-24}, 0, "新名字", true)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 物品附魔

### `enchant_item(slot, enchants)`

- **范围**：协程内
- **说明**：机器人将指定快捷栏中的物品附魔
- **参数**：
  - `slot` (number)：快捷栏槽位号 (0~8)
  - `enchants` (table)：附魔效果 ID 及其对应的等级
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:enchant_item(0, {
    [9] = 1,   -- 锋利 I
    [12] = 2,  -- 击退 II
})
coromega:print(("运行结果：%s"):format(err or "成功"))
```

- 附魔效果 id 如下：

| 编号 | 附魔效果   |
| ---- | ---------- |
| 0    | 保护       |
| 1    | 火焰保护   |
| 2    | 摔落缓冲   |
| 3    | 爆炸保护   |
| 4    | 弹射物保护 |
| 5    | 荆棘       |
| 6    | 水下呼吸   |
| 7    | 深海探索者 |
| 8    | 水下速掘   |
| 9    | 锋利       |
| 10   | 亡灵杀手   |
| 11   | 节肢杀手   |
| 12   | 击退       |
| 13   | 火焰附加   |
| 14   | 抢夺       |
| 15   | 效率       |
| 16   | 精准采集   |
| 17   | 耐久       |
| 18   | 时运       |
| 19   | 力量       |
| 20   | 冲击       |
| 21   | 火矢       |
| 22   | 无限       |
| 23   | 海之眷顾   |
| 24   | 饵钓       |
| 25   | 冰霜行者   |
| 26   | 经验修补   |
| 27   | 绑定诅咒   |
| 28   | 消失诅咒   |
| 29   | 穿刺       |
| 30   | 激流       |
| 31   | 忠诚       |
| 32   | 引雷       |
| 33   | 多重射击   |
| 34   | 穿透       |
| 35   | 快速装填   |
| 36   | 灵魂疾行   |
| 37   | 迅捷潜行   |

如果输入非上述数字则视为效果`魔咒`。

## 使用物品

### `use_item(slot)`

- **范围**：协程内
- **说明**：机器人使用指定快捷栏中的物品
- **参数**：
  - `slot` (number)：快捷栏槽位号 (0~8)
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:use_item(0)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 对方块使用物品

### `use_item_on_block(block_pos, face, slot, blockNEMCRuntimeID)`

- **范围**：协程内
- **说明**：机器人对方块使用指定快捷栏中的物品
- **参数**：
  - `block_pos` (table)：目标方块坐标，形如 `{x=-6,y=-60,z=-24}`
  - `face` (number)：方块的面 (0:y-, 1:y+, 2:z-, 3:z+, 4:x-, 5:x+)
  - `slot` (number)：快捷栏槽位号 (0~8)
  - `blockNEMCRuntimeID` (number|nil)：目标方块的 runtimeid
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:use_item_on_block({x=-7,y=-56,z=-27}, 1, 0)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

### `use_item_on_block_with_bot_offset(block_pos, bot_offset, face, slot, blockNEMCRuntimeID)`

- **范围**：协程内
- **说明**：机器人在指定的偏移位置对方块使用指定快捷栏中的物品
- **参数**：
  - `block_pos` (table)：目标方块坐标，形如 `{x=-6,y=-60,z=-24}`
  - `bot_offset` (table)：机器人偏移坐标，形如 `{x=-6,y=-60,z=-24}`
  - `face` (number)：方块的面 (0:y-, 1:y+, 2:z-, 3:z+, 4:x-, 5:x+)
  - `slot` (number)：快捷栏槽位号 (0~8)
  - `blockNEMCRuntimeID` (number|nil)：目标方块的 runtimeid
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:use_item_on_block_with_bot_offset({x=-7,y=-56,z=-27}, {x=1,y=0,z=0}, 1, 0)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 获取目标坐标的方块到对应快捷栏

### `pick_block(block_pos, target_hotbar, retry_times)`

- **范围**：协程内
- **说明**：机器人从指定坐标获取方块并放入对应的快捷栏
- **参数**：
  - `block_pos` (table)：方块坐标，形如 `{x=-6,y=-60,z=-24}`
  - `target_hotbar` (number)：快捷栏槽位号 (0~8)
  - `retry_times` (number)：失败重试次数
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:pick_block({x=0, y=64, z=0}, 0, 3)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 主手切换

### `select_hotbar(slot)`

- **范围**：协程内
- **说明**：机器人将主手切换到指定的快捷栏格子
- **参数**：
  - `slot` (number)：快捷栏槽位号 (0~8)
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:select_hotbar(0)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 破坏方块并拾取掉落物

### `break_and_pick_block(block_pos, recover_block, retry_times)`

- **范围**：协程内
- **说明**：机器人破坏指定坐标的方块并将掉落物品拾取到对应的快捷栏
- **参数**：
  - `block_pos` (table)：方块坐标，形如 `{x=-6,y=-60,z=-24}`
  - `recover_block` (boolean)：是否恢复方块
  - `retry_times` (number)：失败重试次数
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:break_and_pick_block({x=0, y=64, z=0}, true, 3)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 获取指定物品栏内物品的信息

### `get_inventory_content(slot, windows)`

- **范围**：任意
- **说明**：机器人获取指定物品栏槽位内物品的信息
- **参数**：
  - `slot` (number)：物品栏槽位号 (0~44)
  - `windows` (number|nil)：指定窗口，默认为 0
- **返回值**：table 类型的物品信息，boolean 类型表示是否成功获取
- **示例**：

```lua
local item_info, success = coromega:get_inventory_content(0)
if success then
    coromega:print(("物品信息：%s"):format(json.encode(item_info)))
else
    coromega:print("获取物品信息失败")
end
```

## 设置结构方块的内容

### `set_structure_block_data(block_pos, settings)`

- **范围**：任意
- **说明**：机器人设置指定坐标的结构方块的内容
- **参数**：
  - `block_pos` (table)：方块坐标，形如 `{x=-6,y=-60,z=-24}`
  - `settings` (table)：nbt 表，用于设置结构方块的内容
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local block_pos = {x=0, y=64, z=0}
local settings = {
    -- 结构方块的设置
}
local err = coromega:set_structure_block_data(block_pos, settings)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 对指定位置下的容器放置内容

### `set_container_content(container_pos, container_data_json)`

- **范围**：协程内
- **说明**：机器人对指定位置下的容器放置内容
- **参数**：
  - `container_pos` (table)：容器位置，形如 `{x=-6,y=-60,z=-24}`
  - `container_data_json` (string)：容器内容的 JSON 字符串
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local container_pos = {x=-6, y=-60, z=-24}
local container_data = [[{"0":{"item":{"name":"stone","val":0},"count":64}}]]
local err = coromega:set_container_content(container_pos, container_data)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 根据内容写成书放到对应快捷栏

### `write_book(slotID, pages, title, author)`

- **范围**：协程内
- **说明**：机器人根据内容写成书并放到对应的快捷栏
- **参数**：
  - `slotID` (number)：快捷栏槽位号 (0~8)
  - `pages` (table)：每页内容的字符串数组
  - `title` (string)：书名
  - `author` (string)：作者名
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local pages = {"第一页内容", "第二页内容", "第三页内容"}
local err = coromega:write_book(0, pages, "我的书", "作者")
coromega:print(("运行结果：%s"):format(err or "成功"))
```

好的，我继续整理剩余的内容：

## 物品展示框放入物品

### `place_item_frame_item(block_pos, slotID)`

- **范围**：协程内
- **说明**：机器人将指定快捷栏中的物品放入指定坐标的物品展示框
- **参数**：
  - `block_pos` (table)：物品展示框位置，形如 `{x=-6,y=-60,z=-24}`
  - `slotID` (number)：快捷栏槽位号 (0~8)
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local err = coromega:place_item_frame_item({x=-6, y=-60, z=-24}, 0)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 生成内容类型的容器

### `gen_container(pos, container_data_json, container_block)`

- **范围**：协程内
- **说明**：机器人在指定位置生成指定类型的容器，并放入指定内容
- **参数**：
  - `pos` (table)：放置位置，形如 `{x=-6,y=-60,z=-24}`
  - `container_data_json` (string)：容器内容的 JSON 字符串
  - `container_block` (string)：容器方块名
- **返回值**：string 类型报错信息|nil
- **示例**：

```lua
local container_pos = {x=-6, y=-60, z=-24}
local container_data = [[{"0":{"item":{"name":"stone","val":0},"count":64}}]]
local container_block = "chest [\"facing_direction\"=4]"
local err = coromega:gen_container(container_pos, container_data, container_block)
coromega:print(("运行结果：%s"):format(err or "成功"))
```

## 容器支持

以下是一个更完整的示例，展示了如何处理容器内容：

```lua
local omega = require("omega")
local json = require("json")
--- @type Coromega
local coromega = require("coromega").from(omega)

-- 如果你需要调试请将下面一段解除注释，关于调试的方法请参考文档
-- local dbg = require('emmy_core')
-- dbg.tcpConnect('localhost', 9966)
-- print("waiting...")
-- for i=1,1000 do -- 调试器需要一些时间来建立连接并交换所有信息
--     -- 如果始终无法命中断点，你可以尝试将 1000 改的更大
--     print(".")
-- end
-- print("end")

-- 容器支持
coromega:when_called_by_terminal_menu({
    triggers = { "chest" },
    argument_hint = "",
    usage = "chest",
}):start_new(function(input)
    -- 假设在 1036，102，1038 处有一个 nbt 方块，我们要先读出来
    local move_bot = true -- 机器人读取前自动移动到附近
    -- 读取这片区域 (只有1格)
    local canvas = coromega:request_structure({ x = 1036, y = 102, z = 1038 }, { x = 1, y = 1, z = 1 }, true)
    -- 这片区域的起点是? -- {"x":1036,"y":102,"z":1038}
    coromega:print(canvas:get_start_pos())
    -- 这个方块是什么?
    local block_runtime_id, found = canvas:block({ x = 1036, y = 102, z = 1038 })
    if not found then
        error("没有方块! 获取失败!")
    end
    local block_name, block_state = omega.blocks.rtid_to_block_name_and_state(block_runtime_id)
    -- 方块名=chest 方块属性=["facing_direction"=4]
    coromega:print(("方块名=%s 方块属性=%s"):format(block_name, block_state))
    -- 这个方块有nbt吗?
    local block_runtime_id, nbt, found = canvas:block_with_nbt({ x = 1036, y = 102, z = 1038 })
    if nbt:is_empty() then
        error("nbt 是空的! ")
    end
    -- nbt 里有什么?
    -- {"Findable": 0b, "IsIgnoreShuffle": 0b, "IsOpened": 1b, "Items": [{"Block": {"name": "minecraft:stone", "states": {"stone_type": "stone"}, "val": 0s, "version": 18090528}, "CanDestroy": ["minecraft:sand"], "CanPlaceOn": ["minecraft:grass", "minecraft:stone"], "Count": 5b, "Damage": 0s, "Name": "minecraft:stone", "Slot": 0b, "WasPickedUp": 0b}, {"CanDestroy": ["minecraft:sand"], "CanPlaceOn": ["minecraft:grass", "minecraft:stone"], "Count": 1b, "Damage": 0s, "Name": "minecraft:diamond_sword", "Slot": 1b, "WasPickedUp": 0b, "tag": {"Damage": 0, "RepairCost": 0, "display": {"Name": "剑1"}, "minecraft:keep_on_death": 1b}}, {"Block": {"name": "minecraft:white_shulker_box", "states": {}, "val": 0s, "version": 18090528}, "Count": 1b, "Damage": 0s, "Name": "minecraft:white_shulker_box", "Slot": 2b, "WasPickedUp": 0b, "tag": {"Items": [{"Count": 1b, "Damage": 0s, "Name": "minecraft:writable_book", "Slot": 0b, "WasPickedUp": 0b, "tag": {"pages": [{"photoname": "", "text": "0"}, {"photoname": "", "text": "0"}, {"photoname": "", "text": "0"}]}}, {"Count": 1b, "Damage": 0s, "Name": "minecraft:written_book", "Slot": 1b, "WasPickedUp": 0b, "tag": {"author": "无名之人", "generation": 0, "pages": [{"photoname": "", "text": "0"}, {"photoname": "", "text": "0"}, {"photoname": "", "text": "0"}], "title": "有名之书", "xuid": ""}}, {"Count": 1b, "Damage": 0s, "Name": "minecraft:written_book", "Slot": 2b, "WasPickedUp": 0b, "tag": {"RepairCost": 0, "author": "无名之人", "display": {"Name": "铁砧"}, "generation": 0, "pages": [{"photoname": "", "text": "0"}, {"photoname": "", "text": "0"}, {"photoname": "", "text": "0"}], "title": "有名之书", "xuid": ""}}]}}], "id": "Chest", "isMovable": 1b, "x": 1036, "y": 102, "z": 1038}
    coromega:print(nbt:to_str())

    -- 那么，关键是，我该如何才能有效的对它操作?
    -- 首先，为了让各位使用起来变得容易，我们后面的api全部使用 json 字符串，
    -- 但是这种还不行，因为它会丢失信息，所以我们必须将其转换成支持的格式的 json 字符串，这样信息就不会丢失了
    -- 而支持的 nbt 目前包括: 容器、告示牌、展示框、命令块, 它们的 support type 分别是 container_data,sign_data,item_data,command_block_data

    local supported_json_str, aux_info, support_type = nbt:to_supported_json(block_runtime_id)
    if support_type == "fail" then
        error("不行,这种nbt,不支持")
    else
        coromega:print("支持类型为: ", support_type) -- container_data
    end
    -- 只有展示框的旋转才会输出在 aux_info 中，aux_info 不然都是空的
    -- supported_json_str 长啥样? {"0":{"item":{"name":"stone","val":0,"base_props":{"can_place_on":["minecraft:grass","minecraft:stone"],"can_destroy":["minecraft:sand"]},"is_block":true,"block_bedrock_state_string":"[\"stone_type\"=\"stone\"]"},"count":5},"1":{"item":{"name":"minecraft:diamond_sword","val":0,"base_props":{"can_place_on":["minecraft:grass","minecraft:stone"],"can_destroy":["minecraft:sand"],"keep_on_death":true},"is_block":false,"display_name":"剑1"},"count":1},"2":{"item":{"name":"white_shulker_box","val":0,"is_block":true,"block_bedrock_state_string":"[]","complex_block_data":{"container":{"0":{"item":{"name":"minecraft:writable_book","val":0,"is_block":false,"specific_known_item_data":{"pages":["0","0","0"]}},"count":1},"1":{"item":{"name":"minecraft:written_book","val":0,"is_block":false,"specific_known_item_data":{"pages":["0","0","0"],"book_author":"无名之人","book_name":"有名之书"}},"count":1},"2":{"item":{"name":"minecraft:written_book","val":0,"is_block":false,"specific_known_item_data":{"pages":["0","0","0"],"book_author":"无名之人","book_name":"有名之书"},"display_name":"铁砧"},"count":1}}}},"count":1}}
    coromega:print(supported_json_str)
    -- wow, 不是很好读对吗? 没关系, 你可以用这个:
    coromega:print(coromega:translate(supported_json_str, "container_data"))
    -- 容器内容:
    --  5个 石头[特殊值=0] 物品方块属性:["stone_type"="stone"]
    --  |  -基础属性:
    --  |   可被放置于:  草方块 石头
    --  1个 钻石剑[特殊值=0]
    --  |  -基础属性:
    --  |   可被放置于:  草方块 石头
    --  |   死亡时保留
    --  |  -被命名为: 剑1
    --  1个 白色潜影盒[特殊值=0] 物品方块属性:[]
    --  |  -包含子容器:
    --  |   容器内容:
    --  |     1个 书与笔[特殊值=0]
    --  |     |  -信息:书名:  作者:  页数: 3
    --  |     1个 minecraft:written_book[特殊值=0]
    --  |     |  -信息:书名: 有名之书 作者: 无名之人 页数: 3
    --  |     1个 minecraft:written_book[特殊值=0]
    --  |     |  -信息:书名: 有名之书 作者: 无名之人 页数: 3
    --  |     |  -被命名为: 铁砧 false

    -- 现在，你可以安全的操作这个json了，用任何你喜欢的方式，比如我在这里要把第0格的东西复制一份放在第5格
    local data = json.decode(supported_json_str)
    data["5"] = json.decode(json.encode(data["0"]))

    -- 当然，你也可以读取其中的一个槽或者里面的物品信息，并用易于读取的方式显示他们
    coromega:print(coromega:translate(json.encode(data["0"]), "container_slot_data"))
    -- 5个 石头[特殊值=0] 物品方块属性:["stone_type"="stone"]
    -- -基础属性:
    --  可被放置于:  草方块 石头 false
    coromega:print(coromega:translate(json.encode(data["0"]["item"]), "item_data"))
    -- 石头[特殊值=0] 物品方块属性:["stone_type"="stone"]
    -- -基础属性:
    --  可被放置于:  草方块 石头 false

    -- 你可以进行任何你喜欢的操作，只需要记得把它变回 json_str
    supported_json_str = json.encode(data)

    -- 那么，现在，boom，该生成这个箱子了!
    local err = coromega:gen_container({ x = 1036, y = 104, z = 1038 }, supported_json_str,
        "chest [\"facing_direction\"=4]")
    if err ~= nil then
        coromega:print("出现错误: ", err)
    else
        coromega:print("成功!")
    end
end)

coromega:run()

```
