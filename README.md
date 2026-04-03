# Personal Kanban Board

A modern, full-stack task management application showcasing production-ready React patterns, optimistic UI updates, and thoughtful component architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue) 
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

Personal Kanban Board is a full-stack application that demonstrates modern web development practices. It showcases how to build smooth, snappy user experiences with drag-and-drop interactions, real-time state management, and carefully optimized API communication patterns. The project prioritizes responsive design, dark mode support, and accessibility while maintaining clean, maintainable code.

## ✨ Features

- **🎯 Drag-and-drop task management** - Seamless task movement across columns with real-time position updates
- **🌓 Dark mode support** - Automatic theme switching with Tailwind CSS
- **📋 Multiple boards** - Create and manage multiple independent kanban boards
- **🎨 Task prioritization** - Low, Medium, High priority indicators with visual feedback
- **📅 Due date tracking** - Set and view task deadlines with built-in date picker
- **🔐 Authentication** - Secure JWT-based auth with user ownership model
- **⚡ Optimistic UI updates** - Instant visual feedback during drag operations, non-blocking API calls
- **📱 Responsive design** - Works seamlessly on desktop and tablet displays

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and API routes
- **React 19** - Latest React with hooks and modern patterns
- **TypeScript** - Type-safe component development
- **Tailwind CSS 4** - Utility-first styling with dark mode support
- **shadcn/ui** - Composable Radix UI components (Select, Popover, Calendar, Dialog, etc.)

### Drag & Drop
- **@dnd-kit** - Modern, framework-agnostic drag-drop library with spatial detection

### Backend
- **MongoDB** - Document database with Mongoose ODM
- **JWT Authentication** - Secure token-based auth with localStorage
- **API Route handlers** - RESTful endpoints with ownership validation

### Key Patterns
- **Optimistic UI updates** - UI changes immediately, API calls happen asynchronously
- **Custom hooks** - `useBoard()` hook for centralized state management
- **Component composition** - Organized by domain (kanban/, ui/, common/)
- **DnD Context** - @dnd-kit Context Provider for drag state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/personal-kanban-board.git
cd personal-kanban-board

# Install dependencies
npm install

# Set up environment
cat > .env.local << EOF
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EOF

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Architecture

### Component Hierarchy
```
BoardsContent (Main page)
├── ManageBoardsDialog (Board selector/creator)
├── BoardGrid (DnD Context provider)
│   ├── Column (Droppable container)
│   │   └── TaskCard[] (Sortable cards)
│   └── DragOverlay (Drag preview)
└── TaskDialog (Task create/edit form)
```

### State Management
- **useBoard()** - Custom hook managing boards, columns, tasks, and mutations
- **Local React state** - Selected board, dialog visibility, form state
- **DnD Kit Context** - Drag state and sensor configuration

### API Flow
1. **Optimistic updates** - UI updates immediately on drag end
2. **Non-blocking** - `moveTask()` called without `await` to prevent blocking
3. **Background sync** - API call processes in background
4. **Consistency** - Server-side position calculations ensure data integrity

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/              # JWT authentication endpoints
│   │   ├── boards/            # Board CRUD endpoints
│   │   ├── columns/           # Column management
│   │   ├── tasks/             # Task CRUD and move operations
│   │   └── board-templates/   # Preset board structures
│   ├── layout.tsx             # Root layout with auth provider
│   ├── page.tsx               # Home/redirect page
│   └── providers.tsx          # Client-side providers
│
├── components/
│   ├── kanban/                # Kanban-specific components
│   │   ├── BoardGrid.tsx      # DnD container with columns
│   │   ├── Column.tsx         # Droppable column with tasks
│   │   ├── TaskCard.tsx       # Draggable task card
│   │   ├── TaskDialog.tsx     # Task create/edit form
│   │   ├── ManageBoardsDialog.tsx # Board management
│   │   └── useBoard.ts        # Custom hook for data
│   ├── ui/                    # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── date-picker.tsx
│   │   └── ... (other UI components)
│   └── common/                # Shared components
│       ├── auth-form-card.tsx
│       ├── protected-route.tsx
│       └── ... (other shared)
│
├── lib/
│   ├── models/                # Mongoose schemas
│   │   ├── user.ts
│   │   ├── board.ts
│   │   ├── column.ts
│   │   └── task.ts
│   ├── auth.ts                # JWT utilities
│   ├── db.ts                  # MongoDB connection
│   ├── middleware.ts          # Auth middleware
│   └── utils.ts               # Helper functions
│
└── public/                    # Static assets
```

## 🎯 Key Development Decisions

### 1. Optimistic UI Updates
Instead of awaiting API responses, the UI updates immediately on drag end, making interactions feel instant. The API call happens in the background non-blocking, improving perceived performance.

### 2. @dnd-kit Selection
Chose @dnd-kit over react-beautiful-dnd for its framework-agnostic design, better TypeScript support, and modern sensor-based architecture that handles edge cases elegantly.

### 3. shadcn/ui Components
Built on Radix UI primitives for accessibility and composability. Provides consistent styling across light/dark modes without hardcoded colors.

### 4. Custom useBoard Hook
Centralized data fetching and mutations in a custom hook rather than scattered useState calls, making state logic testable and reusable.

### 5. Column Position Tracking
Tasks store position within their column rather than global board position, allowing efficient batch operations when moving between columns.

## 📊 Notable Implementation Details

- **Drag overlay** uses shadcn Card for automatic dark mode theming
- **Empty states** provide visual feedback when columns have no tasks
- **Fixed column headers** (40px) while task areas scale with content
- **No internal scrolling** - board-level scrolling handles overflow
- **Equal column heights** via flexbox layout
- **Field validation** on both client and server for data integrity

## 🔐 Authentication & Authorization

- JWT tokens stored in localStorage
- Server validates token on all protected endpoints
- Board ownership model - only creators can modify boards
- User context provided to all components

## 📝 License

MIT © 2026

