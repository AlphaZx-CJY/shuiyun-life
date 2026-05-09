# DESIGN.md — 水韵名邸生活号 设计规范

> 本文件面向所有前端开发者与 AI 编码助手。本项目 UI 设计与实现以本文件为最终依据。

---

## 1. 设计概述

本项目采用 **Material 3 Expressive** 设计系统，在标准 Material You 的基础上，通过更丰富的形状差异、更活泼的排版和更宽松的间距，打造具有品牌识别度的社区生活号界面。

- **动态颜色种子**：`#63A002`
- **核心特征**：形状差异化、更大圆角、活泼排版、宽松间距、沉浸式布局
- **目标平台**：微信小程序（原生 WXML + WXSS + TypeScript）

---

## 2. 设计原则

### 2.1 形状即语言
不同层级和类型的组件使用**不同的圆角尺寸**，通过形状差异传递功能层级。不要将所有元素统一为同一种圆角——那是标准 Material 3 的做法，Expressive 要求形状有对比、有节奏。

### 2.2 无阴影层级
不靠 `box-shadow` 区分层级。层级通过以下方式建立：
- 背景色差异（Surface vs Surface Container vs Surface Container High）
- 形状差异（Pill 按钮 vs 圆角卡片 vs 直角分割线）
- 间距差异

### 2.3 宽松留白
- 模块间距：`48rpx` 及以上
- 内容区内边距：`32rpx`
- 卡片内部内边距：`24rpx ~ 32rpx`

### 2.4 减少硬分割
优先用**间距**、**形状**和**颜色差异**分隔内容。分割线（Divider）仅在需要明确切断视觉流时使用。

---

## 3. 形状系统（Shape System）

Material 3 Expressive 的核心设计手法是**用形状差异构建视觉层级**。以下是本项目采用的形状等级规范：

| 形状等级 | 圆角尺寸 | 适用组件 | 设计意图 |
|----------|----------|----------|----------|
| **Pill（完全圆角）** | `border-radius: 9999rpx` | 按钮、Filter Chip、悬浮操作按钮（FAB） | 表达可交互、可点击的活跃元素 |
| **超大圆角** | `28rpx` | 大卡片、Banner、底部浮层 | 表达内容容器、包容性强、友好 |
| **大圆角** | `20rpx` | 标准卡片、对话框、媒体容器 | 标准内容层级 |
| **中圆角** | `16rpx` | 输入框、小型面板、列表项 | 功能性组件，偏工具属性 |
| **小圆角** | `8rpx` | 标签（Tag）、Badge、内嵌提示 | 辅助信息、紧凑、次要 |
| **无圆角** | `0` | 全宽分割线、沉浸式图片顶部 | 建立边界、引导视线、打断节奏 |
| **顶部圆角** | 仅顶部 `20rpx+` | 底部弹层、抽屉面板 | 表达从底部滑出的物理感 |

### 3.1 形状使用约束

- **同一页面中，形状差异必须有意义**。不要将按钮、卡片、输入框全部设为相同的圆角。
- **交互元素优先使用 Pill 形状**，与非交互容器形成强烈对比。
- **图片/媒体容器的圆角**可以与文字容器的圆角不同，建立"材质差异"。
- **分割线必须是无圆角的直角**，作为形状的"休止符"。

### 3.2 形状组合示例

```
┌─────────────────────────────────────┐  ← Banner: 超大圆角 24rpx
│  [社区春季运动会]                     │
└─────────────────────────────────────┘

[查看详情]  ← 按钮: Pill 形状

┌─────────────────────────────────────┐  ← 卡片: 大圆角 20rpx
│  关于物业费缴纳的通知                 │
│  ─────────────────────────────────  │  ← 分割线: 无圆角
│  正文内容...                         │
└─────────────────────────────────────┘

[重要]  ← 标签: 小圆角 8rpx
```

---

## 4. 颜色系统

所有颜色必须使用 `app.wxss` 中定义的 CSS 变量（`--md-*` 系列），**禁止在局部 WXSS 中硬编码任何色值**。

