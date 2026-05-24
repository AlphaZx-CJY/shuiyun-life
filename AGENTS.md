# AGENTS.md — 新长宁水韵名邸生活号

> 本文件面向 AI 编码助手。若你即将修改本项目代码，请先阅读本文件。
> **本项目已配置 Harness Skill，AI 助手在对应场景下会优先加载 `.agents/skills/` 中的精确上下文。**

---

## Harness 使用指南（必看）

本项目已建立 Level-1 Harness Engineering 体系，围绕 AI 编码助手形成 **约束(Constrain) + 信息(Inform) + 验证(Verify) + 修正(Correct)** 的闭环。

### 项目级 Skills

| Skill                     | 触发场景                                                               | 位置                                      |
| ------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| `design-md3-expressive`   | 创建/修改 UI 组件、页面布局、样式、颜色、形状、排版                    | `.agents/skills/design-md3-expressive/`   |
| `dev-shuiyun-miniprogram` | 开发小程序、修改 pages/ 或 components/、操作云数据库、编写 TS 业务逻辑 | `.agents/skills/dev-shuiyun-miniprogram/` |
| `verify-shuiyun-harness`  | 验证代码合规性、检查项目结构、运行测试、修复规范问题                   | `.agents/skills/verify-shuiyun-harness/`  |

### 每次修改后必做检查

```bash
# 类型检查 + ESLint + 结构测试（必须全部通过）
npm run check && npm test

# 自动修复（如有 lint 错误）
npm run check:fix
npm run format
```

**原则**：`npm run check && npm test` 必须全部通过，才能标记任务完成。

### 预提交钩子

已配置 husky + lint-staged，提交前自动执行 ESLint fix → Prettier → TypeScript 检查 → 结构测试。任何一步失败将阻止提交。

---

## 项目概览

`shuiyun-life` 是为「新长宁水韵名邸」小区打造的**微信小程序生活号**，面向小区居民提供周边生活信息、闲置交易、新闻资讯、缴费知识、活动安排、班车信息、小程序反馈和使用指南等功能。

- **版本**：v2.0.0
- **仓库**：https://github.com/AlphaZx-CJY/shuiyun-life
- **小程序名称**：水韵名邸
- **设计风格**：Material Design 3 Expressive（绿色主题，seed `#63A002`）
- **设计规范**：详见 `.agents/skills/design-md3-expressive/`（Material 3 Expressive 设计令牌、形状系统、组件模板）

---

## 技术栈

| 层级    | 技术                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| 框架    | 原生微信小程序（WXML + WXSS + TypeScript）                                         |
| UI 风格 | **Material Design 3**（Primary `#4C662B` + 背景 `#F9FAEF` + On Surface `#1A1C16`） |
| 后端    | 微信云开发（云数据库 12 个集合）                                                   |
| 语言    | TypeScript 6.x，严格模式，目标 ES2015 / CommonJS                                   |
| 类型    | `@types/wechat-miniprogram`                                                        |

---

## 目录结构

```
shuiyun-life/
├── app.ts                      # 全局逻辑：云开发初始化、获取系统信息
├── app.json                    # 全局配置：页面路由、TabBar、窗口样式
├── app.wxss                    # 全局样式：MD3 设计令牌与组件类
├── env.example.ts              # 敏感配置模板（APPID / 云环境ID）
├── tsconfig.json               # TypeScript 编译配置
├── project.config.json         # 微信开发者工具项目配置
├── project.private.config.json # 本地私有配置（不提交 Git）
├── sitemap.json                # 搜索索引规则
├── package.json                # NPM 清单（仅开发依赖）
├── guides-seed.json            # 使用指南种子数据（JSON Lines，导入 guides 集合）
│
├── pages/                      # 页面目录（9 个页面）
│   ├── index/                  # 首页：快捷入口、社区通知、最近活动、班车卡片
│   ├── discover/               # 发现：聚合资讯/周边/缴费/活动/心声的 Feed 流
│   ├── detail/                 # 通用详情页（替代原 news-detail/payment-detail/schedule-detail/guide-detail）
│   ├── trade/                  # 闲置交易列表
│   ├── trade-detail/           # 交易详情
│   ├── trade-publish/          # 发布闲置
│   ├── profile/                # 我的（个人中心）
│   ├── feedback/               # 意见反馈表单
│   └── voice-publish/          # 发布社区心声
│
├── components/                 # 公共组件
│   └── md3/                    # MD3 基础组件库
│       ├── md-app-bar/
│       ├── md-card/
│       ├── md-chip/
│       ├── md-divider/
│       ├── md-empty-state/
│       ├── md-fab/
│       ├── md-icon/
│       └── md-text-field/
│
├── services/                   # 服务层
│   ├── api.ts                  # 业务 API（对接 12 个云数据库集合）
│   └── cloud.ts                # 云开发基础封装（query / add / db）
│
├── types/
│   └── data.ts                 # 全局 TypeScript 类型定义
│
├── utils/
│   └── util.ts                 # 工具函数
│
└── images/                     # 图片资源
    ├── icons/                  # TabBar 图标（Material Symbols SVG）
    ├── material/               # Material Symbols 着色 SVG 图标

```

