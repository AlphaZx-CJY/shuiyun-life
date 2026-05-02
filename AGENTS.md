# AGENTS.md — 新长宁水韵名邸生活号

> 本文件面向 AI 编码助手。若你即将修改本项目代码，请先阅读本文件。

---

## 项目概览

`shuiyun-life` 是为「新长宁水韵名邸」小区打造的**微信小程序生活号**，面向小区居民提供周边生活信息、闲置交易、新闻资讯、缴费知识、便民安排、班车信息、意见反馈和使用指南等功能。

- **版本**：v2.0.0
- **仓库**：https://github.com/AlphaZx-CJY/shuiyun-life
- **小程序名称**：水韵名邸
- **设计风格**：Material Design 3（绿色主题，seed `#63A002`）

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | 原生微信小程序（WXML + WXSS + TypeScript） |
| UI 风格 | **Material Design 3**（Primary `#4C662B` + 背景 `#F9FAEF` + On Surface `#1A1C16`） |
| 后端 | 微信云开发（云数据库 12 个集合） |
| 语言 | TypeScript 6.x，严格模式，目标 ES2015 / CommonJS |
| 类型 | `@types/wechat-miniprogram` |

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
├── GUIDE.md                    # 开发使用指南（面向技术人员）
├── guides-seed.json            # 使用指南种子数据（JSON Lines，导入 guides 集合）
│
├── pages/                      # 页面目录（15 个页面）
│   ├── index/                  # 首页：快捷入口、社区通知、今日便民
│   ├── news/                   # 新闻资讯列表
│   ├── news-detail/            # 新闻详情
│   ├── trade/                  # 闲置交易列表
│   ├── trade-detail/           # 交易详情
│   ├── trade-publish/          # 发布闲置
│   ├── life-info/              # 周边生活信息
│   ├── payment/                # 缴费知识列表
│   ├── payment-detail/         # 缴费详情
│   ├── schedule/               # 便民安排
│   ├── shuttle/                # 班车信息
│   ├── profile/                # 我的（个人中心）
│   ├── feedback/               # 意见反馈表单
│   ├── guide/                  # 使用指南列表
│   └── guide-detail/           # 使用指南详情
│
├── components/                 # 公共组件
│   ├── nav-bar/                # 自定义导航栏
│   ├── news-card/              # 新闻卡片
│   ├── schedule-item/          # 便民条目
│   └── service-item/           # 生活服务条目
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
    ├── logo-dark.png
```

每个页面和组件均包含 4 个标准文件：`.ts`、`.wxml`、`.wxss`、`.json`。

---

## 关键配置文件说明

### `app.json`
- 注册 15 个页面路由
- 配置 5 项 TabBar（首页、资讯、交易、便民、我的）
- TabBar 选中色：`#4C662B`（Primary），背景：`#EEEFE3`（Surface Container）
- 使用 **自定义 TabBar**（`custom-tab-bar/` 组件，`app.json` 配置 `"custom": true`，Material Symbols SVG 图标）
- 开启云开发：`"cloud": true`
- 启用样式版本 v2 与懒加载组件

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
6. **克制圆角**：卡片 12rpx，按钮 8rpx，标签 4rpx。

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

| 集合 | 前端模块 | 核心字段 |
|------|----------|----------|
| `news` | 新闻资讯 | `title`, `summary`, `category`, `date`, `content`, `enabled` |
| `trades` | 闲置交易 | `title`, `price`, `originalPrice`, `category`, `images`, `enabled` |
| `services` | 周边生活 | `name`, `category`, `address`, `phone`, `tags`, `enabled` |
| `schedules` | 便民安排 | `title`, `date`, `time`, `location`, `enabled` |
| `payments` | 缴费知识 | `title`, `summary`, `content`, `date`, `enabled` |
| `shuttle_config` | 班车配置 | `routeName`, `stops`, `contactPhone`, `runNote`, `enabled` |
| `shuttle_times` | 班车时刻 | `time`, `sort`, `enabled` |
| `contacts` | 物业电话 | `label`, `number`, `enabled`, `sort` |
| `feedback_config` | 反馈配置 | `title`, `content`, `contactInfo`, `enabled` |
| `guides` | 使用指南 | `title`, `content`(HTML), `tag`, `date`, `sort`, `enabled` |
| `feedback` | 用户反馈 | `type`, `content`, `contact`, `status`, `createTime` |

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

- **当前没有测试套件**。`package.json` 中的 `test` 脚本为占位符。
- 如需引入测试，请评估微信小程序测试框架（如 `miniprogram-automator`）。

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

