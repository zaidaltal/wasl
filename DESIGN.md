# Wasl Design System

Extracted from the Stitch project **"Wasl Freelance Marketplace UI"** (ID `8124980371629565488`),
screens: Landing Page, Create Account, Sign In. A LinkedIn/Upwork-style professional SaaS look —
deep corporate blue primary, slate-navy dark panels, ivory surfaces, pill-shaped buttons, Inter type.

> **Brand rule:** Red (`#CE1126`) is reserved for the **logo only**. No red anywhere else in the UI.

---

## Colors

### Core
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#004e99` | Primary blue — links, active nav, prices, icons |
| `primary-container` | `#0a66c2` | LinkedIn-blue — main CTA fills (Sign Up, Find Talent, Create Account) |
| `surface-tint` | `#005eb5` | Tint / gradients |
| `on-primary-fixed-variant` | `#00468a` | Primary button hover (darker) |
| `text-primary` | `#0F172A` | Headlines, body text **and** the dark split-panel background |
| `text-muted` | `#64748B` | Secondary/body copy, captions |
| `secondary` | `#565e74` | Tertiary text |

### Surfaces
| Token | Hex | Usage |
|---|---|---|
| `surface` / `background` | `#f8f9fb` | Page background (ivory-grey) |
| `surface-white` | `#FFFFFF` | Cards, form panel, nav bar |
| `surface-container` | `#edeef0` | Skill-tag / chip background |
| `surface-container-low` | `#f2f4f6` | Subtle alt section bg |
| `secondary-container` | `#dae2fd` | Light-blue badge / category icon bg |
| `cta-navy` | `#1E3A5F` | CTA banner block background |

### Lines & states
| Token | Hex | Usage |
|---|---|---|
| `outline-variant` | `#c1c6d4` | Default borders, dividers |
| `outline` | `#727783` | Stronger borders (social buttons) |
| `success` | `#16A34A` | "Available" badge, success states |
| `error` | `#ba1a1a` | Error states |
| `logo-red` | `#CE1126` | **Logo only** |

### Dark-panel accents (on `#0F172A`)
| Token | Hex | Usage |
|---|---|---|
| `primary-fixed-dim` | `#a8c8ff` | Light-blue text/icons on dark |
| `secondary-fixed-dim` | `#bec6e0` | Muted text on dark |
| `on-tertiary-container` | `#dbe7ff` | Footer link text |
| dot-grid | `rgba(255,255,255,0.05)` | 1px radial dots, 24px grid |

---

## Typography

**Family:** `Inter` (weights 400, 500, 700, 800). Arabic fallback: `Noto Naskh Arabic`.

| Style | Size | Line / Tracking | Weight |
|---|---|---|---|
| `headline-xl` | 48px | 1.1 / -0.02em | 800 |
| `headline-lg` | 32px | 1.2 / -0.01em | 700 |
| `headline-lg-mobile` | 28px | 1.2 | 700 |
| `headline-md` | 24px | 1.3 | 700 |
| `body-lg` | 18px | 1.6 | 400 |
| `body-md` | 16px | 1.5 | 400 |
| `body-sm` | 14px | 1.5 | 500 |
| `label-md` | 14px | 1.2 / 0.05em | 700 (uppercase-ish labels) |

---

## Spacing & layout

| Token | Value |
|---|---|
| `container-max` | 1280px |
| `section-gap` | 80px (vertical section padding) |
| `margin-desktop` | 40px (horizontal page gutter) |
| `margin-mobile` | 16px |
| `gutter` | 24px (grid gap) |
| `stack-lg / md / sm` | 32 / 16 / 8px |

Header height: **60px**, fixed, white, 1px `outline-variant` bottom border.
Split auth layout: dark panel **40–55%** (`#0F172A`) + form panel remainder (`#f8f9fb`/white).

---

## Border radius

| Token | Value | Usage |
|---|---|---|
| `DEFAULT` | 0.25rem (4px) | chips/tags |
| `lg` | 0.5rem (8px) | inputs |
| `xl` | 0.75rem (12px) | cards |
| `2xl`/banner | 32px | CTA banner |
| `full` | 9999px | **all buttons (pills)** |

---

## Shadows

| Name | Value |
|---|---|
| card hover | `0 20px 40px rgba(15,23,42,0.08)` |
| button | `shadow-md` (subtle) |

---

## Components

### Button
- **Shape:** always pill (`rounded-full`).
- **Primary:** `bg-primary-container` (`#0a66c2`) text white, `hover:opacity-90` / `hover:bg-on-primary-fixed-variant`, `active:scale-95`, `shadow-md`. Heights: 48px (lg), ~40px (md).
- **Secondary/outline:** `border border-outline` (or `outline-variant`), `bg-white`, `text-text-primary`, `hover:bg-surface`.
- **Ghost/link:** `text-primary font-bold hover:opacity-80`.
- **On dark CTA:** white fill → navy text, or `border-2 border-white` ghost.

### Card
- `bg-surface-white rounded-xl` + hover `shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition`.
- Freelancer/role cards use `border border-outline-variant`; selected role card → `border-primary ring-1 ring-primary`.

### Input
- `w-full h-[44px] px-4 rounded-lg border border-outline-variant bg-white`.
- Focus: `border-primary` + `ring-2 ring-primary/10` (no red).
- Label: `label-md text-on-surface-variant`. Password field has trailing visibility toggle.

### Badge
- **success** ("Available"): `bg-success/10 text-success rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider`.
- **neutral** (skill tag): `bg-surface-container px-2 py-1 rounded text-xs`.

### Search bar (hero)
- Pill container `bg-white rounded-full p-2 border border-outline-variant shadow-lg`, leading search icon, inline `Find Talent` pill button (`bg-primary-container`).

### Category card
- `bg-white p-8 rounded-xl`, icon in `w-12 h-12 rounded-full bg-secondary-container` → on hover `bg-primary-container` with white icon. Blue icons, never grey.

---

## Page-specific notes

**Landing:** fixed white nav (logo + Browse Jobs / Find Freelancers / Resources + Log in + Sign Up pill) → hero `55%/45%` grid with search on left and **3 floating, rotated, animated freelancer cards** on right → dark `#0F172A` stats bar with `border-t-[3px] border-primary` and count-up numbers → category grid (blue icons) → top-freelancers 2-col list cards → How It Works (3 white circles, dashed connector, giant ghost `01/02/03` numerals) → CTA banner `#1E3A5F` with `وصل` watermark → dark footer `border-t-4 border-primary`.

**Create Account:** split — dark left ("Join the world's most ambitious companies." + avatars + testimonial card) / form right with **role selector cards (Client / Freelancer)**, full name, email, password (toggle), terms checkbox, blue `Create Account` pill, divider, Google + Apple pills.

**Sign In:** split — dark left ("Your next opportunity starts here." + 3 social-proof rows) / form right with email, password (toggle + forgot link), blue `Sign in` pill, `or` divider, `Continue with Google` pill, Apple + LinkedIn icon buttons.

---

## Motion
- `.reveal` → `opacity:0; translateY(30px)` to `active` over 0.8s; IntersectionObserver, staggered `transition-delay`.
- Stats: count-up via IntersectionObserver.
- Floating hero cards: `animate-float` (6s ease-in-out), each rotated + staggered `animation-delay`.
- Buttons: `active:scale-95`; cards: hover lift / un-rotate.
