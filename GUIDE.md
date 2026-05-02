# 水韵名邸生活号 — 使用指南与二次开发文档

> 本文档面向两类读者：
> - **运营人员**：通过微信云控制台 CMS 更新小程序内容，无需写代码。
> - **开发人员**：基于本项目进行二次开发，扩展功能或修改样式。

---

## 目录

- [一、CMS 内容管理指南](#一cms-内容管理指南)
  - [1.1 环境准备](#11-环境准备)
  - [1.2 云数据库集合速查表](#12-云数据库集合速查表)
  - [1.3 各模块内容更新说明](#13-各模块内容更新说明)
- [二、二次开发指南](#二二次开发指南)
  - [2.1 技术栈与项目结构](#21-技术栈与项目结构)
  - [2.2 新增页面的标准流程](#22-新增页面的标准流程)
  - [2.3 样式开发规范](#23-样式开发规范)
  - [2.4 云数据库操作示例](#24-云数据库操作示例)
  - [2.5 常见问题](#25-常见问题)

---

## 一、CMS 内容管理指南

### 1.1 环境准备

#### 步骤 1：配置环境变量

复制示例文件并填入真实值：

```bash
cp env.example.ts env.ts
```

编辑 `env.ts`：

```typescript
export const APPID = '你的小程序 AppID';
export const CLOUD_ENV = '你的云开发环境 ID';
```

> 云开发环境 ID 可在微信开发者工具 → 云开发控制台 → 设置 中查看。

#### 步骤 2：开通云开发

1. 打开微信开发者工具，点击工具栏「云开发」按钮。
2. 按指引开通云开发服务（可选择「按量付费」或免费额度）。
3. 记录「环境 ID」，填入 `env.ts` 的 `CLOUD_ENV`。

#### 步骤 3：创建数据库集合

在云开发控制台 → 数据库中，手动创建以下 **12 个集合**（Collection）：

```
banners, news, trades, services, schedules, payments,
shuttle_config, shuttle_times,
contacts, feedback_config, guides, feedback
```

> `feedback` 集合用于存储用户提交的反馈记录，可不必预置数据。

#### 步骤 4：设置数据库权限

对于需要用户写入的集合（如 `feedback`），在集合设置中将权限调整为「所有用户可读，仅创建者可写」或「所有用户可读可写」。

对于纯运营维护的集合（如 `banners`, `news` 等），保持默认「仅管理员可写」即可。

---

### 1.2 云数据库集合速查表

以下表格列出每个集合的字段、类型、用途和示例值。所有集合均建议包含 `enabled` 字段（布尔值），用于控制内容是否在前端展示。

#### `banners` — 首页轮播 Banner

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `image` | string | 是 | 图片 URL（支持云存储 fileID 或 HTTPS） | `cloud://xxx.jpg` |
| `title` | string | 是 | Banner 标题 | 「社区健身活动」 |
| `enabled` | boolean | 是 | 是否展示 | `true` |
| `sort` | number | 否 | 排序，越小越靠前 | `1` |

#### `news` — 新闻资讯

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | 是 | 标题 | 「关于停车收费调整的通知」 |
| `summary` | string | 是 | 摘要 | 「自2024年5月起...」 |
| `source` | string | 否 | 来源 | 「物业办公室」 |
| `date` | string | 是 | 发布日期（`YYYY-MM-DD`） | `2024-05-01` |
| `tag` | string | 否 | 标签文字 | 「重要」 |
| `category` | string | 是 | 分类：`notice`（通知）/ `policy`（政策）/ `around`（周边） | `notice` |
| `cover` | string | 否 | 封面图 URL | `cloud://xxx.jpg` |
| `content` | string | 是 | 正文（支持换行） | 「各位业主：...」 |
| `viewCount` | number | 否 | 浏览量 | `128` |
| `enabled` | boolean | 是 | 是否展示 | `true` |

> `category: 'notice'` 的新闻会出现在首页「社区通知」区域。

#### `trades` — 闲置交易

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | 是 | 物品名称 | 「九成新宜家沙发」 |
| `price` | number | 是 | 现价 | `500` |
| `originalPrice` | number | 是 | 原价 | `1200` |
| `category` | string | 是 | 分类：`furniture` / `appliance` / `baby` / `books` / `others` | `furniture` |
| `images` | string[] | 否 | 图片 URL 数组 | `["cloud://xxx.jpg"]` |
| `seller` | string | 是 | 卖家昵称 | 「张先生」 |
| `time` | string | 是 | 发布时间 | `2024-04-20` |
| `location` | string | 否 | 所在楼栋 | 「12号楼」 |
| `description` | string | 否 | 详细描述 | 「买了两年，保养很好...」 |
| `enabled` | boolean | 是 | 是否展示 | `true` |

> 闲置交易也支持用户在前端「发布」后存入本地缓存，云数据库中的数据优先展示。

#### `services` — 周边生活服务

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `name` | string | 是 | 商家名称 | 「全家便利店」 |
| `address` | string | 是 | 地址 | 「天山西路123号」 |
| `distance` | string | 否 | 距离 | 「步行5分钟」 |
| `hours` | string | 否 | 营业时间 | 「07:00-23:00」 |
| `phone` | string | 否 | 联系电话 | `021-12345678` |
| `tags` | string[] | 否 | 标签数组 | `["24小时", "可配送"]` |
| `category` | string | 是 | 分类，与前端硬编码分类对应 | `supermarket` |
| `enabled` | boolean | 是 | 是否展示 | `true` |
| `sort` | number | 否 | 排序 | `1` |

> 前端分类映射（`services/api.ts` 硬编码）：
> - `supermarket` → 超市 🏪
> - `market` → 菜场 🥬
> - `food` → 美食 🍜
> - `hotel` → 酒店 🏨
> - `transport` → 交通 🚇
> - `school` → 学校 🏫
> - `leisure` → 休闲 ☕
> - `medical` → 医疗 🏥
> - `mall` → 商场 🛍️

#### `schedules` — 活动安排

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | 是 | 活动名称 | 「社区义诊」 |
| `date` | string | 是 | 日期（`YYYY-MM-DD`） | `2024-04-28` |
| `time` | string | 是 | 时间 | `09:00-11:00` |
| `location` | string | 是 | 地点 | 「社区活动中心」 |
| `description` | string | 否 | 详细说明 | 「免费提供血压测量...」 |
| `status` | string | 否 | 状态：`upcoming` / `ended` | `upcoming` |
| `type` | string | 否 | 类型标记 | `medical` |
| `enabled` | boolean | 是 | 是否展示 | `true` |

> 当天日期的安排会自动出现在首页「今日活动」区域。

#### `payments` — 缴费知识

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | 是 | 标题 | 「物业费缴纳指南」 |
| `summary` | string | 是 | 摘要 | 「支持线上/线下多种方式...」 |
| `tag` | string | 否 | 标签 | 「缴费」 |
| `tagType` | string | 否 | 标签类型（预留） | `` |
| `date` | string | 是 | 发布日期 | `2024-04-15` |
| `content` | string | 是 | 正文 | 「缴费方式一：...」 |
| `hot` | boolean | 否 | 是否热门 | `true` |
| `enabled` | boolean | 是 | 是否展示 | `true` |

#### `shuttle_config` — 班车配置（单条记录）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `routeName` | string | 是 | 路线名称 | 「社区→地铁站」 |
| `stops` | string[] | 是 | 站点列表 | `["南门", "地铁站", "购物中心"]` |
| `contactPhone` | string | 否 | 咨询电话 | `021-88888888` |
| `runNote` | string | 否 | 运行说明 | 「周末班次有所调整...」 |
| `enabled` | boolean | 是 | 是否启用 | `true` |

> 此集合通常只需 **1 条记录**。`stops` 作为数组字段录入。

#### `shuttle_times` — 班车时刻表

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `time` | string | 是 | 发车时间（`HH:MM`） | `07:30` |
| `sort` | number | 是 | 排序，决定显示顺序 | `1` |
| `enabled` | boolean | 是 | 是否展示 | `true` |

> 录入 8 条即可覆盖早高峰 4 班 + 晚高峰 4 班。不区分方向，统一按时间排序。

#### `contacts` — 物业联系方式

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `label` | string | 是 | 显示名称 | 「物业前台」 |
| `number` | string | 是 | 电话号码 | `021-66668888` |
| `enabled` | boolean | 是 | 是否展示 | `true` |
| `sort` | number | 否 | 排序 | `1` |

> 个人中心「联系物业」点击后会弹出 ActionSheet，展示此列表中的电话。

#### `feedback_config` — 意见反馈页说明（单条记录）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | 是 | 页面标题 | 「您的意见对我们很重要」 |
| `content` | string | 是 | 说明文字 | 「请详细描述您遇到的问题...」 |
| `contactInfo` | string | 否 | 联系方式提示 | 「如需回访，请留下手机号」 |
| `enabled` | boolean | 是 | 是否启用 | `true` |

> 当前版本反馈页为纯表单，此配置暂作预留，未来可在页头展示。

#### `guides` — 使用指南

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string | 是 | 标题 | 「如何缴纳物业费」 |
| `content` | string | 是 | 正文（支持换行） | 「第一步：打开小程序...」 |
| `tag` | string | 否 | 标签 | 「缴费」 |
| `date` | string | 是 | 发布日期 | `2024-04-20` |
| `sort` | number | 否 | 排序 | `1` |
| `enabled` | boolean | 是 | 是否展示 | `true` |

#### `feedback` — 用户反馈记录（自动生成）

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 反馈类型（如「功能建议」「Bug反馈」） |
| `content` | string | 反馈内容 |
| `contact` | string | 用户联系方式（选填） |
| `status` | string | 处理状态：`pending` / `resolved` |
| `createTime` | Date | 提交时间 |

> 此集合由前端表单自动写入，无需手动录入。

---

### 1.3 各模块内容更新说明

#### 首页

首页数据来自 **并行查询** 多个集合：

| 区域 | 数据来源 | 更新方式 |
|------|----------|----------|
| Banner 轮播（除首屏） | `banners` 集合 | 在云控制台增删记录 |
| 首屏班车卡片 | `shuttle_times` + `shuttle_config` | 更新时刻表和路线配置 |
| 快捷入口 | 前端硬编码（6 个 Emoji 图标） | 修改 `pages/index/index.ts` |
| 社区通知 | `news` 集合（`category: 'notice'`） | 更新新闻记录 |
| 今日活动 | `schedules` 集合（当天日期） | 更新日程记录 |

#### 新闻资讯页

- 列表：`news` 集合全部 `enabled: true` 记录，按日期倒序
- 分类标签：`notice` / `policy` / `around`
- 详情页：点击后通过 `_id` 查询单条记录

#### 闲置交易页

- 分类筛选：前端硬编码（全部 / 家具 / 电器 / 母婴 / 书籍 / 其他）
- 列表数据：`trades` 集合 + 本地缓存的用户发布
- 用户可点击右下角「+」发布，数据存入本地缓存

#### 周边生活页

- 分类标签：前端硬编码 9 个分类
- 每个分类下的条目：`services` 集合按 `category` 筛选
- 点击条目可拨打电话或跳转小程序

#### 活动安排页

- 全部日程：`schedules` 集合按日期 + 时间排序
- 状态由前端根据当前时间自动计算

#### 缴费知识页

- 列表：`payments` 集合按日期倒序
- 详情页展示完整 `content`

#### 班车服务页

- 路线名：`shuttle_config.routeName`
- 时刻表：`shuttle_times` 按 `sort` 排序
- 站点列表：`shuttle_config.stops`
- 联系按钮：`shuttle_config.contactPhone`
- 运行说明：`shuttle_config.runNote`

#### 个人中心页

- 关于我们：前端硬编码弹窗内容
- 意见反馈：跳转表单页，提交到 `feedback` 集合
- 联系物业：从 `contacts` 集合动态读取电话列表
- 使用指南：从 `guides` 集合读取列表

---

## 二、二次开发指南

### 2.1 技术栈与项目结构

```
shuiyun-life/
├── app.ts                  # 应用入口，云开发初始化
├── app.json                # 全局配置（页面路由、TabBar、窗口样式）
├── app.wxss                # 全局样式（WeUI 设计系统 + CSS 变量）
├── env.ts                  # 环境变量（APPID、CLOUD_ENV）
├── tsconfig.json           # TypeScript 配置（严格模式已开启）
│
├── pages/                  # 页面（每个页面含 .ts .wxml .wxss .json）
│   ├── index/              # 首页
│   ├── news/               # 新闻列表
│   ├── news-detail/        # 新闻详情
│   ├── trade/              # 闲置交易列表
│   ├── trade-detail/       # 交易详情
│   ├── trade-publish/      # 发布交易
│   ├── life-info/          # 周边生活
│   ├── payment/            # 缴费知识列表
│   ├── payment-detail/     # 缴费详情
│   ├── schedule/           # 活动安排
│   ├── shuttle/            # 班车服务
│   ├── profile/            # 个人中心
│   ├── feedback/           # 意见反馈表单
│   ├── guide/              # 使用指南列表
│   └── guide-detail/       # 使用指南详情
│
├── components/             # 可复用组件
│   ├── nav-bar/            # 自定义导航栏
│   ├── news-card/          # 新闻卡片
│   ├── schedule-item/      # 日程项
│   └── service-item/       # 服务项
│
├── services/               # 业务 API 层
│   ├── api.ts              # 封装所有数据获取逻辑
│   └── cloud.ts            # 云开发基础封装（query / add）
│
├── types/                  # TypeScript 类型定义
│   └── data.ts             # 全局数据模型
│
├── utils/                  # 工具函数
│   └── util.ts
│
│
└── images/                 # 静态资源
    ├── icons/              # TabBar 图标
    ├── banners/            # Banner 图片
    └── logo-*.png          # Logo
```

**技术栈**：原生微信小程序（WXML + WXSS + TypeScript）+ 微信云开发（云数据库）。

**编译插件**：`useCompilerPlugins: ["typescript"]`，由微信开发者工具内置 TypeScript 插件处理编译。

---

### 2.2 新增页面的标准流程

以新增「社区活动」页面为例：

#### 步骤 1：注册页面路由

在 `app.json` 的 `pages` 数组中添加：

```json
"pages/activity/activity"
```

#### 步骤 2：创建页面文件

```bash
mkdir -p pages/activity
touch pages/activity/activity.ts
 touch pages/activity/activity.wxml
 touch pages/activity/activity.wxss
 touch pages/activity/activity.json
```

`activity.json`：
```json
{
  "navigationBarTitleText": "社区活动",
  "usingComponents": {}
}
```

#### 步骤 3：声明数据类型

在 `types/data.ts` 中添加：

```typescript
export interface ActivityItem {
  id: number | string;
  title: string;
  date: string;
  location: string;
  cover: string;
  description: string;
}
```

#### 步骤 4：编写 API 接口

在 `services/api.ts` 中添加：

```typescript
export async function getActivities(): Promise<ActivityItem[]> {
  return safeQuery<ActivityItem>('activities', { enabled: true }, { orderBy: [{ field: 'date', desc: true }] });
}
```

> 无需修改 `services/cloud.ts`，已有 `query()` / `add()` 通用封装。

#### 步骤 5：编写页面逻辑

`activity.ts`：

```typescript
import * as api from '../../services/api';

interface IActivityData {
  list: api.ActivityItem[];
  loading: boolean;
}

Page<IActivityData>({
  data: {
    list: [],
    loading: true,
  },

  async onLoad() {
    try {
      const list = await api.getActivities();
      this.setData({ list, loading: false });
    } catch (e) {
      console.error('load activities failed', e);
      this.setData({ loading: false });
    }
  },
});
```

#### 步骤 6：编写页面布局和样式

参考现有页面的结构，复用全局样式类（见 2.3 节）。

---

### 2.3 样式开发规范

本项目采用 **WeUI（微信设计美学）** 风格，全局样式定义在 `app.wxss` 中。

#### CSS 变量

```css
/* 主色 */
--wx-primary: #07C160;        /* 微信绿 */
--wx-primary-hover: #06AD56;  /* 悬停态 */
--wx-link: #576B95;           /* 链接蓝 */

/* 背景与表面 */
--wx-bg: #F7F7F7;             /* 页面背景 */
--wx-surface: #FFFFFF;        /* 卡片表面 */

/* 文字 */
--wx-text: #000000;           /* 主文字 */
--wx-text-secondary: #999999; /* 次要文字 */
--wx-text-tertiary: #888888;  /* 第三级文字 */

/* 边框 */
--wx-border: #E5E5E5;         /* 分割线 */
--wx-border-light: #EDEDED;   /* 浅边框 */

/* 圆角 */
--radius-xs: 4rpx;            /* 标签 */
--radius-sm: 8rpx;            /* 按钮 */
--radius-md: 12rpx;           /* 卡片 */
--radius-lg: 16rpx;           /* Banner */
```

#### 推荐复用的组件类

| 类名 | 效果 | 适用场景 |
|------|------|----------|
| `.ios-card` / `.md-card` | 白底、12rpx 圆角、无阴影 | 内容卡片 |
| `.ios-btn--primary` / `.md-btn--filled` | 微信绿填充、白字、8rpx 圆角 | 主按钮 |
| `.ios-tag` / `.md-tag` | 微信绿 8% 底色、小圆角 | 状态标签 |
| `.ios-list-item` | 白底、底部 1rpx 分割线 | 列表项 |

> 兼容说明：`.ios-*` 和 `.md-*` 类名均映射到 WeUI Token，wxml 无需修改即可复用。

#### 设计原则

- **无阴影**：WeUI 靠白底卡片 + 灰背景区分层级，不使用 `box-shadow`
- **细线分割**：列表项用 `1rpx solid #E5E5E5` 分隔
- **克制圆角**：卡片 12rpx，按钮 8rpx，避免 Material Design 的大圆角
- **纯黑主文字**：`#000000`，而非灰色

---

### 2.4 云数据库操作示例

`services/cloud.ts` 已封装三个基础方法：

#### 查询数据

```typescript
import * as cloud from './cloud';

// 基础查询
const list = await cloud.query('news', { enabled: true });

// 带排序和分页
const list = await cloud.query('news', { category: 'notice' }, {
  orderBy: [{ field: 'date', desc: true }],
  limit: 10,
});
```

#### 新增数据

```typescript
await cloud.add('feedback', {
  type: '功能建议',
  content: '希望增加夜间模式',
  contact: '13800138000',
  status: 'pending',
  createTime: new Date().toISOString(),
});
```

#### 直接使用数据库实例

```typescript
import { db } from './cloud';

// 聚合查询
db.collection('news').aggregate()
  .match({ enabled: true })
  .group({ _id: '$category', count: { $sum: 1 } })
  .end({ success: console.log });
```

---

### 2.5 常见问题

#### Q1：TypeScript 编译报错

本项目已开启 TypeScript 严格模式。常见错误：

- **`_id` 不存在于类型上**：云数据库返回的文档含 `_id`，但业务类型可能未声明。建议在 `safeQuery` 中使用 `(item as any)._id` 或扩展类型定义。
- **隐式 any 类型**：回调参数需显式声明类型，如 `success: (res: { data: any[] }) => { ... }`。

#### Q2：云数据库读取为空

1. 检查 `env.ts` 的 `CLOUD_ENV` 是否正确。
2. 检查集合名称是否拼写正确（区分大小写）。
3. 检查 `where` 条件是否与数据匹配（如 `enabled: true`）。
4. 检查数据库权限是否允许读取。

#### Q3：如何替换 TabBar 图标

TabBar 图标为 PNG 文件，存放于 `images/icons/`。替换时：
- 未选中图标：`home.png`, `news.png`, `trade.png`, `schedule.png`, `profile.png`
- 选中图标：`home-active.png`, `news-active.png`, `trade-active.png`, `schedule-active.png`, `profile-active.png`
- 图标尺寸建议 **81×81 像素**
- 选中图标主色应为 **微信绿 `#07C160`**
- 未选中图标为灰色

#### Q4：如何修改快捷入口

首页 6 个快捷入口在 `pages/index/index.ts` 中硬编码：

```typescript
{ id: 1, label: '周边生活', path: '/pages/life-info/life-info', icon: '🏪' },
{ id: 2, label: '社区通知', path: '/pages/news/news', icon: '📢' },
// ...
```

修改 `label`、`path` 或 `icon`（Emoji 字符）即可。

#### Q5：如何修改服务分类

周边生活的 9 个分类在 `services/api.ts` 的 `getServiceCategories()` 中硬编码：

```typescript
{ id: 'supermarket', name: '超市', icon: '🏪', color: '#576B95' },
```

修改 `name`、`icon`（Emoji）或 `color`（分类标签色）即可。

---

## 附录：快速命令

```bash
# 复制环境配置
cp env.example.ts env.ts

# 安装依赖（如有）
npm install

# TypeScript 类型检查（需全局安装 tsc）
npx tsc --noEmit
```

---

> 文档版本：v1.0 | 最后更新：2026-04-26
