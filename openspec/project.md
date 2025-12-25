# Project Context

## Purpose

题库平台 (Question Bank) 是一个**社区驱动的在线题库系统**,旨在为用户提供一个开放的平台来:

- 📝 上传和分享各类题目(单选、多选、判断、填空、简答、编程)
- 🎯 练习和测试自己的知识水平
- 💬 通过评论和讨论与其他用户交流
- 📊 跟踪个人学习进度和统计数据
- 🏆 参与社区贡献排行榜

**核心理念**: 知识共享,共同进步

## Tech Stack

### 架构

- **Monorepo**: pnpm workspace
- **语言**: TypeScript (全栈)

### 后端

- **框架**: NestJS 11.x
- **数据库**: PostgreSQL 14+
- **ORM**: TypeORM
- **认证**: JWT + Passport
- **缓存**: Redis (可选)

### 前端

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5.x
- **UI**: Tailwind CSS v4 (使用 @tailwindcss/vite 插件)
- **组件库**: Headless UI
- **图标**: Heroicons
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP**: Axios
- **富文本**: TipTap
- **代码编辑器**: Monaco Editor (编程题)

### 共享

- **类型定义**: `@question-bank/types` (共享包)

## Project Conventions

### Code Style

- **TypeScript**: 严格模式 (`strict: true`)
- **格式化**: Prettier (配置见 `.prettierrc`)
- **命名规范**:
  - 文件名: kebab-case (例: `question-list.vue`)
  - 组件名: PascalCase (例: `QuestionCard`)
  - 函数/变量: camelCase (例: `getUserById`)
  - 常量: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
  - 类型/接口: PascalCase (例: `Question`, `CreateQuestionDto`)

### Architecture Patterns

#### 后端 (NestJS)

- **模块化**: 每个功能一个模块 (例: `QuestionsModule`, `AuthModule`)
- **依赖注入**: 使用 NestJS 的 DI 系统
- **DTO 模式**: 使用 class-validator 验证输入
- **Repository 模式**: 数据访问层抽象
- **Guard/Interceptor**: 认证、授权、日志

#### 前端 (Vue 3)

- **Composition API**: 优先使用 `<script setup>`
- **组件化**:
  - `components/ui/`: 基础 UI 组件 (Button, Card, Input 等)
  - `components/question/`: 题目相关组件
  - `components/layout/`: 布局组件
- **Composables**: 可复用逻辑放在 `composables/` 目录
- **Store 模式**: Pinia stores 按功能划分
- **路径别名**: 使用 `@/`, `@components/`, `@views/` 等

#### Tailwind CSS v4

- **无配置文件**: 使用 Vite 插件,不需要 `tailwind.config.js`
- **主题定义**: 在 CSS 中使用 `@theme` 定义自定义变量
- **实用类优先**: 直接在模板中使用 Tailwind 类
- **组件提取**: 复杂组件可使用 `@apply` 或创建 Vue 组件

### Testing Strategy

- **单元测试**: Vitest
- **覆盖率目标**: > 80%
- **测试重点**:
  - 后端: Service 层业务逻辑、Controller 端点
  - 前端: Composables、复杂组件逻辑
- **E2E 测试**: 待定 (可选 Playwright)

### Git Workflow

- **分支策略**:
  - `main`: 生产分支
  - `develop`: 开发分支
  - `feature/*`: 功能分支
  - `fix/*`: 修复分支

- **Commit 规范**: Conventional Commits
  ```
  feat: 新功能
  fix: 修复
  docs: 文档
  style: 格式
  refactor: 重构
  test: 测试
  chore: 构建/工具
  ```

## Domain Context

### 题目类型 (QuestionType)

1. **单选题 (single)**: 多个选项,一个正确答案
2. **多选题 (multiple)**: 多个选项,多个正确答案
3. **判断题 (judge)**: 对/错
4. **填空题 (fill)**: 填写答案
5. **简答题 (short)**: 文本回答
6. **编程题 (coding)**: 代码实现

### 难度等级 (QuestionDifficulty)

- **easy**: 简单
- **medium**: 中等
- **hard**: 困难

### 题目状态 (QuestionStatus)

- **draft**: 草稿 (未发布)
- **published**: 已发布
- **under_review**: 审核中 (公开题目需要审核)
- **archived**: 已归档

### 用户角色 (UserRole)

- **user**: 普通用户 (可上传题目、练习、评论)
- **admin**: 管理员 (可审核题目、管理用户、查看统计)

### 权限规则

- **题目可见性**:
  - 公开题目 (`isPublic: true`): 所有人可见
  - 私有题目 (`isPublic: false`): 仅创建者可见
- **题目编辑**: 仅创建者和管理员可编辑
- **评论**: 登录用户可评论
- **点赞**: 登录用户可点赞

## Important Constraints

### 技术约束

- **Node.js 版本**: >= 18.0.0
- **pnpm 版本**: >= 8.0.0
- **数据库**: PostgreSQL 14+ (必需)
- **浏览器支持**: 现代浏览器 (Chrome, Firefox, Safari, Edge 最新版)

### 业务约束

- **题目上传**: 用户可上传题目,公开题目需管理员审核
- **评论审核**: 用户可举报不当评论,管理员处理
- **数据隐私**: 私有题目仅创建者可见
- **API 限流**: 待实现 (防止滥用)

### 性能约束

- **首屏加载**: < 3s
- **API 响应**: < 500ms (P95)
- **并发用户**: 支持 1000+ 并发

## External Dependencies

### 必需服务

- **PostgreSQL**: 主数据库
- **Redis** (可选): 缓存、会话管理

### 第三方服务 (可选)

- **对象存储**: 阿里云 OSS / AWS S3 (题目图片)
- **邮件服务**: SMTP (用户通知)
- **监控**: Sentry (错误追踪)

### 开发工具

- **IDE**: VS Code (推荐)
- **扩展**:
  - Vue - Official
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

## 项目结构

```
Question-Bank/
├── apps/
│   ├── backend/          # NestJS 后端 (端口: 4000)
│   ├── frontend/         # Vue 3 用户端 (端口: 3000)
│   └── admin/            # Vue 3 管理端 (端口: 3001)
├── packages/
│   └── types/            # 共享 TypeScript 类型
├── docs/                 # 文档
├── .agent/               # Agent 配置
├── openspec/             # OpenSpec 规范
└── README.md
```

## 开发指南

### 快速开始

```bash
# 安装依赖
pnpm install

# 启动所有服务
pnpm dev

# 单独启动
cd apps/backend && pnpm dev   # 后端
cd apps/frontend && pnpm dev  # 前端
cd apps/admin && pnpm dev     # 管理端
```

### 常用命令

```bash
pnpm build          # 构建所有应用
pnpm test           # 运行测试
pnpm lint           # 代码检查
pnpm format         # 格式化代码
```

## 相关文档

- [实施计划](/.gemini/antigravity/brain/9018c4cd-9037-44e1-804e-5eaebbc4a3a6/implementation_plan.md)
- [Monorepo 架构说明](/.gemini/antigravity/brain/9018c4cd-9037-44e1-804e-5eaebbc4a3a6/monorepo_vs_multirepo.md)
- [UI 框架选型](/.gemini/antigravity/brain/9018c4cd-9037-44e1-804e-5eaebbc4a3a6/ui_framework_comparison.md)
- [项目初始化记录](/.gemini/antigravity/brain/9018c4cd-9037-44e1-804e-5eaebbc4a3a6/walkthrough.md)
