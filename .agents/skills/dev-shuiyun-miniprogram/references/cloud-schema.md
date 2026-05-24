# Cloud Database Schema — 云数据库完整字段定义

> 所有集合均建议包含 `enabled` 字段（布尔值），用于控制内容是否在前端展示。

## `banners`

| 字段      | 类型    | 必填 | 说明                               |
| --------- | ------- | ---- | ---------------------------------- |
| `image`   | string  | 是   | 图片 URL（云存储 fileID 或 HTTPS） |
| `title`   | string  | 是   | Banner 标题                        |
| `enabled` | boolean | 是   | 是否展示                           |
| `sort`    | number  | 否   | 排序，越小越靠前                   |

## `news`

| 字段        | 类型    | 必填 | 说明                       |
| ----------- | ------- | ---- | -------------------------- |
| `title`     | string  | 是   | 标题                       |
| `summary`   | string  | 是   | 摘要                       |
| `source`    | string  | 否   | 来源                       |
| `date`      | string  | 是   | 发布日期（YYYY-MM-DD）     |
| `tag`       | string  | 否   | 标签文字                   |
| `category`  | string  | 是   | `notice`/`policy`/`around` |
| `cover`     | string  | 否   | 封面图 URL                 |
| `content`   | string  | 是   | 正文（支持换行）           |
| `viewCount` | number  | 否   | 浏览量                     |
| `enabled`   | boolean | 是   | 是否展示                   |

## `trades`

| 字段            | 类型     | 必填 | 说明                                            |
| --------------- | -------- | ---- | ----------------------------------------------- |
| `title`         | string   | 是   | 物品名称                                        |
| `price`         | number   | 是   | 现价                                            |
| `originalPrice` | number   | 是   | 原价                                            |
| `category`      | string   | 是   | `furniture`/`appliance`/`baby`/`books`/`others` |
| `images`        | string[] | 否   | 图片 URL 数组                                   |
| `seller`        | string   | 是   | 卖家昵称                                        |
| `time`          | string   | 是   | 发布时间                                        |
| `location`      | string   | 否   | 所在楼栋                                        |
| `description`   | string   | 否   | 详细描述                                        |
| `enabled`       | boolean  | 是   | 是否展示                                        |

## `services`

| 字段       | 类型     | 必填 | 说明           |
| ---------- | -------- | ---- | -------------- |
| `name`     | string   | 是   | 商家名称       |
| `address`  | string   | 是   | 地址           |
| `distance` | string   | 否   | 距离           |
| `hours`    | string   | 否   | 营业时间       |
| `phone`    | string   | 否   | 联系电话       |
| `tags`     | string[] | 否   | 标签数组       |
| `category` | string   | 是   | 与前端分类对应 |
| `enabled`  | boolean  | 是   | 是否展示       |
| `sort`     | number   | 否   | 排序           |

> 前端分类 ID：1=超市, 2=菜场, 3=美食, 4=银行, 5=交通, 6=学校, 7=休闲, 8=医疗, 9=商场

## `schedules`

| 字段          | 类型    | 必填 | 说明                               |
| ------------- | ------- | ---- | ---------------------------------- |
| `title`       | string  | 是   | 活动名称                           |
| `date`        | string  | 是   | 日期（YYYY-MM-DD）                 |
| `time`        | string  | 是   | 时间                               |
| `location`    | string  | 是   | 地点                               |
| `description` | string  | 否   | 详细说明                           |
| `status`      | string  | 否   | `upcoming`/`ended`（可由前端计算） |
| `type`        | string  | 否   | 类型标记                           |
| `enabled`     | boolean | 是   | 是否展示                           |

## `payments`

| 字段      | 类型    | 必填 | 说明     |
| --------- | ------- | ---- | -------- |
| `title`   | string  | 是   | 标题     |
| `summary` | string  | 是   | 摘要     |
| `tag`     | string  | 否   | 标签     |
| `date`    | string  | 是   | 发布日期 |
| `content` | string  | 是   | 正文     |
| `hot`     | boolean | 否   | 是否热门 |
| `enabled` | boolean | 是   | 是否展示 |

## `shuttle_config`

| 字段           | 类型     | 必填 | 说明     |
| -------------- | -------- | ---- | -------- |
| `routeName`    | string   | 是   | 路线名称 |
| `stops`        | string[] | 是   | 站点列表 |
| `contactPhone` | string   | 否   | 咨询电话 |
| `runNote`      | string   | 否   | 运行说明 |
| `enabled`      | boolean  | 是   | 是否启用 |

> 此集合通常只需 **1 条记录**。

## `shuttle_times`

| 字段      | 类型    | 必填 | 说明               |
| --------- | ------- | ---- | ------------------ |
| `time`    | string  | 是   | 发车时间（HH:MM）  |
| `sort`    | number  | 是   | 排序，决定显示顺序 |
| `enabled` | boolean | 是   | 是否展示           |

## `contacts`

| 字段      | 类型    | 必填 | 说明     |
| --------- | ------- | ---- | -------- |
| `label`   | string  | 是   | 显示名称 |
| `number`  | string  | 是   | 电话号码 |
| `enabled` | boolean | 是   | 是否展示 |
| `sort`    | number  | 否   | 排序     |

## `feedback_config`

| 字段          | 类型    | 必填 | 说明         |
| ------------- | ------- | ---- | ------------ |
| `title`       | string  | 是   | 页面标题     |
| `content`     | string  | 是   | 说明文字     |
| `contactInfo` | string  | 否   | 联系方式提示 |
| `enabled`     | boolean | 是   | 是否启用     |

> 此集合通常只需 **1 条记录**。

## `guides`

| 字段      | 类型    | 必填 | 说明              |
| --------- | ------- | ---- | ----------------- |
| `title`   | string  | 是   | 标题              |
| `content` | string  | 是   | 正文（HTML 格式） |
| `tag`     | string  | 否   | 标签              |
| `date`    | string  | 是   | 发布日期          |
| `sort`    | number  | 否   | 排序              |
| `enabled` | boolean | 是   | 是否展示          |

## `feedback`

| 字段         | 类型   | 说明                           |
| ------------ | ------ | ------------------------------ |
| `type`       | string | 反馈类型                       |
| `content`    | string | 反馈内容                       |
| `contact`    | string | 联系方式（选填）               |
| `status`     | string | 处理状态：`pending`/`resolved` |
| `createTime` | Date   | 提交时间                       |

## `voices`

| 字段         | 类型    | 说明     |
| ------------ | ------- | -------- |
| `type`       | string  | 类型     |
| `content`    | string  | 内容     |
| `contact`    | string  | 联系方式 |
| `expired`    | boolean | 是否过期 |
| `deadline`   | string  | 截止日期 |
| `createTime` | Date    | 创建时间 |

## 数据库权限建议

| 集合类型                                                                                                                   | 推荐权限                   |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 运营维护（banners, news, services, schedules, payments, guides, contacts, shuttle_config, shuttle_times, feedback_config） | 仅管理员可写               |
| 用户写入（feedback, voices）                                                                                               | 所有用户可读，仅创建者可写 |
| 公开读取（所有集合）                                                                                                       | 所有用户可读               |
