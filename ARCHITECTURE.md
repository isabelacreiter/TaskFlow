# 🏗️ Visão Geral da Arquitetura - TaskFlow

## 📋 Resumo Executivo

TaskFlow é uma aplicação full-stack de gerenciamento de tarefas construída com **Next.js 16**, **TypeScript**, **Firebase** e **Tailwind CSS**. A arquitetura segue o padrão de **Client Components** para interatividade e **Server Components** para otimização, com uma camada de abstração via **hooks React** que centraliza a lógica de negócio.

---

## 🏛️ Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA APRESENTAÇÃO                     │
│  (React Components - Client & Server Side)                  │
├─────────────────────────────────────────────────────────────┤
│  Pages: /dashboard, /tasks, /kanban, /calendar, /login      │
│  Components: TaskForm, KanbanBoard, AccessibilityBar        │
└────────────────┬────────────────────────────────────────────┘
                 │
┌─────────────────┴────────────────────────────────────────────┐
│                   CAMADA DE LÓGICA                            │
│  (Custom Hooks & Business Logic)                             │
├──────────────────────────────────────────────────────────────┤
│  useAuth()  → Autenticação e gerenciamento de sessão        │
│  useTasks() → CRUD de tarefas e sync com Firestore          │
└────────────────┬─────────────────────────────────────────────┘
                 │
┌─────────────────┴────────────────────────────────────────────┐
│                 CAMADA DE INTEGRAÇÃO                          │
│  (Firebase Client SDK)                                       │
├──────────────────────────────────────────────────────────────┤
│  firebase.ts → Inicialização e exports de serviços          │
│  getFirebaseAuth()   → Auth instance                        │
│  getFirebaseFirestore() → Firestore instance                │
└────────────────┬─────────────────────────────────────────────┘
                 │
┌─────────────────┴────────────────────────────────────────────┐
│                  CAMADA DE DADOS                              │
│  (Firebase Backend - Hosted na Google Cloud)                 │
├──────────────────────────────────────────────────────────────┤
│  ☁️ Firebase Authentication (Email/Password)                 │
│  ☁️ Firestore Database (NoSQL)                               │
│     └─ Collection: tasks                                     │
│     └─ Subcollections: comments                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 Conexão das Tecnologias

### 1️⃣ **Next.js 16 (App Router)**
- **Função**: Framework web com rendering server-side e client-side
- **Integração**:
  - `src/app/` → Estrutura de páginas (routing automático)
  - `src/app/layout.tsx` → Root layout com AccessibilityBar (Client Component)
  - App Router com `'use client'` directives para componentes interativos
- **Benefício**: SSR automático, otimização de performance, Turbopack para builds rápidos

### 2️⃣ **TypeScript**
- **Função**: Type safety em toda a aplicação
- **Arquivos principais**:
  - `src/types/index.ts` → Interfaces: `Task`, `Subtask`, `Priority`, `TaskStatus`
  - `tsconfig.json` → Configuração com path aliases (`@/*`)
- **Integração**: 
  - Todos os componentes tipados
  - Hooks com tipos de entrada/saída
  - Firestore operations tipadas
- **Benefício**: Previne erros em tempo de desenvolvimento, melhor DX

### 3️⃣ **Firebase (Backend-as-a-Service)**
```
┌─────────────────────────────────────────┐
│    FIREBASE AUTHENTICATION               │
├─────────────────────────────────────────┤
│  • Email/Password Sign-Up & Sign-In     │
│  • Session persistence com onAuthState  │
│  • useAuth() hook lê estado de auth      │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│    FIRESTORE DATABASE (NoSQL)            │
├─────────────────────────────────────────┤
│  Collection: tasks                      │
│  ├─ Documents: {id, title, desc...}    │
│  ├─ userId: para isolamento de dados   │
│  └─ Subcollections: comments           │
│                                         │
│  Real-time sync via onSnapshot()       │
│  CRUD operations: add, update, delete   │
└─────────────────────────────────────────┘
```

### 4️⃣ **React Hooks Customizados**

#### **useAuth()**
```
┌────────────────────────────────────┐
│  onAuthStateChanged (Firebase)     │
├────────────────────────────────────┤
│         ↓                          │
│  [user, loading] state             │
├────────────────────────────────────┤
│  Usado em:                         │
│  • Login/Register pages            │
│  • Dashboard (proteção de rota)    │
│  • Tasks (verificação de auth)     │
└────────────────────────────────────┘
```

