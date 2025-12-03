This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Estrutura de Pastas e Arquivos

Abaixo está uma representação em árvore da estrutura principal do projeto TaskFlow:

```
TaskFlow/
├── ARCHITECTURE.md
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.js
├── vercel.json
├── next-env.d.ts
├── eslint.config.mjs
├── public/
│   └── (assets estáticos: imagens, ícones, etc.)
└── src/
	├── app/
	│   ├── globals.css
	│   ├── layout.tsx
	│   ├── page.tsx                # Landing page
	│   ├── dashboard/
	│   │   └── page.tsx
	│   ├── login/
	│   │   └── page.tsx
	│   ├── register/
	│   │   └── page.tsx
	│   ├── tasks/
	│   │   ├── page.tsx
	│   │   └── [id]/
	│   │       └── page.tsx
	│   ├── kanban/
	│   │   └── page.tsx
	│   └── calendar/
	│       ├── page.tsx
	│       └── CalendarView.tsx
	│
	├── components/
	│   ├── accessibility/
	│   │   ├── AccessibilityBar.tsx
	│   │   └── VLibrasWidget.tsx
	│   ├── kanban/
	│   │   └── KanbanBoard.tsx
	│   ├── tasks/
	│   │   ├── TaskForm.tsx
	│   │   └── SubtaskItem.tsx
	│   └── ui/
	│       ├── Button.tsx
	│       └── Input.tsx
	│
	├── hooks/
	│   ├── useAuth.ts
	│   └── useTasks.ts
	│
	├── lib/
	│   ├── firebase.ts
	│   ├── index.ts
	│   └── validation/
	│       ├── authSchema.ts
	│       └── taskSchema.ts
	│
	├── types/
	│   └── index.ts
	│
	└── globals.css
```

Se desejar, posso também:

- gerar um arquivo `TREE.md` contendo esta árvore separadamente;
- estender a árvore listando arquivos de configuração adicionais presentes no repositório.
