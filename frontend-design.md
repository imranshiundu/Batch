# Batch Platform: Master Frontend Specification

This document serves as the absolute blueprint for frontend engineering. It defines the exact design tokens, component architecture, screen layouts, and interaction physics required to build Batch.

---

## 1. Design Tokens (The Foundations)

### 1.1 Spatial System & Grid
Batch uses a strict 8px base grid to ensure vertical and horizontal rhythm.
- **Base Unit:** `8px`
- **Micro-spacing:** `4px` (for tight relationships, e.g., an icon next to text)
- **Macro-spacing:** `16px`, `24px`, `32px`, `48px`, `64px`
- **Desktop Container Max-Width:** `1200px` (Centered)
- **Mobile Safe Area Padding:** `16px` on edges.

### 1.2 Typography System
Typography is the primary UI element. We rely on two specific typefaces.
- **Primary UI Font:** `Inter` (Sans-serif, neutral, highly legible).
- **Data/Financial Font:** `JetBrains Mono` or `Roboto Mono` (Tabular numerals prevent numbers from jumping when values change).

**Hierarchy (Inter unless specified):**
- **Display (H1):** `36px` / `44px` Line-height / `SemiBold` (-1% tracking)
- **Title (H2):** `24px` / `32px` Line-height / `Medium`
- **Subtitle (H3):** `18px` / `24px` Line-height / `Medium`
- **Body Large (P1):** `16px` / `24px` Line-height / `Regular`
- **Body Small (P2):** `14px` / `20px` Line-height / `Regular` (Default UI text)
- **Financial Metric:** `32px` / `Mono` / `Medium` (Used for escrow totals)
- **Micro Label:** `12px` / `16px` Line-height / `Medium` / `Uppercase` (+2% tracking)

### 1.3 Color Palette
No gradients. No neon. Strict trust-based coloring.
- **Surfaces:**
  - `Background`: `#F8FAFC` (Slate 50) - The main canvas.
  - `Surface`: `#FFFFFF` - Crisp white for cards and modals.
  - `Surface-Hover`: `#F1F5F9` (Slate 100).
- **Ink (Text):**
  - `Ink-Primary`: `#0F172A` (Slate 900) - For all primary reading text.
  - `Ink-Secondary`: `#64748B` (Slate 500) - For timestamps, empty states, minor labels.
- **Semantic / State Colors:**
  - `Brand/Action`: `#0F172A` (Slate 900) - Buttons are confident, stark black/dark gray.
  - `Escrow/Active`: `#3B82F6` (Blue 500).
  - `Cleared/Success`: `#10B981` (Emerald 500).
  - `Warning/Dispute`: `#F59E0B` (Amber 500).

### 1.4 Borders & Elevation (Shadows)
- **Radii:**
  - Inputs & Buttons: `6px` (Sharp, professional).
  - Cards & Drawers: `12px`.
  - Badges: `4px`.
- **Shadows:**
  - UI Elements: `box-shadow: 0px 1px 3px rgba(15, 23, 42, 0.08)` (Subtle lift).
  - Dropdowns/Modals: `box-shadow: 0px 10px 25px rgba(15, 23, 42, 0.1)` (Clear layering).

---

## 2. Core Components (The UI Library)

### 2.1 Buttons
Buttons must feel heavy and decisive.
- **Primary Action Button:**
  - Height: `44px` (Ensures mobile touch accessibility).
  - Padding: `0 16px`.
  - Font: `14px`, `Medium`.
  - Default State: Background `#0F172A`, Text `#FFFFFF`.
  - Hover State: Transform `translateY(-1px)`, Background `#1E293B`, Shadow intensifies slightly.
  - Active/Click State: Transform `translateY(0px)`, Background `#000000`.
- **Large Market CTA (e.g., "Commit Funds"):**
  - Height: `56px`. Font: `16px`, `SemiBold`.
- **Disabled State:** Opacity `50%`, cursor `not-allowed`. No hover effects.

### 2.2 Avatars & User Identity
We do not allow user-uploaded profile pictures. It reduces moderation overhead and visual noise.
- **Dimensions:** Default `40x40px`, Small `32x32px`, Profile Header `80x80px`.
- **Shape:** Circle (`border-radius: 50%`).
- **Content:** User Initials (e.g., "IS" for Imran Shiundu).
- **Background Logic:** Hash the user ID to a deterministic, muted pastel array (e.g., Pastel Blue, Muted Sage, Soft Lavender). 
- **Typography Inside:** `14px`, `SemiBold`, Color `#0F172A`.

### 2.3 Form Inputs
- **Height:** `44px`.
- **Border:** `1px solid #CBD5E1` (Slate 300).
- **Focus State:** `outline: none`, `border-color: #3B82F6`, `box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2)`.
- **Labeling:** Label sits *above* the input. `14px`, `Medium`, `#0F172A`, `margin-bottom: 6px`.

### 2.4 Status Badges
Used aggressively to denote state (`OPEN`, `FUNDED`, `PRODUCTION`, `SHIPPED`).
- **Dimensions:** Height `24px`, Padding `0 8px`.
- **Typography:** `12px`, `SemiBold`, Uppercase.
- **Coloring (Example for FUNDED):** Background `Emerald 50`, Text `Emerald 700`.

---

## 3. Screen Layouts & Data Arrangement

