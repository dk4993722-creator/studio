# AI Coding Agent Instructions for YUNEX Studio

## Project Overview
YUNEX is a Next.js 15 full-stack application for a digital wallet and multi-level marketing (MLM) platform. It's a Firebase-backed dashboard system with admin and dealer-level access, supporting vehicle stock management, spare parts inventory, payments, and rewards.

**Tech Stack:** Next.js 15, React 18, TypeScript, Firebase (Firestore), Genkit AI, Tailwind CSS, Radix UI, React Hook Form + Zod validation, Recharts

## Architecture & Key Patterns

### Project Structure
- **`src/app/`** — Next.js App Router with nested dashboard layouts
  - **`src/app/page.tsx`** — Auth gateway (login/signup) with role-based routing (admin vs dealer)
  - **`src/app/admin/`** — Admin-only features (user management, branches, inventory)
  - **`src/app/dashboard/`** — Dealer/user dashboard with panels: accounts, sales, purchases, spare parts, wallet, rewards, MLM tree
- **`src/components/ui/`** — Radix UI component library (headless primitives wrapped with Tailwind)
- **`src/lib/`** — Utilities: Firebase config, Tailwind className merger (`cn()`), placeholder images
- **`src/hooks/`** — Custom hooks: `useToast()`, `useMobile()`
- **`src/ai/`** — Genkit AI integration with Google Gemini 2.5 Flash

### Critical Patterns

#### Form Validation & Input
Every form uses **React Hook Form + Zod** for validation:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  identifier: z.string().min(1, "Field required"),
});

const form = useForm({ resolver: zodResolver(schema) });
```
See [src/app/page.tsx](src/app/page.tsx) (login/signup) and [src/app/dashboard/dealer-panel/page.tsx](src/app/dashboard/dealer-panel/page.tsx) for examples.

#### Component Styling
Use **Tailwind CSS** with the custom `cn()` utility (clsx + twMerge) for conditional className merging. All UI components are in `src/components/ui/`. Example from [src/components/ui/button.tsx](src/components/ui/button.tsx):
```tsx
const buttonVariants = cva("base-styles", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "..." }
  }
});
```

#### Firebase Firestore Integration
Firebase is initialized once in [src/lib/firebase.ts](src/lib/firebase.ts). Always import `db` from there. Handle errors gracefully:
```tsx
import { db, firebaseError } from '@/lib/firebase';
import { collection, getDocs, setDoc, addDoc } from 'firebase/firestore';
```
Pages using Firebase are "use client" components.

#### Notifications
Use the `useToast()` hook from `@/hooks/use-toast` for user feedback (stored in [src/hooks/use-toast.ts](src/hooks/use-toast.ts)):
```tsx
const { toast } = useToast();
toast({ title: "Success", description: "Action completed" });
```
The `<Toaster />` component is rendered in [src/app/layout.tsx](src/app/layout.tsx) root layout.

#### Dashboard Navigation Pattern
Dashboards use Card-based feature grids with icon buttons. See [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx) and [src/app/dashboard/dealer-panel/page.tsx](src/app/dashboard/dealer-panel/page.tsx):
```tsx
const features = [
  { title: "...", icon: <Icon />, onClick: () => router.push("/path") }
];
// Map over features in a responsive grid of Cards
```

## Developer Workflows

### Running the App
```bash
npm run dev              # Start Next.js dev server (port 9002 with Turbopack)
npm run build            # Production build
npm start                # Start production server
npm run typecheck        # TypeScript validation (strict mode)
npm run lint             # ESLint (currently ignoring during builds)
```

### Genkit AI Integration
```bash
npm run genkit:dev       # Start Genkit dev server for AI features
npm run genkit:watch     # Watch mode for AI development
```
Genkit is configured in [src/ai/genkit.ts](src/ai/genkit.ts) using Google Gemini 2.5 Flash.

### Environment Setup
Firebase config via `.env.local` (NEXT_PUBLIC_* variables for client-side). See [src/lib/firebase.ts](src/lib/firebase.ts) for required keys: API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID.

## Key Developer Conventions

1. **Path Alias:** Use `@/` prefix for all imports (configured in `tsconfig.json`): `import { Button } from '@/components/ui/button'`
2. **Client Components:** Mark forms and interactive pages with `"use client"` at the top
3. **TypeScript Strict Mode:** Enabled; handle types carefully and avoid `any`
4. **Image Remotes:** Configured for unsplash.com, placehold.co, picsum.photos, and storage.googleapis.com
5. **Tailwind Font Families:** `font-body` (PT Sans) and `font-headline` for typography
6. **Error Handling:** Graceful Firebase errors in [src/lib/firebase.ts](src/lib/firebase.ts); use toast for user-facing errors
7. **Build Strictness:** TypeScript and ESLint errors ignored in builds (see `next.config.ts`), but run `npm run typecheck` locally

## Integration Points & Dependencies

- **Firebase Firestore:** Primary data backend for user accounts, inventory, transactions
- **Genkit AI + Google Gemini:** Available for AI-powered features (see [src/ai/dev.ts](src/ai/dev.ts))
- **Recharts:** Charting library for analytics/dashboards
- **jsPDF + jsPDF-autotable:** PDF generation for reports/bills
- **Radix UI + Tailwind:** Component library (headless + styling)
- **React Hook Form + Zod:** Form validation (always together)

## Common Tasks

- **Add a new page:** Create folder in `src/app/` (App Router convention), add `page.tsx`, mark "use client" if interactive
- **Add a form:** Use Zod schema + React Hook Form with Radix Form component wrappers
- **Create a dashboard panel:** Follow Card grid pattern from admin/dealer dashboards
- **Integrate data:** Query Firestore via `getDocs(query(...))`, cache thoughtfully for Next.js ISR if needed
- **Add notifications:** Import `useToast()` hook and call `toast()`
