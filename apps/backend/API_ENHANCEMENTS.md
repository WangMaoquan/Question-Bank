# API Enhancements Documentation

## 已添加的功能

### 1. 📚 Swagger API 文档

**访问地址**: `http://localhost:4000/api`

**功能**:

- 自动生成交互式 API 文档
- 可直接在浏览器测试所有接口
- 支持 Bearer Token 认证

**如何使用**:

1. 启动后端服务：`pnpm --filter backend dev`
2. 浏览器访问：`http://localhost:4000/api`
3. 查看所有可用接口及其参数
4. 点击 "Authorize" 按钮输入 JWT token 进行认证
5. 直接在页面上测试接口

**为控制器添加文档** (可选):

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Questions') // API 分组
@Controller('questions')
export class QuestionsController {
  @ApiOperation({ summary: 'Create a new question' }) // 接口描述
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  @Post()
  create(@Body() dto: CreateQuestionDto) {
    // ...
  }
}
```

---

### 2. 🛡️ Helmet 安全头部

**自动启用的安全功能**:

- ✅ 防止点击劫持 (X-Frame-Options)
- ✅ XSS 保护 (X-XSS-Protection)
- ✅ 禁用 MIME 类型嗅探 (X-Content-Type-Options)
- ✅ HTTPS 强制 (Strict-Transport-Security)
- ✅ DNS 预取控制
- ✅ 隐藏 X-Powered-By 头部

**配置位置**: `apps/backend/src/main.ts`

**无需额外配置，默认已启用最佳安全设置**

---

### 3. 🚦 请求限流 (Rate Limiting)

**当前配置**:

- **时间窗口**: 60 秒
- **最大请求数**: 100 次/分钟
- **超出限制**: 返回 429 Too Many Requests

**保护所有路由**:

```
同一 IP 在 60 秒内最多调用 100 次 API
```

**特定路由自定义限流** (可选):

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 登录接口: 5次/分钟
  @Post('login')
  login(@Body() dto: LoginDto) {
    // ...
  }
}
```

**跳过限流** (特殊场景):

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()  // 跳过此路由的限流检查
@Get('public')
getPublic() {
  // ...
}
```

**调整全局配置**:
编辑 `apps/backend/src/app.module.ts`:

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000,   // 时间窗口（毫秒）
    limit: 100,   // 最大请求数
  },
]),
```

---

## 生产环境建议

### Swagger

```typescript
// 仅在开发环境启用 Swagger
if (process.env.NODE_ENV !== 'production') {
  const config = new DocumentBuilder()...
  SwaggerModule.setup('api', app, document);
}
```

### Helmet

生产环境可能需要自定义配置：

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
```

### Rate Limiting

根据实际负载调整：

- **高流量 API**: 增加 limit
- **敏感操作** (登录、注册): 降低 limit
- **公开接口**: 考虑使用 IP 白名单

---

## 测试这些功能

### 1. 测试 Swagger

```bash
# 启动服务
pnpm --filter backend dev

# 浏览器访问
open http://localhost:4000/api
```

### 2. 测试安全头部

```bash
curl -I http://localhost:4000/api
# 检查响应头中的安全设置
```

### 3. 测试限流

```bash
# 快速发送 101 个请求
for i in {1..101}; do
  curl http://localhost:4000/questions
done
# 第 101 个请求应该返回 429
```

---

## 下一步建议

1. **为所有控制器添加 Swagger 装饰器** - 完善 API 文档
2. **根据业务需求调整限流策略** - 不同接口不同限制
3. **生产环境关闭 Swagger** - 避免暴露 API 结构
4. **配置 CORS 白名单** - 替代 `enableCors()` 的通配符配置
