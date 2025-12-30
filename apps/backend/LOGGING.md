# 日志使用指南

## 1. HTTP 请求日志

自动记录所有 HTTP 请求和响应，无需手动配置。

**示例输出**：

```
[HTTP] 📥 POST /auth/login - IP: ::1 - User-Agent: PostmanRuntime/7.x
[HTTP] Body: {"email":"test@example.com","password":"***"}
[HTTP] 📤 POST /auth/login - 200 - 45ms
```

---

## 2. 数据库查询日志

开发环境下自动记录所有 SQL 查询。

**配置**: `apps/backend/src/app.module.ts`

```typescript
logging: process.env.NODE_ENV === 'development'
  ? ['query', 'error']
  : ['error'];
```

**示例输出**：

```
query: SELECT * FROM users WHERE email = $1
```

---

## 3. 业务逻辑日志

在 Service 中使用 Logger 记录关键操作。

**使用示例**：

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  async create(dto: CreateQuestionDto, userId: string) {
    this.logger.log(`User ${userId} creating question: ${dto.title}`);
    // ... business logic
    this.logger.debug(`Question created with ID: ${result.id}`);
    return result;
  }

  async remove(id: string, userId: string) {
    this.logger.warn(`User ${userId} deleting question ${id}`);
    // ... delete logic
  }
}
```

**日志级别**：

- `logger.log()` - 一般信息
- `logger.debug()` - 调试信息（详细）
- `logger.warn()` - 警告
- `logger.error()` - 错误（自动包含堆栈）

---

## 4. 错误和异常日志

全局异常过滤器自动捕获和记录所有错误。

**自动记录**：

- ⚠️ 4xx 错误 - 警告级别
- ❌ 5xx 错误 - 错误级别（包含堆栈）

**示例输出**：

```
[ExceptionFilter] ⚠️  POST /questions - 400 - Validation failed
[ExceptionFilter] ❌ GET /questions/invalid-id - 500
Error: Entity not found
    at QuestionsService.findOne (questions.service.ts:45)
    ...
```

---

## 5. 性能监控

HTTP 拦截器自动记录每个请求的响应时间。

**示例输出**：

```
[HTTP] 📤 GET /questions - 200 - 156ms  ⚡ Fast
[HTTP] 📤 POST /questions - 201 - 1248ms  🐌 Slow
```

**慢查询警告**：

- 响应时间 > 1000ms 会特别标记

---

## 环境变量控制

```bash
# .env
NODE_ENV=development  # 启用详细日志
LOG_LEVEL=debug       # 日志级别: debug | log | warn | error
```

---

## 最佳实践

1. **不要记录敏感信息**：密码、Token 等会自动脱敏
2. **使用合适的日志级别**：
   - `debug` - 开发调试
   - `log` - 正常操作
   - `warn` - 异常但可处理的情况
   - `error` - 错误和异常
3. **添加上下文**：包含用户 ID、资源 ID 等关键信息
4. **生产环境优化**：减少 debug 级别日志，关闭 SQL 查询日志
