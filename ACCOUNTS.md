# 🔐 Аккаунты для входа в Tapper

## 📋 Готовые тестовые аккаунты

### 👑 Администратор
```
Email: admin@tapper.com
Password: admin123
Username: admin
Role: admin
```

### 👤 Обычный пользователь
```
Email: test@tapper.com
Password: test123
Username: testuser
Role: user
```

## 🚀 Как создать аккаунты

### 1. Создать администратора:
```bash
npm run create-admin
```

### 2. Создать тестового пользователя:
```bash
npm run create-test-user
```

### 3. Посмотреть всех пользователей:
```bash
npm run list-users
```

## 🔧 Настройка переменных окружения

### Для продакшена (Render):
```bash
NEXTAUTH_URL=https://tapper.onrender.com
NEXTAUTH_SECRET=2908d74a104473dec6e778531de3bed2cff9cc20d4183bc2ddb613235a168ac3
DATABASE_URL=your-postgresql-connection-string
```

### Для разработки:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=file:./dev.db
```

## 🎯 Функции аккаунтов

### Администратор (admin@tapper.com):
- ✅ Доступ к админ-панели
- ✅ Управление пользователями
- ✅ Просмотр статистики
- ✅ Создание/удаление пользователей

### Обычный пользователь (test@tapper.com):
- ✅ Личный кабинет
- ✅ Управление профилем
- ✅ Добавление ссылок
- ✅ Настройка темы

## 🚨 Важно!

1. **Измените пароли** в продакшене
2. **Настройте переменные окружения** в Render
3. **Создайте базу данных** PostgreSQL
4. **Запустите миграции** Prisma

## 🚀 Создание администратора на продакшене

### Если не можете войти как админ:

1. **Зайдите в Render Shell**
2. **Выполните команды:**
```bash
npm run check-production
npm run create-production-admin
```

### Или через локальную машину:
```bash
export DATABASE_URL="your-postgresql-connection-string"
npm run create-production-admin
```

## 📞 Поддержка

Если возникли проблемы с входом:
1. **Проверьте, что администратор создан:** `npm run check-production`
2. **Создайте администратора:** `npm run create-production-admin`
3. **Проверьте переменные окружения** в Render
4. **Убедитесь, что база данных подключена**
5. **Проверьте логи в Render Dashboard**
