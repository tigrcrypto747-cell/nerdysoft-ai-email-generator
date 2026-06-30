# MailCraft AI — AI Email Generator MVP

Повноцінний SaaS MVP для генерації email-листів за допомогою AI. Користувач вводить тему, обирає тон і довжину — і отримує готовий лист для копіювання. Проєкт виконаний як тестове завдання.

---

## Як запустити локально

### 1. Клонування та встановлення залежностей

```bash
git clone <repo-url>
cd nerdysoft-ai-email-generator
npm install
```

### 2. Налаштування змінних середовища

```bash
cp .env.local.example .env.local
```

Відкрий `.env.local` і встав значення зі свого Supabase-проєкту (Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
```

> **Важливо:** використовуй **Publishable key** (не Secret key).

### 3. Запуск dev-сервера

```bash
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000).

### 4. Продакшн-збірка

```bash
npm run build
npm start
```

### Supabase: мінімальне налаштування

1. Створи новий проєкт на [supabase.com](https://supabase.com)
2. Authentication → Providers → Email — увімкнено за замовчуванням
3. (Опціонально) Authentication → Settings → виключи підтвердження email для локальної розробки

---

## Технології

| Шар | Технологія |
|---|---|
| Фреймворк | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Мова | TypeScript (strict mode) |
| Стилі | [Tailwind CSS v4](https://tailwindcss.com) |
| UI-компоненти | [shadcn/ui](https://ui.shadcn.com) (на базі [@base-ui/react](https://base-ui.com)) |
| Автентифікація | [Supabase Auth](https://supabase.com/auth) |
| Supabase клієнт | `@supabase/supabase-js`, `@supabase/ssr` |
| Іконки | [lucide-react](https://lucide.dev) |

---

## Структура проєкту

```
.
├── app/
│   ├── page.tsx              # Лендінг (Hero, How it works, Features, FAQ, CTA)
│   ├── layout.tsx            # Кореневий layout: Navbar + Footer, Supabase user
│   ├── error.tsx             # Глобальний error boundary
│   ├── not-found.tsx         # Кастомна 404-сторінка
│   ├── login/page.tsx        # Форма входу (Supabase signInWithPassword)
│   ├── signup/page.tsx       # Форма реєстрації (Supabase signUp)
│   ├── dashboard/page.tsx    # Захищений дашборд — email-генератор
│   ├── pricing/page.tsx      # Сторінка тарифів з upgrade-діалогом
│   ├── profile/page.tsx      # Профіль користувача + logout
│   └── api/
│       └── generate-email/
│           └── route.ts      # POST /api/generate-email (auth-guarded)
│
├── components/
│   ├── navbar.tsx            # Адаптивна навігація (desktop + mobile menu)
│   ├── footer.tsx            # Футер сайту
│   ├── email-generator.tsx   # UI email-генератора (клієнтський компонент)
│   ├── profile-client.tsx    # Клієнтська частина сторінки профілю
│   └── ui/                   # shadcn/ui компоненти
│       ├── button.tsx        # Кастомізований Button з підтримкою asChild
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── accordion.tsx
│       ├── dialog.tsx
│       ├── textarea.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       └── separator.tsx
│
├── lib/
│   ├── email-generator.ts    # EmailGeneratorService інтерфейс + mock-реалізація
│   └── supabase/
│       ├── client.ts         # Browser-клієнт Supabase
│       ├── server.ts         # Server-клієнт Supabase (Server Components / Route Handlers)
│       └── middleware.ts     # Хелпер оновлення сесії для proxy.ts
│
├── proxy.ts                  # Route protection middleware (Next.js 16)
├── .env.local.example        # Шаблон змінних середовища
└── README.md
```

---

## Архітектурні рішення

### Mock-режим для AI-генерації

AI-генерація реалізована через **mock-реалізацію** без реального API-виклику. Причина: MVP повинен демонструвати повний UX-флоу (форма → завантаження → результат → копіювання) без залежності від зовнішнього API і витрат на токени під час розробки та демо.

Mock повертає правдоподібний текст листа з варіаціями залежно від тону (`formal` / `friendly` / `persuasive` / `casual`) і довжини (`short` / `medium` / `long`), симулюючи реалістичну затримку (~800–1200мс).

### EmailGeneratorService — інтерфейс для заміни AI-провайдера

Вся логіка ізольована за інтерфейсом у `lib/email-generator.ts`:

```typescript
export interface EmailGeneratorService {
  generate(params: EmailGenerationParams): Promise<GeneratedEmail>;
}
```

Щоб підключити реальний Claude або OpenAI API, достатньо:

1. Реалізувати інтерфейс у новому класі:

```typescript
// lib/email-generator.ts
class ClaudeEmailGeneratorService implements EmailGeneratorService {
  async generate({ topic, tone, length }: EmailGenerationParams): Promise<GeneratedEmail> {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-8",
      messages: [{ role: "user", content: buildPrompt(topic, tone, length) }],
    });
    return parseResponse(response);
  }
}
```

2. Змінити один рядок в кінці файлу:

```typescript
export const emailGeneratorService: EmailGeneratorService = new ClaudeEmailGeneratorService();
```

**Більше жодного коду змінювати не потрібно** — API-роут і весь UI використовують інтерфейс, не реалізацію.

### Supabase для авторизації

Supabase обрано як BaaS з вбудованим Auth тому що:
- Готова реалізація email+password, OAuth, magic link з мінімальним boilerplate
- `@supabase/ssr` надає окремих клієнтів для Server Components і клієнтського коду з правильною обробкою cookies
- Не потрібно розгортати власну базу даних для MVP

### Route protection через proxy.ts

Next.js 16 використовує `proxy.ts` (замість застарілого `middleware.ts`) для захисту маршрутів на рівні Edge перед рендерингом:

- `/dashboard`, `/profile` → редірект на `/login` якщо користувач не авторизований
- `/login`, `/signup` → редірект на `/dashboard` якщо вже авторизований
- Хелпер `lib/supabase/middleware.ts` оновлює JWT-сесію в cookies при кожному запиті, запобігаючи її протіканню

### Button asChild та base-ui

shadcn/ui v4 базується на `@base-ui/react` (не Radix UI). Button-компонент розширений підтримкою `asChild`, що дозволяє рендерити `<Link>` з button-стилями. При цьому встановлюється `nativeButton={false}`, щоб пригнітити попередження base-ui про рендер не-`<button>` елемента.
