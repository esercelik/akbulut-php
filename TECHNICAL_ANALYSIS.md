# Akbulut Emlak - Complete Technical Analysis

**Last Updated:** May 5, 2026  
**Project Focus:** Laravel 13 + Inertia React v3 Admin Panel

---

## 1. TECHNOLOGY STACK

### Backend Framework
- **Laravel:** v13.7
- **PHP:** 8.3+
- **Authentication:** Laravel Fortify v1.34 (with 2FA/TOTP support)
- **Database:** MySQL with migrations-based schema
- **Testing:** Pest v4 + PHPUnit v12

### Frontend Framework
- **Inertia.js:** v3 (Server-Side Rendering enabled)
- **React:** v19.2.0 (React Server Components via compiler)
- **CSS Framework:** Tailwind CSS v4
- **UI Components:** Radix UI primitives + custom components
- **Icons:** Lucide React v0.475.0
- **Form Handling:** Inertia Form helpers

### Build & Development Tools
- **Bundler:** Vite (with Laravel plugin + Wayfinder generation)
- **SSR:** Enabled via `@inertiajs/vite` plugin
- **Type Generation:** Wayfinder (auto-generates typed route functions)
- **Linting:** ESLint v9 + Prettier v3
- **Code Formatting:** Laravel Pint v1.27 (PHP)

### Additional Libraries
- **Headless UI:** @headlessui/react (dropdowns, dialogs, etc.)
- **OTP Input:** input-otp
- **Notifications:** Sonner toast library
- **HTTP Client:** Built-in XHR via Inertia (Axios removed in v3)

---

## 2. ADMIN PANEL ARCHITECTURE

### Location
- **Main Component:** `/resources/js/components/admin/AdminShell.tsx`
- **Header:** `/resources/js/components/admin/AdminHeader.tsx`
- **Sidebar:** `/resources/js/components/admin/AdminSidebar.tsx`
- **Pages:** `/resources/js/pages/admin/`
- **Controllers:** `/app/Http/Controllers/Admin/`