| 模块 | 页面 | 数据来源 | 说明 |
|------|------|----------|------|
| 首页 | `pages/index/index` | `news` + `schedules` + `shuttle_times` | 快捷入口、社区通知、今日便民、班车卡片 |
| 新闻资讯 | `pages/news/news` | `news` 集合 | 文章列表、分类筛选、详情 |
| 闲置交易 | `pages/trade/trade` | `trades` 集合 + 本地缓存 | 商品列表、分类筛选、详情、发布 |
| 周边生活 | `pages/life-info/life-info` | `services` 集合 | 9 个分类，支持拨打电话 |
| 缴费知识 | `pages/payment/payment` | `payments` 集合 | 物业费、水费、电费、燃气费指南 |
| 便民安排 | `pages/schedule/schedule` | `schedules` 集合 | 社区活动日历 |
| 班车信息 | `pages/shuttle/shuttle` | `shuttle_config` + `shuttle_times` | 时刻表、站点、动态状态计算 |
| 个人中心 | `pages/profile/profile` | `contacts` + `guides` + 硬编码 | 关于、联系物业、意见反馈、使用指南 |
| 意见反馈 | `pages/feedback/feedback` | 写入 `feedback` 集合 | 表单提交，picker + textarea |
| 使用指南 | `pages/guide/guide` | `guides` 集合 | CMS 驱动的运营手册，rich-text 渲染 HTML |

---

## 设计风格速查

| 元素 | MD3 规范 |
|------|----------|
| 主色 | `#4C662B`（Primary） |
| On Primary | `#FFFFFF` |
| Primary Container | `#CDEDA3` |
| 背景 | `#F9FAEF`（Background / Surface） |
| Surface Container | `#EEEFE3` |
| 卡片 | `#FFFFFF`（Surface）、圆角 12rpx、无阴影 |
| 文字 | `#1A1C16`（On Surface 主）、`#44483D`（On Surface Variant 次） |
| 链接 | `#4C662B`（Primary） |
| 分割线 | `1rpx solid #C5C8BA` |
| 按钮 | Primary 填充、圆角 8rpx |
| 标签 | Primary Container `#CDEDA3` 底色、圆角 4rpx |

---

## AI 助手操作规范（每次修改后必做检查）

1. **文档同步检查**：每次执行操作后，检查修改内容是否涉及 `README.md` 或 `AGENTS.md` 中已记录的架构、目录、配置、技术栈、设计风格等描述。如有不一致，必须同步更新对应的 `.md` 文件，确保文档与实际代码保持同步。

2. **冗余文件清理**：执行修改后，检查项目中是否产生了不再被引用的文件（例如：被替换的图标、废弃的组件、空目录、临时字体文件、已弃用的样式等）。如有冗余文件，必须进行删除，保持仓库整洁，避免包体积膨胀。

3. **页面布局无遮挡验证**：每次执行修改后，检查所有页面的布局是否正常，特别是：
   - **顶部遮挡**：使用自定义导航栏（`nav-bar`）的页面，检查内容顶部是否被导航栏遮挡。相关页面需在根容器设置正确的 `padding-top`。
   - **底部遮挡**：使用自定义 TabBar 时，框架不会自动预留 TabBar 高度。所有 Tab 页面需在根容器设置 `padding-bottom: calc(120rpx + env(safe-area-inset-bottom))`，避免内容被自定义 TabBar 遮挡。
   - **全局一致性**：检查 `app.json`、`app.wxss` 中的全局配置变更是否导致个别页面布局异常。
   - 如发现遮挡，必须调整对应页面的 WXSS 布局参数。

---

## 给 AI 助手的特别提醒

- 修改页面或组件时，请同时检查对应的 `.json` 文件是否需要调整 `usingComponents`。
- 新增页面后，必须先在 `app.json` 的 `pages` 数组中注册路由。
- 修改 `services/api.ts` 时请注意保持返回类型与 `types/data.ts` 一致。
- 全局样式变更请在 `app.wxss` 中修改 CSS 变量，避免在局部硬编码。
- 所有用户可见文本使用中文。
- 快捷入口（首页 6 个 Emoji 图标）在 `pages/index/index.ts` 中硬编码。
- 周边生活 9 个分类在 `services/api.ts` 的 `getServiceCategories()` 中硬编码。
- `guides` 集合的 `content` 字段使用 HTML 格式，由 `guide-detail.wxml` 的 `<rich-text>` 组件渲染。
