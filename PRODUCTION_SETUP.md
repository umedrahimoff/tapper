# 🚀 Настройка продакшена Tapper

## 🔐 Создание администратора на продакшене

### Проблема: Не можете войти как админ
Если не можете войти с `admin@tapper.com` / `admin123`, значит администратор не создан в базе данных.

### Решение 1: Через Render Shell (Рекомендуется)

1. **Зайдите в Render Dashboard**
2. **Перейдите в ваш сервис**
3. **Откройте Shell (консоль)**
4. **Выполните команды:**

```bash
# Установите переменные окружения
export ADMIN_EMAIL="admin@tapper.com"
export ADMIN_PASSWORD="admin123"
export ADMIN_NAME="Admin"
export ADMIN_USERNAME="admin"

# Создайте администратора
npm run create-production-admin
```

### Решение 2: Через локальную машину

1. **Установите переменные окружения:**
```bash
export DATABASE_URL="your-postgresql-connection-string"
export ADMIN_EMAIL="admin@tapper.com"
export ADMIN_PASSWORD="admin123"
export ADMIN_NAME="Admin"
export ADMIN_USERNAME="admin"
```

2. **Запустите скрипт:**
```bash
npm run create-production-admin
```

### Решение 3: Через API (если сервер работает)

1. **Откройте браузер**
2. **Перейдите на:** `https://tapper.onrender.com/api/auth/register`
3. **Отправьте POST запрос с данными:**
```json
{
  "email": "admin@tapper.com",
  "password": "admin123",
  "name": "Admin",
  "username": "admin",
  "role": "admin"
}
```

## 🔧 Проверка пользователей

### Посмотреть всех пользователей:
```bash
npm run list-users
```

### Создать тестового пользователя:
```bash
npm run create-test-user
```

## 🎯 Готовые аккаунты

### Администратор:
```
Email: admin@tapper.com
Password: admin123
Username: admin
Role: admin
```

### Тестовый пользователь:
```
Email: test@tapper.com
Password: test123
Username: testuser
Role: user
```

## 🚨 Важные моменты

1. **База данных должна быть подключена** - проверьте `DATABASE_URL`
2. **Миграции должны быть выполнены** - `npx prisma migrate deploy`
3. **Переменные окружения настроены** - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

## 🔍 Диагностика проблем

### Если не можете войти:

1. **Проверьте логи в Render Dashboard**
2. **Убедитесь, что база данных подключена**
3. **Проверьте, что пользователь создан:**
   ```bash
   npm run list-users
   ```

### Если ошибка "User not found":
- Администратор не создан в базе данных
- Выполните `npm run create-production-admin`

### Если ошибка "Invalid password":
- Пароль не совпадает
- Проверьте, что используете правильный пароль

### Если ошибка "Database connection failed":
- Проверьте `DATABASE_URL` в Render
- Убедитесь, что PostgreSQL сервис работает

## 📞 Поддержка

Если проблемы продолжаются:
1. Проверьте логи в Render Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте подключение к базе данных
4. Убедитесь, что миграции выполнены

## 🎉 После успешного создания

После создания администратора вы сможете:
- ✅ Войти в систему
- ✅ Получить доступ к админ-панели
- ✅ Управлять пользователями
- ✅ Просматривать статистику
