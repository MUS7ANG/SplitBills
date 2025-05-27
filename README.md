<div align="center">
  <h1 style="color: #1976d2;">🍽️ Split|Pay</h1>
  <p style="font-size: 18px; color: #333;">
    Добро пожаловать в <strong>Split|Pay</strong> — современное веб-приложение для заказа вкусных блюд с уникальной функцией разделения платежей! 
    Созданное с использованием React, TypeScript и Firebase, приложение позволяет просматривать блюда, управлять корзиной и делить счёт между участниками вашей "платёжной семьи". 
    Интеграция с <a href="https://www.themealdb.com/" style="color: #1976d2;">TheMealDB API</a> предоставляет богатый каталог блюд.
  </p>
  <img src="../AuthFirebase/public/inter.png" alt="Скриншот приложения" style="max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
</div>

---

## ✨ Возможности

<div style="padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
  <ul style="font-size: 16px; color: #333;">
    <li><strong>Просмотр и заказ блюд:</strong> Изучайте блюда с описанием и изображениями благодаря TheMealDB API.</li>
    <li><strong>Аутентификация:</strong> Безопасная регистрация и вход через Firebase (email/пароль).</li>
    <li><strong>Совместные платежи:</strong> Делите счёт между членами платёжной семьи при заказе.</li>
    <li><strong>Платёжная семья:</strong> Создавайте семью и добавляйте участников по email.</li>
    <li><strong>Корзина:</strong> Добавляйте, удаляйте и сохраняйте товары с синхронизацией в Firestore.</li>
    <li><strong>Профиль:</strong> Обновляйте email и управляйте аккаунтом.</li>
    <li><strong>Адаптивный дизайн:</strong> Интерфейс на базе Material UI, удобный для мобильных устройств.</li>
    <li><strong>Защищённые маршруты:</strong> Доступ к личным страницам только для авторизованных пользователей.</li>
  </ul>
</div>

---

## 🚀 Начало работы

<div style="margin: 20px 0;">
  <h2 style="color: #1976d2;">Требования</h2>
  <p style="color: #333;">
    <ul>
      <li><strong>Node.js</strong> (версия 16 или выше)</li>
      <li><strong>npm</strong> или <strong>yarn</strong></li>
      <li>Проект в <strong>Firebase</strong> с включёнными Authentication (Email/Password) и Firestore</li>
      <li>Ключ <strong>TheMealDB API</strong> (необязательно, используется бесплатная версия)</li>
    </ul>
  </p>

  <h2 style="color: #1976d2;">Установка</h2>
  <ol style="font-size: 16px; color: #333;">
    <li>
      <strong>Клонируйте репозиторий:</strong>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        <code>
git clone https://github.com/your-username/split-pay.git
cd split-pay
        </code>
      </pre>
    </li>
    <li>
      <strong>Установите зависимости:</strong>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        <code>
npm install
        </code>
      </pre>
    </li>
    <li>
      <strong>Настройте Firebase:</strong>
      <ul>
        <li>Создайте проект в <a href="https://console.firebase.google.com/" style="color: #1976d2;">консоли Firebase</a>.</li>
        <li>Включите <strong>Authentication</strong> (метод Email/Password) и <strong>Firestore</strong>.</li>
        <li>Добавьте конфигурацию в <code>src/firebase.ts</code>:</li>
      </ul>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        <code>
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
        </code>
      </pre>
      <ul>
        <li>Обновите правила Firestore:</li>
      </ul>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        <code>
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /families/{familyId} {
      allow read: if request.auth != null && exists(/databases/$(database)/documents/families/$(familyId)) && request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.members;
      allow write: if request.auth != null;
    }
    match /payments/{paymentId} {
      allow read: if request.auth != null && exists(/databases/$(database)/documents/payments/$(paymentId)) && request.auth.uid in get(/databases/$(database)/documents/families/$(get(/databases/$(database)/documents/payments/$(paymentId)).data.familyId)).data.members;
      allow write: if request.auth != null;
    }
  }
}
        </code>
      </pre>
    </li>
    <li>
      <strong>Запустите приложение:</strong>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        <code>
npm run dev
        </code>
      </pre>
      <p>Откройте <a href="http://localhost:5173" style="color: #1976d2;">http://localhost:5173</a> в браузере.</p>
    </li>
  </ol>
