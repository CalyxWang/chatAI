# Vercel 部署指南

## 🔐 环境变量配置

### 必需的环境变量

在 Vercel 项目设置中，您需要添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|----|---------|
| `VOLC_API_KEY` | `02d28e09-b9d4-4123-b790-be8d9b7f02a9` | 火山方舟API密钥 |
| `VOLC_MODEL_ID` | `ep-20250527195458-cjjmp` | DeepSeek R1模型ID |

### 可选的环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|---------|
| `VOLC_API_URL` | `https://ark.cn-beijing.volces.com/api/v3/chat/completions` | API端点URL |
| `API_TIMEOUT` | `60000` | 请求超时时间（毫秒） |
| `API_TEMPERATURE` | `0.6` | AI回复的创造性程度 |
| `API_STREAM` | `true` | 是否启用流式响应 |

## 📋 部署步骤

### 第一步：准备代码

1. 确保所有文件都已提交到 Git 仓库
2. 推送代码到 GitHub/GitLab/Bitbucket

### 第二步：连接 Vercel

1. 访问 [Vercel官网](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择您的代码仓库
5. 点击 "Import"

### 第三步：配置环境变量

1. 在项目导入页面，点击 "Environment Variables"
2. 添加以下必需变量：

   ```
   VOLC_API_KEY = 02d28e09-b9d4-4123-b790-be8d9b7f02a9
   VOLC_MODEL_ID = ep-20250527195458-cjjmp
   ```

3. （可选）添加其他配置变量：

   ```
   VOLC_API_URL = https://ark.cn-beijing.volces.com/api/v3/chat/completions
   API_TIMEOUT = 60000
   API_TEMPERATURE = 0.6
   API_STREAM = true
   ```

### 第四步：部署设置

1. **Framework Preset**: 选择 "Other"
2. **Build Command**: 留空（不需要构建步骤）
3. **Output Directory**: 留空
4. **Install Command**: `npm install`

### 第五步：完成部署

1. 点击 "Deploy" 开始部署
2. 等待部署完成（通常需要1-3分钟）
3. 部署成功后，您会获得一个 Vercel 域名

## 🔧 部署后配置

### 更新环境变量

如果需要更新环境变量：

1. 进入 Vercel 项目仪表板
2. 点击 "Settings" 标签
3. 选择 "Environment Variables"
4. 编辑或添加新的环境变量
5. 点击 "Save"
6. 重新部署项目（在 "Deployments" 标签中点击 "Redeploy"）

### 自定义域名

1. 在项目设置中点击 "Domains"
2. 添加您的自定义域名
3. 按照提示配置 DNS 记录

## 🚨 安全注意事项

1. **永远不要**在代码中硬编码 API 密钥
2. **确保**环境变量设置正确
3. **定期更换** API 密钥
4. **监控**API 使用情况

## 🐛 故障排除

### 常见错误

1. **"缺少必需的环境变量"**
   - 检查 VOLC_API_KEY 和 VOLC_MODEL_ID 是否正确设置
   - 确保变量名拼写正确

2. **"API调用失败"**
   - 验证 API 密钥是否有效
   - 检查网络连接
   - 确认模型ID是否正确

3. **"部署失败"**
   - 检查 package.json 依赖是否正确
   - 查看部署日志获取详细错误信息

### 查看日志

1. 在 Vercel 项目仪表板中
2. 点击 "Functions" 标签
3. 选择相应的函数查看日志

## 📞 获取帮助

如果遇到问题：

1. 查看 [Vercel 官方文档](https://vercel.com/docs)
2. 检查项目的部署日志
3. 确认所有环境变量都已正确设置

---

✅ **部署完成后，您的 AI 生活教练网站就可以在全球范围内访问了！**