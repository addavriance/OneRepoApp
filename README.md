# Project 15 - Full Stack Application

Проект с разделением на frontend (React + Tailwind + shadcn/ui) и backend (Express + MongoDB).

## Структура проекта

```
project_15/
├── src/
│   ├── client/          # Frontend (React + Tailwind + shadcn/ui)
│   │   ├── api/         # API клиент
│   │   ├── components/  # React компоненты
│   │   │   └── ui/      # shadcn/ui компоненты
│   │   ├── hooks/       # React hooks
│   │   ├── lib/         # Утилиты
│   │   ├── pages/       # Страницы приложения
│   │   ├── App.tsx      # Главный компонент
│   │   ├── main.tsx     # Точка входа
│   │   └── index.css    # Глобальные стили
│   ├── server/          # Backend (Express + MongoDB)
│   │   ├── middleware/  # Express middleware
│   │   ├── services/    # Бизнес-логика
│   │   ├── types/       # Типы TypeScript
│   │   ├── db.ts        # Конфигурация БД
│   │   └── server.ts    # Главный файл сервера
│   └── shared/          # Общие файлы для client и server
│       ├── flags.ts     # Битовые флаги
│       └── interfaces.ts # Общие интерфейсы
├── package.json
├── tsconfig.json        # Конфигурация TypeScript для client
├── tsconfig.server.json # Конфигурация TypeScript для server
├── tsconfig.node.json   # Конфигурация TypeScript для Vite
├── vite.config.ts       # Конфигурация Vite
├── tailwind.config.js   # Конфигурация Tailwind CSS
├── postcss.config.js    # Конфигурация PostCSS
├── components.json      # Конфигурация shadcn/ui
└── index.html           # HTML шаблон
```

## Установка

1. Установите зависимости:
```bash
npm install
```

## Запуск

### Режим разработки (одновременный запуск frontend и backend):
```bash
npm run dev
```

Это запустит:
- Frontend на http://localhost:5173
- Backend на http://localhost:3000

### Раздельный запуск:

Запустить только backend:
```bash
npm run dev:server
```

Запустить только frontend:
```bash
npm run dev:client
```

## Сборка для продакшена

Собрать client:
```bash
npm run build:client
```

Собрать server:
```bash
npm run build:server
```

## Технологии

### Frontend:
- **React 19** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **Tailwind CSS** - CSS фреймворк
- **shadcn/ui** - Компоненты UI
- **React Router** - Роутинг
- **Axios** - HTTP клиент
- **Lucide React** - Иконки

### Backend:
- **Express 5** - Web фреймворк
- **MongoDB** - База данных
- **Mongoose** - ODM для MongoDB
- **JWT** - Аутентификация
- **Zod** - Валидация данных
- **bcryptjs** - Хеширование паролей

## Особенности

- Полная типизация с TypeScript
- Разделение кода на client, server и shared
- Современный UI с Tailwind CSS и shadcn/ui
- Валидация форм на клиенте и сервере
- Аутентификация с JWT
- Toast уведомления
- Responsive дизайн

## API Endpoints

### Auth:
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация

### User:
- `GET /api/user/get` - Получить данные пользователя
- `POST /api/user/save` - Сохранить данные пользователя

### Posts:
- `GET /api/post/list` - Получить список постов
- `POST /api/post/create` - Создать пост
- `GET /api/post/:id` - Получить пост
- `DELETE /api/post/:id` - Удалить пост

## Страницы

- `/login` - Страница входа
- `/register` - Страница регистрации
- `/posts` - Список постов
- `/posts/create` - Создание поста
- `/posts/:id` - Просмотр поста

## Требования

- Node.js 18+
- MongoDB (запущенный локально на порту 27017)