每个页面和组件均包含 4 个标准文件：`.ts`、`.wxml`、`.wxss`、`.json`。

---

## 关键配置文件说明

### `app.json`

- 注册 10 个页面路由
- 配置 4 项 TabBar（首页、发现、交易、更多）
- TabBar 选中色：`#4C662B`（Primary），背景：`#EEEFE3`（Surface Container）
- 使用 **自定义 TabBar**（`custom-tab-bar/` 组件，`app.json` 配置 `"custom": true`，Material Symbols SVG 图标）
- 开启云开发：`"cloud": true`
- 启用样式版本 v2 与懒加载组件

### `app.ts`

- 云开发环境初始化：`wx.cloud.init({ env: CLOUD_ENV, traceUser: true })`
- 全局数据：`userInfo`、`systemInfo`
- 通过 `env.ts` 导入敏感配置（`CLOUD_ENV`）

### `env.example.ts`

- 敏感配置模板，包含 `APPID` 和 `CLOUD_ENV`
- 复制为 `env.ts` 后填入真实值，已被 `.gitignore` 排除

### `app.wxss`

- MD3 设计系统核心变量：
  - `--md-primary: #4C662B`
  - `--md-on-primary: #FFFFFF`
  - `--md-primary-container: #CDEDA3`
  - `--md-surface: #F9FAEF`
  - `--md-surface-container: #EEEFE3`
  - `--md-on-surface: #1A1C16`
  - `--md-on-surface-variant: #44483D`
  - `--md-outline: #75796C`
  - `--md-outline-variant: #C5C8BA`
- 组件类：`.md-btn--filled` / `.md-btn--elevated` / `.md-btn--tonal` / `.md-btn--outlined` / `.md-btn--text`、`.md-card` / `.md-card--filled`、`.md-fab`、`.md-text-field`、`.md-nav-bar`
- 原生组件默认样式重置：`button`、`image`、`input`、`textarea`、`picker`

### `project.config.json`

- `compileType`: `miniprogram`
- `libVersion`: `3.4.0`
- `useCompilerPlugins`: `["typescript"]`
- `editorSetting`: 缩进为空格，tabSize 为 2
- **AppID 字段使用占位符** `touristappid`，真实 AppID 不在版本控制中

### `tsconfig.json`

- `strict`: `true`
- `noEmit`: `true`（开发者工具负责编译输出）
- `types`: `["wechat-miniprogram"]`

---

## 代码风格指南

### TypeScript 规范

1. **页面数据接口**使用 `I` 前缀命名，如 `IIndexData`、`ITradeData`。
2. 优先使用 `WechatMiniprogram` 命名空间提供的类型。
3. 页面通过 `Page<IData, WechatMiniprogram.IAnyObject>({ ... })` 注册。
4. 严格模式已开启，避免隐式 `any`。

### WXML / WXSS 规范

1. 全局样式基于 **MD3**，核心变量定义在 `app.wxss` 的 `page` 选择器中。
2. 通用类名兼容 `.ios-*`、`.md-*` 和 `--wx-*` 前缀，均映射到 MD3 Token。
3. 页面根容器统一使用 `page-container`。
4. **无阴影设计**：MD3 靠白底卡片 + 灰背景区分层级，不使用 `box-shadow`。
5. **细线分割**：列表项用 `1rpx solid #E5E5E5` 分隔。
6. **克制圆角**：卡片 `20rpx`（大卡片 `28rpx`），按钮 **Pill** `9999rpx`，标签 `8rpx`。

### 页面生命周期与交互惯例

1. 每个页面均实现 `onShareAppMessage`。
2. 下拉刷新统一在 `onPullDownRefresh` 中调用数据加载方法。
3. 事件处理函数命名遵循 `onXxxTap`、`onXxxChange` 风格。
4. 数据传参通过 `data-xxx` 绑定，在 `e.currentTarget.dataset` 中读取。

### 服务层规范

