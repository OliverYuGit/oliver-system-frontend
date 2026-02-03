# Oliver Personal System - Frontend

个人管理系统前端，基于 Vue 3 + TypeScript + Vite + Tailwind CSS 构建。

## 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **语言**: TypeScript 5.0+
- **构建工具**: Vite 5.0+
- **样式**: Tailwind CSS 3.4+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **HTTP 客户端**: Axios
- **图表**: Chart.js + vue-chartjs
- **图标**: Heroicons

## 功能模块

- 🏠 **仪表盘** - 数据概览、健康指标、任务提醒
- 🍎 **健康追踪** - 饮食记录、饮水追踪、训练计划、体重管理
- ✅ **任务管理** - Apple Reminders 集成（只读）
- 📦 **库存管理** - 家庭物品库存、过期提醒、购买清单
- 🐱 **宠物管理** - 宠物信息、健康记录

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t oliver-system-frontend .

# 运行容器
docker run -d -p 80:80 oliver-system-frontend
```

### 阿里云服务器部署

1. 构建 Docker 镜像并推送到镜像仓库
2. 在服务器上拉取镜像并运行
3. 配置 Nginx 反向代理（如需要）

```bash
# 在服务器上
docker pull your-registry/oliver-system-frontend:latest
docker run -d --name oliver-frontend -p 3000:80 your-registry/oliver-system-frontend:latest
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `/api` |
| `VITE_APP_TITLE` | 应用标题 | `Oliver Personal System` |

## 项目结构

```
src/
├── api/          # API 接口层
├── assets/       # 静态资源
├── components/   # 组件
│   ├── common/   # 通用组件
│   ├── charts/   # 图表组件
│   └── layout/   # 布局组件
├── composables/  # 组合式函数
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── types/        # TypeScript 类型
├── utils/        # 工具函数
└── views/        # 页面组件
```

## 设计规范

- **主色调**: `#1E40AF` (Primary Blue)
- **强调色**: `#F59E0B` (Amber CTA)
- **字体**: Fira Sans (正文), Fira Code (标题/代码)
- **圆角**: 8px (卡片), 12px (大卡片), 16px (模态框)

## License

Private - Oliver Personal Use Only