#### **useTasks()**
```
┌──────────────────────────────────────┐
│  Query Firestore:                   │
│  where('userId', '==', uid)        │
├──────────────────────────────────────┤
│         ↓                           │
│  Real-time listener (onSnapshot)    │
├──────────────────────────────────────┤
│         ↓                           │
│  [tasks, loading] state             │
├──────────────────────────────────────┤
│  Métodos:                           │
│  • createTask() → addDoc()          │
│  • updateTask() → updateDoc()       │
│  • deleteTask() → deleteDoc()       │
├──────────────────────────────────────┤
│  Notificações via Sonner (toast)    │
└──────────────────────────────────────┘
```

### 5️⃣ **Tailwind CSS (Styling)**
- **Função**: Utility-first CSS framework
- **Integração**:
  - `globals.css` → Root theme, accessibility utilities
  - Dark mode via `@media prefers-color-scheme`
  - Classes em componentes: `bg-zinc-50 dark:bg-black`
- **Benefício**: Desenvolvimento rápido, tema consistente, dark mode nativo

### 6️⃣ **UI Libraries Especializadas**

#### **Tremor** (Charts)
- Dashboard charts: AreaChart (7-dia trend), BarChart (prioridades)
- Exibição visual de dados

#### **DndKit** (Drag & Drop)
```
DndContext (Kanban page)
├─ SortableContext
├─ Task cards (DndContext listeners)
└─ updateTask() ao soltar
```

#### **FullCalendar** (Calendar)
- Integração de eventos com datas de tarefas
- Modal de detalhes ao clicar em evento

#### **Lucide React** (Icons)
- Icons em toda UI: ArrowLeft, Plus, Trash2, Edit, etc.

#### **React Hook Form + Zod** (Form Validation)
```
TaskForm Component
├─ React Hook Form (state management)
├─ Zod resolver (schema validation)
└─ TypeScript types (Task interface)
```

#### **Sonner** (Toast Notifications)
- Feedback ao criar/editar/deletar tarefas
- `toast.success()`, `toast.error()`

### 7️⃣ **Acessibilidade**
```
AccessibilityBar (Client Component)
├─ VLibras widget (Libras interpretation)
├─ Font size controls (A+/A-)
├─ Contrast toggle
├─ Dark mode toggle
├─ Keyboard navigation
└─ Motion preferences respect

globals.css
├─ focus-visible (3px outline)
├─ min-height buttons (touch)
├─ line-height 1.6 (readability)
└─ @media prefers-reduced-motion
```

---

## 📁 Estrutura de Pastas

```
TaskFlow/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout com AccessibilityBar
│   │   ├── page.tsx              # Landing page pública
│   │   ├── dashboard/            # Dashboard protegido
│   │   ├── login/                # Autenticação
│   │   ├── register/
│   │   ├── tasks/                # CRUD tarefas
│   │   ├── tasks/[id]/           # Detalhe tarefa + comentários
│   │   ├── kanban/               # Drag-drop board
│   │   └── calendar/             # FullCalendar integrado
│   │
│   ├── components/               # Reusable components
│   │   ├── tasks/
│   │   │   ├── TaskForm.tsx
│   │   │   └── SubtaskItem.tsx
│   │   ├── kanban/
│   │   │   └── KanbanBoard.tsx
│   │   ├── accessibility/
│   │   │   ├── AccessibilityBar.tsx
│   │   │   └── VLibrasWidget.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Autenticação
│   │   └── useTasks.ts           # CRUD tarefas
│   │
│   ├── lib/                      # Utilities e config
│   │   ├── firebase.ts           # Firebase initialization
│   │   ├── index.ts
│   │   └── validation/           # Zod schemas
│   │       ├── authSchema.ts
│   │       └── taskSchema.ts
│   │
│   ├── types/                    # TypeScript interfaces
│   │   └── index.ts
│   │
│   └── app/
│       └── globals.css           # Global styles
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── next.config.ts                # Next.js config
└── .env.local                    # Firebase credentials (gitignored)
```

---

## 🔄 Fluxo de Dados

### **Exemplo: Criar uma Tarefa**

