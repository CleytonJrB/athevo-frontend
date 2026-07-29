---
name: Athevo Precision
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#A1A1AA'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#9a9078'
  outline-variant: '#4d4632'
  surface-tint: '#eec200'
  primary: '#ffecb9'
  on-primary: '#3c2f00'
  primary-container: '#facc15'
  on-primary-container: '#6c5700'
  inverse-primary: '#735c00'
  secondary: '#c8c5ca'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#efecf0'
  on-tertiary: '#303033'
  tertiary-container: '#d2d0d4'
  on-tertiary-container: '#59595c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe083'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#e4e1e5'
  tertiary-fixed-dim: '#c8c6c9'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#09090B'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
  surface-glass: rgba(24, 24, 27, 0.4)
  glow-yellow: rgba(250, 204, 21, 0.15)
  success-green: '#22C55E'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  mono-sm:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
Athevo is a high-performance B2B SaaS platform for gym management that blends technical precision with athletic energy. The brand personality is professional, authoritative, and ultra-modern, targeting business owners who value data accuracy and premium aesthetics.

The visual style is **Glassmorphic Minimalism**. It utilizes a deep "Obsidian" base to create a focused, low-distraction environment. Depth is achieved through frosted glass layers, subtle radial glows (the "Glow Effect"), and precise 1px borders rather than heavy shadows. The emotional response should be one of "effortless control" and "technological edge," evoked by the contrast between dark surfaces and high-vibrancy yellow accents.

## Colors
The palette is centered on an "Obsidian & Gold" theme. 
- **Primary (#FACC15):** A vibrant yellow used for key actions, metrics, and highlights. It should often be paired with a subtle vertical gradient (down to #EAB308) for buttons.
- **Base Layer (#09090B):** The darkest neutral used for the main background to maximize contrast.
- **Surface Layers (#18181B / #27272A):** Graduated dark grays used for cards and structural borders to create a hierarchy of depth.
- **Typography:** Primary headers use a white-to-gray gradient (#FAFAFA to #A1A1AA) to simulate metallic depth, while body text stays in the high-legibility "on-surface-variant" range.

## Typography
The system relies exclusively on the **Geist** typeface family to project a clean, technical, and developer-friendly aesthetic. 
- **Display & Headlines:** Use tight letter spacing and heavy weights to create a "locked-in" professional look.
- **Body:** Generous line-height (1.6) is used for longer descriptions to ensure readability against the dark background.
- **Monospace:** **Geist Mono** is reserved for metadata, small labels, and "industry trusted" tags to emphasize the "Precision" aspect of the brand.

## Layout & Spacing
The system uses a **Fixed Grid** approach for web, centering content within a `1440px` maximum container. 
- **Vertical Rhythm:** Built on a 4px/8px baseline. Sections are typically separated by `3xl` (64px) padding to allow the glassmorphic elements "room to breathe."
- **Desktop:** A 12-column structure with `24px` gutters. 
- **Mobile:** Transition to a single-column layout with `16px` (margin-mobile) side margins.
- **Component Padding:** Standard cards use `lg` (24px) internal padding, while small interactive items use `md` (16px).

## Elevation & Depth
Depth is created through **Layered Translucency** rather than traditional elevation scales.
- **Level 0 (Base):** Solid #09090B.
- **Level 1 (Cards):** #18181B with a 1px solid #27272A border.
- **Level 2 (Glass):** `rgba(24, 24, 27, 0.4)` with a `12px` backdrop-filter blur. This is used for "floating" or "overlay" elements.
- **Glows:** Subtle `radial-gradient` backgrounds using the primary color at 15% opacity are placed behind key graphics to suggest a light source from within the UI.
- **Shadows:** Only used for high-importance overlays (e.g., `shadow-xl` on primary buttons or `shadow-2xl` on floating dashboard elements), usually tinted with the primary color's hue.

## Shapes
The shape language is **Strictly Geometric**. 
- **Large Containers:** Cards and glass panels use a `16px` (rounded-2xl) radius to soften the technical aesthetic.
- **Interactive Elements:** Buttons and input fields use a sharper `4px` (rounded-DEFAULT) radius to maintain a professional, high-precision feel.
- **Icons:** Enclosed in square or lightly rounded `8px` boxes.

## Components
- **Buttons:** 
    - **Primary:** Linear gradient (#FACC15 to #EAB308), black text, 4px radius. Features a soft yellow outer glow (`shadow-primary/20`).
    - **Secondary:** Transparent background, 1px solid #27272A border, white text. Hover state shifts background to #18181B.
- **Cards:** 
    - **Standard:** Solid #18181B background, 1px #27272A border. 
    - **Glass:** Semi-transparent background with blur; used for hero visuals and final CTAs.
- **Inputs & Details:** 
    - **Accordions (FAQ):** Simple #18181B boxes with a top-border separator when open. Transition uses a subtle "sweep" animation (opacity and margin shift).
- **Navigation:**
    - **Navbar:** Fixed position. Becomes semi-transparent with a 16px blur (`nav-scrolled`) when the user scrolls, creating a seamless transition over page content.
- **Badges/Chips:** 
    - Small pill-shaped containers with high-contrast text, used for "Most Popular" or status indicators.