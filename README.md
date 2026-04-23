# 新长宁水韵名邸生活号

## 项目简介
为「新长宁水韵名邸」小区打造的微信小程序生活号，展示小区周边生活信息、闲置交易、新闻资讯、缴费知识和便民安排。

## 技术栈
- 原生微信小程序框架（WXML + WXSS + JavaScript）
- Apple Design 风格 UI

## 项目结构
```
shuiyun-life/
├── app.js                    # 全局逻辑
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式（Apple Design）
├── pages/                    # 页面目录
│   ├── index/               # 首页
│   ├── news/                # 新闻资讯
│   ├── news-detail/         # 新闻详情
│   ├── trade/               # 闲置交易
│   ├── trade-detail/        # 交易详情
│   ├── life-info/           # 周边生活信息
│   ├── payment/             # 缴费知识
│   ├── payment-detail/      # 缴费详情
│   ├── schedule/            # 便民安排
│   └── profile/             # 我的
├── components/              # 公共组件
│   ├── news-card/
│   ├── trade-card/
│   ├── service-item/
│   └── schedule-item/
├── images/                  # 图片资源
│   ├── icons/              # TabBar图标
│   └── banners/            # Banner图
└── utils/                   # 工具函数
    └── util.js
```

## 功能模块
1. **首页** - Banner轮播、快捷入口、最新动态、今日便民
2. **周边生活** - 超市、菜场、公共交通、学校信息
3. **闲置交易** - 商品列表、分类筛选、详情页
4. **新闻资讯** - 文章列表、分类筛选、详情页
5. **缴费知识** - 物业费、水费、电费、燃气费指南
6. **便民安排** - 社区活动日历、状态标识

## 开发说明
- 使用微信开发者工具导入项目
- 图片资源需要替换为真实素材
- 数据目前为静态 Mock，二期可接入云开发

## 版本
v1.0.0
