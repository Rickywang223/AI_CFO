# AI CFO · 项目指南

## 项目概述
企业财税AI操作系统，Flask单页应用，服务于汉堡王中国600+门店税务管理。

## 快速命令
- `python3 app.py` — 启动开发服务器 (端口5002)
- 浏览器打开 `http://localhost:5002` 访问demo
- `git push` — 推送代码到GitHub（已配置代理+认证）

## 项目结构
```
税安AI/
├── app.py                    # Flask应用
├── templates/
│   └── demo.html             # 单页应用 (~4300行, 含CSS/HTML/JS)
├── static/
│   └── logo.png              # Logo
└── CLAUDE.md                 # 本文件
```

## 架构要点
- **3栏布局**: left-menu(200px) + center-content + right-chat(380px)
- **CSS**: 内联在demo.html `<style>` 块中（约800行）
- **JS**: 两个 `<script>` 块
  - 头部的进项模块JS（data + render函数）
  - 底部主JS（导航、聊天、风险、合规等所有其他功能）
- **ECharts**: 用于认证进度环图等可视化

## 主要模块
| 模块 | 触发 | 关键函数 |
|------|------|---------|
| 驾驶舱 | 默认 | `loadKpiData()` |
| 进项管理 | 左侧菜单 | `renderInvoiceModule()` |
| 风险监控 | 左侧菜单 | `showRiskDashboard()` |
| 申报/销项/报告 | 左侧菜单 | `switchModule()` |

## 数据来源
- 当前: demo.html内硬编码数据常量（`INVOICE_OVERVIEW`, `HISTORY`, `R`等）
- API: `/api/overview` 返回驾驶舱KPI数据
- 后续: 迁移到JSON文件/Flask API

## 已知问题（待修复）
1. **对话记录点击无反应** — 已加debug overlay，怀疑是msgs变量作用域问题
2. **进项管理模块JS** — 注意onclick中中文引号转义
3. 多处功能依赖硬编码数据，尚未对接真实数据源

## git 配置
- Remote: `https://github.com/Rickywang223/AI_CFO.git`
- Proxy: 127.0.0.1:7897 (Clash)
- 已在 `.git/credentials` 保存token
- 无登录态时: `GIT_ASKPASS=/tmp/git_askpass.sh git push`

## 编码规范
- demo.html 是唯一前端文件，所有改动集中在此
- JS函数名使用驼峰命名
- CSS类名使用连字符命名
- 保持右侧税务助手侧边栏不变