### 4.1 核心色板

| Token | 色值 | 用途 |
|-------|------|------|
| `--md-primary` | `#4C662B` | 主按钮、链接、活跃状态 |
| `--md-on-primary` | `#FFFFFF` | 主色上的文字 |
| `--md-primary-container` | `#CDEDA3` | 标签背景、选中态、FAB 背景 |
| `--md-on-primary-container` | `#354E16` | Primary Container 上的文字 |
| `--md-secondary` | `#586249` | 次要操作 |
| `--md-on-secondary` | `#FFFFFF` | 次要色上的文字 |
| `--md-secondary-container` | `#DCE7C8` | 次要标签背景 |
| `--md-tertiary` | `#386663` | 强调色、辅助操作 |
| `--md-tertiary-container` | `#BCECE7` | 第三层级标签背景 |
| `--md-error` | `#BA1A1A` | 错误提示 |
| `--md-error-container` | `#FFDAD6` | 错误标签背景 |

### 4.2 Surface 层级

| Token | 色值 | 用途 |
|-------|------|------|
| `--md-background` | `#F9FAEF` | 页面最底层背景 |
| `--md-surface` | `#F9FAEF` | 默认表面 |
| `--md-surface-container-lowest` | `#FFFFFF` | 最亮的容器（如弹窗） |
| `--md-surface-container-low` | `#F3F4E9` | 略亮的容器 |
| `--md-surface-container` | `#EEEFE3` | 标准容器（快捷入口背景等） |
| `--md-surface-container-high` | `#E8E9DE` | 略暗的容器 |
| `--md-surface-container-highest` | `#E2E3D8` | 最暗的容器 |

### 4.3 文字与轮廓

| Token | 色值 | 用途 |
|-------|------|------|
| `--md-on-surface` | `#1A1C16` | 主要文字 |
| `--md-on-surface-variant` | `#44483D` | 次要文字、元信息 |
| `--md-outline` | `#75796C` | 边框、轮廓按钮边框 |
| `--md-outline-variant` | `#C5C8BA` | 分割线、禁用态边框 |

---

## 5. 排版系统

### 5.1 字体栈

小程序无法加载 Google Fonts，使用系统字体栈：

```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
```

### 5.2 字号规范

| 层级 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| **Display** | `56rpx` | `700` | `1.15` | 首屏大标题（极少使用） |
| **Headline** | `48rpx` | `600` | `1.2` | 页面标题、文章标题 |
| **Title** | `36rpx` | `600` | `1.3` | 卡片标题、章节标题 |
| **Body** | `32rpx` | `400` | `1.75` | 正文阅读、主要内容 |
| **Label** | `24rpx` | `500` | `1.4` | 辅助文字、元信息、时间、来源 |

### 5.3 排版约束

- 字重最低使用 `400`，**避免 `300` 及以下细体**（小程序渲染模糊问题）。
- 中文标题使用负字间距 `-0.4rpx` 提升紧凑感。
- 正文行高不低于 `1.75`，保证阅读舒适度。
- 所有用户可见文本使用**中文**。

---

## 6. 图标规范

### 6.1 禁止使用 Emoji

**禁止在任何地方使用 emoji 作为图标、装饰或状态指示。** 包括但不限于：
- TabBar 图标
- 快捷入口图标
- 分类图标
- 状态标记
- 空状态插图

### 6.2 使用 Material Symbols

统一使用 **Material Symbols** 风格的图标。实现方式：

- 使用 Material Symbols 的 **SVG 版本**，存放于 `images/material/` 和 `images/icons/` 目录。
- 图标颜色使用 `currentColor` 以继承父元素文字色，或显式使用 `var(--md-primary)`。
- 图标尺寸规范：
  - 标准：`24rpx`（导航、列表、按钮内）
  - 紧凑：`20rpx`（标签内、元信息行）
  - 大尺寸：`40rpx`（空状态、功能入口）
- 图标与文字组合时，图标与文字间距 `8rpx`，垂直居中对齐。

---

