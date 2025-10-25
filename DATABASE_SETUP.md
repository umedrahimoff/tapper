# Настройка базы данных

## Переменные окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Шаги для подключения

1. **Скопируйте файл примера**:
   ```bash
   cp env.example .env.local
   ```

2. **Настройте переменные окружения** в `.env.local`

3. **Запустите миграции**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Сгенерируйте Prisma Client**:
   ```bash
   npx prisma generate
   ```

## Для продакшена

В Vercel добавьте переменные окружения:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `NEXTAUTH_URL` - URL вашего приложения
- `NEXTAUTH_SECRET` - секретный ключ для NextAuth
