---
name: design-md3-expressive
description: >
  Material 3 Expressive 设计规范 Skill，用于「水韵名邸」微信小程序的 UI 开发。
  当需要创建或修改页面布局、组件样式、颜色主题、形状圆角、排版字号时触发。
  适用于 WXML/WXSS 编写、卡片/按钮/输入框/标签等组件设计、页面视觉层级构建。
---

# design-md3-expressive

本项目采用 **Material 3 Expressive** 设计系统，在标准 Material You 基础上通过更丰富的形状差异、更活泼的排版和更宽松的间距打造品牌识别度。

## 核心设计原则（必须遵守）

1. **形状即语言**：不同层级组件使用不同圆角尺寸，通过形状差异传递功能层级。
2. **无阴影层级**：不靠 `box-shadow` 区分层级，靠背景色差异、形状差异、间距差异。
3. **宽松留白**：模块间距 `48rpx+`，内容区内边距 `32rpx`，卡片内部 `24rpx~32rpx`。
4. **减少硬分割**：优先用间距、形状、颜色差异分隔内容，分割线仅在需要明确切断视觉流时使用。
5. **禁止硬编码色值**：所有颜色必须使用 `app.wxss` 中定义的 `--md-*` CSS 变量。

## 工作流（创建/修改 UI 时遵循）

### Step 1: 确定形状等级

根据组件类型选择圆角尺寸：

| 形状等级     | 圆角尺寸        | 适用组件                     |
| ------------ | --------------- | ---------------------------- |
| **Pill**     | `9999rpx`       | 按钮、Filter Chip、FAB       |
| **超大圆角** | `28rpx`         | 大卡片、Banner、底部浮层     |
| **大圆角**   | `20rpx`         | 标准卡片、对话框、媒体容器   |
| **中圆角**   | `16rpx`         | 输入框、小型面板、列表项     |
| **小圆角**   | `8rpx`          | 标签（Tag）、Badge、内嵌提示 |
| **无圆角**   | `0`             | 全宽分割线、沉浸式图片顶部   |
| **顶部圆角** | 仅顶部 `20rpx+` | 底部弹层、抽屉面板           |

**约束**：

- 同一页面中形状差异必须有意义
- 交互元素优先使用 Pill 形状
- 分割线必须是无圆角的直角

### Step 2: 选择颜色 Token

从 `app.wxss` 的 CSS 变量中选取，禁止在局部 WXSS 中写死 `#xxx` 色值。

核心 Token 速查：

- `--md-primary: #4C662B` — 主按钮、链接、活跃状态
- `--md-on-primary: #FFFFFF` — 主色上的文字
- `--md-primary-container: #CDEDA3` — 标签背景、选中态
- `--md-surface: #F9FAEF` — 页面背景
- `--md-surface-container: #EEEFE3` — Surface Container
- `--md-on-surface: #1A1C16` — 主文字
- `--md-on-surface-variant: #44483D` — 次要文字
- `--md-outline: #75796C` — 边框
- `--md-outline-variant: #C5C8BA` — 分割线

> 完整 Token 表见 `references/design-tokens.md`

### Step 3: 应用排版与间距

- 页面根容器统一使用 `page-container`
- 内容区 padding：`32rpx`
- 模块间距：`48rpx`
- 列表项分割线：`1rpx solid #C5C8BA`（`--md-outline-variant`）

### Step 4: 使用组件模板

标准组件模板存放在 `assets/component-templates/`，可直接复制修改：

- `card.wxml` / `card.wxss` — 标准卡片
- `button.wxml` / `button.wxss` — Pill 主按钮
- `tag.wxml` / `tag.wxss` — 小圆角标签
- `input.wxml` / `input.wxss` — 中圆角输入框

## 图标规范

统一使用 **Material Symbols** 图标。

- **HTML 原型**：通过 Google Fonts CDN 加载 `Material Symbols Outlined`
  ```html
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    rel="stylesheet"
  />
  ```
  使用方式：
  ```html
  <span class="material-symbols-outlined">home</span>
  ```
- **微信小程序**：使用 Material Symbols SVG 版本，存放于 `images/material/` 和 `images/icons/`
- 图标颜色使用 `currentColor` 继承父元素文字色，或显式使用 `var(--md-primary)`
- 图标尺寸规范：
  - 标准：24px（导航、列表、按钮内）
  - 紧凑：20px（标签内、元信息行）
  - 大尺寸：40px（空状态、功能入口）
- 图标与文字组合时，图标与文字间距 8px，垂直居中对齐

常用图标映射：

| 场景      | Material Symbols 名称 |
| --------- | --------------------- |
| 首页      | `home`                |
| 发现/探索 | `explore`             |
| 交易      | `sync_alt`            |
| 更多      | `more_horiz`          |
| 班车      | `directions_bus`      |
| 周边/商店 | `storefront`          |
| 缴费      | `receipt_long`        |
| 活动      | `event`               |
| 资讯/文章 | `article`             |
| 电话/联系 | `call`                |
| 指南/书籍 | `menu_book`           |
| 反馈/聊天 | `chat`                |
| 关于/信息 | `info`                |
| 添加/发布 | `add`                 |
| 照片/相机 | `photo_camera`        |

## 禁止事项

- ❌ 在局部 WXSS 中硬编码任何色值、字号、间距或圆角
- ❌ 使用 `box-shadow` 建立层级
- ❌ 将所有元素统一为同一种圆角
- ❌ **使用 Emoji 作为图标、装饰或状态指示**（必须使用 Material Symbols）
- ❌ 使用 WeUI 的绿色 `#07C160`，应使用 `--md-primary: #4C662B`

## 参考文档

- `references/design-tokens.md` — 完整颜色 Token 与 CSS 变量表
- `references/shape-system.md` — 形状等级详细规范与组合示例