## 7. 布局风格

### 7.1 沉浸式内容区

内容直接铺展在 Surface 背景上，**不使用卡片包裹正文阅读区域**。卡片仅用于：
- 列表中的独立条目
- 功能模块的容器（如首页快捷入口）
- 需要突出层级的信息块

### 7.2 间距规范

| 场景 | 间距 |
|------|------|
| 页面左右边距 | `32rpx` |
| 模块之间 | `48rpx` |
| 卡片内部 padding | `24rpx ~ 32rpx` |
| 列表项垂直间距 | `28rpx` |
| 标题与元信息间距 | `20rpx` |
| 正文段落间距 | `24rpx` |

### 7.3 标题区与正文分隔

文章详情页的标题区域（.detail-header）与正文区域（.detail-content）之间使用分割线分隔：

```css
.detail-header {
  padding: 40rpx 32rpx;
  border-bottom: 1rpx solid var(--md-outline-variant);
}
```

### 7.4 列表页布局

- 去掉 `.ios-card` 卡片包裹。
- 列表项使用垂直 `padding: 28rpx 0` + 底部细线 `border-bottom: 1rpx solid var(--md-outline-variant)` 分隔。
- 最后一项去掉底部边框。
- 整体容器 `padding: 0 32rpx`。

### 7.5 媒体展示

- 封面图 / Banner 使用**超大圆角**（`28rpx`）。
- 媒体容器与下方文字容器的圆角应**不同**，建立材质差异。
- 图片使用 `mode="aspectFill"` + `lazy-load`。

---

## 8. 组件形状规范

| 组件 | 形状 | 背景 | 说明 |
|------|------|------|------|
| 主按钮（Filled Button） | Pill `9999rpx` | `--md-primary` | 最突出的交互元素 |
| 次要按钮（Tonal Button） | Pill `9999rpx` | `--md-primary-container` | 次要操作 |
| 边框按钮（Outlined Button） | Pill `9999rpx` | transparent + `--md-outline` 边框 | 低优先级操作 |
| 文字按钮（Text Button） | Pill `9999rpx` | transparent | 最低优先级 |
| 卡片（Card） | `20rpx` / `28rpx` | `--md-surface` / `--md-surface-container` | 内容容器（大卡片用 28rpx） |
| 输入框（Text Field） | `16rpx` | `--md-surface-container-low` | 表单输入 |
| 标签 / Chip | Pill `9999rpx` 或 `8rpx` | `--md-primary-container` | 信息标记 |
| 分割线（Divider） | `0` | — | `1rpx solid --md-outline-variant` |
| 悬浮按钮（FAB） | Pill `9999rpx` 或圆形 | `--md-primary-container` | 页面级主要操作 |
| Banner / 大图 | `28rpx` | — | 媒体展示 |

---

## 9. 设计案例（参考 Material 3 Expressive 官方规范）

以下设计案例参考 Material 3 Expressive 官方组件规范与应用界面提炼而成，用于指导实际页面的视觉实现。

### 9.1 图标按钮网格

首页快捷入口等高频功能入口使用**方形圆角图标按钮网格**（参考图片 1 右侧图标按钮矩阵）。

| 属性 | 规范 |
|------|------|
| 按钮尺寸 | `120rpx × 120rpx`（大）、`96rpx × 96rpx`（中） |
| 圆角 | `16rpx`（方形圆角，非圆形） |
| 背景 | `var(--md-surface-container-high)` 或 `var(--md-primary-container)` |
| 图标尺寸 | `40rpx` |
| 文字位置 | 按钮下方，Label 字号 `24rpx`，距按钮 `12rpx` |
| 间距 | 按钮之间 `24rpx`，网格布局 `repeat(3, 1fr)` |
| 按下反馈 | `transform: scale(0.96)`，duration `100ms` |

**设计意图**：方形圆角图标按钮比纯图标+文字更具"可按压感"，背景的色块提供了明确的触控热区，是 Expressive 风格区别于标准 Material 3 的标志性手法。

### 9.2 Pill 标签组

