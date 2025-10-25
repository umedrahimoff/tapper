# Деплой на Render

## Автоматический деплой

1. **Подключите репозиторий к Render:**
   - Зайдите на [render.com](https://render.com)
   - Нажмите "New" → "Web Service"
   - Подключите GitHub репозиторий
   - Выберите ветку `main`

2. **Настройки сервиса:**
   - **Name**: `tapper`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

3. **Переменные окружения:**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://tapper_3dqp_user:jd7AGFrFh7e5LYhdh8jDgun2ArXmcrLP@dpg-d3uc373e5dus739ilc7g-a:5432/tapper_3dqp
   NEXTAUTH_URL=https://tapper.onrender.com
   NEXTAUTH_SECRET=your-secret-key-here
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password
   ```

4. **База данных:**
   - Создайте PostgreSQL базу данных на Render
   - Скопируйте строку подключения в `DATABASE_URL`

5. **Redis (опционально):**
   - Создайте Redis инстанс на Render
   - Настройте переменные `REDIS_*`

## Ручной деплой

### 1. Подготовка
```bash
# Клонируйте репозиторий
git clone https://github.com/umedrahimoff/tapper.git
cd tapper

# Установите зависимости
npm install
```

### 2. Настройка переменных окружения
```bash
# Создайте .env файл
cp env.example .env

# Отредактируйте .env с вашими данными
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
```

### 3. Миграции базы данных
```bash
# Примените миграции
npx prisma migrate deploy

# Сгенерируйте Prisma Client
npx prisma generate
```

### 4. Создание первого пользователя
```bash
# Создайте админа
npm run create-user admin@yourdomain.com admin123 "Admin User" admin
```

### 5. Запуск
```bash
# Сборка
npm run build

# Запуск
npm start
```

## Проверка деплоя

1. Откройте ваш домен
2. Перейдите на `/auth/signin`
3. Войдите с созданными учетными данными
4. Проверьте создание ссылок и публичных страниц

## Мониторинг

- **Логи**: Render Dashboard → Logs
- **Метрики**: Render Dashboard → Metrics
- **База данных**: Render Dashboard → Database

## Обновление

При пуше в `main` ветку Render автоматически:
1. Скачает новый код
2. Установит зависимости
3. Применит миграции
4. Пересоберет приложение
5. Перезапустит сервис