</div>

---

## 📋 Использование

<div style="padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
  <ol style="font-size: 16px; color: #333;">
    <li><strong>Регистрация или вход:</strong> Создайте аккаунт или войдите через email и пароль.</li>
    <li><strong>Просмотр блюд:</strong> Перейдите на <code>/meals</code> для изучения блюд.</li>
    <li><strong>Корзина:</strong> Добавляйте блюда в корзину и просматривайте на <code>/cart</code>.</li>
    <li><strong>Платёжная семья:</strong> На <code>/family</code> создайте семью или добавьте участников по email.</li>
    <li><strong>Оформление заказа:</strong> В корзине увидите счёт и вашу долю, затем создайте платёж.</li>
    <li><strong>Профиль:</strong> Обновите email на <code>/profile</code> или <code>/create-profile</code>.</li>
  </ol>
</div>

<div align="center">
  <img src="../AuthFirebase/public/cart.png" alt="Скриншот корзины" style="max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
</div>

---

## 🛠️ Технологии

<div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
  <div style="width: 45%;">
    <h3 style="color: #1976d2;">Frontend</h3>
    <ul style="font-size: 16px; color: #333;">
      <li><a href="https://reactjs.org/" style="color: #1976d2;">React</a> — интерфейс</li>
      <li><a href="https://www.typescriptlang.org/" style="color: #1976d2;">TypeScript</a> — типизация</li>
      <li><a href="https://vitejs.dev/" style="color: #1976d2;">Vite</a> — сборка</li>
      <li><a href="https://mui.com/" style="color: #1976d2;">Material UI</a> — компоненты</li>
      <li><a href="https://github.com/pmndrs/zustand" style="color: #1976d2;">Zustand</a> — состояние</li>
      <li><a href="https://reactrouter.com/" style="color: #1976d2;">React Router</a> — маршруты</li>
    </ul>
  </div>
  <div style="width: 45%;">
    <h3 style="color: #1976d2;">Backend и инструменты</h3>
    <ul style="font-size: 16px; color: #333;">
      <li><a href="https://firebase.google.com/" style="color: #1976d2;">Firebase</a> — аутентификация, Firestore</li>
      <li><a href="https://www.themealdb.com/" style="color: #1976d2;">TheMealDB API</a> — блюда</li>
      <li><a href="https://eslint.org/" style="color: #1976d2;">ESLint</a> — линтинг</li>
      <li><a href="https://prettier.io/" style="color: #1976d2;">Prettier</a> — форматирование</li>
    </ul>
  </div>
</div>

---

## 📂 Структура проекта

<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
  <pre style="font-size: 16px; color: #333;">
split-pay/
├── public/                  # Статические ресурсы
├── src/
│   ├── api/                 # API-вызовы
│   │   ├── cart/            # Корзина (Firestore)
│   │   ├── meals/           # TheMealDB API
│   │   ├── users/           # Аутентификация, семьи
│   ├── components/          # Компоненты (Header, ProtectedRoute)
│   ├── pages/               # Страницы (Home, Cart, FamilyManagement)
│   ├── store/               # Zustand (useAuthStore, useCartStore)
│   ├── types/               # Интерфейсы TypeScript
│   ├── firebase.ts          # Firebase
│   ├── App.tsx              # Маршруты
│   ├── main.tsx             # Вход
├── .eslintrc.js             # ESLint
├── .prettierrc              # Prettier
├── package.json             # Зависимости
├── tsconfig.json            # TypeScript
├── vite.config.ts           # Vite
├── README.md                # Документация
  </pre>
</div>

---

## 🤝 Внесение вклада

<div style="padding: 20px;">
  <p style="font-size: 16px; color: #333;">
    Приветствуются любые улучшения! Чтобы внести вклад:
  </p>
  <ol style="font-size: 16px; color: #333;">
    <li>Сделайте форк репозитория.</li>
    <li>Создайте ветку (<code>git checkout -b feature/ваша-функция</code>).</li>
    <li>Зафиксируйте изменения (<code>git commit -m "Новая функция"</code>).</li>
    <li>Отправьте ветку (<code>git push origin feature/ваша-функция</code>).</li>
    <li>Откройте Pull Request.</li>
  </ol>
  <p style="color: #333;">Следуйте стилю кода (ESLint, Prettier).</p>
</div>
