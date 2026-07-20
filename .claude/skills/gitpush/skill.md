---
name: gitpush
description: 提交AI CFO项目代码变更到GitHub
type: project
---

# gitpush — 提交代码到 GitHub

当用户说"提交一下"、"push"、"提交代码"、"推送到GitHub"时执行此技能。

## 执行步骤

1. 切换到项目目录: `cd /home/rickyclaw/税安AI`
2. 查看变更: `git status -s` 和 `git diff`
3. 暂存所有: `git add -A`
4. 提交: `git commit -m "描述改了什么"`
5. 推送: `git push`
   - proxy: `http.proxy=http://127.0.0.1:7897`
   - credential: 保存在 `.git/credentials`
   - 备用: `GIT_ASKPASS=/tmp/git_askpass.sh git push`

## 注意事项
- 提交信息用中文，简明扼要
- 提交前先用 `git diff` 确认变更内容，给用户概述
- 如果有新文件（untracked），先 `git add` 再提交
- 推送遇到网络问题先检查 Clash 代理（端口7897）