- `services/api.ts`：业务 API，对接 12 个云数据库集合，所有函数已改为 `async`。
- `services/cloud.ts`：云开发底层封装，提供 `query`、`add` 和 `db` 导出。
- `safeQuery<T>()`：通用安全查询，自动 `_id → id` 映射，出错返回空数组。
- 类型定义集中在 `types/data.ts`，按功能模块分区导出。

---

## 云数据库集合（12 个）

| 集合              | 前端模块 | 核心字段                                                           |
| ----------------- | -------- | ------------------------------------------------------------------ |
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

---

## 构建与开发流程

### 环境准备

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 导入本项目目录。
3. 复制 `env.example.ts` 为 `env.ts`，填入真实 **AppID** 和 **云环境 ID**。
4. 在开发者工具中点击「云开发」按钮开通云服务。
5. 在云控制台数据库中创建上述 12 个集合。

### 开发运行

- 项目**没有**独立的构建脚本，所有编译由微信开发者工具处理。
- TypeScript 通过 `useCompilerPlugins: ["typescript"]` 由工具自动转译。
- `tsconfig.json` 中 `noEmit: true`，不生成中间 JS 文件。

### 云函数部署

- 云函数位于 `cloud/` 目录下。
- 开发完成后，**右键云函数目录** → 选择「上传并部署：云端安装依赖」。

---

## 测试说明

- **结构测试**：已配置 `npm test`，运行 `scripts/structural-test.js` 检查页面注册完整性、四件套文件存在性、类型引用一致性、硬编码色值扫描、图片路径有效性。
- **类型检查 + Lint**：`npm run check` 运行 `tsc --noEmit && eslint . --ext .ts`。
- **预提交钩子**：已配置 husky + lint-staged，提交前自动执行 ESLint fix → Prettier → TypeScript 检查 → 结构测试。

---

## 安全与隐私注意事项

1. **敏感文件已加入 `.gitignore`**：
   - `env.ts` —— 包含 `APPID` 和 `CLOUD_ENV`
   - `project.private.config.json` —— 开发者工具本地私有配置
   - `node_modules/`、`*.log`、`.DS_Store`
2. **真实 AppID 不在版本控制中**：`project.config.json` 中的 `appid` 字段使用占位符 `touristappid`。
3. 云开发在 `app.ts` 中初始化，开启 `traceUser: true`。
4. 交易发布模块数据写入**本地缓存**（`wx.setStorageSync`）+ **云数据库**（`trades` 集合）双通道。
5. 用户反馈（`feedback` 集合）涉及隐私，请妥善保管，不要对外泄露。

---

## 功能模块速查

| 模块       | 页面                                | 数据来源                                          | 说明                                      |
| ---------- | ----------------------------------- | ------------------------------------------------- | ----------------------------------------- |
| 首页       | `pages/index/index`                 | `news` + `schedules` + `shuttle_times`            | 班车 Hero、快捷入口、通知列表、活动卡片   |
| 发现       | `pages/discover/discover`           | `news`+`services`+`payments`+`schedules`+`voices` | Pill 筛选、Feed 彩色容器卡片              |
| 通用详情   | `pages/detail/detail`               | `news`/`schedules`/`payments`/`guides`            | 彩色容器 Hero + rich-text 内容渲染        |
| 闲置交易   | `pages/trade/trade`                 | `trades` 集合 + 本地缓存                          | 彩色容器大图卡片、分类筛选、发布          |
| 更多       | `pages/profile/profile`             | `contacts` + 硬编码                               | 头像、联系物业、小程序反馈、使用指南      |
| 班车信息   | `pages/index/index`（首页弹窗）     | `shuttle_config` + `shuttle_times`                | 时刻表、站点、动态状态计算                |
| 小程序反馈 | `pages/feedback/feedback`           | 写入 `feedback` 集合                              | 针对小程序的建议与问题，picker + textarea |
| 发布心声   | `pages/voice-publish/voice-publish` | 写入 `voices` 集合                                | 社区心声发布表单                          |

---

## 设计风格速查

| 元素              | MD3 规范                                                       |
| ----------------- | -------------------------------------------------------------- |
| 主色              | `#4C662B`（Primary）                                           |
| On Primary        | `#FFFFFF`                                                      |
| Primary Container | `#CDEDA3`                                                      |
| 背景              | `#F9FAEF`（Background / Surface）                              |
| Surface Container | `#EEEFE3`                                                      |
| 卡片              | `#FFFFFF`（Surface）、圆角 `20rpx`（大卡片 `28rpx`）、无阴影   |
| 文字              | `#1A1C16`（On Surface 主）、`#44483D`（On Surface Variant 次） |
| 链接              | `#4C662B`（Primary）                                           |
| 分割线            | `1rpx solid var(--md-outline-variant)`                         |
| 按钮              | Primary 填充、**Pill** `9999rpx`                               |
| 标签              | Primary Container `#CDEDA3` 底色、圆角 `8rpx`                  |