### 3.1 The User Profile / Settings Page
This page must feel like a bank settings portal, not a social media profile.
- **Header Section (Height: 120px, Bottom Border: 1px solid #E2E8F0):**
  - **Left Align:** Large Avatar (`80x80px`), vertical stack of User Display Name (H2) and Account Status Badge (e.g., `Verified Buyer` badge).
  - **Right Align:** "Edit Profile" (Secondary Ghost Button).
- **Body Layout:** A 2-column grid on desktop (Gap `32px`), stacking to 1-column on mobile.
  - **Left Column (Core Identity & Logistics):**
    - *Card 1: Personal Information.* Vertical list of immutable data (Email, Legal Name).
    - *Card 2: Delivery Profiles.* A list of saved addresses. Each row has a `24px` custom radio button to select the default, the address text, and an "Edit" icon link.
  - **Right Column (Security & Preferences):**
    - *Card 1: Notification Preferences.* Toggle switches (Width `36px`, Height `20px`, internal knob `16px`) for 'Milestone Updates', 'Escrow Alerts'.
    - *Card 2: API Keys (Developer/Bot).* Hidden by default. Shows a row with a masked key `sk_live_••••••••`. A click-to-copy icon (`lucide-copy`) sits adjacent.

### 3.2 The Live Batch Detail (The Deal Room)
This page operates like a StockX or Bloomberg terminal view for a specific deal.
- **Layout:** Two uneven columns (60% / 40%).
- **Left Pane (Context & Escrow Timeline):**
  - **Title Block:** H1 Batch Name, Supplier Tag, Risk Badge.
  - **The Timeline Component:** A vertical stepper tracking the escrow state.
    - Node: `16x16px` circle. Connected by a `2px` vertical line.
    - Active Node: Pulsing blue fill. Past Nodes: Solid Emerald. Future Nodes: Hollow Gray.
- **Right Pane (The Market Action Box):**
  - **Behavior:** `position: sticky; top: 24px;` (It scrolls down with the user).
  - **Styling:** `Padding: 24px`, `Border: 1px solid #E2E8F0`, `Border-Radius: 12px`, `Background: #FFFFFF`.
  - **Data Hierarchy:** 
    1. Top right: Countdown clock (JetBrains Mono, Red/Gray).
    2. Huge Typography: "Current Batch Price: $4.20" (36px).
    3. Small comparison: "Market value: $8.00 (Savings 47%)".
    4. Progress Bar: `Height: 8px`, `border-radius: 4px`. Fill is Blue.
    5. Action: Massive `56px` height Primary Button: "Commit Funds".

---

## 4. Frontend Physics & Graceful Degradation

### 4.1 Loading Mechanics (Skeletons, No Spinners)
If the frontend drops connection or is waiting on the database, it must not white-screen or show a generic spinning wheel.
- **Skeleton Shimmer:** Data components render as gray blocks matching the exact geometry of the missing data (e.g., an `H2` skeleton is `height: 32px`, `width: 60%`, `border-radius: 4px`).
- **Animation:** A linear gradient sweeps left to right over `1.5s` (`ease-in-out`).

### 4.2 Error Boundaries (Partial Failure Handling)
If a specific backend microservice fails (e.g., the Logistics API crashes):
- The entire application **does not** crash.
- React Error Boundaries trap the failure at the component level.
- The "Delivery Tracking" card turns into an Empty State: Background `#F8FAFC`, Icon `lucide-alert-circle` (Gray), Text "Delivery tracking temporarily unavailable".
- The rest of the page (Escrow Wallet, Active Commitments) remains 100% interactive.

### 4.3 Motion and Interactions
- **Page Routing:** Instantaneous. No artificial fade-ins.
- **Drawers (Slide-overs):** Used for the Commit Flow instead of modals. They slide in from the right over `300ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Hover Physics:** Only interactive elements transform. Information cards are static. 
- **Financial Tickers:** When wallet balances update via WebSocket, use tabular lining features (`font-variant-numeric: tabular-nums`) so the numbers flip seamlessly without causing the layout width to jitter.

---

## 5. User Flow

The vertical tree below mirrors the structure in the reference image. Black boxes are primary hubs. White boxes are sub-screens. Arrows show navigation direction.

```
┌─────────────┐
│  Splash     │
└──────┬──────┘
       │
┌──────▼──────┐
│ Onboarding  │  ← First-time only. Role selection: Buyer / Supplier.
└──────┬──────┘
       │
   ┌───┴───┐
   │ Log In│   Sign Up
   └───┬───┘
       │
       ├──────────────────────────────────────────────────────────────────┐
       │                                                                  │
┌──────▼──────────────────────┐                              ┌───────────▼─────────────┐
│  BUYER                      │                              │  SUPPLIER               │
│  Dashboard                  │                              │  Dashboard              │
└──────┬──────────────────────┘                              └───────────┬─────────────┘
       │                                                                 │
       ├── Live Batches (Market)                                         ├── My Batches
       │       │                                                         │       │
       │       ├── [Batch Deal Room]                                     │       ├── [Batch Detail]
       │       │       │                                                 │       │       ├── Milestone Tracker
       │       │       ├── Commit Flow                                   │       │       └── Upload Proof
       │       │       │       ├── Step 1: Choose Quantity               │       │
       │       │       │       ├── Step 2: Choose Delivery               │       └── [Create New Batch]
       │       │       │       ├── Step 3: Escrow Summary                │               ├── Step 1: Batch Details
       │       │       │       └── Step 4: Confirmation Receipt          │               ├── Step 2: Pricing & Tiers
       │       │       │                                                 │               ├── Step 3: Delivery Plan
       │       │       └── Slot Transfer (Exit)                         │               └── Step 4: Submit for Review
       │       │               ├── Set Ask Price                         │
       │       │               └── Confirm Transfer                      ├── Payouts
       │       │                                                         │       └── Payout Timeline
       ├── My Commitments                                                │
       │       ├── Active                                                └── Reputation Score
       │       │       ├── Track Delivery
       │       │       ├── Confirm Delivery Received
       │       │       └── Request Refund → Refund Status
       │       └── Past / Settled
       │
       ├── Wallet & Escrow
       │       ├── Held in Escrow (per commitment)
       │       ├── Available Balance
       │       └── Transaction History
       │
       └── Profile & Settings
               ├── Personal Info (view only)
               ├── Delivery Profiles (add / edit / set default)
               ├── Notification Preferences
               ├── API Keys (Developers / Bots)
               └── Log Out


┌──────────────────────────────────────┐
│  OPERATOR CONSOLE (internal)         │
└──────┬───────────────────────────────┘
       │
       ├── Overview Dashboard
       │       ├── Stuck Batches Queue
       │       ├── Overdue Milestones
       │       └── Risky Suppliers
       │
       ├── Escrow Ledger
       │       ├── All Ledger Events
       │       └── Payment Event Failures
       │
       ├── Batch Interventions
       │       ├── Approve / Pause / Cancel Batch
       │       └── Allocate Deliveries
       │
       ├── Dispute Center
       │       ├── Open Disputes
       │       └── Resolve Dispute
       │
       ├── Refund Queue
       │       └── Approve Refund
       │
       ├── Supplier Verification
       │       ├── Verified Suppliers
       │       └── Suspend Supplier
       │
       └── Audit Logs
               └── Full Event Trail
```

---

## 6. Page-by-Page Specifications

### 6.1 Splash / Landing (`/`)
**Purpose:** Explain Batch to first-time visitors. No clutter. No pricing page. No testimonials wall.
**Layout:** Single centered column. Max width `680px`.
- **Header bar:** Logo left. "Log in" link right. `height: 64px`.
- **Hero Block:**
  - H1: 2-3 word proposition. `36px`, `SemiBold`.
  - Subtext: One sentence max. `16px`, `Regular`, `Ink-Secondary`.
  - Two CTAs side by side: Primary "Join a Batch" + Ghost "Learn how it works". Gap `12px`.
- **Three-column info strip** (`padding: 64px 0`): Escrow / Commitment / Delivery. Icon top, H3 label, 1-line description. No images.
- **Footer:** Links only. No marketing copy.

---

### 6.2 Auth (`/login`, `/register`, `/verify`)
**Purpose:** Fast, minimal entry. No social logins unless added later.
**Layout:** Centered card. `Width: 400px`. `Padding: 40px`. `Border-radius: 12px`.
- **Logo:** `32px` height. Centered top.
- **H2:** "Welcome back" / "Create your account". `24px`.
- **Inputs:** Email (`44px`), Password (`44px`). Labels above.
- **Primary CTA:** Full-width. `44px` height.
- **Role Selection (Register only):** Two large radio cards (Buyer / Supplier). `Border: 1px solid #E2E8F0`. Selected state: `Border-color: #3B82F6`, `Background: #EFF6FF`.
- **Verification step:** 6-digit OTP grid. Each cell `52x52px`, `border: 1px solid #CBD5E1`, `border-radius: 6px`.

---

### 6.3 Buyer Dashboard (`/app`)
**Purpose:** A portfolio view of the user's active financial positions in Batch. Not a homepage. Not a store.
**Layout:** Left sidebar (`240px` wide) + Main content area. Sidebar collapses to bottom tab bar on mobile.
- **Sidebar items (top to bottom):** Logo mark, Batches, My Commitments, Wallet, Deliveries, Profile. Icon `20x20px` + Label `14px`. Active state: `Background: #F1F5F9`, `font-weight: Medium`.
- **Top bar:** Avatar (`40x40px`), notification bell icon.
- **Main Content — 4 KPI Cards (row):**
  - "Protected in Escrow" / "Active Commitments" / "Clearing Soon" / "Pending Deliveries".
  - Card: `padding: 20px 24px`, `border: 1px solid #E2E8F0`, `border-radius: 12px`.
  - Value: `32px`, Mono. Label: `12px`, Uppercase, `Ink-Secondary`.
- **Below KPIs — Two columns (60/40):**
  - Left: "My Active Commitments" list.
  - Right: "Batches Clearing Soon" compact list.
- **Each commitment row:**
  - Batch name (`14px Medium`), Status badge, Progress bar (`6px height`), Escrow amount (Mono `14px`). `padding: 16px 0`. `border-bottom: 1px solid #F1F5F9`.

---

### 6.4 Live Batches Market (`/batches`)
**Purpose:** Browse open group deals. Feels like a market feed, not a product grid.
**Layout:** Sidebar filters (`240px`) + Card feed (fluid).
- **Filter Sidebar:**
  - Category checkboxes (IMPORT, LOCAL, COMMUNITY, MERCHANT).
  - Risk level (Low / Medium / High) toggle chips.
  - Deadline filter: "Closing Today", "This Week".
  - Delivery Mode: Hub Pickup / Direct.
- **Deal Card (not product card):**
  - `Width: 100%` (list view, not grid). `Padding: 20px`. `Border: 1px solid #E2E8F0`. `Border-radius: 12px`. `Margin-bottom: 12px`.
  - **Row 1:** Batch title (`16px Medium`) left, Status badge right.
  - **Row 2:** Supplier name + location (`14px`, `Ink-Secondary`).
  - **Row 3:** Progress bar. `Height: 6px`. Blue fill. Below bar: "382 of 500 minimum committed" `12px Ink-Secondary`.
  - **Row 4:** Price strip. `Batch Price: $4.20` (`18px Mono Medium`) + `Normal: $8.00` (`14px Ink-Secondary strikethrough`) + `Save 47%` badge (Emerald).
  - **Row 5:** Three data chips: Deadline / Delivery Window / Risk Level.
  - **Row 6:** "View Batch" ghost button right-aligned. `Height: 36px`.

---

### 6.5 Batch Deal Room (`/batches/[slug]`)
**Purpose:** The core deal view. Combines StockX deal box + Alibaba escrow narrative.
**Layout:** Two columns. Left `58%`, Right `42%`. Gap `32px`. Right column sticky.
- **Left column (top to bottom):**
  - **Status breadcrumb:** `Home > Batches > [Batch Name]`. `12px`.
  - **H1:** Batch title. `36px SemiBold`.
  - **Meta strip:** Supplier name, Batch type badge, Risk badge. `14px`.
  - **Escrow Timeline (vertical stepper):**
    - Node: `16x16px` circle. Line: `2px` vertical.
    - States: hollow (pending) → pulsing blue (active) → solid emerald (done).
    - Milestone labels at `14px Medium`.
  - **Delivery Plan section:** Pickup options or direct delivery details.
  - **Refund Rules section:** Plain text. "If batch fails to clear, 100% refunded within 3 business days."
  - **Buyer Activity section:** "382 buyers committed." Recent commitment timestamps.
- **Right column — The Market Box (sticky):**
  - `Padding: 24px`. `Border: 1px solid #E2E8F0`. `Border-radius: 12px`.
  - **Countdown:** `JetBrains Mono 20px`. Turns Amber at <24h, no color at normal.
  - **Batch Price:** `36px Mono SemiBold`. `$4.20`.
  - **Comparison:** `Normal market: $8.00 — You save 47%`. `14px`.
  - **Progress bar:** `Height: 8px`, `border-radius: 4px`. Below: "382 committed / 500 minimum".
  - **Tier notice (if applicable):** "Price drops to $3.80 at 750 units."
  - **Quantity selector:** `–` button + number field + `+` button. `Height: 44px`. Button width `44px`.
  - **Escrow summary (inline):** `Your total: $42.00. Held in escrow until clearing.`
  - **Primary CTA:** "Commit Funds". `Width: 100%`. `Height: 56px`. `font-size: 16px SemiBold`.

---

### 6.6 Commit Flow (`/commit/[batchId]`) — Drawer
**Render:** Slide-over drawer from right. Overlays the Deal Room. Does NOT navigate away.
- **Header:** "Commit to [Batch Name]" `18px Medium`. Close `X` icon top right.
- **Step indicator:** 4 dots. Active dot: filled. Past: filled emerald. Upcoming: hollow.
- **Step 1 — Quantity:**
  - Large quantity selector (`52px` height input, `+/–` controls).
  - Live subtotal: "Total: $42.00" updates on each change. Mono font.
- **Step 2 — Delivery Method:**
  - Two radio cards: "Hub Pickup" / "Direct Delivery". Each `padding: 16px`. Selected: `border-color: #3B82F6`.
  - If "Hub Pickup": show hub location map pin + address.
  - If "Direct Delivery": show saved delivery profiles. Tap to select, or "Add New Address".
- **Step 3 — Escrow Review:**
  - Line-item breakdown (Wise-style):
    - `Batch Price: $42.00`
    - `Platform Fee: $1.26`
    - `Delivery Reserve: $2.00`
    - `Total Held in Escrow: $45.26`
  - "Refundable if batch fails to clear." `12px Ink-Secondary`.
- **Step 4 — Confirmation:**
  - Confirm button: "Lock my commitment — $45.26". `56px height`.
  - Disclaimer: `12px`. One line.
- **Step 5 — Receipt:**
  - Success state: Emerald check icon `48x48px`. "Committed." H2.
  - Commitment ID in Mono. Copy icon.
  - Two CTAs: "View my commitment" + "Back to market".

---

### 6.7 My Commitments (`/app/my-batches`)
**Purpose:** Track all active and past commitments in one place.
**Layout:** Tabs: "Active" | "Settling" | "Past". Below tabs: list.
- **Active commitment row:**
  - Batch name + Status badge.
  - Progress ring `32x32px` showing delivery progress.
  - Escrow total in Mono.
  - CTA chip: "Track Delivery" or "Confirm Receipt" depending on state.
- **Settling row:** Shows payout or refund timeline. Amber badge.
- **Past row:** Greyed. "Delivered on [date]."

---

### 6.8 Wallet & Escrow (`/app/wallet`)
**Purpose:** Full money clarity. Wise-style ledger.
**Layout:** Single column. Max `680px` centered.
- **Balance block (top):**
  - "Total in Escrow": `40px Mono SemiBold`.
  - "Available balance": `20px Mono`. `Ink-Secondary`.
- **Ledger events (list):**
  - Each row: Icon left (`24x24px`) + Event description center + Amount right (Mono). `border-bottom: 1px solid #F1F5F9`.
  - Icon color encodes type: Outflow = Gray, Escrow Lock = Blue, Release = Emerald, Refund = Amber.

---

### 6.9 Delivery Tracking (`/app/deliveries`)
**Purpose:** Amazon/Shop-style delivery clarity per allocation.
**Layout:** List left + Detail panel right (or full-screen on mobile).
- **Delivery row:** Batch name, current milestone label, delivery date estimate.
- **Detail view:** Vertical stepper of delivery stages: Cleared → Production confirmed → Shipped → At Hub → Delivered.

---

### 6.10 User Profile & Settings (`/app/profile`)
**Layout:** Two-column grid. Left `320px` fixed, Right fluid. 1-column on mobile.
- **Header zone (spans full width, `padding: 32px`, border-bottom):**
  - Avatar `80x80px` (deterministic initials) left.
  - Name H2 + role badge + account status badge. Stacked vertically.
  - "Edit" ghost button top right. `Height: 36px`.
- **Left column:**
  - Card: "Personal Information". Fields: Email (locked, view only), Display Name (editable inline on click).
  - Card: "Delivery Profiles". Each profile: address line `14px`, default radio `20x20px`, Edit icon `16x16px`, Delete icon `16x16px` per row. "Add address" ghost button at bottom.
- **Right column:**
  - Card: "Notifications". Three rows with toggle switches: Milestone Updates / Escrow Alerts / Refund Notifications. Toggle: `Width 36px, Height 20px`. On = Blue thumb.
  - Card: "API Keys" (developer section). Row: Masked key `••••••••` in Mono, copy icon, regenerate icon, eye icon to reveal. Red "Revoke" text link at far right.
  - "Log Out" danger ghost button at bottom. Full-width. `Height: 44px`. Text `Red 600`. No fill. Border `1px solid Red 200`.

---

### 6.11 Supplier Dashboard (`/supplier`)
**Layout:** Sidebar + main area (same structure as Buyer).
- **KPIs:** Active Batches / Total Committed Units / Pending Payouts / Reputation Score.
- **Batch list:** Kanban columns — `DRAFT | OPEN | FUNDED | PRODUCTION | SHIPPED | SETTLED`. Each card shows unit progress and next milestone due.

---

### 6.12 Create Batch Wizard (`/supplier/batches/new`)
**Layout:** Full-width stepped form. 4 steps shown as a progress bar (`4px height`, top of page).
- **Step 1 — Details:** Title, Type dropdown, Summary textarea.
- **Step 2 — Pricing:** Normal price, Batch price, Minimum units, Target units. Price tier table (add rows).
- **Step 3 — Delivery:** Delivery window input, Hub or Direct toggle, Location field.
- **Step 4 — Review & Submit:** Read-only summary. "Submit for Review" Primary CTA.

---

### 6.13 Milestone Tracker (`/supplier/batches/[id]`)
**Layout:** Full page. Left column milestones, right column allocation summary.
- **Milestone row:** Checkbox `20x20px`, milestone name `14px Medium`, due date `12px Ink-Secondary`, upload CTA.
- **Upload Proof:** On click: opens a drawer with a drag-and-drop zone (`Height: 200px`, dashed border, `border-radius: 12px`) + file list below.

---

### 6.14 Operator Console (`/admin`)
**Layout:** Sidebar + high-density main area. Tables, not cards.
- **Overview tiles (row of 5):** Stuck batches / Overdue milestones / Pending payouts / Open disputes / Failed payment events.
- **Batch Interventions table:** Columns: Batch Name, State, Days Open, Committed Units, Risk Level, Actions. Action cells: three icon buttons (Pause, Approve, Cancel) each `32x32px`.
- **Escrow Ledger table:** Columns: Event ID (Mono), Type, Amount, Batch, Supplier, Timestamp, Status badge.
- **Audit Log table:** Monotone. Every operator action. No delete. Scroll-infinite.

---

## 7. Premium Design Rationale — Upgrading Tokens

### 7.1 Typography — Elevated Choices
The previous choices (`Inter` + `JetBrains Mono`) are good but generic. The following is the deliberate, premium pairing with reasoning for each decision.

| Role | Font | Why |
|------|------|-----|
| UI Body & Labels | `Inter` | Industry standard. Renders perfectly at 12–16px. No substitute at small sizes. |
| Display / Hero Headings | `Satoshi` (Fontshare) | Geometric, slightly warm, used by Mercury and several premium fintech products. Creates a distinct visual identity over pure Inter. Load only weights 500 and 700. |
| Financial Data | `Berkeley Mono` or fallback `JetBrains Mono` | Berkeley Mono is used by Linear and Arc browser. It has character at small sizes and communicates "precision instrument". Tabular numerals are non-negotiable for all amounts. |

**Variable Font Loading Strategy:**
```css
/* Load Satoshi for display only — limit weight range */
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Variable.woff2') format('woff2-variations');
  font-weight: 400 700;
  font-display: swap; /* fallback renders immediately, swap when ready */
}
```
`font-display: swap` ensures no invisible text flash during load.

**Refined Scale with Satoshi/Inter Split:**
- **Page Title (H1):** `Satoshi` `32px` / `700` / `letter-spacing: -0.03em`
- **Section Title (H2):** `Satoshi` `22px` / `500` / `letter-spacing: -0.02em`
- **Card Label (H3):** `Inter` `16px` / `500`
- **Body (P1):** `Inter` `15px` / `400` / `line-height: 1.6`
- **Body Small (P2):** `Inter` `13px` / `400` / `line-height: 1.5`
- **Financial Value:** `Berkeley Mono` `28px` / `500`
- **Badge / Chip Text:** `Inter` `11px` / `600` / `letter-spacing: 0.06em` / `UPPERCASE`
- **Timestamp / Metadata:** `Inter` `12px` / `400` / `color: Ink-Secondary`

---

### 7.2 Color Palette — Premium Refinement
The previous palette used generic Tailwind utility values. Below is a named, intentional system with rationale for every decision.

**Why not pure `#000000` black?**
Pure black on white is harsh and signals "default browser." `#0D1117` (GitHub's near-black) is warmer, more refined.

**Why not generic Blue 500 for accent?**
`#3B82F6` (Blue 500) appears in millions of apps. The Batch accent is `#1C64F2` — a slightly deeper, more saturated blue that reads "financial grade, not toy app."

| Token Name | Value | Usage |
|---|---|---|
| `bg-canvas` | `#F9FAFB` | Page background. Warm white, not cold grey. |
| `bg-surface` | `#FFFFFF` | Cards, drawers, modals. |
| `bg-surface-raised` | `#F3F4F6` | Hover states, sidebar. |
| `border-default` | `#E5E7EB` | Default 1px borders. |
| `border-focus` | `#1C64F2` | Input focus rings. |
| `ink-primary` | `#0D1117` | All primary text. Slightly warm near-black. |
| `ink-secondary` | `#6B7280` | Timestamps, metadata, placeholders. |
| `ink-disabled` | `#9CA3AF` | Disabled form fields. |
| `accent-blue` | `#1C64F2` | Escrow active, primary CTA fill, focus rings. |
| `accent-blue-light` | `#EFF6FF` | Blue background for selected states, info panels. |
| `accent-emerald` | `#059669` | Cleared, success, delivery confirmed. |
| `accent-emerald-light` | `#ECFDF5` | Emerald tinted backgrounds. |
| `accent-amber` | `#D97706` | Warning, dispute, milestone overdue. |
| `accent-amber-light` | `#FFFBEB` | Amber tinted alert panels. |
| `accent-red` | `#DC2626` | Destructive: cancel batch, revoke key, log out. |
| `accent-red-light` | `#FEF2F2` | Red tinted panels. |

**Dark surfaces (Operator Console only):**
The operator console may optionally use a muted dark surface for the sidebar only (`#111827`) to differentiate it from buyer/supplier surfaces and communicate it is an internal tool.

---

## 8. Batch Card Visual Anatomy (The Core UI Unit)

The Deal Card is the most repeated component in Batch. It must work perfectly because users will scan 10–20 of them at once. The layout borrows from StockX (market data density) + Alibaba (trust signals) without copying the visual style of either.

### 8.1 Anatomy of a Batch Card (List View)

```
┌──────────────────────────────────────────────────────────┐
│  [IMPORT BATCH]   Shenzhen 20W Charger Restock  [OPEN ●] │  ← Row 1: Type chip + Title + Status badge
│  Demo Shenzhen Exporter · Shenzhen → Nairobi             │  ← Row 2: Supplier + route
│                                                          │
│  ████████████████░░░░░░░░  76%                          │  ← Row 3: Progress bar (8px height)
│  382 committed · 500 minimum · 618 slots left            │  ← Row 4: Progress metadata
│                                                          │
│  $4.20 /unit   ~~$8.00~~   Save 47%                      │  ← Row 5: Price strip (Mono font)
│                                                          │
│  [2 days left]  [18–30 day delivery]  [⚡ Medium risk]   │  ← Row 6: 3 data chips
│                                         [View Batch →]   │  ← Row 7: CTA
└──────────────────────────────────────────────────────────┘
```

**Exact measurements:**
- Card outer: `padding: 20px 24px`, `border: 1px solid #E5E7EB`, `border-radius: 12px`, `background: #FFFFFF`
- Card hover: `border-color: #1C64F2 (20% opacity)`, `box-shadow: 0 2px 8px rgba(28, 100, 242, 0.08)`
- Row 1: `gap: 8px` between elements. Status badge: `height: 22px`, `padding: 0 8px`, `border-radius: 4px`, `font: 11px/600/uppercase`
- Row 3 bar: `height: 8px`, `border-radius: 4px`, background track `#E5E7EB`, filled `#1C64F2`
- Row 5: Batch price `18px Berkeley Mono 500`. Struck-through normal price `14px Ink-Secondary`. Savings chip: `background: #ECFDF5`, `color: #059669`, `12px/600`
- Row 6 chips: `height: 28px`, `padding: 0 10px`, `border-radius: 20px`, `background: #F3F4F6`, `font: 12px/500`
- Row 7 CTA: `height: 36px`, `padding: 0 16px`, ghost style, right-aligned

### 8.2 Batch Card States

| State | Visual Signal |
|---|---|
| `OPEN` | Blue pulsing dot in status badge. Progress bar blue. |
| `FUNDED` | Emerald badge. Progress bar full emerald. "Supplier confirming" label. |
| `PRODUCTION` | Amber badge. Progress bar grey (funded). Milestone indicator shown. |
| `SHIPPED` | Emerald/blue badge. Tracking chip shown. |
| `FAILED` | Red badge. Bar grey. "Refund in progress" label. Entire card opacity 70%. |

### 8.3 Compact Card (Used in Dashboard sidebar / "Clearing Soon" list)
Single-row format. No progress bar. No chips.
```
┌─────────────────────────────────────────────┐
│ Shenzhen Charger   [OPEN]   $4.20   2d left │
└─────────────────────────────────────────────┘
```
Height: `56px`. `padding: 0 16px`. Divider line between rows.

---

## 9. Terminology System

Every word shown to users must be direct, unambiguous, and consistent. The following are the canonical terms for all UI copy, error messages, CTA labels, and status badges.

### 9.1 Core Actions (CTA Labels)

| Action | Label | Never Say |
|---|---|---|
| Join a batch deal | **Commit** | "Buy", "Add to cart", "Reserve", "Pledge" |
| Exit before clearing | **Transfer Slot** | "Sell", "Cancel order", "Exit position" |
| Confirm goods arrived | **Confirm Delivery** | "Mark received", "Accept order" |
| Move money out | **Withdraw** | "Cash out", "Redeem" |
| Supplier provides evidence | **Upload Proof** | "Submit documents", "Add attachment" |
| Operator unlocks payment | **Approve Release** | "Approve payment", "Release funds" |
| Buyer requests money back | **Request Refund** | "Get refund", "Dispute charge" |

### 9.2 Status Labels (Badges)

| System State | Displayed as | Color |
|---|---|---|
| `OPEN` | **Open** | Blue |
| `FUNDED` | **Clearing** | Emerald |
| `ACTIVE` | **In Production** | Amber |
| `PRODUCTION` | **In Production** | Amber |
| `SHIPPED` | **Shipped** | Blue |
| `RECEIVED_AT_HUB` | **At Hub** | Emerald |
| `FAILED` | **Failed** | Red |

### 9.3 Financial Terms (Shown in UI)

| Technical Term | User-Facing Label |
|---|---|
| Escrow hold | **Protected funds** |
| Escrow release | **Funds released** |
| Commitment | **Slot** (in market context) or **Commitment** (in account context) |
| Allocation | **My allocation** |
| Milestone proof | **Proof** |
| Payout | **Supplier payment** |
| Platform fee | **Service fee** |

### 9.4 Empty States (Short, Direct)
Empty states must not be generic. Each is context-specific.

| Screen | Empty State Text |
|---|---|
| My Commitments (no active) | "No active slots. Browse open batches." |
| Wallet (no transactions) | "No transactions yet." |
| Deliveries (no deliveries) | "Nothing to deliver yet." |
| Operator Disputes (none) | "No open disputes." |
| Supplier Batches (none) | "No batches created yet." |

---

## 10. Loading Strategy — YouTube-Style Progress Bar

### 10.1 Global Page Loader
No full-page spinners. No centred spinning wheels. Batch uses a **top-of-viewport thin progress bar** modelled after YouTube and GitHub.

**Specification:**
- `position: fixed`, `top: 0`, `left: 0`, `z-index: 9999`
- `height: 3px`
- `background: #1C64F2` (brand blue)
- **Behaviour on navigation start:** Instantly appears at `width: 0%`, animates to `70%` over `400ms ease-out` (gives the impression of progress while the page loads).
- **On load complete:** Jumps to `100%` over `200ms`, then fades out with `opacity: 0` over `300ms`. Element then unmounts.
- **On error:** Bar turns `#DC2626` (red), completes to 100%, fades out.
- **Implementation:** Use the `nprogress` library or a lightweight custom implementation with a CSS transition.

### 10.2 Component-Level Skeleton Loaders
When individual data components are fetching (e.g., the escrow balance, a batch card list), they show skeleton screens matching the exact geometry of the data they represent.

**Skeleton Base Styles:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #F3F4F6 25%,     /* base grey */
    #E5E7EB 50%,     /* slightly lighter shimmer */
    #F3F4F6 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Skeleton Variants:**
- **Text line:** `height: 14px`, `border-radius: 4px`, varying widths (`60%`, `80%`, `40%`).
- **Badge:** `height: 22px`, `width: 64px`, `border-radius: 4px`.
- **Financial value:** `height: 28px`, `width: 120px`, `border-radius: 4px`.
- **Progress bar:** `height: 8px`, `width: 100%`, `border-radius: 4px`.
- **Full card skeleton:** Matches card dimensions with skeleton blocks in place of each data row.
- **Avatar skeleton:** `40x40px` circle, `border-radius: 50%`.

### 10.3 Instant Feedback on User Actions (Optimistic UI)
When a user clicks **Commit**, do not wait for the server. Immediately:
1. Disable and animate the CTA button (spinner replaces label text inside button, button stays same size).
2. On success: Transition to the receipt step.
3. On failure: Restore the button, show an inline error below the CTA. Error text: `13px`, `#DC2626`. No modal. No page reload.

---

## 11. Error Isolation — Frontend Crash Containment

### 11.1 The Principle
No single component failure should cascade. If the Delivery Tracking API returns 500, the user's Wallet balance must remain fully interactive. This is implemented via **React Error Boundaries** placed strategically at the zone level, not at the page level.

### 11.2 Zone Boundaries (What to Wrap)
Each of these zones is wrapped in its own independent Error Boundary:

| Zone | Boundary Scope | Fallback UI |
|---|---|---|
| KPI Stats Strip | Per-card | Grey skeleton card, no value shown |
| Batch Card Feed | Entire list | "Batches temporarily unavailable. Try refreshing." |
| Market Box (sticky CTA) | The entire right-column box | "This batch's live data is temporarily unavailable." + refresh icon |
| Delivery Tracker (stepper) | Stepper component only | "Delivery tracking unavailable." + grey icon |
| Escrow Ledger | Ledger table | "Ledger temporarily unavailable." |
| Supplier Milestone Tracker | Per-milestone-row | Individual row shows dashed border + "Unavailable" |
| Operator Table | Per table | "Data unavailable. Last updated: [timestamp]" |

### 11.3 Fallback UI Anatomy
Every fallback must be:
- `background: #F9FAFB`, `border: 1px dashed #E5E7EB`, `border-radius: 12px`
- Icon: `lucide-alert-circle`, `20x20px`, `color: #9CA3AF`
- Text: `13px`, `Ink-Secondary`. Maximum 1 line.
- Optional: Retry button. Ghost, `height: 32px`. On click: clears the error boundary and remounts the component.

---

## 12. Responsive Behaviour — Breakpoints & Per-Screen Rules

### 12.1 Breakpoint System

| Name | Range | Context |
|---|---|---|
| `mobile` | `< 640px` | Phone, PWA |
| `tablet` | `640px – 1024px` | iPad, small laptop |
| `desktop` | `1024px – 1440px` | Standard laptop/monitor |
| `wide` | `> 1440px` | Large monitor, operator consoles |

### 12.2 Per-Screen Responsive Behaviour

**Sidebar Navigation:**
- `desktop/wide`: Fixed left sidebar `240px`. Always visible.
- `tablet`: Sidebar collapses to `64px` icon-only rail.
- `mobile`: Sidebar hidden. Replaced by **bottom tab bar** (`height: 64px`, 5 icons: Batches, Commitments, Wallet, Deliveries, Profile).

**Buyer Dashboard (`/app`):**
- `desktop`: 4 KPI cards in a row, then 60/40 two-column layout.
- `tablet`: 2 KPI cards per row (2×2 grid), two-column collapses to stacked single column.
- `mobile`: KPI cards scroll horizontally (snapping carousel, `overflow-x: scroll; scroll-snap-type: x mandatory`). Below: single column list.

**Live Batches Market (`/batches`):**
- `desktop`: Filter sidebar `240px` left, card feed right.
- `tablet`: Filters collapse into a slide-up sheet triggered by "Filter" button. Card feed full width.
- `mobile`: Filter button in top bar (icon + label). Card feed full width. Each card is slightly tighter (`padding: 16px 16px`).

**Batch Deal Room (`/batches/[slug]`):**
- `desktop`: 58/42 two-column. Right column sticky.
- `tablet`: Right column (Market Box) moves to **bottom of left column** but stays in normal document flow.
- `mobile`: Left column first (narrative, timeline). Market Box is a **sticky bottom bar** (`position: fixed; bottom: 0`), showing price + "Commit Funds" CTA only. Tapping expands to a full bottom sheet drawer.

**Commit Flow Drawer:**
- `desktop/tablet`: Right-side slide-over drawer, `width: 480px`.
- `mobile`: Full-screen bottom sheet drawer, slides up from bottom. Steps render as full-width stacked form.

**Wallet & Escrow (`/app/wallet`):**
- All breakpoints: Single column, max `680px`. Centers on desktop. Full width on mobile. No layout change needed.

**User Profile (`/app/profile`):**
- `desktop`: Two-column (left `320px` fixed, right fluid).
- `tablet`: Two-column collapses to single column, sections stacked.
- `mobile`: Single column. Avatar block goes to full-width centered. Cards stack vertically.

**Supplier — Create Batch Wizard:**
- `desktop`: Two-column form (inputs left, live preview right).
- `tablet/mobile`: Single column. Live preview is removed; replaced by a collapsible "Preview" button.

**Operator Console (`/admin`):**
- `desktop/wide`: Full sidebar + dense table views. This is the primary target.
- `tablet`: Sidebar collapses to icon rail. Tables remain but columns reduce (hide lower-priority columns like "Days Open").
- `mobile`: Tables collapse to card list view. Each row becomes a card. Actions become a swipe-right gesture or a "..." menu.

### 12.3 Touch Target Rules (Mobile)
- Every tappable element: minimum `44x44px` effective hit area, even if visually smaller.
- Icon buttons with no label: wrap in a `44x44px` transparent hit area.
- Bottom tab bar icons: `48x48px` hit area per tab.
- Quantity selector `+/–` buttons: `52x52px` on mobile (financial inputs require precision).

### 12.4 Image & Asset Responsiveness
- No heavy images in batch cards. Batch cards are data, not product photography.
- Any proof images uploaded by suppliers use `loading="lazy"` and are served via a CDN with `webp` format.
- SVG illustrations (escrow stages, delivery allocation diagrams) scale cleanly at all sizes. Max `width: 100%` on mobile.

---

## 13. Backend Stress Test & API-to-UI Mapping

This section was built by reading every route handler, the full Prisma schema (17 models, 18 enums), the core state machine (18 batch states), and the business rule files in `packages/core`. It maps every backend capability to its correct UI surface, flags gaps in the existing design plan, and specifies exactly what data each screen must fetch and render.

---

### 13.1 Full Batch State Machine — UI Rendering Map

The state machine in `packages/core/src/state-machine.ts` defines 18 states with strict allowed transitions. Every state must render a distinct UI signal to the user. This is the canonical source of truth for badge colors, CTA availability, and card states.

```
DRAFT ──────────────────────► UNDER_REVIEW ──────────────────► OPEN
  │                                │                             │
  └──► CANCELLED              DRAFT (back)                    FUNDED ──► FAILED
                                   └──► CANCELLED               │
                                                         SUPPLIER_CONFIRMING
                                                                 │
                                                          ACTIVE / FAILED
                                                                 │
                                                           PRODUCTION
                                                                 │
                                                            SHIPPED
                                                                 │
                                                        RECEIVED_AT_HUB
                                                                 │
                                                           ALLOCATING
                                                                 │
                                                           DELIVERING
                                                                 │
                                                           DELIVERED ──► SETTLED
                                                                         (terminal)

FAILED ──► REFUNDING ──► REFUNDED (terminal)
Any state ──► DISPUTED ──► ACTIVE | FAILED | REFUNDING | SETTLED | CANCELLED
```

**UI rendering per state:**

| State | Buyer sees | Supplier sees | Operator sees | Badge | CTA available |
|---|---|---|---|---|---|
| `DRAFT` | Hidden | "Draft — complete your batch" | In review queue | Gray | None (buyer) |
| `UNDER_REVIEW` | Hidden | "Awaiting operator review" | "Approve / Reject" | Gray | Operator: Approve |
| `OPEN` | Deal card. Commit CTA live | Progress visible | Live, monitoring | Blue pulse | Buyer: Commit |
| `FUNDED` | "This batch has cleared" | "Confirm your order" | "Move to supplier confirming" | Emerald | Supplier: Confirm |
| `SUPPLIER_CONFIRMING` | "Supplier confirming" | Confirmation form | Deadline clock | Amber | Supplier: Confirm |
| `ACTIVE` | "In production" | Milestone list | Risk view | Amber | Supplier: Upload Proof |
| `PRODUCTION` | "In production" | Milestone checklist | Milestone approval queue | Amber | Operator: Approve Milestone |
| `SHIPPED` | "Shipped" + tracking chip | Shipping proof submitted | Logistics view | Blue | None |
| `RECEIVED_AT_HUB` | "At hub" | Read only | Allocate Deliveries button | Blue | Operator: Allocate |
| `ALLOCATING` | "Preparing your delivery" | Read only | In progress | Blue | None |
| `DELIVERING` | "Out for delivery" | Read only | Tracking view | Blue | Buyer: Confirm Delivery |
| `DELIVERED` | "Confirm receipt" CTA | Read only | Awaiting confirmation | Emerald | Buyer: Confirm Delivery |
| `SETTLED` | "Completed" — view history | "Payment received" | Closed | Emerald | None |
| `FAILED` | "This batch failed. Refund processing." | "Batch failed." | Refund queue | Red | None |
| `REFUNDING` | "Refund in progress" | Read only | Refund approval | Amber | Operator: Approve Refund |
| `REFUNDED` | "Refunded — check wallet" | Read only | Closed | Gray | None |
| `DISPUTED` | "Dispute open" | "Dispute open" | Dispute center | Red | Operator: Resolve |
| `CANCELLED` | Hidden from market | Read only | Closed | Gray | None |

**Stress test finding — DESIGN GAP:** The existing user flow plan only shows `OPEN → FUNDED → PRODUCTION → SHIPPED`. The actual machine has **18 states**, including `SUPPLIER_CONFIRMING`, `ALLOCATING`, `DELIVERING`, `DISPUTED`, `REFUNDING`, `REFUNDED`, `UNDER_REVIEW`. The buyer dashboard and commitment list must handle all of these, not just the 4 happy-path states. Each missing state needs a distinct status badge and UI message.

---

### 13.2 API-to-Screen Mapping (Every Endpoint → Correct UI Component)

#### Public Routes (No auth required)

| Endpoint | Method | Data Returned | Screen / Component | Renders |
|---|---|---|---|---|
| `/api/health` | GET | `{ status, mode }` | Developer panel / status bar | System health indicator |
| `/api/public/batches` | GET | `Batch[]` (seeded or DB) | `/batches` — Market feed | Full deal card list |
| `/api/public/batches/:slug` | GET | `Batch` detail | `/batches/[slug]` — Deal Room | Full deal room page |
| `/api/market/instruments` | GET | Market instrument list | Market tab (future) | Price feed |
| `/api/market/instruments/:symbol` | GET | Single instrument | Instrument detail | Price + depth |
| `/api/market/instruments/:symbol/depth` | GET | Order book depth | Depth chart component | Bid/ask visualization |
| `/api/developers/bot-manifest` | GET | Bot capability manifest | `/developers` page | API key intro |
| `/api/developers/api-map` | GET | Route map JSON | Dev portal | API explorer |

**Stress test — GAP:** The market instruments endpoints (`/api/market/instruments`) are **not referenced anywhere** in the existing user flow. This is the slot-trading / secondary market system. The design plan mentions "Slot Transfer" but has no dedicated market screen for it. This needs a `/market` route with instrument cards and order book depth.

---

#### Auth & Profile Routes

| Endpoint | Method | Request Body | Auth | Screen | Action |
|---|---|---|---|---|---|
| `/api/auth/me` | GET | — | Any | All pages (nav bar) | Populate avatar, name, role |
| `/api/profile` | GET | — | User | `/app/profile` | Load profile settings |
| `/api/profile` | PATCH | `{ displayName, notificationEmail, notificationSms, notificationWhatsapp }` | User | Profile settings card | Save notification prefs |
| `/api/supplier/profile` | GET | — | SUPPLIER | `/supplier` sidebar | Load supplier bio + verification status |
| `/api/supplier/profile` | PATCH | `{ businessName, country }` | SUPPLIER | Supplier profile card | Update business info |

**Schema cross-check:** `Profile` model has `defaultCurrency`, `defaultDeliveryMode`, `notificationEmail`, `notificationSms`, `notificationWhatsapp`. The profile page **must** render all five of these as editable fields — the current design plan only shows three notification toggles. Add `defaultCurrency` selector (dropdown: USD, KES, NGN, GHS) and `defaultDeliveryMode` toggle.

---

#### Buyer Routes

| Endpoint | Method | Request Body | Required Headers | Screen | What to render |
|---|---|---|---|---|---|
| `/api/buyer/dashboard` | GET | — | User (BUYER role) | `/app` | KPI strip: escrow total, active commitments, clearing soon, deliveries |
| `/api/buyer/commitments` | GET | — | User (BUYER role) | `/app/my-batches` | Commitment list with status, escrow amount, batch name |
| `/api/buyer/commitments` | POST | `{ batchId, quantity }` | `Idempotency-Key` header REQUIRED | Commit Flow Step 4 | Creates commitment + ledger draft |

**Critical POST body requirements from `createCommitmentSchema`:**
```json
{
  "batchId": "shenzhen-charger-restock",
  "quantity": 10
}
```
The frontend must send an `Idempotency-Key` UUID header on every POST. If missing, API returns 400. The commit flow drawer must generate this UUID client-side at Step 1 and hold it across all 4 steps.

**Stress test — BUSINESS RULE from `commitments.ts`:**
- Commitment is only accepted if batch `status === "OPEN" || "FUNDED"`.
- If batch `status === "FUNDED"`, the commitment quote returns `lockState: "LOCKED_AFTER_CLEARING"` — meaning the buyer **cannot cancel** after clearing. The commit flow Step 3 Escrow Review panel must show this lock status explicitly: *"This batch has already cleared. Your commitment locks immediately and cannot be cancelled."*
- If batch is `OPEN`, show: *"Refundable if batch does not clear by [deadline]."*
- If `riskLevel === "BLOCKED"`, the core returns `BATCH_RISK_BLOCKED`. The Commit button must check this and show an operator-hold warning instead of the CTA.

---

#### Supplier Routes

| Endpoint | Method | Required Body | Auth | Screen | Action |
|---|---|---|---|---|---|
| `/api/supplier/batches` | GET | — | SUPPLIER | `/supplier` — batch list | List all drafts and live batches |
| `/api/supplier/batches` | POST | See schema below | SUPPLIER + `Idempotency-Key` | Create Batch Wizard Step 4 | Creates DRAFT batch |
| `/api/supplier/proofs` | POST | `{ batchId, milestoneId, proofUrl, proofType }` | SUPPLIER + `Idempotency-Key` | Milestone Tracker | Submit milestone proof |
| `/api/uploads/proofs` | POST | `FormData { file }` | SUPPLIER | Proof upload drawer | Upload file, get `fileUrl` back to use in proofs POST |

**Create Batch POST body from `supplierBatchDraftSchema`:**
```json
{
  "title": "Shenzhen Charger Restock",
  "summary": "Bulk phone charger import for Nairobi merchants",
  "type": "IMPORT_BATCH",
  "minimumUnits": 500,
  "targetUnits": 1000,
  "currency": "USD",
  "deliveryMode": "HUB_PICKUP"
}
```
The wizard Step 1 maps to `title` + `summary` + `type`. Step 2 maps to `minimumUnits` + `targetUnits` + `currency`. Step 3 maps to `deliveryMode`. The wizard does NOT yet support `BatchTier` creation — that is a future endpoint. The UI must not show tier pricing inputs until that endpoint exists.

**Schema cross-check:** `MilestoneProof` requires `proofType` (one of: `INVOICE | PRODUCTION_PHOTO | INSPECTION_REPORT | WAREHOUSE_RECEIPT | SHIPPING_DOCUMENT | CUSTOMS_DOCUMENT | DELIVERY_SCAN`). The upload drawer must include a `proofType` dropdown — the current design plan omits this field entirely.

---

#### Operator Routes

| Endpoint | Method | Body | Auth | Screen | Action |
|---|---|---|---|---|---|
| `/api/operator/overview` | GET | — | OPERATOR/ADMIN | `/admin` — overview tiles | Stuck batches, disputes, overdue milestones |
| `/api/operator/escrow` | GET | — | OPERATOR/ADMIN | `/admin/escrow` | Ledger: `{ entries[], totals: { held, pendingRelease, pendingRefund } }` |
| `/api/operator/disputes` | GET | — | OPERATOR/ADMIN | `/admin/disputes` | Open disputes list |
| `/api/operator/disputes` | POST | `{ batchId, reason, action }` | OPERATOR/ADMIN | Dispute form | Open or update dispute |
| `/api/operator/batches/:slug/transition` | POST | `{ to: BatchStatus, reason: string }` | OPERATOR/ADMIN + `Idempotency-Key` | Batch intervention panel | Trigger state transition |
| `/api/operator/batches/:slug/allocate-deliveries` | POST | `{ courier? }` | OPERATOR/ADMIN + `Idempotency-Key` | Delivery allocation action | Move batch to ALLOCATING |
| `/api/operator/commitments/:commitmentId/refund` | POST | `{ reason: string (min 5 chars) }` | OPERATOR/ADMIN + `Idempotency-Key` | Refund queue action | Trigger commitment refund |
| `/api/operator/milestones/:milestoneId/approve-payout` | POST | `{ amount, currency }` | OPERATOR/ADMIN + `Idempotency-Key` | Milestone approval panel | Release funds to supplier |

**Stress test — TRANSITION VALIDATION:** The transition route calls `assertTransition(from, to)`. The operator UI must **only show the allowed next states as options** — never the full 18-state list. The transition selector is a dropdown that queries current batch state and renders only valid transitions.

Example: If batch is `FUNDED`, valid transitions = `[SUPPLIER_CONFIRMING, FAILED, DISPUTED]`. The dropdown shows only those 3 options. Not all 18.

**Stress test — REFUND VALIDATION:** The refund `reason` field requires minimum 5 characters. The refund form must show character count and block submission below 5 chars. Inline validation, not a modal error.

---

#### Payment Routes

| Endpoint | Method | Body | Auth | Screen | Notes |
|---|---|---|---|---|---|
| `/api/payments/webhooks/:provider` | POST | Provider event payload | Public (webhook) | No UI | Supported providers: `circle`, `arc`, `mock`, `local`. Creates `PaymentEvent` record before processing. |

**Stress test — NO PAYMENT CAPTURE UI YET:** The database has `PaymentStatus` enum (`NOT_STARTED → INTENT_CREATED → HELD → CAPTURED → FAILED → REFUNDED`) and `EscrowStatus` (`NOT_HELD → HELD → LOCKED → PARTIALLY_RELEASED → RELEASED → REFUNDING → REFUNDED`). But there is no `/api/payments/commitment-intent` route implemented yet. The commit flow currently mocks payment. The UI must show a "Payment processing" holding state and must NOT show final escrow confirmation until the payment webhook fires. This is a critical flow gap.

---

### 13.3 Database Models → UI Requirements (Schema-to-Screen)

**`BatchSlotTransfer` model (DB exists, no route exists yet):**
The schema has `BatchSlotTransfer` with `fromBuyerId`, `toBuyerId`, `quantity`, `transferAmount`, `status`. But there is no implemented API route for slot transfers. The "Transfer Slot" CTA in the design plan must be marked as **Phase 2** in the UI with a disabled state and "Coming soon" label until the route is built.

**`OrderAllocation` model (DB exists, `allocate-deliveries` route exists):**
The allocation has `deliveryMode`, `deliveryStatus`, `trackingCode`, `pickupCode`. The delivery tracking screen must display `trackingCode` for courier deliveries and `pickupCode` for hub pickups. Both fields must be rendered differently — trackingCode is a link to carrier tracking, pickupCode is a large QR-code-ready display (copy to clipboard).

**`AuditEvent` model (DB exists, no read route exposed yet):**
The operator audit log screen needs a `GET /api/admin/audit` route. This is documented in `docs/02-api-contract.md` but **not yet implemented**. Operator console audit log must show a "Not yet connected" empty state with an explanation, not a blank table.

**`IdempotencyRecord` model:**
Every POST from the frontend must generate a UUID v4 `Idempotency-Key` header. The frontend should use a helper: `crypto.randomUUID()` (available natively in all modern browsers and Node 20+). This key must be generated **once per user intent** and held across retries, not regenerated on each retry.

---

### 13.4 User Flow — Corrected & Stress-Tested

The following replaces the simplified flow in Section 5. It reflects what the backend actually supports today.

```
ENTRY
  └─ Splash (/) → Login → Role detected from JWT (BUYER | SUPPLIER | OPERATOR | ADMIN)

BUYER FLOW — fully mapped to live endpoints
  └─ Dashboard (/app)
       API: GET /api/buyer/dashboard → KPI cards
       API: GET /api/auth/me → avatar + name
       │
       ├─ Live Batches (/batches)
       │    API: GET /api/public/batches → deal card list
       │    Filter: status=OPEN (client-side filter on response array)
       │    │
       │    └─ Batch Deal Room (/batches/[slug])
       │         API: GET /api/public/batches/:slug → full batch data
       │         Renders: state-dependent UI (see 13.1 table)
       │         │
       │         └─ Commit Flow (drawer, no navigation)
       │              Step 1: Quantity + live total calc (client-side)
       │              Step 2: Delivery method selection (client-side)
       │              Step 3: Escrow breakdown (client-side calc from batch data)
       │                  — Shows lockState from quoteCommitment() result
       │              Step 4: API POST /api/buyer/commitments
       │                  Headers: Idempotency-Key (UUID generated at Step 1)
       │                  Body: { batchId, quantity }
       │              Step 5: Receipt screen (renders API response)
       │
       ├─ My Commitments (/app/my-batches)
       │    API: GET /api/buyer/commitments → list
       │    States to handle: PENDING_PAYMENT | ACTIVE | CANCELLED | LOCKED |
       │                      ALLOCATED | DELIVERED | REFUNDED | DISPUTED
       │    CTA map:
       │      ALLOCATED → "Track Delivery"
       │      DELIVERED → "Confirm Delivery" (not yet implemented — Phase 2)
       │      ACTIVE + batch OPEN → "Transfer Slot" (Phase 2 — disabled)
       │      DISPUTED → "View Dispute"
       │
       ├─ Wallet (/app/wallet)
       │    API: GET /api/operator/escrow (shared endpoint, buyer-scoped view)
       │    NOTE: No dedicated /api/buyer/wallet route exists yet.
       │    Renders: held total, ledger entries filtered to user's commitments
       │
       ├─ Deliveries (/app/deliveries)
       │    API: No dedicated route yet. Uses commitment data from /api/buyer/commitments
       │    OrderAllocation: trackingCode (courier link) | pickupCode (hub QR)
       │    States: NOT_READY | READY_FOR_DISPATCH | IN_TRANSIT | AT_HUB |
       │            OUT_FOR_DELIVERY | READY_FOR_PICKUP | DELIVERED | FAILED | DISPUTED
       │
       └─ Profile (/app/profile)
            API: GET /api/profile → load
            API: PATCH /api/profile → save (notificationEmail, notificationSms,
                 notificationWhatsapp, defaultCurrency, defaultDeliveryMode)

SUPPLIER FLOW
  └─ Dashboard (/supplier)
       API: GET /api/supplier/batches → batch list
       API: GET /api/supplier/profile → business name, verification badge
       │
       ├─ Create Batch Wizard (/supplier/batches/new)
       │    API: POST /api/supplier/batches
       │    Body: title, summary, type, minimumUnits, targetUnits, currency, deliveryMode
       │    Returns: DRAFT batch with ID
       │    NOTE: Tier pricing requires separate endpoint (not yet built — Phase 2)
       │
       └─ Batch Detail + Milestone Tracker (/supplier/batches/[id])
            API: GET /api/supplier/batches/:id (not implemented — uses list for now)
            Milestone proofs:
              Step 1: Upload file → POST /api/uploads/proofs → returns fileUrl
              Step 2: Submit proof → POST /api/supplier/proofs
                Body: { batchId, milestoneId, proofUrl: fileUrl, proofType }
                proofType dropdown: INVOICE | PRODUCTION_PHOTO | INSPECTION_REPORT |
                                    WAREHOUSE_RECEIPT | SHIPPING_DOCUMENT |
                                    CUSTOMS_DOCUMENT | DELIVERY_SCAN

OPERATOR FLOW
  └─ Console (/admin)
       API: GET /api/operator/overview → overview tiles
       │
       ├─ Escrow Ledger (/admin/escrow)
       │    API: GET /api/operator/escrow
       │    Renders: totals block + ledger entry table
       │    Entry types: BUYER_COMMITMENT_HOLD | BUYER_COMMITMENT_CAPTURE |
       │                 PLATFORM_FEE | SUPPLIER_MILESTONE_RELEASE |
       │                 LOGISTICS_PAYOUT | REFUND | SUPPLIER_BOND_HOLD |
       │                 SUPPLIER_BOND_RELEASE | SUPPLIER_BOND_PENALTY
       │
       ├─ Batch Interventions (inline panel in /admin)
       │    API: POST /api/operator/batches/:slug/transition
       │    Body: { to: [ALLOWED_NEXT_STATES_ONLY], reason: string }
       │    UI: Dropdown must be pre-filtered to valid next states only
       │    API: POST /api/operator/batches/:slug/allocate-deliveries
       │    Body: { courier? }
       │
       ├─ Refund Queue (/admin/disputes or inline)
       │    API: POST /api/operator/commitments/:commitmentId/refund
       │    Body: { reason } — min 5 chars, validated inline
       │
       ├─ Milestone Approval (/admin)
       │    API: POST /api/operator/milestones/:milestoneId/approve-payout
       │    Body: { amount, currency }
       │
       ├─ Disputes (/admin/disputes)
       │    API: GET /api/operator/disputes
       │    API: POST /api/operator/disputes
       │
       └─ Audit Log (/admin/audit)
            API: Not yet implemented — show empty state with note
```

---

### 13.5 Confirmed Phase 2 Items (Not Blocking, Must Show Disabled State)

The following are fully modeled in the database but have no live API route yet. The UI must handle them gracefully with disabled states — not hide them entirely.

| Feature | DB Model | API Route | UI Treatment |
|---|---|---|---|
| Slot Transfer | `BatchSlotTransfer` | None | "Transfer Slot" button: disabled, tooltip "Coming soon" |
| Buyer wallet endpoint | `EscrowLedgerEntry` | None (uses operator endpoint) | Wallet screen works, note: data is operator-level for now |
| Buyer delivery confirm | `OrderAllocation` | None | "Confirm Delivery" disabled until route is built |
| Supplier batch detail | `Batch` | None (uses list) | Batch detail uses list data |
| Tier pricing | `BatchTier` | None | Tier section in wizard: "Price tiers — coming soon", not editable |
| Payout management | `Payout` | None exposed | Supplier payout section: disabled state |
| Audit log read | `AuditEvent` | None | Operator audit log: "Not connected" state with timestamp |

---

## 14. Update: 7 New Commits from origin/main

Fetched and merged `ccf13b6..4ade2fa` on 2026-05-19. Every new file has been read. This section documents what changed, what it means for the UI, and what the design plan must be updated to reflect.

### 14.1 Commit Summary

| Commit | Title | What it adds |
|---|---|---|
| `d6ff263` | Slots: add delivery rights and transferable batch positions | `BatchSlot`, `DeliveryProfile`, `DeliverySnapshot`, `BatchSlotListing`, `BatchSlotOrder` models. Slot status flow. Listing/P&L/cancel rules. |
| `4e287aa` | Slots: wire commitment slots and delivery lock | Auto slot creation on commitment. Delivery profile selection. Listing purchase. Partial split. `POST /api/operator/batches/:slug/lock-delivery`. |
| `fc9e2ff` | Bots: add scoped access and slot order matching | Bot scope enforcement via `x-batch-bot-key` header. `POST /api/slots/orders`. Internal slot matching service. OpenAPI spec. |
| `8b55bfb` | Bots: add database-backed API keys | `BotApiKey` model. SHA-256 key hashing. `GET/POST /api/developers/api-keys`. `POST /api/developers/api-keys/:keyId/revoke`. |
| `5ad9e71` | Market: add slot order lifecycle and UI entry points | `GET /api/slots/orders`. `POST /api/slots/orders/:orderId/reserve`. New frontend pages: `/app/slots`, `/app/slot-orders`, `/developers/api-keys`. |
| `09f9e9e` | Finance: add SPV-ready ledger accounts and slot payment holds | `LedgerAccount` model. 6 account types. `GET/POST /api/operator/batches/:slug/ledger-accounts`. Slot transfer hold/complete routes. `/operator/finance` page. |
| `4ade2fa` | Ledger: add posting controls and reconciliation view | `ledger-posting-service.ts`. `GET/POST /api/operator/batches/:slug/ledger-postings`. Reconciliation route `?view=reconcile`. 3 new ledger entry types: `SLOT_TRANSFER_HOLD`, `SLOT_TRANSFER_SETTLEMENT`, `SLOT_TRANSFER_FEE`. |

---

### 14.2 New UI Surfaces — Pages Added or Now Required

The following pages are now backend-supported and must be built:

#### `/app/slots` — My Slots (Buyer)
**Was:** Planned as Phase 2 / disabled state.
**Now:** Backend exists. Slots are auto-created when a buyer commitment is confirmed. This is a live screen.

**Data source:** `GET /api/slots`
**Auth:** BUYER role + `slots:read` scope (bot) or session (human)

**What to render:**
- List of the buyer's `BatchSlot` records.
- Each slot row:
  - Batch name + batch status badge
  - Slot status badge (`ACTIVE | LISTED | RESERVED | TRANSFERRING | TRANSFERRED | LOCKED | DELIVERED | REFUNDED | DISPUTED`)
  - Quantity (e.g., "10 units")
  - Entry price (Mono, `14px`) + current market ask if listed
  - P&L display: use `calculateSlotPnL()` output — show `net` value in green (positive) or red (negative), `returnPercent` as a percentage badge
  - Delivery lock status: if `deliveryLockAt` has passed → show "Delivery locked" amber chip
  - CTAs per status:
    - `ACTIVE` → "List for Transfer" (enabled)
    - `LISTED` → "Cancel Listing" (enabled)
    - `LOCKED` → "Locked" (disabled chip, not a button)
    - `DELIVERED` → "View Delivery" (link)

**Slot P&L display component:**
- Uses `calculateSlotPnL({ entryUnitPrice, exitUnitPrice, quantity, transferFeeAmount })`
- `gross`, `fees`, `net`, `returnPercent` — all from `packages/core/src/slots.ts`
- Net positive: `color: #059669`, prefix `+`
- Net negative: `color: #DC2626`, prefix `–`
- Return percent badge: same color, `(+12.4%)` format
- Font: `Berkeley Mono` for all numeric values

---

#### `/app/slot-orders` — Slot Orders (Buyer)
**Data sources:**
- `GET /api/slots/orders` — list buyer's orders
- `POST /api/slots/orders/:orderId/reserve` — reserve a matched listing
- `POST /api/slots/orders/:orderId/cancel` — cancel open order

**What to render:**
- Tabs: "Open" | "Reserved" | "Filled" | "Cancelled"
- Each order row:
  - Batch name, quantity, limit price (Mono), status badge
  - Matched listing: ask price vs. limit price comparison
  - CTA: "Reserve" (if matched, not yet reserved), "Cancel" (if `OPEN` or `PARTIALLY_FILLED`)
- **Cancel validation:** `canCancelMarketOrder()` checks `status` is `OPEN` or `PARTIALLY_FILLED`. Button must be disabled for any other status with tooltip "Order cannot be cancelled."
- **Reserve flow:** `POST /api/slots/orders/:orderId/reserve` creates a `HELD` transfer. Show inline confirmation: "Order reserved — payment confirmation pending."

---

#### `/app/slots/listings/new` — List a Slot (Drawer, not a page)
**Trigger:** "List for Transfer" CTA on the My Slots page.
**Render as:** Right-side drawer (same pattern as Commit Flow).

**Form fields:**
- Ask price per unit (Mono input, `52px` height, financial precision)
- Quantity to list (1 to slot.quantity)
- Transfer fee preview (auto-calculated using `calculateTransferFee({ transferAmount, feeBps: 150 })`)
- Lock warning: if `deliveryLockAt` is within 24h → amber alert: "Delivery locks in [time]. Listed slots that haven't transferred will lock."

**Submit:** `POST /api/slots/listings` with `Idempotency-Key`

**Listing rules enforced client-side before submit (from `canListSlot()`):**
- Slot must be `ACTIVE` or `LISTED`
- Batch must not be in `ALLOCATING | DELIVERING | DELIVERED | SETTLED | FAILED | REFUNDING | REFUNDED | DISPUTED | CANCELLED`
- `deliveryLockAt` must not have passed
- `transferableQuantity` must be > 0

---

#### `/app/slots/pnl` — P&L Dashboard
**Data source:** `GET /api/slots/pnl`
**Scope:** `slots:pnl:read`

**What to render (Wise-style clarity):**
```
Realized P/L:       +$42.00
Unrealized P/L:     +$18.50   (from active listings at current ask)
Transfer fees paid:  –$3.20
Net result:         +$57.30
```
- All values in `Berkeley Mono 24px`
- Color-coded: positive = emerald, negative = red
- Below totals: a table of individual closed slot transfers with entry price, exit price, quantity, net P&L per transfer

---

#### `/developers/api-keys` — Developer Portal (Bot API Keys)
**Data sources:**
- `GET /api/developers/api-keys` — list keys
- `POST /api/developers/api-keys` — create key (raw key shown ONCE)
- `POST /api/developers/api-keys/:keyId/revoke` — revoke key

**Layout:** Full-width single column. Max `800px`.

**Create Key Form:**
- Input: Key name (`44px`)
- Scope checkboxes (one per scope, with description):
  - `market:read` — Read open batch markets
  - `market:depth:read` — Read order book depth
  - `orders:create` — Place slot buy orders
  - `orders:cancel` — Cancel open orders
  - `slots:read` — Read owned slots
  - `slots:listings:create` — List slots for transfer
  - `slots:listings:purchase` — Purchase slot listings
  - `slots:pnl:read` — Read P&L data
  - `delivery:read` — Read delivery profiles
  - `delivery:write` — Update delivery details
- Optional expiry date picker
- Submit: "Generate Key" primary CTA

**Raw key display (ONE-TIME reveal):**
- After creation: amber alert banner: "Copy this key now. It will not be shown again."
- Key displayed in a monospace box (`background: #0D1117`, `color: #10B981`, `font: Berkeley Mono 14px`, `padding: 16px`, `border-radius: 8px`)
- Copy button adjacent

**Key list table:**
- Columns: Name, Prefix (`sk_•••`), Scopes (chip list), Status, Last used, Expires, Actions
- Action: "Revoke" — red text button, confirmation inline popover (not modal): "Revoke this key? This cannot be undone." with "Confirm" red button.
- Revoked keys: greyed row, status badge "Revoked", no action available

---

#### `/operator/finance` — Finance & Ledger Accounts (Operator)
**Data sources:**
- `GET /api/operator/batches/:slug/ledger-accounts` — list accounts
- `POST /api/operator/batches/:slug/ledger-accounts` — create account
- `GET /api/operator/batches/:slug/ledger-postings` — list postings
- `POST /api/operator/batches/:slug/ledger-postings` — post ledger entry
- `GET /api/operator/batches/:slug/ledger-postings?view=reconcile` — reconciliation view

**Layout:** Sidebar nav + tabbed main area.

**Tab 1 — Ledger Accounts:**
- Table: Account type, Label, Currency, Balance (Mono), Status, External provider (if set)
- Account types rendered with distinct icons:
  - `BATCH_ESCROW` → Shield icon
  - `SUPPLIER_PAYABLE` → User icon
  - `LOGISTICS_PAYABLE` → Truck icon
  - `PLATFORM_FEE` → Percent icon
  - `REFUND_RESERVE` → RotateCcw icon
  - `SPV_CONTROL` → Building icon

**Tab 2 — Ledger Postings:**
- Table: Entry ID (Mono, 8 chars), Type, Amount, Currency, Account, Source → Destination, Status, Timestamp
- New entry types to show: `SLOT_TRANSFER_HOLD`, `SLOT_TRANSFER_SETTLEMENT`, `SLOT_TRANSFER_FEE`
- "Post Entry" button → right-side drawer with form: account type, entry type, amount, currency, idempotency key (auto-generated)

**Tab 3 — Reconciliation:**
- `GET /api/operator/batches/:slug/ledger-postings?view=reconcile`
- Shows: account count, posted entry count, account balance total vs. posted entry total
- If they match → emerald "Balanced" badge
- If they differ → amber "Discrepancy" badge + the delta amount in red Mono

---

### 14.3 Updated Commit Flow — `deliveryProfileId` is Now Accepted

**From doc 21 (`slots.ts`):** `POST /api/buyer/commitments` now accepts an optional `deliveryProfileId`:

```json
{
  "batchId": "shenzhen-charger-restock",
  "quantity": 10,
  "deliveryProfileId": "dp_abc123"
}
```

**Commit Flow Step 2 update:**
- Previously: "Hub Pickup / Direct Delivery" radio cards.
- Now: First, show saved `DeliveryProfile` records from `GET /api/profile/delivery`.
- Each profile: label, address, delivery mode. Radio select.
- "Use default profile" auto-selects the buyer's default.
- "Add new address" → POST to `POST /api/profile/delivery` before proceeding.
- Selected `profileId` is passed as `deliveryProfileId` in the commitment POST.

**When the commitment is created, the backend auto-creates:**
1. `Commitment` record
2. `BatchSlot` record (the buyer's tradeable position)
3. `DeliverySnapshot` (a frozen copy of the chosen delivery profile — this is what matters for routing, not the live profile)
4. `EscrowLedgerEntry`
5. `AuditEvent`

---

### 14.4 Delivery Profile Management — New Dedicated Routes

**From doc 20:** Two new routes now exist:
- `GET /api/profile/delivery` — list delivery profiles
- `POST /api/profile/delivery` — create delivery profile

**Profile & Settings page update (Section 6.10):**
The "Delivery Profiles" card must now fetch from `GET /api/profile/delivery` — not just render static data.

**DeliveryProfile fields to render:**
- Label (e.g., "Home", "Office", "Nairobi Hub")
- Recipient name, phone, country, city, address / hub code
- Delivery mode
- Default flag (radio select)

**Edit delivery profile:** This field is locked after `deliveryLockAt` has passed for any associated batch. Show lock indicator on the specific profile row.

---

### 14.5 New Ledger Entry Types — UI Impact

Three new `LedgerEntryType` values added in doc 26:
- `SLOT_TRANSFER_HOLD` — Money held when a slot order is reserved
- `SLOT_TRANSFER_SETTLEMENT` — Money released to seller on slot transfer completion
- `SLOT_TRANSFER_FEE` — Platform fee on the slot transfer

**Wallet screen (Section 6.8) and Operator Escrow Ledger (Section 6.14) must:**
- Render these 3 new types in the ledger event table
- Icon coding for wallet:
  - `SLOT_TRANSFER_HOLD` → Lock icon, Blue
  - `SLOT_TRANSFER_SETTLEMENT` → ArrowUpRight icon, Emerald (you received)
  - `SLOT_TRANSFER_FEE` → Minus icon, Gray

---

### 14.6 Bot Access Flow — Developer Portal Context

From docs 22 and 23, bots authenticate via:
1. **Demo/local mode:** `x-batch-bot-key` + `x-batch-bot-scopes` headers (no DB needed)
2. **Database mode:** `x-batch-bot-key` → SHA-256 hash → `BotApiKey` lookup → scope enforcement

**The developer portal page must explain this clearly:**
- Two-mode explanation: "Sandbox" (header-only) vs. "Live" (database-backed key)
- A mode toggle indicator in the top bar of the developer portal (shows current persistence mode)
- Code snippet showing how to attach the key to requests:
```
x-batch-bot-key: sk_live_your_key_here
```
- Link to `docs/openapi/batch-api.yaml` (now exists in the repo)

---

### 14.7 Delivery Lock — New Operator Action

**New route:** `POST /api/operator/batches/:slug/lock-delivery`

**Effect:**
- Sets `batch.deliveryLockAt` to now
- Locks all `ACTIVE`, `LISTED`, `RESERVED` slots
- Locks all `ACTIVE` delivery snapshots
- Locks all `OPEN`, `RESERVED` slot listings
- Writes audit event

**Operator Console — Batch Interventions panel update:**
Add "Lock Delivery" as a new action button. `Height: 32px`. Amber-bordered ghost button (distinct from the danger red of "Cancel"). Confirmation popover: "Lock delivery for this batch? Buyers will no longer be able to transfer slots or change delivery details."

---

### 14.8 Revised Navigation Structure (All Portals)

The merge added 3 new confirmed app pages. Navigation must be updated.

**Buyer sidebar / bottom tab bar:**
```
Batches          (was: Batches)
My Slots         (NEW — /app/slots)
Slot Orders      (NEW — /app/slot-orders)
My Commitments   (was: My Commitments)
Wallet           (was: Wallet)
Deliveries       (was: Deliveries)
Profile          (was: Profile)
```
On mobile bottom tab bar: 5 slots max. Group "My Slots" and "Slot Orders" under a "Market" tab that expands.

**Developer portal nav:**
```
API Overview     (/developers)
API Keys         (NEW — /developers/api-keys)
API Reference    (link to openapi yaml)
Sandbox          (/developers/sandbox)
```

**Operator console nav:**
```
Overview         (/admin)
Escrow Ledger    (/admin/escrow)
Batch Finance    (NEW — /operator/finance)
Disputes         (/admin/disputes)
Supplier Review  (/admin/suppliers)
Audit Log        (/admin/audit)
```

---

### 14.9 Phase 2 Table — Revised

The Phase 2 table from Section 13.5 is now partially promoted to Phase 1 based on the new commits:

| Feature | Was | Now |
|---|---|---|
| Slot Transfer | Phase 2 disabled | **Phase 1 — routes exist** |
| Delivery Profiles | Not planned | **Phase 1 — routes exist** |
| Bot API Keys | Not planned | **Phase 1 — routes exist** |
| Slot P&L | Phase 2 | **Phase 1 — route exists** |
| Ledger Accounts | Not planned | **Phase 1 — routes exist** |
| Ledger Postings | Not planned | **Phase 1 — routes exist** |
| Slot Orders | Phase 2 | **Phase 1 — routes exist** |
| Reconciliation | Not planned | **Phase 1 — route exists** |
| Tier Pricing | Phase 2 | Still Phase 2 — no route |
| Payout management (supplier) | Phase 2 | Still Phase 2 — no route |
| Audit log read | Phase 2 | Still Phase 2 — no route |
| Buyer delivery confirm | Phase 2 | Still Phase 2 — no route |
