# BD Medical Tests Platform

This project is a web application designed to manage medical tests, hospitals, and related data, with a dedicated admin panel for administrative tasks. It's built using Next.js for a full-stack approach, leveraging React for the frontend, Supabase for the backend (database and authentication), and Tailwind CSS with Shadcn/ui for styling and UI components.

## 1. Project Overview

The platform serves two primary purposes:
- **Public-facing**: Allows users to browse medical tests, hospitals, compare prices, and access information like FAQs and contact details.
- **Admin Panel**: A secure, authenticated section for administrators to manage medical tests, test categories, hospitals, and view analytics.

## 2. Technologies Used

-   **Framework**: Next.js (React Framework for production)
-   **Frontend**: React.js
-   **Backend**: Next.js API Routes (Serverless Functions)
-   **Database & Authentication**: Supabase (PostgreSQL database, Authentication, and Storage)
-   **Styling**: Tailwind CSS
-   **UI Components**: Shadcn/ui (re-usable components built with Radix UI and Tailwind CSS)
-   **Type Checking**: TypeScript (for API routes and utility functions)
-   **Linting**: ESLint

## 3. Folder Structure

The project follows a standard Next.js `app` directory structure:

```
bd-medical-tests/
├───.git/
├───.next/
├───node_modules/
├───public/
├───src/
│   ├───app/
│   │   ├───(root)
│   │   │   ├───favicon.ico
│   │   │   ├───globals.css
│   │   │   ├───layout.jsx          // Main application layout
│   │   │   └───page.jsx            // Public home page
│   │   ├───admin/                  // Admin panel routes
│   │   │   ├───analytics/
│   │   │   │   └───page.jsx        // Admin analytics dashboard
│   │   │   ├───dashboard/
│   │   │   │   └───page.jsx        // Admin dashboard
│   │   │   ├───hospitals/
│   │   │   │   └───page.jsx        // Admin hospital management
│   │   │   ├───login/
│   │   │   │   └───page.jsx        // Admin login page
│   │   │   ├───tests/
│   │   │   │   └───page.jsx        // Admin medical test management
│   │   │   └───layout.jsx          // Admin panel layout (authentication handled here)
│   │   ├───api/                    // Next.js API Routes
│   │   │   ├───admin/              // Admin-specific API routes (protected)
│   │   │   │   ├───analytics/
│   │   │   │   │   └───route.ts    // API for admin analytics
│   │   │   │   ├───hospitals/
│   │   │   │   │   ├───route.ts    // API for hospital CRUD
│   │   │   │   │   └───[id]/
│   │   │   │   │       └───route.ts// API for specific hospital CRUD
│   │   │   │   ├───prices/
│   │   │   │   │   ├───route.ts    // API for price updates
│   │   │   │   │   └───test/
│   │   │   │   │       └───[testId]/
│   │   │   │   │           └───route.ts // API for test prices
│   │   │   │   ├───test-categories/
│   │   │   │   │   ├───route.ts    // API for test category CRUD
│   │   │   │   │   └───[id]/
│   │   │   │   │       └───route.ts // API for specific test category CRUD
│   │   │   │   └───tests/
│   │   │   │       ├───route.ts    // API for test CRUD
│   │   │   │       └───[id]/
│   │   │   │           └───route.ts // API for specific test CRUD
│   │   │   ├───compare/
│   │   │   │   └───route.ts        // API for test comparison
│   │   │   ├───hospitals/
│   │   │   │   ├───route.ts        // Public API for hospitals
│   │   │   │   └───[id]/
│   │   │   │       └───route.ts    // Public API for specific hospital
│   │   │   ├───search/
│   │   │   │   ├───route.ts        // Public API for search
│   │   │   │   └───autocomplete/
│   │   │   │       └───route.ts    // Public API for search autocomplete
│   │   │   └───tests/
│   │   │       ├───route.ts        // Public API for tests
│   │   │       └───[id]/
│   │   │           └───route.ts    // Public API for specific test
│   │   ├───browse-hospitals/
│   │   │   └───page.jsx
│   │   ├───browse-tests/
│   │   │   └───page.jsx
│   │   ├───compare/
│   │   │   └───page.jsx
│   │   ├───contact/
│   │   │   └───page.jsx
│   │   ├───faq/
│   │   │   └───page.jsx
│   │   ├───help/
│   │   │   └───page.jsx
│   │   ├───hospitals/
│   │   │   └───[id]/
│   │   │       └───page.jsx
│   │   ├───privacy/
│   │   │   └───page.jsx
│   │   ├───search-results/
│   │   │   └───page.jsx
│   │   ├───terms/
│   │   │   └───page.jsx
│   │   └───tests/
│   │       └───[id]/
│   │           └───page.jsx
│   ├───components/
│   │   ├───features/               // Larger, feature-specific components
│   │   ├───layout/                 // Layout components (Header, Footer)
│   │   │   ├───Footer.jsx
│   │   │   └───Header.jsx
│   │   └───ui/                     // Shadcn/ui components (buttons, cards, etc.)
│   │       ├───badge.tsx
│   │       ├───breadcrumb.tsx
│   │       ├───button.tsx
│   │       ├───card.tsx
│   │       ├───checkbox.tsx
│   │       ├───collapsible.tsx
│   │       ├───command.tsx
│   │       ├───dialog.tsx
│   │       ├───form.tsx
│   │       ├───input.tsx
│   │       ├───label.tsx
│   │       ├───navigation-menu.tsx
│   │       ├───pagination.tsx
│   │       ├───select.tsx
│   │       ├───sheet.tsx
│   │       ├───skeleton.tsx
│   │       ├───slider.tsx
│   │       ├───sonner.tsx
│   │       ├───switch.tsx
│   │       ├───table.tsx
│   │       ├───textarea.tsx
│   │       ├───toast.tsx
│   │       ├───toaster.tsx
│   │       └───use-toast.ts
│   ├───lib/
│   │   ├───supabase.js             // Client-side Supabase client
│   │   ├───utils.ts                // Utility functions (e.g., cn for Tailwind)
│   │   └───supabase/
│   │       └───server.ts           // Server-side Supabase client for API routes/middleware
│   └───types/
│       ├───api.ts                  // TypeScript types for API data structures
│       └───database.ts             // TypeScript types for Supabase database schema
└───middleware.ts                   // Next.js Middleware for route protection
```