分类筛选（新闻、交易、周边生活）使用**Pill 标签组**（参考图片 1 的 Photos/Memories/Library 标签切换）。

| 属性 | 规范 |
|------|------|
| 整体容器 | Pill 形状，`border-radius: 9999rpx`，背景 `var(--md-surface-container)` |
| 容器内边距 | `8rpx` |
| 单个标签 | Pill 形状，`padding: 12rpx 28rpx` |
| 未选中态 | 透明背景，`color: var(--md-on-surface-variant)` |
| 选中态 | 背景 `var(--md-primary)`，`color: #FFFFFF` |
| 过渡动画 | `background-color 100ms ease-out, color 100ms ease-out` |

**设计意图**：将分散的 Chip 收拢到统一的 Pill 容器中，形成更强的视觉整体性，选中项与容器的对比更鲜明。

### 9.3 底部浮动操作栏

详情页、发布页、反馈页的底部操作按钮使用**浮动操作栏**（参考图片 2 的 "Tap to pay" 按钮）。

| 属性 | 规范 |
|------|------|
| 定位 | **非 fixed**，放置在页面内容流末尾 |
| 距底边距 | `48rpx`（内容下方留白） |
| 左右边距 | `32rpx` |
| 按钮高度 | `96rpx` |
| 按钮形状 | Pill `9999rpx` |
| 双按钮场景 | 主按钮 `flex: 2`，次按钮 `flex: 1`，间距 `24rpx` |
| 背景 | 不设置固定底栏背景，直接露出页面背景色 |

**设计意图**：fixed 底栏会产生生硬的"切断感"，浮动按钮让页面底部有自然的呼吸空间，更符合 Expressive 的宽松节奏。

### 9.4 卡片层叠

当页面中需要展示多张同类型卡片时（如班车路线卡片、活动卡片），可采用**垂直层叠**布局（参考图片 2 Cardfolio 的银行卡层叠效果）。

| 属性 | 规范 |
|------|------|
| 层叠方向 | 垂直方向，下方卡片露出顶部 `16rpx` |
| 卡片间距 | `0`（通过负 margin 实现重叠） |
| 圆角 | `28rpx`（超大圆角） |
| 背景色 | 相邻卡片使用不同 Container 色调区分层级 |
| 阴影 | 不使用 box-shadow，靠颜色差异和形状建立层级 |

### 9.5 Display 级标题

首屏大标题使用 **Display 级别字号**（参考图片 2 音乐播放器的 "ODETTE" 标题）。

| 属性 | 规范 |
|------|------|
| 字号 | `56rpx ~ 64rpx` |
| 字重 | `700` |
| 字间距 | `-0.8rpx` |
| 使用场景 | 首页头部标题、空状态主标题、首屏 Banner 标题 |
| 限制 | 每页最多一处 Display 标题，避免视觉噪音 |

---

## 10. 动画与性能

### 10.1 禁止的动画

考虑小程序性能，**删除或避免以下动画**：
- 复杂 CSS transition（多个属性同时过渡）
- 多元素同时动画
- 持续循环动画（如呼吸效果、脉冲）
- 粒子效果、模糊 backdrop-filter
- 大范围的 transform（如 translateY 长距离滑动）

### 10.2 允许的动画

| 动画 | 参数 |
|------|------|
| 按钮按下反馈 | `transform: scale(0.96)`，duration `100ms`，ease-out |
| 页面切换 | 使用小程序原生页面切换，不额外添加 |
| 骨架屏 | 优先使用骨架屏替代 loading spinner |
| 内容淡入 | `opacity: 0 → 1`，duration `150ms`（可选） |

### 10.3 性能原则

- 动画元素使用 `will-change: transform`（谨慎使用，动画结束后移除）。
- 避免在 `scroll` 事件中执行复杂计算或 DOM 操作。
- 列表使用 `wx:key` 和 `lazy-load`。
- 图片控制在 200KB 以内。

---

## 11. 响应式与适配

### 11.1 安全区域

