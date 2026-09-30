<div align="center">

# ⚡ React Bits Gallery

**让界面动起来 —— 一套开箱即用的 React 动效组件展示站**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=gsap)](https://gsap.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0080?style=flat-square&logo=framer)](https://motion.dev)
[![OGL](https://img.shields.io/badge/OGL-WebGL-5227FF?style=flat-square)](https://github.com/oframe/ogl)
[![License: MIT](https://img.shields.io/badge/License-MIT-8261FF?style=flat-square)](LICENSE)

*28 个精心策划的 [React Bits](https://reactbits.dev) 动效组件 · WebGL 背景 · 动态排版 · 微交互*

</div>

---

## 📖 简介

**React Bits Gallery** 是一个基于 Next.js 16 App Router 构建的动效组件展示站，收录了 28 个来自 [React Bits](https://reactbits.dev)（MIT 协议）的高质量动效组件，并将它们全部以**可交互实景演示**的方式呈现在一个单页应用中。

项目的核心目标有三个：其一，提供一个直观的「所见即所得」画廊，让访客在浏览器里直接感受每个组件的真实手感，而非仅看静态截图；其二，沉淀一套可直接复制的组件源码，全部使用 React + TypeScript + Tailwind CSS 编写，无任何封装锁定；其三，验证这些组件在 Next.js 16 + React 19 的严格模式（Strict Mode）与 React Compiler 环境下的兼容性，所有组件均通过了 ESLint 零警告检查与真实浏览器端到端验证。

整个站点采用 React Bits 标志性的暗夜紫主题（`#060010` 底色 + `#5227FF` / `#FF2D92` 渐变强调色），并通过 GSAP、OGL 与 Framer Motion 三大引擎驱动所有动画。

## ✨ 组件清单

### 🌌 动态背景（Backgrounds）

| 组件 | 技术 | 说明 |
|------|------|------|
| **Aurora** | OGL · GLSL ES 3.0 | 多层 Simplex 噪声驱动的极光光带，支持自定义渐变色标、振幅与流速 |
| **Particles** | OGL · `gl.POINTS` | 数千颗发光粒子，静息漂移，鼠标靠近时产生实时斥力场 |
| **DotGrid** | OGL · Fragment Shader | 程序化点阵网格，光标周围圆点膨胀增亮，带呼吸波动画 |
| **Squares** | Canvas 2D | 方格涟漪：波浪沿对角线扫过方格阵列，悬停点亮光标所在单元格 |
| **Silk** | OGL · GLSL ES 3.0 | 五倍频 Simplex 噪声折叠成丝绸光泽面，支持颜色/转速/缩放/旋转定制 |
| **Waves** | OGL · Vertex Shader | 透射式正弦波场，相机随光标环绕俯瞰，波峰高光与边缘溶解 |

### ✍️ 文字动画（Text Animations）

| 组件 | 技术 | 说明 |
|------|------|------|
| **SplitText** | GSAP | 按字符或单词拆分，配合 overflow 遮罩逐字升起，支持交错节奏 |
| **BlurText** | GSAP | 文字由模糊到清晰、由偏移到归位的滚动入场效果 |
| **GradientText** | 纯 CSS | 无限流动的渐变色流，通过 `background-clip: text` 裁切至字形 |
| **ShinyText** | 纯 CSS | 高光扫过文字的微光效果，常用于徽章与口号 |
| **RotatingText** | Framer Motion | 字母逐个上滑退场、新词入场，适合轮播关键词 |
| **CountUp** | GSAP + IntersectionObserver | 数字滚动计数，进入视口触发，支持千分位与小数 |
| **TextType** | React 定时器 | 打字机效果：输入 → 停顿 → 删除 → 循环下一条，带闪烁光标 |
| **CircularText** | SVG textPath + CSS | 文字沿圆环路径持续旋转，悬停加速（可配置减速/停止） |
| **ScrambleText** | rAF 定时器 | 字符从随机字符池中翻滚，从左到右逐位锁定，支持多短语循环 |
| **TextPressure** | rAF + 线性插值 | 字母随光标距离拉伸变形，离开后弹性恢复（光滑衰减曲线） |

### 🎬 入场动画（Animations）

| 组件 | 技术 | 说明 |
|------|------|------|
| **AnimatedContent** | GSAP | 滚动进入视口时的淡入 + 位移，支持方向、距离与缓动配置 |
| **ClickSpark** | Canvas 2D | 点击任意位置迸发的火花粒子，easeOut 缓动 + 透明度衰减 |
| **StarBorder** | 纯 CSS | 沿边框无限巡游的星光流，为 CTA 按钮注入能量感 |
| **FadeContent** | IntersectionObserver | 轻量淡入（可选模糊）入场，进入视口即触发 |
| **BlobCursor** | Canvas 2D | 多层发光泡泡拖尾追随光标（screen 混合），空闲时沿李萨如轨迹自转 |
| **MetaBalls** | SVG gooey filter | 黏液质感 Metaballs：按住指针吸附融合，松手弹回原位 |

### 🖱️ 微交互（Components）

| 组件 | 技术 | 说明 |
|------|------|------|
| **SpotlightCard** | CSS 变量 | 跟随鼠标的径向聚光灯卡片，常用于功能展示网格 |
| **TiltedCard** | Framer Motion | 3D 透视倾斜 + 弹簧惯性 + 高光追踪，悬停浮现字幕 |
| **Magnet** | Framer Motion | 元素被光标磁吸，带弹性回弹与扩展吸引范围 |
| **Dock** | Framer Motion | macOS 风格程序坞，按光标距离弹性放大图标 |
| **ElasticSlider** | Framer Motion | 弹性滑块：拖出端点时旋钮产生橡皮筋拉伸回弹 |
| **Stack** | Framer Motion | 卡片堆叠：甩出顶部卡片，整摞弹簽循环前移 |
| **MagnetLines** | rAF + 线性插值 | 指北针线段阵列，随光标方向带缓动旋转并局部放大 |

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 20（推荐 22 LTS）
- **bun** ≥ 1.2（亦可使用 npm / pnpm，删除 `bun.lock` 后自行安装依赖）

### 安装与运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd my-project

# 2. 安装依赖
bun install

# 3. 启动开发服务器（默认监听 3000 端口）
bun run dev
```

打开浏览器访问 `http://localhost:3000` 即可看到展示站。开发服务器自带热更新，修改 `src/` 下任意文件都会实时生效。

### 其他常用命令

```bash
bun run lint        # ESLint 代码质量检查（当前 0 error / 0 warning）
bun run build       # 生产构建（standalone 输出）
bun run start       # 以生产模式启动
bun run db:push     # 同步 Prisma Schema 到 SQLite（本项目暂未使用数据库）
```

## 📁 项目结构

```text
src/
├── app/
│   ├── layout.tsx              # 根布局：字体、元信息（SEO / OpenGraph）
│   ├── page.tsx                # 主页：ClickSpark 全局包裹 + 各区块组装
│   └── globals.css             # Tailwind 4 主题 + React Bits 专属 CSS（星光/微光动画）
├── components/
│   ├── reactbits/              # ⚛ React Bits 组件库（本站核心资产）
│   │   ├── Backgrounds/        #   Aurora / Particles / DotGrid / Squares
│   │   │                       #   Silk / Waves
│   │   ├── TextAnimations/     #   SplitText / BlurText / GradientText / ShinyText
│   │   │                       #   CountUp / RotatingText / TextType / CircularText
│   │   │                       #   ScrambleText / TextPressure
│   │   ├── Animations/         #   AnimatedContent / ClickSpark / StarBorder / FadeContent
│   │   │                       #   BlobCursor / MetaBalls
│   │   ├── Components/         #   SpotlightCard / TiltedCard / Magnet / Dock
│   │   │                       #   ElasticSlider / Stack / MagnetLines
│   │   └── index.ts            #   统一桶式导出（barrel export）
│   ├── landing/                # 展示站页面区块
│   │   ├── Nav.tsx             #   毛玻璃滚动感知导航
│   │   ├── Hero.tsx            #   首屏：Aurora 背景 + 双行标题 + 统计卡片
│   │   ├── BackgroundsSection.tsx  # 背景组件实景演示卡（5 WebGL + 1 Canvas）
│   │   ├── TextSection.tsx     #   文字动画实景演示卡（9 组件）
│   │   ├── InteractionsSection.tsx # 微交互演示卡（8 组件）
│   │   └── Footer.tsx          #   CTA 横幅（DotGrid 背景）+ 页脚
│   └── ui/                     # shadcn/ui 基础组件（由脚手架提供）
└── lib/
    └── utils.ts                # cn() 等工具函数
```

## 🧩 如何复用这些组件

所有 React Bits 组件均位于 `src/components/reactbits/`，彼此零耦合，可以直接整目录拷贝到任何 React 项目。通过桶式导出一行引入：

```tsx
import { Aurora, SplitText, StarBorder, SpotlightCard } from "@/components/reactbits";

export function MyHero() {
  return (
    <section className="relative isolate min-h-[60vh] overflow-hidden">
      {/* WebGL 极光背景 */}
      <Aurora
        className="absolute inset-0 -z-10"
        colorStops={["#5227FF", "#B497FF", "#FF2D92"]}
        amplitude={1.2}
        speed={1.1}
      />

      <div className="flex flex-col items-center justify-center gap-6 pt-24 text-center">
        {/* 逐字升起的标题 */}
        <SplitText
          text="Interface motion"
          splitType="chars"
          stagger={0.025}
          className="text-6xl font-bold text-white"
        />

        {/* 星光流边框的 CTA 按钮 */}
        <StarBorder color="#8261FF" speed="5s">
          <button className="rounded-xl bg-[#0b0118] px-6 py-3 font-semibold text-white">
            Get started
          </button>
        </StarBorder>
      </div>
    </section>
  );
}
```

> **注意事项**
>
> - 背景類组件（Aurora / Particles / DotGrid / Silk / Waves）的根元素定位由调用方通过 `className` 控制（如 `absolute inset-0`），请确保父容器有 `relative` 或 `isolate` 以正确建立层叠上下文。
> - 它们均已在内部处理了 WebGL 上下文创建失败、`ResizeObserver` 自适应与组件卸载时的资源回收（`WEBGL_lose_context`），可安全地在路由间切换。
> - GSAP 驱动的组件使用 IntersectionObserver 触发，滚动出视口后不会重复播放；FPS 开销集中在 rAF 循环，移动端已通过 `dpr` 上限（≤2）做了降载。

## 🎨 主题定制

站点的配色集中定义在两处，修改即可全局换肤：

| 位置 | 内容 |
|------|------|
| `src/app/page.tsx` | 页面底色 `bg-[#060010]`、文字选区色 `selection:bg-[#5227FF]/40` |
| `src/components/landing/*.tsx` | 渐变强调色 `#5227FF → #FF2D92`、淡紫辅助色 `#B497FF` |
| `src/app/globals.css` | ShinyText / GradientText / StarBorder 的关键帧与混合参数 |

若想替换强调色，推荐保持「深底 + 高饱和双端渐变」的结构；`#8261FF` 是 `#5227FF` 的提亮变体，用于边框类发光以避免大面积高饱和导致的视觉疲劳。

## 🛠 技术栈

| 层级 | 选型 | 用途 |
|------|------|------|
| 框架 | Next.js 16（App Router）+ React 19 | 服务端渲染、路由与元信息管理 |
| 语言 | TypeScript 5（strict） | 全量类型安全 |
| 样式 | Tailwind CSS 4 + shadcn/ui | 原子化样式与基础组件 |
| 动画 | GSAP 3.15 | 文字拆分、计数、滚动入场 |
| 动画 | Framer Motion 11 | 弹簧物理交互（倾斜/磁吸/坞站） |
| 图形 | OGL 1.0（WebGL2） | 极光/粒子/点阵/丝绸/波浪五套着色器背景 |
| 质量 | ESLint（react-hooks + react-compiler 规则） | 0 error / 0 warning |

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。所有收录的 React Bits 组件同样遵循 [MIT 协议](https://reactbits.dev)（原始版权归 [David Haz](https://github.com/DavidHDev) 所有）。欢迎自由使用、修改与分发 —— 如果这个画廊对你有帮助，别忘了给上游的 [React Bits](https://github.com/DavidHDev/react-bits) 点个 Star ⭐。

<div align="center">

**用 ❤ 与 GSAP 构建 · Next.js 16 · Tailwind CSS 4 · OGL**

</div>
