# Design Tokens — 完整颜色与 CSS 变量表

> 所有颜色必须使用 `app.wxss` 中定义的 `--md-*` CSS 变量。**禁止在局部 WXSS 中硬编码色值。**

## 核心色板

| Token                         | 色值      | 用途                         |
| ----------------------------- | --------- | ---------------------------- |
| `--md-primary`                | `#4C662B` | 主按钮、链接、活跃状态       |
| `--md-on-primary`             | `#FFFFFF` | 主色上的文字                 |
| `--md-primary-container`      | `#CDEDA3` | 标签背景、选中态、FAB 背景   |
| `--md-on-primary-container`   | `#354E16` | Primary Container 上的文字   |
| `--md-secondary`              | `#586249` | 次要操作                     |
| `--md-on-secondary`           | `#FFFFFF` | 次要色上的文字               |
| `--md-secondary-container`    | `#DCE7C8` | 次要标签背景                 |
| `--md-on-secondary-container` | `#404A33` | Secondary Container 上的文字 |
| `--md-tertiary`               | `#386663` | 强调色、辅助操作             |
| `--md-on-tertiary`            | `#FFFFFF` | 第三色上的文字               |
| `--md-tertiary-container`     | `#BCECE7` | 第三层级标签背景             |
| `--md-on-tertiary-container`  | `#1E4E4A` | Tertiary Container 上的文字  |
| `--md-error`                  | `#BA1A1A` | 错误提示                     |
| `--md-on-error`               | `#FFFFFF` | 错误色上的文字               |
| `--md-error-container`        | `#FFDAD6` | 错误标签背景                 |
| `--md-on-error-container`     | `#410002` | Error Container 上的文字     |

## Surface 层级

| Token                            | 色值      | 用途                       |
| -------------------------------- | --------- | -------------------------- |
| `--md-background`                | `#F9FAEF` | 页面最底层背景             |
| `--md-surface`                   | `#F9FAEF` | 默认表面                   |
| `--md-surface-container-lowest`  | `#FFFFFF` | 最亮的容器（如弹窗）       |
| `--md-surface-container-low`     | `#F3F4E9` | 略亮的容器                 |
| `--md-surface-container`         | `#EEEFE3` | 标准容器（快捷入口背景等） |
| `--md-surface-container-high`    | `#E8E9DE` | 略暗的容器                 |
| `--md-surface-container-highest` | `#E2E3D8` | 最暗的容器                 |

## 文字与轮廓

| Token                     | 色值      | 用途               |
| ------------------------- | --------- | ------------------ |
| `--md-on-surface`         | `#1A1C16` | 主要文字           |
| `--md-on-surface-variant` | `#44483D` | 次要文字、元信息   |
| `--md-outline`            | `#75796C` | 边框、轮廓按钮边框 |
| `--md-outline-variant`    | `#C5C8BA` | 分割线、禁用态边框 |

## 图标 Token 规范

| 场景         | Material Symbols                                         | 尺寸 | 颜色                                                       |
| ------------ | -------------------------------------------------------- | ---- | ---------------------------------------------------------- |
| TabBar 图标  | `home` / `explore` / `sync_alt` / `more_horiz`           | 24px | 未选中 `--md-on-surface-variant`，选中 `--md-primary`      |
| 快捷入口图标 | `storefront` / `receipt_long` / `event` / `sync_alt`     | 20px | `--md-on-primary-container`（在 Primary Container 背景上） |
| 列表项图标   | `call` / `menu_book` / `chat` / `info`                   | 20px | `--md-on-surface-variant`                                  |
| FAB 图标     | `add`                                                    | 24px | `--md-on-primary-container`                                |
| 交易分类图标 | `chair` / `tv` / `book` / `child_care` / `electric_bolt` | 32px | `--md-on-surface-variant`                                  |
| 状态栏图标   | `signal_cellular_alt` / `wifi` / `battery_full`          | 14px | `--md-on-surface`                                          |

## 使用约束

- 所有用户可见文本使用**中文**。
- 禁止使用 WeUI 默认绿色 `#07C160`，应统一使用 `--md-primary: #4C662B`。
- 禁止在局部 WXSS 中写死 `#xxx` 色值。
- **禁止使用 Emoji 作为图标或装饰**，必须使用 Material Symbols。