### Admin Shell Structure
The `AdminShell` component acts as the main layout wrapper for all admin pages:
- Renders `AdminSidebar` on the left (72px wide on desktop, collapsible on mobile)
- Renders `AdminHeader` with page title and user info
- Main content area with responsive padding
- Light gray background (#f7f8fa)

### Admin Pages Available
1. **Dashboard** (`dashboard.tsx`)
   - Stats cards (total listings, active listings, sale/rent counts, etc.)
   - Recent listings table with images
   - Consultant summaries

2. **Listings Management** (`listings.tsx`, `listing-form.tsx`)
   - Create/edit property listings
   - Upload property images
   - Filter by status (ACTIVE, PASSIVE, SOLD, RENTED)
   - Display featured listings

3. **Consultants Management** (`consultants.tsx`, `consultant-edit.tsx`)
   - Create/edit consultant profiles
   - Upload profile photos
   - Assign permissions
   - View portfolio statistics

4. **Messages** (`messages.tsx`)
   - View contact requests
   - Mark as read/unread
   - Delete messages
   - Filter by status

5. **Settings** (`settings.tsx`)
   - Manage site-wide settings (branding, SEO, etc.)
   - Update contact information
   - Configure payment settings

### Admin Rendering
- **Entry Point:** `app.tsx` detects page name starting with `admin/` and applies `AdminShell` layout
- **Authentication:** All admin routes protected by `auth` + `verified` middleware
- **Authorization:** Permission-based access via `BuildsAdminProps` trait
- **Data Structure:** Props passed via `adminUser` method in `BuildsAdminProps`

---

## 3. AUTHENTICATION & USER SYSTEM

### Authentication Flow
1. **Login Route:** `/admin/login` → Renders `site/admin-login` page
2. **Login Form:** Uses Fortify's `store` route from `/login` (POST)
3. **Logout:** Uses Fortify's `logout` route (POST `/logout`)
4. **Session:** Standard Laravel session-based authentication

### Authentication Guards & Middleware
- **Guard:** `web` (configured in `config/fortify.php`)
- **Middleware Chain:** `auth` → `verified` → route-specific checks
- **Permission Validation:** Done in controllers via `BuildsAdminProps::ensurePermission()`

### User Model (`app/Models/User.php`)
```
Table: users
Columns:
- id (primary)
- username (unique, nullable)
- slug (unique, nullable) → Used for consultant profiles
- name (string)
- surname (nullable)
- email (unique)
- password (hashed)
- role (enum: CONSULTANT, SUPER_ADMIN, default: CONSULTANT)
- title (string, default: "Gayrimenkul Danışmanı")
- phone (nullable)
- region (string, nullable) → Format: "İstanbul/Kadıköy"
- bio (text, nullable)
- image_url (string, nullable) → Legacy image URL
- profile_photo (string, nullable) → NEW: Uploaded file path in storage/public
- active (boolean, default: true)
- two_factor_secret (from Fortify)
- two_factor_recovery_codes (from Fortify)
- email_verified_at (timestamp, nullable)
- remember_token
- timestamps (created_at, updated_at)

Relationships:
- hasMany('permissions') → UserPermission
- hasMany('properties', 'consultant_id') → Property (listings owned)

Accessors:
- avatar → Returns profile_photo URL or falls back to image_url
```

### User Roles & Permissions
- **SUPER_ADMIN:** Full access to all features
- **CONSULTANT:** Limited to own listings; can have granular permissions

### Permission System (`app/Models/UserPermission.php`)
```
Table: user_permissions
Columns:
- id
- user_id (foreign key)
- permission (string) → Specific capability name
- allowed (boolean, default: true)
- timestamps

Available Permissions:
- DASHBOARD_VIEW
- LISTINGS_VIEW, LISTINGS_CREATE, LISTINGS_EDIT, LISTINGS_DELETE, LISTINGS_PUBLISH, LISTINGS_FEATURE
- CONSULTANTS_VIEW, CONSULTANTS_CREATE, CONSULTANTS_EDIT, CONSULTANTS_DELETE
- USERS_VIEW, USERS_CREATE, USERS_EDIT, USERS_DELETE
- MESSAGES_VIEW, MESSAGES_EDIT
- SETTINGS_VIEW, SETTINGS_EDIT
```

### Password Reset
- **Config:** `config/fortify.php` → `'passwords' => 'users'`
- **Routes:** Auto-registered by Fortify:
  - GET `/forgot-password` → Request reset link
  - POST `/forgot-password` → Send reset email
  - GET `/reset-password/{token}` → Reset form
  - POST `/reset-password` → Process reset

### Two-Factor Authentication
- **Type:** TOTP (Time-based One-Time Password)
- **QR Code:** Generated via `TwoFactorSecretKey.svg`
- **Recovery Codes:** Provided for account recovery
- **Enabled by Default:** Yes (via Fortify features config)

### Admin User Props Structure (passed to frontend)
```typescript
type AdminUser = {
  id: number;
  name: string; // Concatenated: name + surname
  email: string;
  role: string | null; // CONSULTANT, SUPER_ADMIN
  permissions: string[]; // Allowed permission codes
}
```

---

## 4. DATABASE SCHEMA

### Core Tables

#### `users`
- **Purpose:** User accounts (consultants, super admins)
- **Key Columns:**
  - `id` (auto-increment)
  - `username`, `email` (both unique)
  - `slug` (for public consultant URLs)
  - `role` (CONSULTANT | SUPER_ADMIN)
  - `profile_photo` (path in storage/public, nullable)
  - `image_url` (legacy, nullable)
  - `phone`, `region`, `bio`
  - `active` (soft status flag)
  - Two-factor columns (from Fortify migration)

#### `properties` (Real Estate Listings)
- **Purpose:** Real estate listings/property advertisements
- **Key Columns:**
  - `id`, `title`, `slug` (unique)
  - `ilan_no`, `ilan_tarihi` (Turkish property listing ID/date)
  - `description` (text), `price` (bigInt)
  - Location: `city_id`, `district_id`, `neighborhood_id`, `address`
  - Denormalized: `city`, `district`, `neighborhood` (strings for search)
  - Property Details:
    - `property_type` (Villa, Apartman, etc.)
    - `listing_type` (SALE | RENT)
    - `square_meters`, `brut_m2`, `net_m2`
    - `room_count`, `building_age`, `floor`, `total_floors`
    - `heating`, `bathroom_count`, `balcony`, `furnished`, `otopark`, `asansor`
  - Status: `status` (ACTIVE, PASSIVE, SOLD, RENTED), `featured` (boolean)
  - `consultant_id` (foreign key → users)
  - Additional Turkish Fields:
    - `mutfak`, `site_icerisinde`, `site_adi`, `aidat`
    - `deed_status`, `credit_eligible`, `enerji_kimlik_belgesi`
    - `kimden`, `takas`, `usage_status`

#### `property_images`
- **Purpose:** Store multiple images per property
- **Key Columns:**
  - `id`, `property_id` (foreign key)
  - `image_url` (S3 or local storage path)
  - `sort_order` (for ordering)
  - `timestamps`

#### `user_permissions`
- **Purpose:** Granular permission assignments
- **Key Columns:**
  - `id`, `user_id`, `permission`, `allowed` (boolean)

#### `contact_requests`
- **Purpose:** Visitor inquiries from website contact form
- **Key Columns:**
  - `id`, `email`, `name`, `phone`, `message`
  - `property_id` (optional, if inquiry is about a specific property)
  - `read_at` (for marking as read)
  - `timestamps`

#### `locations` (Hierarchical)
- **Tables:**
  - `cities` → `districts` → `neighborhoods`
- **Purpose:** SEO-friendly location hierarchy for properties
- **Structure:**
  - Each has `id`, `name`, `slug`
  - Links to parent (district → city, neighborhood → district)

#### `site_settings`
- **Purpose:** Global site configuration
- **Key Columns:**
  - `key` (config key), `value` (stored as JSON/string)
  - SEO fields: `meta_title`, `meta_description`, `canonical_url`
  - Contact: `phone`, `email`, `address`, `business_hours`
  - Branding: `site_name`, `primary_color`, `logo_url`

---

## 5. STYLING & THEME

### Color Scheme (Tailwind v4 CSS Variables)
```css
--color-navy: #0b1f3a          /* Main dark blue */
--color-navy-soft: #16365f     /* Lighter navy for hover states */
--color-gold: #c6a15b          /* Accent gold (CTAs, highlights) */
--color-gold-soft: #f3e8d2     /* Very light gold background */
--color-light-gray: #f7f8fa    /* Main background */
--color-ivory: #fbfaf7         /* Off-white for cards */
--color-dark-text: #111827     /* Main text color */
--color-stone-line: #e7e5df    /* Borders, dividers */
```

### Typography
- **Font:** "Instrument Sans" (via Bunny, weights: 400, 500, 600)
- **Fallback:** ui-sans-serif, system-ui, sans-serif

### Tailwind Configuration
- **Version:** v4 with `@tailwindcss/vite` plugin
- **Custom Theme:** Defined in `resources/css/app.css` via `@theme` block
- **Dark Mode:** Via `@custom-variant dark`
- **Radius:** Customized for `lg`, `md`, `sm`

### CSS Classes Patterns
- Custom classes in admin components:
  - `premium-shadow` → Box shadow for premium feel
  - `section-eyebrow` → Small uppercase helper text above headers
  - `glass-effect` → Backdrop blur (used in headers)
- **Responsive Breakpoints:** `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

### Design System Components
Located in `/resources/js/components/ui/` (Radix UI based):
- `avatar.tsx` → Profile photos
- `button.tsx` → Primary/secondary buttons
- `card.tsx` → Content cards
- `dialog.tsx` → Modal dialogs
- `dropdown-menu.tsx` → User menus
- `input.tsx`, `textarea.tsx` → Form inputs
- `label.tsx` → Form labels
- `select.tsx` → Select dropdowns
- `checkbox.tsx`, `toggle.tsx` → Toggles
- `badge.tsx` → Status badges
- `skeleton.tsx` → Loading placeholders
- `sonner.tsx` → Toast notifications
- `spinner.tsx` → Loading spinners

---

## 6. FRONTEND STRUCTURE

### Directory Layout
```
resources/js/
├── app.tsx                    # Inertia app bootstrap + layout resolver
├── actions/                   # Server actions (not used in this setup)
├── components/
│   ├── admin/                 # Admin panel components
│   │   ├── AdminHeader.tsx    # Top bar with user + logout
│   │   ├── AdminShell.tsx     # Main admin layout wrapper
│   │   ├── AdminSidebar.tsx   # Left navigation
│   │   ├── AdminTable.tsx     # Data table component
│   │   └── StatCard.tsx       # Dashboard stat cards
│   ├── site/                  # Public website components
│   │   ├── BrandLogo.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SiteShell.tsx      # Public site layout wrapper
│   │   └── ...
│   └── ui/                    # Radix UI component library
├── data/                      # Static data/constants
├── hooks/                     # Custom React hooks
│   └── use-appearance.ts      # Dark mode/theme hook
├── layouts/
│   ├── app/
│   │   └── app-sidebar-layout.tsx  # Settings page layout
│   ├── app-layout.tsx         # Wrapper for authenticated pages
│   ├── auth-layout.tsx        # Login/register layout
│   └── settings/
│       └── layout.tsx         # Settings-specific layout
├── lib/
│   ├── auth.ts
│   ├── session.ts
│   ├── prisma.ts
│   └── image-url.ts
├── pages/
│   ├── admin/                 # Admin panel pages
│   │   ├── dashboard.tsx
│   │   ├── listings.tsx
│   │   ├── listing-form.tsx
│   │   ├── consultants.tsx
│   │   ├── consultant-edit.tsx
│   │   ├── messages.tsx
│   │   └── settings.tsx
│   ├── auth/                  # Authentication pages
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   ├── verify-email.tsx
│   │   ├── two-factor-challenge.tsx
│   │   └── confirm-password.tsx
│   ├── settings/              # User settings pages
│   │   ├── profile.tsx
│   │   ├── appearance.tsx
│   │   └── security.tsx
│   ├── site/                  # Public pages
│   │   ├── admin-login.tsx
│   │   ├── home.tsx
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   └── seo/
│   └── welcome.tsx
├── routes/                    # Wayfinder auto-generated route functions
│   ├── index.ts               # Web routes (home, login, logout, etc.)
│   ├── admin/
│   │   ├── index.ts           # Admin dashboard
│   │   ├── listings.ts
│   │   ├── consultants.ts
│   │   ├── messages.ts
│   │   └── settings.ts
│   └── login.ts               # Login routes
├── types/                     # TypeScript definitions
│   ├── auth.ts                # User, Auth types
│   ├── consultant.ts
│   ├── property.ts
│   └── index.ts
└── wayfinder/                 # Wayfinder type definitions (auto-gen)
```

### Page Layout System
**Layout Resolver in `app.tsx`:**
```typescript
layout: (name) => {
  switch (true) {
    case name === 'site/admin-login':
      return null;                    // No layout
    case name.startsWith('site/'):
      return SiteShell;               // Public website layout
    case name.startsWith('admin/'):
      return AdminShell;              // Admin panel layout
    case name.startsWith('auth/'):
      return AuthLayout;              // Auth layout
    case name.startsWith('settings/'):
      return [AppLayout, SettingsLayout];  // Nested layouts
    default:
      return AppLayout;               // Default app layout
  }
}
```

---

## 7. KEY CONTROLLERS

### Admin Controllers Location
`/app/Http/Controllers/Admin/`

#### DashboardController
- **Action:** Show admin dashboard with stats
- **Method:** `__invoke(Request $request): Response`
- **Authorization:** `DASHBOARD_VIEW` permission
- **Returns:**
  - `stats`: Object with totalListings, activeListings, saleListings, rentListings, consultantCount, messageCount, unreadMessageCount
  - `recentListings[]`: Last 5 listings with images
  - `consultantSummaries[]`: Top 6 consultants with portfolio count

#### ListingsController
- **Methods:**
  - `__invoke()` → List all listings (index)
  - `create()` → Show create form
  - `store()` → Save new listing
  - `edit()` → Show edit form
  - `update()` → Update listing
  - `destroy()` → Delete listing
- **Authorization:** Various LISTINGS_* permissions
- **Property Scoping:** Consultants see only their own listings (except SUPER_ADMIN)

#### ConsultantsController
- **Methods:**
  - `__invoke()` → List consultants
  - `store()` → Create consultant
  - `edit()` → Edit form
  - `update()` → Update consultant
  - `destroy()` → Delete consultant
  - `updateProfilePhoto()` → Handle file upload for profile_photo
- **Authorization:** Various CONSULTANTS_* permissions
- **Special Features:**
  - Slug generation (auto-generated from name)
  - Profile photo upload to `storage/public`
  - Region parsing ("Istanbul/Kadıköy" → separate city/district)
  - Permission syncing (assign granular permissions to consultant)

#### MessagesController
- **Methods:**
  - `__invoke()` → List contact messages
  - `update()` → Mark as read
  - `destroy()` → Delete message
- **Authorization:** MESSAGES_VIEW, MESSAGES_EDIT

#### SettingsController
- **Methods:**
  - `index()` → Show settings form
  - `update()` → Save settings
- **Authorization:** SETTINGS_VIEW, SETTINGS_EDIT

### Shared Trait: `BuildsAdminProps`
**Location:** `/app/Http/Controllers/Admin/Concerns/BuildsAdminProps.php`

**Methods:**
- `ensurePermission(User $user, string $permission): void` → Throws 403 if not allowed
- `userCan(User $user, string $permission): bool` → Check permission (always true for SUPER_ADMIN)
- `adminUser(User $user): array` → Build admin props with name concatenation + permission list
- `applyPropertyScope(Builder $query, User $user): Builder` → Filter properties for consultants

---

## 8. ROUTES

### Admin Routes
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    
    Route::prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/', DashboardController::class)->name('dashboard');
        
        // Listings
        Route::get('listings', ListingsController::class)->name('listings.index');
        Route::get('listings/create', [ListingsController::class, 'create'])->name('listings.create');
        Route::post('listings', [ListingsController::class, 'store'])->name('listings.store');
        Route::get('listings/{property}/edit', [ListingsController::class, 'edit'])->name('listings.edit');
        Route::put('listings/{property}', [ListingsController::class, 'update'])->name('listings.update');
        Route::delete('listings/{property}', [ListingsController::class, 'destroy'])->name('listings.destroy');
        
        // Consultants
        Route::get('consultants', ConsultantsController::class)->name('consultants.index');
        Route::post('consultants', [ConsultantsController::class, 'store'])->name('consultants.store');
        Route::get('consultants/{consultant}/edit', [ConsultantsController::class, 'edit'])->name('consultants.edit');
        Route::post('consultants/{consultant}/profile-photo', [ConsultantsController::class, 'updateProfilePhoto'])
            ->name('consultants.profile-photo.update');
        Route::put('consultants/{consultant}', [ConsultantsController::class, 'update'])->name('consultants.update');
        Route::delete('consultants/{consultant}', [ConsultantsController::class, 'destroy'])->name('consultants.destroy');
        
        // Messages
        Route::get('messages', MessagesController::class)->name('messages.index');
        Route::put('messages/{message}', [MessagesController::class, 'update'])->name('messages.update');
        Route::delete('messages/{message}', [MessagesController::class, 'destroy'])->name('messages.destroy');
        
        // Settings
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');
    });
});
```

### Authentication Routes (Auto-registered by Fortify)
```
POST   /login              → Login form submission
GET    /login              → Show login page
POST   /logout             → Logout (used in AdminHeader)
GET    /forgot-password    → Password reset request form
POST   /forgot-password    → Send password reset email
GET    /reset-password/:token → Password reset form
POST   /reset-password     → Process password reset
```

### Web Routes (Public)
```php
GET    /                          → HomeController (index)
GET    /listings                  → WebListingController::show
GET    /listings/{reference}      → WebListingController::legacyDetails
GET    /ilan/{reference}          → WebListingController::details (SEO URL)
GET    /consultants               → WebConsultantsController
GET    /danisman/{consultant:slug} → ConsultantPortfolioController
GET    /about                     → Inertia render 'site/about'
GET    /contact                   → Inertia render 'site/contact'
POST   /contact-requests          → ContactRequestController::store (throttled: 10/min)
GET    /admin/login               → Inertia render 'site/admin-login'
```

### Wayfinder Route Functions
Auto-generated in `/resources/js/routes/`:

**Main Routes:**
```typescript
// From resources/js/routes/index.ts
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'>
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'>

// From resources/js/routes/admin/index.ts
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'>

// From resources/js/routes/admin/listings.ts
export const index = (): RouteDefinition<'get'>  // admin/listings
export const create = (): RouteDefinition<'get'>  // admin/listings/create
export const store = (): RouteFormDefinition<'post'>
// ... etc

// From resources/js/routes/admin/consultants.ts
export const index = (): RouteDefinition<'get'>
export const store = (): RouteFormDefinition<'post'>
// ... etc
```

**Usage in Components:**
```typescript
// In AdminHeader.tsx
import { logout } from '@/routes';
<Link href={logout.url()} method="post" as="button">
  Çıkış Yap
</Link>

// In AdminSidebar.tsx
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as listingsIndex } from '@/routes/admin/listings';
```

---

## 9. ENTRY POINTS

### Backend Entry Points
1. **Main App Bootstrap:** `/bootstrap/app.php`
   - Registers service providers
   - Loads configuration
   - Sets up middleware

2. **HTTP Kernel:** (Laravel default)
   - Middleware stack: web, auth, verified
   - CSRF protection
   - Session management

3. **FortifyServiceProvider:** `/app/Providers/FortifyServiceProvider.php`
   - Configures Fortify actions
   - Registers Inertia login views
   - Sets up rate limiting

### Frontend Entry Points
1. **Vite Entry:** `resources/js/app.tsx`
   - Creates Inertia app
   - Resolves layouts based on page name
   - Initializes theme/appearance
   - Wraps app with providers (TooltipProvider, Toaster)

2. **CSS Entry:** `resources/css/app.css`
   - Imports Tailwind v4
   - Defines custom theme variables
   - Imports custom animations

3. **SSR Entry:** (Auto-handled by `@inertiajs/vite`)
   - Uses same `app.tsx` for both SSR and client rendering
   - Configured in `config/inertia.php`

### Build Process
```bash
# Development
npm run dev
  ↓
Vite dev server with HMR
  ↓
Watches resources/js and resources/css
  ↓
Serves compiled assets at /build

# Production
npm run build
  ↓
Vite builds resources/js/app.tsx
  ↓
Generates public/build/ manifest
  ↓
Can also run `npm run build:ssr` for SSR bundle
```

---

## 10. ADMIN HEADER - CURRENT IMPLEMENTATION

### File Location
`/resources/js/components/admin/AdminHeader.tsx`

### Current Structure
```typescript
export default function AdminHeader({ user }: { user: AdminUser | null }) {
  // Shows title, breadcrumb info, search bar (hidden on mobile)
  // Right side: Bell icon (notifications), Logout button
  
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 px-4 py-4">
      {/* Left: Title + User Info */}
      <div className="flex flex-wrap items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-gold">Admin Panel</p>
          <h1 className="mt-1 text-2xl font-semibold text-navy">{title}</h1>
          {user && <p className="mt-1 text-xs text-slate-500">{user.name} / {user.role}</p>}
        </div>
        
        {/* Center: Search Bar (hidden on XL+) */}
        <div className="hidden xl:flex items-center gap-3">
          {/* Search input */}
        </div>
        
        {/* Right: Notifications + Logout */}
        <div className="ml-auto flex items-center gap-2">
          <button className="h-11 w-11 rounded border" aria-label="Bildirimler">
            <Bell size={19} />
          </button>
          
          {/* LOGOUT BUTTON */}
          <Link
            href={logout.url()}
            method="post"
            as="button"
            className="inline-flex h-11 items-center gap-2 px-3 text-xs font-bold uppercase"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

### Logout Button Details
- **Route Used:** `logout.url()` from `/resources/js/routes/index.ts`
- **Method:** POST (required by Fortify)
- **Styling:**
  - Height: 44px (h-11)
  - Border: 1px solid stone-line (#e7e5df)
  - Text: Navy on normal state, Gold on hover
  - Icons from lucide-react
  - Responsive: "Çıkış Yap" text hidden on mobile

### Props Passed to AdminHeader
```typescript
type AdminUser = {
  id: number;
  name: string;           // Already concatenated (name + surname)
  email: string;
  role: string | null;    // CONSULTANT, SUPER_ADMIN
  permissions: string[];  // List of allowed permissions
}
```

**Props Flow:**
1. Admin controller calls `adminUser($user)` from `BuildsAdminProps` trait
2. Passes as `adminUser` prop to Inertia render
3. `AdminShell` receives it from `usePage()`
4. Passes to `AdminHeader` component

### Page Title Logic
```typescript
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/admin/listings': 'Ilan Yonetimi',
  '/admin/listings/create': 'Yeni Ilan Ekle',
  '/admin/consultants': 'Kullanicilar',
  '/admin/messages': 'Mesajlar',
  '/admin/settings': 'Site Ayarlari',
};
```
- Falls back to "Ilan Duzenle" if path includes `/edit`
- Uses current route URL from `usePage()`

---

## 11. PROFILE PHOTO IMPLEMENTATION

### Database Column
```php
// Migration: 2026_05_04_125944_add_profile_photo_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->string('profile_photo')->nullable()->after('image_url');
});
```

### User Model Accessor
```php
protected function avatar(): Attribute
{
    return Attribute::get(
        fn (): ?string => $this->profile_photo
            ? Storage::disk('public')->url($this->profile_photo)
            : $this->image_url,
    );
}
```
- **Priority:** profile_photo (new) → image_url (legacy)
- **Storage Disk:** `public` (local filesystem or S3)
- **Returns:** Full URL via Storage facade

### Frontend Usage
- **Pages:** `/resources/js/pages/admin/consultants.tsx` and `consultant-edit.tsx`
- **Form Fields:**
  ```html
  <input
    type="file"
    name="profile_photo"
    accept="image/*"
  />
  ```
- **Form Helper:** Uses `Form` component from Inertia with automatic file handling
- **Upload Route:** POST `/admin/consultants/{consultant}/profile-photo`

### Upload Handler
```php
// ConsultantsController::updateProfilePhoto
Route::post('consultants/{consultant}/profile-photo', 
    [ConsultantsController::class, 'updateProfilePhoto'])
    ->name('consultants.profile-photo.update');
