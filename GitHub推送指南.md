# GitHub 推送指南

## 📋 推送到 GitHub 的完整步骤

### 前提条件

1. **安装 Git**
   - 下载并安装 [Git for Windows](https://git-scm.com/download/win)
   - 安装完成后重启命令提示符

2. **GitHub 账号**
   - 确保您有 GitHub 账号
   - 登录 [GitHub.com](https://github.com)

### 第一步：配置 Git（首次使用）

打开命令提示符或 PowerShell，运行以下命令：

```bash
# 设置用户名（替换为您的 GitHub 用户名）
git config --global user.name "您的用户名"

# 设置邮箱（替换为您的 GitHub 邮箱）
git config --global user.email "您的邮箱@example.com"
```

### 第二步：在 GitHub 创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 号
3. 选择 "New repository"
4. 填写仓库信息：
   - **Repository name**: `ai-life-coach`（或您喜欢的名称）
   - **Description**: `基于火山方舟DeepSeek R1 API的AI生活教练网站`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Add a README file"（因为我们已经有了）
5. 点击 "Create repository"

### 第三步：初始化本地 Git 仓库

在项目目录中打开命令提示符：

```bash
# 切换到项目目录
cd "e:\hello_trae\ChatAI"

# 初始化 Git 仓库（如果还没有初始化）
git init

# 添加所有文件到暂存区
git add .

# 创建初始提交
git commit -m "初始提交：AI生活教练网站完整项目"
```

### 第四步：连接到 GitHub 仓库

```bash
# 添加远程仓库（替换为您的 GitHub 用户名和仓库名）
git remote add origin https://github.com/您的用户名/ai-life-coach.git

# 设置默认分支为 main
git branch -M main
```

### 第五步：推送代码到 GitHub

```bash
# 推送代码到 GitHub
git push -u origin main
```

**注意**：首次推送时，系统会要求您登录 GitHub。

### 🔐 身份验证选项

#### 选项1：使用 Personal Access Token（推荐）

1. 在 GitHub 上生成 Personal Access Token：
   - 进入 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问权限）
   - 复制生成的 token

2. 推送时使用 token：
   - 用户名：您的 GitHub 用户名
   - 密码：刚才生成的 Personal Access Token

#### 选项2：使用 SSH Key

1. 生成 SSH Key：
   ```bash
   ssh-keygen -t ed25519 -C "您的邮箱@example.com"
   ```

2. 添加 SSH Key 到 GitHub：
   - 复制公钥内容：`cat ~/.ssh/id_ed25519.pub`
   - 在 GitHub Settings → SSH and GPG keys 中添加

3. 使用 SSH URL：
   ```bash
   git remote set-url origin git@github.com:您的用户名/ai-life-coach.git
   ```

### 📁 创建 .gitignore 文件

为了避免推送不必要的文件，创建 `.gitignore`：

```gitignore
# 依赖文件
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境变量文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志文件
logs
*.log

# 运行时数据
pids
*.pid
*.seed
*.pid.lock

# 临时文件
.tmp
.temp

# IDE 文件
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统文件
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 构建输出
dist/
build/

# 缓存
.cache/
.parcel-cache/
```

### 🔄 日常更新流程

当您修改代码后，使用以下命令推送更新：

```bash
# 查看文件状态
git status

# 添加修改的文件
git add .

# 或者添加特定文件
git add 文件名

# 提交更改
git commit -m "描述您的更改"

# 推送到 GitHub
git push
```

### 📋 常用 Git 命令

```bash
# 查看仓库状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull

# 查看分支
git branch

# 创建新分支
git checkout -b 新分支名

# 切换分支
git checkout 分支名
```

### 🚨 故障排除

#### 问题1：推送被拒绝
```bash
# 先拉取远程更改
git pull origin main

# 解决冲突后再推送
git push
```

#### 问题2：忘记添加 .gitignore
```bash
# 移除已跟踪的文件
git rm -r --cached node_modules
git rm --cached .env

# 添加 .gitignore 后重新提交
git add .gitignore
git commit -m "添加 .gitignore"
git push
```

#### 问题3：身份验证失败
- 确保使用正确的用户名和 Personal Access Token
- 检查 token 是否有正确的权限
- 尝试重新生成 token

### ✅ 推送完成后

1. **验证推送**：访问您的 GitHub 仓库页面，确认文件已上传
2. **设置仓库描述**：在 GitHub 仓库页面添加项目描述
3. **添加 Topics**：为仓库添加相关标签（如：`ai`, `chatbot`, `nodejs`, `express`）
4. **准备 Vercel 部署**：现在可以使用这个 GitHub 仓库在 Vercel 上部署了

### 🎉 下一步

代码推送到 GitHub 后，您就可以：
- 在 Vercel 中导入这个 GitHub 仓库
- 配置环境变量
- 部署您的 AI 生活教练网站

---

**提示**：保存好您的 Personal Access Token，它相当于密码，不要分享给他人！