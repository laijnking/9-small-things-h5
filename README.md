# 9 件小事 - H5 版本

> 用微小的确定性行动，替代手机的廉价多巴胺

**版本**：v0.1.0  
**状态**：✅ 已发布  
**在线演示**：[即将上线](https://9-small-things.vercel.app)

---

## 🎯 项目简介

9 件小事是一个习惯养成应用，基于"人生回报率最高的 9 件小事"理念设计。

通过语音输入、文本优化、进度追踪等功能，帮助用户建立微习惯，获得持续的正反馈。

---

## ✨ 核心功能

- 🎤 **语音输入**：长按录音，自动识别
- 📝 **文本优化**：AI 将口语转为 3 句话日记
- 📊 **进度追踪**：实时显示今日完成进度
- ✅ **打卡完成**：一键标记习惯完成
- 💾 **本地存储**：数据自动保存，刷新不丢失
- 📱 **响应式**：完美适配手机、平板、桌面

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

---

## 📁 项目结构

```
9-small-things-h5/
├── src/
│   ├── views/          # 页面
│   │   └── Home.vue    # 首页
│   ├── components/     # 组件
│   │   ├── HabitCard.vue
│   │   └── ...
│   ├── stores/         # 状态管理
│   │   └── habits.js
│   ├── services/       # API 服务
│   │   └── aliyun/
│   │       ├── funasr.js   # 语音识别
│   │       └── bailian.js  # 文本优化
│   ├── assets/         # 静态资源
│   └── main.js         # 入口文件
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🛠️ 技术栈

- **前端框架**：Vue 3 + Vite
- **状态管理**：Pinia
- **样式框架**：Tailwind CSS
- **构建工具**：Vite 5
- **API 服务**：阿里云百炼（FunASR + Bailian）
- **部署平台**：Vercel

---

## 📱 9 个习惯

1. 📝 **写 3 句话**：记录今天的 3 件小事
2. 🧹 **整理空间**：花 10 分钟收拾一个小区域
3. 💰 **记录开销**：看清钱都去了哪里
4. 🎨 **学技能**：碎片化学习一个技能
5. 📚 **深度阅读**：静下心来读一篇长文
6. 👤 **联系朋友**：真诚问候一个具体的人
7. ⏰ **早起**：比平时早起半小时
8. 🏃 **运动**：10 分钟简单运动
9. 📵 **睡前关机**：睡前一小时远离手机

---

## ⚙️ 配置

### 环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

填入你的 API Key：

```env
# 阿里云百炼 API Key
VITE_DASHSCOPE_API_KEY=your_api_key_here

# Supabase（可选）
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## 📊 开发团队

本项目由多 Agent 协同开发完成：

| Agent | 职责 |
|-------|------|
| 📱 Mobile App Builder | 前端开发 |
| 🤖 AI Engineer | API 集成 |
| 🏗️ Backend Architect | 数据架构 |
| 🎨 UI Designer | UI/UX 设计 |
| 🔍 代码 QA | 代码审查 |
| 📋 PM Agent | 项目管理 |

---

## 📝 更新日志

### v0.1.0 (2026-03-05)
- ✅ 初始版本发布
- ✅ 首页功能
- ✅ 语音输入
- ✅ 文本优化
- ✅ 进度追踪
- ✅ 本地存储

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢所有参与开发的 Agent 们！

---

_用微小的确定性行动，对抗生活的焦虑 🌙_
