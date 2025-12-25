# Question Bank

A community-driven question bank platform where users can upload, share, and practice questions.

## Tech Stack

- **Architecture**: Monorepo (pnpm workspace)
- **Backend**: NestJS + TypeScript + PostgreSQL
- **Frontend**: Vue 3 + TypeScript + Tailwind CSS
- **UI Components**: Headless UI

## Features

- 📝 6 types of questions (Single, Multiple, Judge, Fill, Short, Coding)
- 👥 User authentication and profiles
- 📤 Upload questions (public/private)
- 💬 Comments and discussions
- ❤️ Like questions
- 📊 Practice mode and statistics
- 🏆 User contribution leaderboard

## Project Structure

```
Question-Bank/
├── apps/
│   ├── backend/      # NestJS backend
│   └── frontend/     # Vue 3 frontend
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

## Development

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier

## License

MIT
