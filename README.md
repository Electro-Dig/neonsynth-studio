# NeonSynth Studio

> An AI-assisted browser synthwave studio for building 16-step loops, editing synth parameters, and visualizing sound as neon motion.

[中文说明](#中文说明)

## Demo

- Live demo: not published yet
- Local demo: run the Vite app locally with your own Gemini API key
- Media to add: screenshot or GIF showing the sequencer, sound-design panel, and Echo Pond view

## Overview

NeonSynth Studio is a browser-based synthwave sketchpad. It combines a four-track step sequencer, editable synth parameters, preset song templates, Web Audio synthesis, and an optional Gemini-powered prompt-to-pattern generator.

The project is designed as a compact music-technology prototype: write or generate a loop, tweak bass / lead / pad / drum tracks, then switch between a sequencer view and a visual Echo Pond view.

## Features

- 16-step sequencer for BASS, LEAD, PAD, and DRUMS tracks
- Built-in synthwave / retrowave preset library
- Editable track volume and sound-design parameters
- Sound bank controls for brightness, release, detune, and reverb send
- Web Audio engine with bass, lead, pad, drum, reverb, delay, and compression behavior
- Gemini-powered loop generation from a text prompt
- Echo Pond visual mode for ripple-like audio/visual interaction
- React + TypeScript + Vite implementation

## Tech Stack

- React 19 / TypeScript / Vite
- Web Audio API for synthesis and effects
- `@google/genai` for optional Gemini generation
- Tailwind CDN styling and custom neon UI

## Run Locally

**Prerequisites:** Node.js

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then set your own Gemini API key in `.env.local`:

```env
GEMINI_API_KEY=your_key_here
```

Do not commit `.env.local` or real API keys.

## API Key and Security

This project previously contained a committed `.env.local` file. The current branch and reachable git history have been cleaned, and `.env.local` is now ignored. You should still treat any previously exposed key as compromised and rotate or revoke it.

## Project Status

Prototype / active experiment.

Recommended next improvements:

- Publish a live demo with safe environment-variable handling
- Add screenshots and a short GIF
- Add export / save / load support for patterns
- Add MIDI input or browser keyboard control
- Add bilingual in-app UI if the project becomes public-facing

## License

No license has been specified yet.

---

# 中文说明

> 一个 AI 辅助的浏览器 synthwave 工作室，用于创建 16 步 loop、编辑合成器参数，并把声音可视化为霓虹运动。

## 演示

- 在线演示：暂未发布
- 本地演示：使用你自己的 Gemini API key 在本地运行 Vite 应用
- 建议补充素材：展示 sequencer、音色设计面板和 Echo Pond 视图的截图或 GIF

## 项目概述

NeonSynth Studio 是一个浏览器端 synthwave 音乐草图工具。它结合了四轨 step sequencer、可编辑合成器参数、内置 song presets、Web Audio 合成，以及可选的 Gemini prompt-to-pattern 生成能力。

这个项目更像一个小型 music-technology 原型：你可以手写或生成一个 loop，调整 bass / lead / pad / drums 轨道，然后在 sequencer 视图和 Echo Pond 视觉模式之间切换。

## 功能

- 面向 BASS、LEAD、PAD、DRUMS 的 16 步 sequencer
- 内置 synthwave / retrowave preset library
- 可编辑轨道音量与音色参数
- 声音库控制：brightness、release、detune、reverb send
- Web Audio 引擎：bass、lead、pad、drum、reverb、delay、compression
- 使用 Gemini 从文字 prompt 生成 loop
- Echo Pond 视觉模式，用涟漪方式呈现音频 / 视觉互动
- React + TypeScript + Vite 实现

## 技术栈

- React 19 / TypeScript / Vite
- Web Audio API 声音合成与效果处理
- `@google/genai` 用于可选 Gemini 生成
- Tailwind CDN 与自定义霓虹风格 UI

## 本地运行

**前置要求：** Node.js

```bash
npm install
cp .env.example .env.local
npm run dev
```

然后在 `.env.local` 中填入你自己的 Gemini API key：

```env
GEMINI_API_KEY=your_key_here
```

不要提交 `.env.local` 或真实 API key。

## API Key 与安全说明

这个项目之前曾提交过 `.env.local` 文件。当前分支和可达 git history 已清理，`.env.local` 也已加入忽略规则。即便如此，任何曾经暴露过的 key 都应视为已泄露，并进行轮换或吊销。

## 项目状态

原型 / 持续实验中。

建议下一步：

- 使用安全的环境变量配置发布在线 demo
- 增加截图和 GIF
- 增加 pattern 的 export / save / load
- 增加 MIDI 输入或浏览器键盘控制
- 如果作为公开作品继续发展，增加应用内中英双语 UI

## License

暂未指定 license。