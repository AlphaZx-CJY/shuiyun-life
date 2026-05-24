---
name: dev-shuiyun-miniprogram
description: >
  水韵名邸微信小程序开发规范 Skill。
  当开发「水韵名邸」小程序、修改 pages/ 或 components/、操作微信云数据库、
  编写 TypeScript 业务逻辑、新增页面/组件、重构服务层时触发。
  提供目录结构、命名规范、生命周期惯例、云数据库 Schema 和脚手架工具。
---

# dev-shuiyun-miniprogram

## 技术栈

- 框架：原生微信小程序（WXML + WXSS + TypeScript）
- 后端：微信云开发（云数据库 12 个集合）
- 编译：`useCompilerPlugins: ["typescript"]`，由微信开发者工具内置插件处理
- 类型：`@types/wechat-miniprogram`，严格模式已开启

## 目录结构规范

```
pages/                    # 页面（每个含 .ts .wxml .wxss .json）
components/               # 可复用组件（同上四件套）
custom-tab-bar/           # 自定义 TabBar
services/                 # 业务 API 层
  ├── api.ts              # 所有数据获取逻辑（async 函数）
  └── cloud.ts            # 云开发基础封装（query / add / update / db）
types/
  └── data.ts             # 全局 TypeScript 类型定义
utils/
  └── util.ts             # 工具函数
```

## TypeScript 命名规范

1. **页面数据接口**使用 `I` 前缀：`IIndexData`、`ITradeData`
2. 优先使用 `WechatMiniprogram` 命名空间提供的类型
3. 页面注册：`Page<IData, WechatMiniprogram.IAnyObject>({ ... })`
4. 严格模式已开启，避免隐式 `any`

## WXML / WXSS 规范

1. 全局样式基于 MD3，核心变量在 `app.wxss` 的 `page` 选择器中
2. 页面根容器统一使用 `page-container`
3. **无阴影设计**：靠白底卡片 + 灰背景区分层级
4. **细线分割**：列表项用 `1rpx solid #C5C8BA` 分隔
5. **克制圆角**：卡片 12rpx~20rpx，按钮 Pill，标签 8rpx

## 页面生命周期与交互惯例

1. 每个页面均实现 `onShareAppMessage`
2. 下拉刷新统一在 `onPullDownRefresh` 中调用数据加载方法
3. 事件处理命名：`onXxxTap`、`onXxxChange`
4. 数据传参通过 `data-xxx` 绑定，在 `e.currentTarget.dataset` 中读取

## 服务层规范

- `services/api.ts`：业务 API，对接 12 个云数据库集合，所有函数已改为 `async`
- `services/cloud.ts`：底层封装，提供 `query`、`add`、`update` 和 `db` 导出
- `safeQuery<T>()`：通用安全查询，自动 `_id → id` 映射，出错返回空数组
- 类型定义集中在 `types/data.ts`，按功能模块分区导出

## 新增页面标准流程

1. 在 `app.json` 的 `pages` 数组中注册路由
2. 创建目录和四件套文件（.ts / .wxml / .wxss / .json）
3. 在 `types/data.ts` 中声明数据接口
4. 在 `services/api.ts` 中编写 API 函数
5. 编写页面逻辑、布局、样式
6. **同步更新 AGENTS.md 目录登记**

> 可使用脚手架脚本加速：`node .agents/skills/dev-shuiyun-miniprogram/scripts/scaffold-page.js <page-name>`

## 云数据库集合速查（12 + 1 个）

| 集合              | 前端模块 | 核心字段                                                           |
| ----------------- | -------- | ------------------------------------------------------------------ |
| `banners`         | 首页轮播 | `image`, `title`, `enabled`, `sort`                                |
| `news`            | 新闻资讯 | `title`, `summary`, `category`, `date`, `content`, `enabled`       |
| `trades`          | 闲置交易 | `title`, `price`, `originalPrice`, `category`, `images`, `enabled` |
| `services`        | 周边生活 | `name`, `category`, `address`, `phone`, `tags`, `enabled`          |
| `schedules`       | 活动安排 | `title`, `date`, `time`, `location`, `enabled`                     |
| `payments`        | 缴费知识 | `title`, `summary`, `content`, `date`, `enabled`                   |
| `shuttle_config`  | 班车配置 | `routeName`, `stops`, `contactPhone`, `runNote`, `enabled`         |
| `shuttle_times`   | 班车时刻 | `time`, `sort`, `enabled`                                          |
| `contacts`        | 物业电话 | `label`, `number`, `enabled`, `sort`                               |
| `feedback_config` | 反馈配置 | `title`, `content`, `contactInfo`, `enabled`                       |
| `guides`          | 使用指南 | `title`, `content`(HTML), `tag`, `date`, `sort`, `enabled`         |
| `feedback`        | 用户反馈 | `type`, `content`, `contact`, `status`, `createTime`               |
| `voices`          | 社区心声 | `type`, `content`, `contact`, `expired`, `deadline`, `createTime`  |

> 完整 Schema 见 `references/cloud-schema.md`

## 关键常量（硬编码在前端）

- **首页快捷入口**：6 个，在 `pages/index/index.ts` 中硬编码（Material Symbols SVG 图标）
- **周边生活分类**：9 个，在 `services/api.ts` 的 `getServiceCategories()` 中硬编码（ID 为数字 1-9）
- **闲置交易分类**：6 个，在 `services/api.ts` 的 `getTradeCategories()` 中硬编码

## 参考文档

- `references/agents-full.md` — 完整项目规范（AGENTS.md）
- `references/guide-cms.md` — CMS 运营指南（GUIDE.md 运营部分）
- `references/cloud-schema.md` — 云数据库完整字段定义

## 脚本工具

- `scripts/scaffold-page.js` — 一键生成页面四件套
- `scripts/scaffold-component.js` — 一键生成组件四件套
