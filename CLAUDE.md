# AI CFO · 项目指南

## 项目概述
企业财税AI操作系统，Flask单页应用，服务于汉堡王中国600+门店税务管理。
- 目录: `/home/rickyclaw/税安AI`
- 主文件: `templates/demo.html` (~4300行)
- 开发服务器: `python3 app.py` → `http://localhost:5002`

---

## /gitpush — 提交代码到 GitHub

用户说"提交一下" / "push" / "提交代码" 时执行此流程：

1. `cd /home/rickyclaw/税安AI`
2. `git status -s` — 查看变更
3. `git diff` — 查看具体改动
4. `git add -A` — 暂存所有
5. `git commit -m "描述改了什么"` — 提交
6. `git push` — 推送到 GitHub
   - proxy 已配置: `http.proxy=http://127.0.0.1:7897`
   - credential 已保存在 `.git/credentials`
   - 如果提示 credential 失效: `GIT_ASKPASS=/tmp/git_askpass.sh git push`

---

## 项目结构
```
税安AI/
├── app.py                    # Flask应用 (端口5002)
├── templates/
│   └── demo.html             # 单页应用 (~4300行, 含CSS/HTML/JS)
├── static/
│   └── logo.png
├── CLAUDE.md                 # 本文件
└── 其他 .md参考文档
```

## 架构要点
- **3栏布局**: left-menu(200px) + center-content(flex:1) + right-chat(380px)
- **CSS**: 内联 `<style>` 块（~800行）
- **JS**: 两个 `<script>` 块 — 头部进项模块JS + 底部主JS
- **ECharts**: 认证进度环图
- **Flask debug mode**: 文件修改自动重载

## 主要模块
| 模块 | 左侧菜单名 | 关键函数 |
|------|-----------|---------|
| 驾驶舱 | 📊 驾驶舱 | `loadKpiData()` |
| 进项管理 | 📄 进项管理 | `renderInvoiceModule()` |
| 风险监控 | ⚠️ 风险监控 | `showRiskDashboard()` |
| 申报/销项/报告 | 对应菜单 | `switchModule()` |

## 数据来源
- 当前: demo.html内硬编码数据常量（`INVOICE_OVERVIEW`, `HISTORY`, `R`等）
- API: `/api/overview` 返回驾驶舱KPI数据
- 后续: 迁移到JSON文件/Flask API

## 编码规范
- demo.html 是唯一前端文件，所有改动集中在此
- JS函数名使用驼峰命名，CSS类名使用连字符命名
- 保持右侧税务助手侧边栏不变
- onclick 中传中文参数时注意引号转义: `onclick=\'func("中文参数")\'`

## 已知问题（待修复）
1. 对话记录点击无反应 — 已加debug overlay调试中
2. 多处功能依赖硬编码数据，尚未对接真实数据源
3. 文件体积大（~4300行），后续建议拆分CSS/JS独立文件