- **导航栏页面**：内容顶部需设置 `padding-top` 避开自定义导航栏（`nav-bar` 组件高度通常为 `88rpx` + 状态栏高度）。
- **TabBar 页面**：底部需设置 `padding-bottom: calc(120rpx + env(safe-area-inset-bottom))`。
- **普通页面**：底部至少设置 `padding-bottom: calc(24rpx + env(safe-area-inset-bottom))`。

### 11.2 单位规范

- 所有尺寸使用 `rpx` 单位，保证不同屏幕尺寸的一致性。
- 1rpx 边框在 Retina 屏上使用 `transform: scaleY(0.5)` 或 `scaleX(0.5)` 实现真·1px 效果。

### 11.3 设备适配

- iPhone 刘海屏 / 灵动岛：顶部安全区域由自定义导航栏组件统一处理。
- Android 全面屏：底部安全区域通过 `env(safe-area-inset-bottom)` 处理。
- 深色模式：当前版本暂不支持，预留 `--md-*` 变量结构便于后续扩展。

---

## 12. 原生组件样式规范

微信小程序原生组件带有平台默认样式（如按钮的默认边框、navigator 的蓝色下划线、switch 的微信绿），必须通过全局重置消除其对 MD3 Expressive 风格的干扰。

### 12.1 重置原则

- **所有原生组件重置集中在 `app.wxss` 的「Native Component Reset」区域**，禁止在页面级 WXSS 中单独覆盖。
- 重置目标：让原生组件的默认外观「归零」，再通过项目自定义类（如 `.md-btn--filled`、`.md-text-field`）赋予 MD3 风格。
- 对于无法通过简单 CSS 重置的组件（如 `radio`、`checkbox`），应在设计阶段避免使用，或封装为自定义组件。

### 12.2 各组件重置规范

| 组件 | 重置内容 |
|------|----------|
| `button` | 去除默认 `margin`、`padding`、`background`、`border`、`border-radius`；去除点击态边框 `button::after` |
| `input`, `textarea` | 背景透明、文字色 `var(--md-on-surface)`、`placeholder` 色 `var(--md-on-surface-variant)`、`caret-color` 为 `var(--md-primary)` |
| `picker` | 背景透明、文字色 `var(--md-on-surface)` |
| `navigator` | 文字色继承父元素（`color: inherit`）、去除下划线（`text-decoration: none`） |
| `image` | `display: block` 消除图片底部留白 |
| `scroll-view` | 隐藏默认滚动条（`::-webkit-scrollbar { display: none; }`） |
| `switch` | 选中态背景统一为 `var(--md-primary)`，未选中态背景为 `var(--md-surface-variant)` |
| `slider` | 去除默认 `margin`；已选轨道 `var(--md-primary)`，未选轨道 `var(--md-surface-variant)`，滑块 `var(--md-primary)` |
| `radio`, `checkbox` | ⚠️ 微信小程序不支持通过 CSS 重置选中色。如需使用，**必须封装自定义组件**或采用自定义样式方案，确保选中色为 `var(--md-primary)`，禁止直接使用默认绿色 `#07C160` |

### 12.3 实现示例

```css
/* app.wxss — Native Component Reset */

button {
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  border-radius: 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

button::after {
  border: none;
}

navigator {
  color: inherit;
  text-decoration: none;
}

input, textarea {
  background: transparent;
  color: var(--md-on-surface);
  font-size: 28rpx;
  line-height: 1.5;
  caret-color: var(--md-primary);
}

input::placeholder, textarea::placeholder {
  color: var(--md-on-surface-variant);
}

picker {
  background: transparent;
  color: var(--md-on-surface);
}

image {
  display: block;
}

scroll-view::-webkit-scrollbar {
  display: none;
}

slider {
  margin: 0;
}
```

---

## 附录：参考资料

- [Material 3 Expressive Guidelines](https://m3.material.io/styles/overview)
- [Material Symbols](https://fonts.google.com/icons)
- [微信小程序设计指南](https://developers.weixin.qq.com/miniprogram/design/)
