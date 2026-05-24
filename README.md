# 新长宁水韵名邸生活号

[![GitHub](https://img.shields.io/badge/GitHub-AlphaZx--CJY%2Fshuiyun--life-4C662B?logo=github)](https://github.com/AlphaZx-CJY/shuiyun-life)

## 项目简介

为「新长宁水韵名邸」小区打造的**开源**微信小程序生活号，面向小区居民提供周边生活信息、闲置交易、新闻资讯、缴费知识、活动安排、班车信息、社区心声、意见反馈和使用指南等功能。全部内容支持通过 **微信云开发数据库 CMS** 动态更新，无需修改代码即可维护小程序内容。

## 技术栈

- 原生微信小程序框架（WXML + WXSS + TypeScript）
- **Material Design 3 Expressive（绿色主题）** 风格 UI（Primary `#4C662B` + 背景 `#F9FAEF` + On Surface `#1A1C16`）
- 微信云开发（云数据库 12 个集合）
- TypeScript 6.x 严格模式

## 项目结构

```
shuiyun-life/
├── app.ts                    # 全局逻辑（云开发初始化、系统信息）
├── app.json                  # 全局配置（页面路由、自定义 TabBar）
├── app.wxss                  # 全局样式（MD3 设计系统 Token）
├── env.example.ts            # 敏感配置模板（AppID / 云环境ID）
├── tsconfig.json             # TypeScript 配置
├── project.config.json       # 项目配置
├── project.private.config.json # 本地私有配置（不提交Git）
├── custom-tab-bar/           # 自定义 TabBar（Material Symbols SVG）
│
├── pages/                    # 页面目录（14 个页面）
│   ├── index/               # 首页（班车卡片、快捷入口、社区通知、最近活动）
│   ├── discover/            # 发现（聚合资讯/周边/缴费/活动/心声的 Feed 流）
│   ├── detail/              # 通用详情页（新闻/缴费/活动/指南共用）
│   ├── service/             # 周边生活服务列表
│   ├── trade/               # 闲置交易列表（瀑布流双列）
│   ├── trade-detail/        # 交易详情
│   ├── trade-publish/       # 发布闲置
│   ├── voice/               # 社区心声列表
│   ├── voice-publish/       # 发布社区心声
│   ├── my-voice/            # 我的心声（个人发布管理）
│   ├── my-trade/            # 我的闲置（个人发布管理）
│   ├── shuttle/             # 班车信息
│   ├── guide/               # 使用指南 / 运营帮助
│   ├── profile/             # 更多（个人中心 + 开源入口）
│   └── feedback/            # 小程序意见反馈
│
├── components/              # 公共组件
│   └── md3/                 # MD3 基础组件库（5 个）
│       ├── md-app-bar/
│       ├── md-empty-state/
│       ├── md-fab/
│       ├── md-icon/
│       └── md-text-field/
│
├── services/                # 服务层
│   ├── api.ts               # 业务 API（对接 12 个云数据库集合）
│   └── cloud.ts             # 云开发数据库封装
│
├── types/                   # TypeScript 类型定义
│   └── data.ts
│
├── utils/                   # 工具函数
│   └── util.ts
│
└── images/                  # 图片资源
    ├── icons/              # TabBar 与分类图标（Material Symbols SVG）
    └── material/           # Material Symbols 着色 SVG 图标
```

## 功能模块

1. **首页** — 班车 Hero 卡片、快捷入口（周边生活/社区心声）、社区通知列表、最近活动卡片
2. **发现** — 聚合资讯/周边生活/缴费知识/活动安排/社区心声的 Feed 流，Pill 分类筛选，彩色容器卡片
3. **通用详情** — 新闻资讯、缴费知识、活动安排、使用指南共用详情页，支持 rich-text 渲染 HTML 内容，含云存储图片链接自动解析
4. **周边生活** — 小区周边商家/服务信息列表
5. **闲置交易** — 瀑布流双列商品列表、分类筛选、大图卡片、详情页、用户发布（本地缓存 + 云端双通道）、分类图标回退
6. **社区心声** — 居民发布建议与问题，在发现页 Feed 中展示
7. **我的心声 / 我的闲置** — 个人发布内容管理，支持编辑和删除
8. **班车信息** — 班车时刻表、站点列表、动态状态计算（已发车/即将发车/未发车）、联系方式
9. **使用指南** — CMS 驱动的操作手册，指导运营人员更新内容
10. **意见反馈** — 用户提交反馈到云数据库 `feedback` 集合
11. **开源代码** — 个人中心提供 GitHub 仓库入口，支持一键复制链接

## CMS 内容管理

本项目所有展示内容均存储在微信云开发数据库中，运营人员可通过云控制台直接增删改查，无需修改代码。

### 云数据库集合（共 12 个）

| 集合              | 用途         | 典型数据量 |
| ----------------- | ------------ | ---------- |
| `news`            | 新闻资讯     | 20–50 条   |
| `trades`          | 闲置交易     | 50–200 条  |
| `services`        | 周边生活服务 | 50–100 条  |
| `schedules`       | 活动安排     | 10–30 条   |
| `payments`        | 缴费知识     | 10–20 条   |
| `shuttle_config`  | 班车路线配置 | 1 条       |
| `shuttle_times`   | 班车时刻表   | 8 条       |
| `contacts`        | 物业联系方式 | 3–5 条     |
| `feedback_config` | 反馈页配置   | 1 条       |
| `guides`          | 使用指南     | 8 条       |
| `feedback`        | 用户反馈记录 | 自动增长   |
| `voices`          | 社区心声     | 自动增长   |

### 数据导入

在云控制台数据库中创建集合后，可通过「导入 JSON」批量导入初始数据。

## 开发说明

1. 使用微信开发者工具导入项目
2. 复制 `env.example.ts` 为 `env.ts`，填入真实 AppID 和云环境 ID
3. 在微信开发者工具中点击「云开发」按钮开通云服务
4. 在云控制台数据库中创建 12 个集合（见上表）
5. `project.private.config.json` 为本地私有配置，由开发者工具自动生成，**请勿提交到 Git**
6. 所有数据通过客户端直连云数据库操作，无需云函数
7. 运行 `cp env.example.ts env.ts` 并填入真实值后方可正常编译

## Harness 工程规范

本项目已建立 Level-1 Harness Engineering 体系，每次修改后必须运行：

```bash
npm run check && npm test
```

- `npm run check` = TypeScript 类型检查 + ESLint
- `npm test` = 结构测试（页面完整性、类型一致性、硬编码色值扫描、图片引用检查）

已配置 husky + lint-staged 预提交钩子，任何一步失败将阻止提交。

## 开源协议

本项目采用 [MIT License](LICENSE) 开源，欢迎 Star 和提交 Issue。

- GitHub 仓库：https://github.com/AlphaZx-CJY/shuiyun-life
- 问题反馈：https://github.com/AlphaZx-CJY/shuiyun-life/issues

## 版本

**v2.0.0** — MD3 Expressive 风格 + 通用详情页重构 + Feed 流聚合 + Harness 工程体系

近期主要变更：

- 活动内容数据结构重构（`startDate`/`endDate` 替代多条记录合并）
- 新增"我的心声""我的闲置"个人发布管理
- 闲置交易页瀑布流双列布局 + 分类图标回退
- 清理未使用组件（md-card、md-chip、md-divider、md-list-item）
- 更多页面增加开源代码入口