```
1. Usuário preenche TaskForm (Client Component)
   ↓
2. React Hook Form valida com Zod schema
   ↓
3. onSubmit chama createTask() do useTasks hook
   ↓
4. createTask() executa:
   - getFirebaseAuth() → uid do usuário
   - addDoc(collection(db, 'tasks'), {...})
   - Firestore salva documento
   ↓
5. onSnapshot listener detecta nova tarefa
   ↓
6. useTasks atualiza state [tasks]
   ↓
7. Componente re-renderiza com nova tarefa
   ↓
8. Sonner toast notifica "Tarefa criada!"
```

### **Exemplo: Atualizar Status (Kanban)**

```
1. Usuário arrasta card (DndKit listeners)
   ↓
2. DragEndEvent dispara handleDragEnd()
   ↓
3. updateTask(id, {status: newStatus})
   ↓
4. updateDoc(doc(db, 'tasks', id), {...})
   ↓
5. Firestore atualiza documento
   ↓
6. onSnapshot notifica mudança
   ↓
7. useTasks re-renderiza [tasks]
   ↓
8. Kanban columns atualizam em tempo real
```

---

## 🛡️ Segurança & Isolamento de Dados

### **Regras Firestore (Recomendado)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuário autenticado pode acessar suas tarefas
    match /tasks/{taskId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
      
      // Comentários como subcollection
      match /comments/{commentId} {
        allow read, write: if request.auth.uid == resource.data.userId;
      }
    }
  }
}
```

### **Frontend**
- `useAuth()` verifica autenticação antes de operações
- useTasks() filtra por `userId` na query
- Rotas protegidas redireccionam para `/login`

---

## 🚀 Stack Resumido

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| **Frontend** | Next.js 16 App Router | Rendering & routing |
| **Linguagem** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Design system |
| **Estado** | React Hooks + Firebase | State management |
| **Auth** | Firebase Authentication | User sessions |
| **Database** | Firestore | Real-time NoSQL |
| **Interatividade** | React Hook Form, DndKit, FullCalendar | Features específicas |
| **Notificações** | Sonner | User feedback |
| **Icons** | Lucide React | UI elements |
| **Acessibilidade** | VLibras + Custom controls | WCAG compliance |

---

## 📊 Fluxo de Requisição

```
Cliente (Browser)
    │
    ├─ Renderiza Next.js page
    │  
    ├─ useAuth() hook
    │  └─ Firebase Auth API
    │
    ├─ useTasks() hook
    │  └─ Firestore Query (real-time)
    │
    ├─ Componentes renderizam com dados
    │  ├─ TaskForm valida com Zod
    │  ├─ DndKit listeners capturam drag
    │  └─ FullCalendar renderiza eventos
    │
    └─ Eventos disparam mutations
       ├─ createTask() → Firebase
       ├─ updateTask() → Firebase
       └─ deleteTask() → Firebase
            │
            Firebase Cloud
            ├─ Authentication verifica uid
            ├─ Firestore persiste dados
            └─ onSnapshot notifica cliente
                 │
                 Volta ao estado [tasks]
```

---

## ✨ Padrões & Best Practices

✅ **Separation of Concerns**: Components, hooks, types, config separados  
✅ **Type Safety**: TypeScript em 100% do código  
✅ **Real-time Sync**: Firestore listeners mantêm UI atualizada  
✅ **Error Handling**: Try-catch e toast notifications  
✅ **Performance**: Client/Server components otimizados  
✅ **Accessibility**: VLibras + WCAG compliant  
✅ **Dark Mode**: Suportado nativamente com Tailwind  
✅ **Security**: Isolamento de dados por userId  

---

## 🎯 Próximos Passos para Melhorias

- [ ] Implementar Firestore Security Rules
- [ ] Add unit tests com Jest/Vitest
- [ ] E2E tests com Playwright/Cypress
- [ ] API routes para operações serverless
- [ ] Image optimization com next/image
- [ ] PWA offline support
- [ ] Pagination para grandes datasets
- [ ] Advanced search & filtering
- [ ] Export tasks (PDF, CSV)
- [ ] Team collaboration features

---

## 📚 Referências

- [Next.js 16 Documentation](https://nextjs.org)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Hooks API](https://react.dev/reference/react/hooks)
- [DndKit Documentation](https://docs.dndkit.com)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

---

**Última atualização**: Dezembro 2025  
**Versão**: 1.0  
**Status**: ✅ Production Ready