## 4. Authentication Flow

The authentication system is built using Supabase and integrated with Next.js:

-   **Client-Side Supabase (`src/lib/supabase.js`)**: Used in React components for user login/logout and direct client-side data fetching (for public data).
-   **Server-Side Supabase (`src/lib/supabase/server.ts`)**: Used in Next.js API routes and Middleware. This client is crucial for secure server-side operations and for handling authentication cookies. It correctly sets and retrieves cookies to maintain session state across requests.
-   **Next.js Middleware (`middleware.ts`)**:
    -   Protects all routes under `/admin` and `/api/admin`.
    -   Checks for an active Supabase user session.
    -   If no active session is found, it redirects the user to `/admin/login`.
    -   This ensures that all administrative and sensitive API routes are protected at the edge.
-   **Admin Layout (`src/app/admin/layout.jsx`)**:
    -   Acts as a wrapper for all admin pages.
    -   Performs a client-side check for user authentication using `supabase.auth.getUser()`.
    -   If the user is not authenticated, it redirects them to `/admin/login`.
    -   Displays a "Loading admin panel..." message while checking authentication status.
    -   Includes the `Toaster` component for displaying notifications across admin pages.
    -   Crucially, it *does not* redirect if the current path is `/admin/login`, preventing an infinite redirect loop.
-   **Session Persistence**: The combination of `middleware.ts` and `src/lib/supabase/server.ts` ensures that the Supabase session is properly managed and persisted across page refreshes and server-side requests by handling authentication tokens via cookies.

## 5. Data Management

-   **Supabase Database**: The project uses a PostgreSQL database managed by Supabase.
-   **API Routes (`src/app/api/`)**:
    -   Provide a secure layer for interacting with the Supabase database.
    -   Admin API routes (`/api/admin/*`) are protected by the `middleware.ts` to ensure only authenticated administrators can access them.
    -   Public API routes (`/api/*`) are accessible without authentication for general data fetching (e.g., listing hospitals, searching tests).
    -   All API interactions with Supabase are performed server-side using `createServerSupabaseClient` to ensure security and proper session handling.
-   **TypeScript Types (`src/types/`)**: `api.ts` and `database.ts` define the data structures for API responses and database tables, ensuring type safety throughout the application.

## 6. UI/UX

-   **Tailwind CSS**: Used for rapid and consistent styling across the application.
-   **Shadcn/ui**: Provides a collection of accessible and customizable UI components (e.g., Card, Button, Input, Dialog, Toast, Select, Switch) that integrate seamlessly with Tailwind CSS. The `useToast` hook and `Toaster` component are part of this library, providing a consistent notification system.

## 7. Key Features

-   **Medical Test Management**: CRUD operations for medical tests (name, description, purpose, preparation, fasting requirements, normal range, turnaround time, sample type, aliases, keywords, symptoms, age/gender restrictions).
-   **Test Category Management**: CRUD operations for organizing medical tests into categories.
-   **Hospital Management**: CRUD operations for hospital details (name, address, contact, description, established year, beds, verification status, features, services, facilities, insurance, departments, images).
-   **Bulk Price Update**: A dedicated section in the admin panel to update prices for a specific test across multiple hospitals efficiently.
-   **Analytics Dashboard**: Displays popular search queries (extensible for other analytics).
-   **Search Functionality**: Public-facing search and autocomplete for tests and hospitals.
-   **Comparison Feature**: Allows users to compare different medical tests or hospitals.

## 8. Setup Instructions

To set up and run this project locally:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/bd-medical-tests.git
    cd bd-medical-tests
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Supabase**:
    -   Create a new project on [Supabase](https://supabase.com/).
    -   Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings (API section).
    -   Set up your database schema (tables like `medical_tests`, `test_categories`, `hospitals`, `popular_searches`, `prices`, etc.) according to your application's needs.
    -   Configure Row Level Security (RLS) policies for your tables to control access.
4.  **Environment Variables**:
    -   Create a `.env.local` file in the project root.
    -   Add your Supabase environment variables:
        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
5.  **Run the development server**:
    ```bash
    npm run dev
    ```
6.  **Access the application**:
    -   Open `http://localhost:3000` in your browser for the public-facing site.
    -   Access the admin panel at `http://localhost:3000/admin/dashboard`. You will be redirected to `http://localhost:3000/admin/login` if not authenticated.

## 9. Future Enhancements

-   Implement a more sophisticated user management system within the admin panel.
-   Add more detailed analytics and reporting features.
-   Integrate payment gateways for test bookings.
-   Implement image upload functionality for hospitals and tests using Supabase Storage.
-   Improve search relevance and filtering options.
-   Add a public user registration and profile management system.
-   Implement server-side rendering (SSR) or Static Site Generation (SSG) for public pages where beneficial for SEO and performance.
