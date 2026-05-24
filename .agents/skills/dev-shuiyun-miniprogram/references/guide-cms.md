# CMS 运营指南

> 本文档面向运营人员：通过微信云控制台 CMS 更新小程序内容，无需写代码。

## 环境准备

1. 复制示例文件：`cp env.example.ts env.ts`，填入真实 AppID 和云环境 ID
2. 在微信开发者工具中点击「云开发」按钮开通服务
3. 在云控制台数据库中创建 13 个集合
4. 设置数据库权限（用户写入集合调整为「所有用户可读可写」）

## 云数据库集合速查

### `banners` — 首页轮播 Banner

| 字段      | 类型    | 必填 | 说明             | 示例              |
| --------- | ------- | ---- | ---------------- | ----------------- |
| `image`   | string  | 是   | 图片 URL         | `cloud://xxx.jpg` |
| `title`   | string  | 是   | Banner 标题      | 「社区健身活动」  |
| `enabled` | boolean | 是   | 是否展示         | `true`            |
| `sort`    | number  | 否   | 排序，越小越靠前 | `1`               |

### `news` — 新闻资讯

| 字段        | 类型    | 必填 | 说明                       |
| ----------- | ------- | ---- | -------------------------- |
| `title`     | string  | 是   | 标题                       |
| `summary`   | string  | 是   | 摘要                       |
| `source`    | string  | 否   | 来源                       |
| `date`      | string  | 是   | 发布日期（YYYY-MM-DD）     |
| `tag`       | string  | 否   | 标签文字                   |
| `category`  | string  | 是   | `notice`/`policy`/`around` |
| `cover`     | string  | 否   | 封面图 URL                 |
| `content`   | string  | 是   | 正文                       |
| `viewCount` | number  | 否   | 浏览量                     |
| `enabled`   | boolean | 是   | 是否展示                   |

> `category: 'notice'` 的新闻会出现在首页「社区通知」区域。

### `trades` — 闲置交易

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

### `services` — 周边生活服务

| 字段       | 类型     | 必填 | 说明                 |
| ---------- | -------- | ---- | -------------------- |
| `name`     | string   | 是   | 商家名称             |
| `address`  | string   | 是   | 地址                 |
| `distance` | string   | 否   | 距离                 |
| `hours`    | string   | 否   | 营业时间             |
| `phone`    | string   | 否   | 联系电话             |
| `tags`     | string[] | 否   | 标签数组             |
| `category` | string   | 是   | 与前端硬编码分类对应 |
| `enabled`  | boolean  | 是   | 是否展示             |
| `sort`     | number   | 否   | 排序                 |

> 前端分类映射：supermarket(超市)、market(菜场)、food(美食)、hotel(酒店)、transport(交通)、school(学校)、leisure(休闲)、medical(医疗)、mall(商场)

### `schedules` — 活动安排

| 字段          | 类型    | 必填 | 说明               |
| ------------- | ------- | ---- | ------------------ |
| `title`       | string  | 是   | 活动名称           |
| `date`        | string  | 是   | 日期（YYYY-MM-DD） |
| `time`        | string  | 是   | 时间               |
| `location`    | string  | 是   | 地点               |
| `description` | string  | 否   | 详细说明           |
| `status`      | string  | 否   | `upcoming`/`ended` |
| `type`        | string  | 否   | 类型标记           |
| `enabled`     | boolean | 是   | 是否展示           |

### `payments` — 缴费知识

| 字段      | 类型    | 必填 | 说明     |
| --------- | ------- | ---- | -------- |
| `title`   | string  | 是   | 标题     |
| `summary` | string  | 是   | 摘要     |
| `tag`     | string  | 否   | 标签     |
| `date`    | string  | 是   | 发布日期 |
| `content` | string  | 是   | 正文     |
| `hot`     | boolean | 否   | 是否热门 |
| `enabled` | boolean | 是   | 是否展示 |

### `shuttle_config` — 班车配置（单条记录）

| 字段           | 类型     | 必填 | 说明     |
| -------------- | -------- | ---- | -------- |
| `routeName`    | string   | 是   | 路线名称 |
| `stops`        | string[] | 是   | 站点列表 |
| `contactPhone` | string   | 否   | 咨询电话 |
| `runNote`      | string   | 否   | 运行说明 |
| `enabled`      | boolean  | 是   | 是否启用 |

### `shuttle_times` — 班车时刻表

| 字段      | 类型    | 必填 | 说明              |
| --------- | ------- | ---- | ----------------- |
| `time`    | string  | 是   | 发车时间（HH:MM） |
| `sort`    | number  | 是   | 排序              |
| `enabled` | boolean | 是   | 是否展示          |

### `contacts` — 物业联系方式

| 字段      | 类型    | 必填 | 说明     |
| --------- | ------- | ---- | -------- |
| `label`   | string  | 是   | 显示名称 |
| `number`  | string  | 是   | 电话号码 |
| `enabled` | boolean | 是   | 是否展示 |
| `sort`    | number  | 否   | 排序     |

### `feedback_config` — 意见反馈页说明（单条记录）

| 字段          | 类型    | 必填 | 说明         |
| ------------- | ------- | ---- | ------------ |
| `title`       | string  | 是   | 页面标题     |
| `content`     | string  | 是   | 说明文字     |
| `contactInfo` | string  | 否   | 联系方式提示 |
| `enabled`     | boolean | 是   | 是否启用     |

### `guides` — 使用指南

| 字段      | 类型    | 必填 | 说明             |
| --------- | ------- | ---- | ---------------- |
| `title`   | string  | 是   | 标题             |
| `content` | string  | 是   | 正文（支持换行） |
| `tag`     | string  | 否   | 标签             |
| `date`    | string  | 是   | 发布日期         |
| `sort`    | number  | 否   | 排序             |
| `enabled` | boolean | 是   | 是否展示         |

### `feedback` — 用户反馈记录（自动生成）

| 字段         | 类型   | 说明     |
| ------------ | ------ | -------- |
| `type`       | string | 反馈类型 |
| `content`    | string | 反馈内容 |
| `contact`    | string | 联系方式 |
| `status`     | string | 处理状态 |
| `createTime` | Date   | 提交时间 |

### `voices` — 社区心声（用户提交）

| 字段         | 类型    | 说明     |
| ------------ | ------- | -------- |
| `type`       | string  | 类型     |
| `content`    | string  | 内容     |
| `contact`    | string  | 联系方式 |
| `expired`    | boolean | 是否过期 |
| `deadline`   | string  | 截止日期 |
| `createTime` | Date    | 创建时间 |
