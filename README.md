# 新长宁水韵名邸生活号

## 项目简介
为「新长宁水韵名邸」小区打造的微信小程序生活号，面向小区居民提供周边生活信息、闲置交易、新闻资讯、缴费知识、活动安排、班车信息、意见反馈和使用指南等功能。全部内容支持通过 **微信云开发数据库 CMS** 动态更新，无需修改代码即可维护小程序内容。

## 技术栈
- 原生微信小程序框架（WXML + WXSS + TypeScript）
- **Material Design 3（绿色主题）**风格 UI（Primary `#4C662B` + 背景 `#F9FAEF` + 纯黑文字 `#1A1C16`）
- 微信云开发（云数据库）
- TypeScript 6.x 严格模式

## 项目结构
```
shuiyun-life/
├── app.ts                    # 全局逻辑（云开发初始化）
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式（MD3 设计系统）
├── env.example.ts            # 敏感配置模板（appid / 云环境ID）
├── tsconfig.json             # TypeScript 配置
├── project.config.json       # 项目配置
├── project.private.config.json # 本地私有配置（不提交Git）
├── pages/                    # 页面目录
│   ├── index/               # 首页（Banner、快捷入口、社区通知、今日活动）
│   ├── news/                # 新闻资讯列表
│   ├── news-detail/         # 新闻详情
│   ├── trade/               # 闲置交易列表
│   ├── trade-detail/        # 交易详情
│   ├── trade-publish/       # 发布闲置
│   ├── life-info/           # 周边生活信息
│   ├── payment/             # 缴费知识列表
│   ├── payment-detail/      # 缴费详情
│   ├── schedule/            # 活动安排
│   ├── shuttle/             # 班车信息
│   ├── profile/             # 我的（个人中心）
│   ├── feedback/            # 意见反馈表单
│   ├── guide/               # 使用指南列表
│   └── guide-detail/        # 使用指南详情
├── components/              # 公共组件
│   ├── nav-bar/             # 自定义导航栏
│   ├── news-card/           # 新闻卡片
│   ├── schedule-item/       # 活动条目
│   └── service-item/        # 生活服务条目
├── services/                # 服务层
│   ├── api.ts               # 业务 API（对接云数据库）
│   └── cloud.ts             # 云开发数据库封装
├── types/                   # TypeScript 类型定义
│   └── data.ts
├── images/                  # 图片资源
│   ├── icons/              # TabBar 图标
│   ├── banners/            # Banner 图
│   ├── logo-dark.png
│   └── logo-white.png
├── utils/                   # 工具函数
│   └── util.ts
└── guides-seed.json         # 使用指南种子数据（JSON Lines）
```

## 功能模块
1. **首页** — Banner 轮播（首屏班车卡片 + 图片轮播）、快捷入口（6 个 Emoji 图标）、社区通知、今日活动
2. **新闻资讯** — 文章列表、分类筛选（通知/政策/周边）、详情页
3. **闲置交易** — 商品列表、分类筛选、详情页、用户发布（本地缓存 + 云端）
4. **周边生活** — 超市、菜场、美食、银行、交通、学校、休闲、医疗、商场共 9 个分类
5. **缴费知识** — 物业费、水费、电费、燃气费指南
6. **活动安排** — 社区活动日历，当天活动自动展示在首页
7. **班车信息** — 班车时刻表、站点列表、下一班动态计算、联系方式
8. **意见反馈** — 用户提交反馈到云数据库
9. **使用指南** — CMS 驱动的操作手册，指导运营人员更新内容

## CMS 内容管理

本项目所有展示内容均存储在微信云开发数据库中，运营人员可通过云控制台直接增删改查，无需修改代码。

### 云数据库集合（共 12 个）

| 集合 | 用途 | 典型数据量 |
|------|------|-----------|
| `banners` | 首页轮播 Banner | 3-5 条 |
| `news` | 新闻资讯 | 20-50 条 |
| `trades` | 闲置交易 | 50-200 条 |
| `services` | 周边生活服务 | 50-100 条 |
| `schedules` | 活动安排 | 10-30 条 |
| `payments` | 缴费知识 | 10-20 条 |
| `shuttle_config` | 班车路线配置 | 1 条 |
| `shuttle_times` | 班车时刻表 | 8 条 |
| `contacts` | 物业联系方式 | 3-5 条 |
| `feedback_config` | 反馈页配置 | 1 条 |
| `guides` | 使用指南 | 8 条 |
| `feedback` | 用户反馈记录 | 自动增长 |

### 使用指南导入

运营操作手册已预置在 `guides-seed.json` 中，导入方式：

1. 打开微信开发者工具 → 云开发 → 数据库
2. 创建集合 `guides`
3. 点击「导入 JSON」→ 选择 `guides-seed.json`

导入后，运营人员可在小程序「我的 → 使用指南」中查看完整的 CMS 操作手册。

## 开发说明

1. 使用微信开发者工具导入项目
2. 复制 `env.example.ts` 为 `env.ts`，填入真实 appid 和云环境 ID
3. 在微信开发者工具中点击「云开发」按钮开通云服务
4. 在云控制台数据库中创建 12 个集合（见上表）
5. `project.private.config.json` 为本地私有配置，由开发者工具自动生成，**请勿提交到 Git**
6. 所有数据通过客户端直连云数据库操作，无需云函数
7. 运行 `cp env.example.ts env.ts` 并填入真实值后方可正常编译

## 版本

v2.0.0 — MD3 风格迁移 + CMS 全面接入 + 使用指南模块
