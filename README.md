# 新长宁水韵名邸生活号

## 项目简介
为「新长宁水韵名邸」小区打造的微信小程序生活号，展示小区周边生活信息、闲置交易、新闻资讯、缴费知识、便民安排和班车信息。

## 技术栈
- 原生微信小程序框架（WXML + WXSS + TypeScript）
- Apple Design 风格 UI（白色背景 + 黑色文字 + Apple 蓝强调色）
- 微信云开发（云数据库 + 云函数）

## 项目结构
```
shuiyun-life/
├── app.ts                    # 全局逻辑（云开发初始化）
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式（Apple Design）
├── env.example.ts            # 敏感配置模板（appid / 云环境ID）
├── tsconfig.json             # TypeScript 配置
├── project.config.json       # 项目配置
├── project.private.config.json # 本地私有配置（不提交Git）
├── pages/                    # 页面目录
│   ├── index/               # 首页
│   ├── news/                # 新闻资讯
│   ├── news-detail/         # 新闻详情
│   ├── trade/               # 闲置交易
│   ├── trade-detail/        # 交易详情
│   ├── trade-publish/       # 发布闲置
│   ├── life-info/           # 周边生活信息
│   ├── payment/             # 缴费知识
│   ├── payment-detail/      # 缴费详情
│   ├── schedule/            # 便民安排
│   ├── shuttle/             # 班车信息
│   └── profile/             # 我的
├── components/              # 公共组件
│   ├── nav-bar/             # 自定义导航栏
│   ├── news-card/
│   ├── trade-card/
│   ├── service-item/
│   └── schedule-item/
├── services/                # 服务层
│   ├── api.ts               # 业务 API（对接云开发）
│   └── cloud.ts             # 云开发封装（数据库/云函数）
├── types/                   # TypeScript 类型定义
│   └── data.ts
├── cloud/                   # 云函数目录
│   └── hello/               # 示例云函数
├── images/                  # 图片资源
│   ├── icons/              # TabBar 图标
│   └── banners/            # Banner 图
├── utils/                   # 工具函数
│   └── util.ts
└── scripts/                 # 脚本工具
```

## 功能模块
1. **首页** - Banner 轮播、快捷入口、最新动态、今日便民
2. **周边生活** - 超市、菜场、美食、酒店、交通、学校、休闲、医疗、商场共 9 个分类；支持跳转到对应小程序或服务号
3. **闲置交易** - 商品列表、分类筛选、详情页、发布闲置
4. **新闻资讯** - 文章列表、分类筛选、详情页
5. **缴费知识** - 物业费、水费、电费、燃气费指南
6. **便民安排** - 社区活动日历、状态标识
7. **班车信息** - 班车时刻表、站点、联系方式

## 开发说明
1. 使用微信开发者工具导入项目
2. 复制 `env.example.ts` 为 `env.ts`，填入真实 appid 和云环境 ID
3. 在微信开发者工具中点击「云开发」按钮开通云服务
4. `project.private.config.json` 为本地私有配置，由开发者工具自动生成，**请勿提交到 Git**
5. 图片资源需要替换为真实素材
6. 云函数开发完成后，右键云函数目录选择「上传并部署：云端安装依赖」

## 版本
v1.0.0