---

## AI 助手操作规范（每次修改后必做检查）

1. **文档同步检查**：每次执行操作后，检查修改内容是否涉及 `README.md`、`AGENTS.md` 或 Skill 文档中已记录的架构、目录、配置、技术栈、设计风格等描述。如有不一致，必须同步更新对应的文档，确保文档与实际代码保持同步。

2. **冗余文件清理**：执行修改后，检查项目中是否产生了不再被引用的文件（例如：被替换的图标、废弃的组件、空目录、临时字体文件、已弃用的样式等）。如有冗余文件，必须进行删除，保持仓库整洁，避免包体积膨胀。

3. **页面布局无遮挡验证**：每次执行修改后，检查所有页面的布局是否正常，特别是：
   - **顶部遮挡**：使用自定义导航栏（`nav-bar`）的页面，检查内容顶部是否被导航栏遮挡。相关页面需在根容器设置正确的 `padding-top`。
   - **底部遮挡**：使用自定义 TabBar 时，框架不会自动预留 TabBar 高度。所有 Tab 页面需在根容器设置 `padding-bottom: calc(120rpx + env(safe-area-inset-bottom))`，避免内容被自定义 TabBar 遮挡。
   - **全局一致性**：检查 `app.json`、`app.wxss` 中的全局配置变更是否导致个别页面布局异常。
   - 如发现遮挡，必须调整对应页面的 WXSS 布局参数。

4. **前端修改必须遵循 Skill 设计规范**：
   所有前端 UI 调整（新增页面、修改样式、调整布局、更换图标等）必须以 **`.agents/skills/design-md3-expressive/`** 中的设计规范为最终依据。包括但不限于：形状系统、颜色变量、排版字号、图标规范（禁止 emoji）、布局风格、组件形状、动画性能、原生组件重置。禁止在局部 WXSS 中硬编码色值、字号、间距或圆角。

5. **每次修改后必须运行 Harness 验证**：

   ```bash
   npm run check && npm test
   ```

   - `npm run check` = TypeScript 类型检查 + ESLint
   - `npm test` = 结构测试（页面完整性、类型一致性、硬编码色值扫描、图片路径检查）
   - **零 error 是提交门槛**。Warnings 应逐步清理，但不应新增。

---

## Harness 工具链说明

| 命令                                        | 作用                                 | 使用场景                                 |
| ------------------------------------------- | ------------------------------------ | ---------------------------------------- |
| `npm run check`                             | `tsc --noEmit && eslint . --ext .ts` | 每次修改后必跑，确保类型安全和代码规范   |
| `npm run check:fix`                         | ESLint 自动修复可修复问题            | 出现 lint 错误时先尝试自动修复           |
| `npm run format`                            | Prettier 格式化 JSON/WXML/WXSS/MD    | 提交前统一代码格式                       |
| `npm test`                                  | 运行结构测试脚本                     | 检查项目结构完整性、硬编码色值、图片引用 |
| `node scripts/scaffold-page.js <name>`      | 一键生成页面四件套                   | 新增页面时加速                           |
| `node scripts/scaffold-component.js <name>` | 一键生成组件四件套                   | 新增组件时加速                           |

### 预提交钩子

已配置 husky + lint-staged，提交前自动执行：

1. `lint-staged` — 对暂存区文件执行 ESLint fix / Prettier write
2. `npm run check` — 全量类型检查与 Lint（必须零 error）
3. `npm test` — 结构测试（必须全部通过）

任何一步失败将阻止提交。

---

## 给 AI 助手的特别提醒

- **前端 UI 设计以 `.agents/skills/design-md3-expressive/` 为唯一依据**，修改样式前必须先阅读 Skill 中的设计规范。
- 修改页面或组件时，请同时检查对应的 `.json` 文件是否需要调整 `usingComponents`。
- 新增页面后，必须先在 `app.json` 的 `pages` 数组中注册路由。
- 修改 `services/api.ts` 时请注意保持返回类型与 `types/data.ts` 一致。
- 全局样式变更请在 `app.wxss` 中修改 CSS 变量，避免在局部硬编码。
- 所有用户可见文本使用中文。
- 快捷入口（首页 4 个：周边生活/缴费知识/社区活动/闲置交易）在 `pages/index/index.ts` 中硬编码，均跳转至发现页（带自动筛选）。
- `guides` 集合的 `content` 字段使用 HTML 格式，由 `pages/detail/detail.wxml` 的 `<rich-text>` 组件渲染。