```
- Validates file is image
- Deletes old profile_photo if exists
- Stores in `storage/public/` with unique filename
- Updates database with relative path

---

## 12. KEY FILES REFERENCE

### Configuration Files
- `config/fortify.php` → Auth settings, features, redirects
- `config/inertia.php` → SSR configuration, page discovery
- `config/auth.php` → Guards, providers, password brokers
- `vite.config.ts` → Build configuration, plugins

### Service Providers
- `app/Providers/FortifyServiceProvider.php` → Authentication setup
- `app/Providers/AppServiceProvider.php` → Global bindings

### Models
- `app/Models/User.php` → User account (consultants, admins)
- `app/Models/Property.php` → Real estate listings
- `app/Models/UserPermission.php` → Permission assignments
- `app/Models/ContactRequest.php` → Website inquiries
- `app/Models/City/District/Neighborhood.php` → Location hierarchy

### Admin Components
- `resources/js/components/admin/AdminShell.tsx` → Main layout
- `resources/js/components/admin/AdminHeader.tsx` → Top bar (includes logout)
- `resources/js/components/admin/AdminSidebar.tsx` → Navigation menu
- `resources/js/components/admin/AdminTable.tsx` → Data tables
- `resources/js/components/admin/StatCard.tsx` → Dashboard stats

---

## SUMMARY

**This is a modern, full-featured admin panel built with:**
- **Backend:** Laravel 13 + Fortify authentication with 2FA
- **Frontend:** Inertia React v3 with server-side rendering
- **Styling:** Tailwind CSS v4 with custom navy/gold theme
- **Type Safety:** Wayfinder auto-generated route functions
- **Authorization:** Permission-based access control per user

**The admin panel manages:**
- Properties (listings) with images
- Consultants (users) with profile photos
- Contact messages
- Site-wide settings
- User permissions

**Logout Button Location:**
- Component: `AdminHeader.tsx` (top-right corner)
- Route: POST `/logout` (via Fortify)
- Styled: Navy button with gold hover, LogOut icon
