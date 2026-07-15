# UAE Government Design System (AEGov DLS)

A faithful, reusable recreation of the **United Arab Emirates Government Design System** — the official design language (DLS) for federal government digital products, published and maintained by the **Telecommunications and Digital Government Regulatory Authority (TDRA)**.

This project packages the system's foundations (colour, type, iconography, voice), real brand assets, ready-to-use CSS tokens, and high-fidelity UI kit components so a design agent can produce correctly-branded UAE government interfaces, slides, and prototypes.

> Built for entities operating under the UAE federal government (ministries, authorities, initiatives). The core **AEGold** palette is approved by the UAE Cabinet Office and is **mandatory and unchangeable for ministries**; authorities may swap the primary colour only.

---

## Sources

Everything here is derived from the public, open-source design system. No private/internal material was used. Reproduce the reader's access by visiting:

- **Guidelines site:** https://designsystem.gov.ae/guidelines
  - Typography — https://designsystem.gov.ae/guidelines/typography
  - Colour system — https://designsystem.gov.ae/guidelines/colour-system
  - Iconography — https://designsystem.gov.ae/guidelines/iconography
  - Content (voice & tone) — https://designsystem.gov.ae/guidelines/content
  - Actions & input (buttons/forms) — https://designsystem.gov.ae/guidelines/actions
  - Imagery / Layout / Accessibility / Mobile — under the same `/guidelines/*` path
- **Component docs:** https://designsystem.gov.ae/docs/components
- **Open-source package (source of truth):** https://github.com/TDRA-ae/aegov-dls
  - Distributed as an npm plugin `@aegov/design-system` for **TailwindCSS v4** (used with `@tailwindcss/forms` + `@tailwindcss/typography`).
- **Maintainer:** TDRA — https://www.tdra.gov.ae
- **AI helper:** UAsk DLS assistant — https://askdls.u.ae/en/

The system ships English (LTR) and Arabic (RTL) variants. The reference implementation is Tailwind-based; this project also exposes plain CSS variables (`colors_and_type.css`) so the tokens work outside a Tailwind build.

---

## What this system is for

The DLS standardises the digital presence of UAE federal entities so that, across hundreds of ministry and authority websites and apps, citizens and residents get a consistent, accessible, trustworthy experience. Two surfaces dominate:

1. **Federal entity websites** — ministry/authority marketing + information sites and **service portals** (the e-government services a citizen actually transacts with). Login is via **UAE Pass**, the national single-sign-on.
2. **Mobile applications** — native government apps, governed by the dedicated *Mobile applications* guideline.

Recurring real-world content themes (use these when you need realistic copy): federal services and the *service catalogue*, UAE Pass authentication, open data policy, digital participation, media centre / news, ICT and innovation programmes (e.g. TDRA Virtual Academy / Virtual Camp), sustainability, and entity *About / vision / mission* pages.

---

## CONTENT FUNDAMENTALS

How copy is written across UAE government digital products.

**Voice (constant): "corporate yet approachable."** Five attributes: **Professional** (elevates facts and outcomes), **Accessible** (for all cultures, ages, backgrounds), **User-centric** (speaks the user's language), **Clear** (simple, logical point of view), **Confident** (trustworthy, straightforward). **Tone adapts** to context — an error message is short and solution-oriented; an FAQ or T&C is longer and fuller.

**Person.** Use **"we"** for the entity and **"you"** for the user. Personal, human, never bureaucratic.
- ✓ "We will review your request and inform you about the status within 24 hours."
- ✗ "The TDRA will review the request posted by Mr. Mohammad and inform about the status in 24 hours."

**Casing — sentence case ONLY.** Capitalise only the first word and proper nouns. Applies to headlines, buttons, CTAs, menu items — everything. Title case, ALL-CAPS, and camelCase are explicitly disallowed (accessibility + screen readers).
- ✓ "Learn more" · "Apply for a tourist visa" · "Evaluate the Ministry of Culture and Youth's mobile app"
- ✗ "Learn More" · "APPLY FOR A TOURIST VISA"

**Spelling — British English**, one dictionary (Oxford). e.g. *centre, licence, programme, organisation, mobile phone, driving licence* (not center/license/program/cell phone/driver's license).

**Plain language.** Avoid jargon and intimidating words. Keep contractions to a minimum (*cannot*, not *can't*; *will not*, not *won't*). Spell out an acronym on first mention with the abbreviation in parentheses — "information and communication technology (ICT)" — unless it's common. Never write "e-services"/"eservice" (all services are electronic; drop the emphasised "E").

**Don't be witty.** No playful, sarcastic, or "clever" microcopy. The goal is to clarify, not to impress.
- ✓ "We are facing a technical issue which hopefully will not take long. Please check back later."
- ✗ "Looks like the page is having a power nap…"

**Error & system messages** — be clear, meaningful, human, humble, directive, and helpful:
- ✓ "Unable to log you in. Your username/password combination does not match."
- ✓ "Please enter your email in the format: example@domain.com."
- ✓ "A file with the same name already exists. Please provide another name." (offer **Replace** / **Rename**)
- Never blame the user ("You did not enter your first name" → "Please enter your first name").

**Numbers.** Spell out at the start of a sentence ("Seventy percent…"); numerals mid-sentence ("70%…"). Commas above 3 digits (1,000 / 200,000).

**Punctuation.** Oxford/serial comma in lists of 3+. Single quotes for direct speech (double for quotes-within-quotes). Exclamation points only when truly warranted ("Welcome Maryam!" — never "!!!!"). Use "**and**", never "&" (except in a brand name like Johnson & Johnson). Em dash (—) for parentheticals; en dash (–) for ranges, but prefer "from Monday to Friday" over "Monday–Friday" with prepositions.

**Navigation terms.** Ministries keep navigation **formal**: "About", "Services", "Service catalogue", "Open data", "Digital participation", "Media centre", "Contact", "Frequently asked questions". Ministries must **avoid** informal equivalents ("Who we are", "What we do", "Get in touch"). Authorities/initiatives may use a semi-formal register if consistent.

**Emoji & decorative unicode:** **not used.** Avoid unicode glyphs/symbols as text (screen-reader unsafe) — write "Reference number", not "Reference nº". Formatting emphasis comes from **bold** (sparingly — headings, buttons, one or two phrases per paragraph) and *italics* (terms, citations, field names — never on hyperlinks).

**Vibe in one line:** a calm, competent, plain-spoken civil servant who respects your time — never chatty, never stiff.

---

## VISUAL FOUNDATIONS

The visual motifs and rules that make a layout read as "UAE Government."

**Palette philosophy.** Two families. The **core palette = "strength"** (AEGold, AERed, AEGreen, AEBlack) — national/ministerial identity, Cabinet-approved. The **supporting palette = "softness"** (Tech Blue, Sea Blue, Camel Yellow, Desert Orange, Fuchsia, Slate) — adds a human touch for imagery, illustration, data, and iconography. **AEGold is the primary brand colour.** Critical accessibility rule: the literal brand swatch `#B68A35` (aegold-500) is **not** WCAG-safe as a background — use **`#92722A` (aegold-600)** for any coloured component background. Default text is **AEBlack-800 `#232528`** on near-white; dark sections use AEBlack-900 `#1B1D21`.

**Don't over-mix colour.** Pull from one palette; never pair clashing opposites (no AEGold-on-AERed, no AEGreen↔AEGold gradient). Functional colour is reserved: **AEGreen = success, AERed = error, Camel/Desert = warning, Tech Blue = info/links.**

**Type.** English: **Roboto** for body/base, **Inter** for headings/titles. Arabic: **Noto Kufi Arabic** (body) + **Alexandria** (headings). All Google Fonts. Scale is a **Major Third (1.333)** from a 16px base — display 76 / h1 62 / h2 48 / h3 40 / h4 32 / h5 26 / h6 20; body 30→12. Headings default to **extrabold (800)**; the 76px *display* size is used **only** at **extralight (200)** in tall hero areas (≥60% viewport height). Body line-height ≥ **1.5**; headings tighten as they grow (never below 1rem). Responsive "one-step decrease" on smaller screens.

**Layout & spacing.** Content container ≈ **1240px**; text columns kept to ~**60% width (≈745px)** so line length lands in the ideal **60–100 characters**. 4px spacing rhythm (Tailwind scale). **Left-align** English content (RTL → right-align Arabic). **Never justify**, never indent paragraphs, never underline anything except hyperlinks/text-buttons. Generous white space between content blocks; reduce margins/padding responsively.

**Backgrounds.** Predominantly clean **neutral environments** (white `#FCFCFC` pages, `#F7F7F7`/Slate-50 alternating sections, AEBlack-900 dark sections). Wireframe-first: design in neutrals, then apply core colour to the few elements that matter (buttons, key highlights). **Background patterns** are allowed but constrained — only on inner-page sections (not the homepage except just above the footer), text-contrast ≥ 4.5, and the pattern no more than **8% darker** than its section background. No loud full-bleed textures behind body copy.

**Gradients.** Subtle and same-tonality only — e.g. `from-primary-400 to-primary-600` (subtle), `from-primary-50 to-primary-200` (light), `from-primary-500 to-primary-900` (dark). Cross-palette gradients are allowed only between contrasting-but-harmonious hues (Tech Blue→Sea Blue, Tech Blue→Fuchsia; **never** Green→Gold). Always contrast-checked. Gradients are accents, not the default surface — avoid the "AI purple gradient" look entirely; this is a restrained, institutional system.

**Corner radii & cards.** Gently rounded, not pill-shaped containers: inputs/cards ~8–12px; **buttons are pill / fully rounded** in the reference components. Cards read as light surfaces on a neutral page — soft, low shadow or a hairline border (`#E1E3E5`), never heavy drop-shadows and never the "rounded box with a single coloured left border" cliché.

**Elevation / shadows.** Low and soft. A subtle `0 1px 2px` for resting surfaces; `0 4px 12px` for raised cards/menus; `0 12px 28px` for overlays/modals. Shadows are quiet — depth comes mostly from neutral background steps, not dramatic shadow.

**Borders & dividers.** Hairlines in AEBlack-100/200 (`#E1E3E5` / `#C3C6CB`). Focus states use a visible ring (AEGold-400) — keyboard accessibility is mandatory.

**Imagery vibe.** Real photography of people, places, and services — warm, optimistic, representative of the UAE's diverse population; not cold stock. Supporting-palette colours are chosen to sit comfortably beside this imagery. Always provide descriptive ALT text.

**Motion.** Restrained and functional — gentle fades and short transitions, no bouncy/playful easing. Animation should aid comprehension (loading, state change), never decorate. (Sustainable-web-design ethos: keep it light.)

**Interaction states.** Buttons darken on hover (primary 600 → 700 → 800 on active); outline/soft buttons gain a soft tint. Use the focus ring for keyboard focus. Hit targets ≥ 44px; icon minimum 24px (20px sparingly). FABs limited to **two**, bottom-right, never obscuring content.

**Transparency & blur.** Used sparingly — light scrims over hero imagery to protect text contrast, occasional frosted header on scroll. Not a glassmorphism-heavy system; clarity and contrast win over effect.

---

## ICONOGRAPHY

**Library: [Phosphor Icons](https://phosphoricons.com)** — the officially selected icon set (1,512 icons × light/regular/bold/fill/duotone = ~9,072 glyphs). Clear, minimal, consistent.

- **Delivery.** SVG is preferred (smaller, recolourable via `fill`/`stroke`). A web-font CDN is also officially supported and is what this project uses for convenience:
  ```html
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/duotone/style.css">
  <!-- usage -->
  <i class="ph ph-magnifying-glass"></i>
  <i class="ph-bold ph-user"></i>
  ```
  No icons are vendored into `assets/` because the set is fully CDN-available — link Phosphor directly. (If you need raw SVGs offline, export them from phosphoricons.com.)
- **Weight matching.** The icon stroke must match the adjacent **font weight** — Regular text → Regular icon; Light (200) text → Light (or Thin) icon. Default stroke is 2pt (`stroke-width="16"` on the 256 canvas). **Fill** and **duotone** used selectively (duotone pairs well with dark mode; secondary layer at 40% opacity).
- **Sizes.** 20 (sparingly) / 24 (minimum recommended, WCAG target size) / 28 (use when text is 18px) / 40 / 56 / 80. Empty-/blank-state icons are 48×48 (bold, often duotone) and may grow to 80×80 edge-to-edge in disabled/state colour.
- **Colour.** White on dark (AEBlack-900) or on primary-600; primary-600 or black on white. Keep icon-to-background contrast ≥ 1:3.
- **Shapes.** Icons may sit in square, rounded, or circular frames — **never** in identity-derived blobs or irregular brand shapes.
- **Common icons** seen in the system: `magnifying-glass`, `user`, `users`, `envelope`/`at`, `gear`/`faders`, `bell-ringing`, `globe-simple`, `qr-code`, `lock`/`lock-open`, `calendar`, `clock`, `file-pdf`, `folder-open`, `chat-circle-text`, `share`, `arrow-left/right`, `caret-left/right`, `mosque`, `certificate`, `warning`.
- **Emoji:** not used. **Unicode glyphs as icons:** avoided (screen-reader unsafe). Use real SVG/icon-font icons with proper `aria-label`/alt.

---

## Index / manifest

**Root files**
- **`README.md`** — this file: context, sources, content + visual foundations, iconography.
- **`colors_and_type.css`** — all design tokens as CSS custom properties (full palettes 50–950, semantic aliases, type scale, spacing, radii, shadows) + drop-in type classes. Self-contained (Google Fonts `@import` inside). **This is the file to `@import`, or copy tokens from, in any artifact.**
- **`SKILL.md`** — Agent-Skill manifest so this folder works as a downloadable Claude skill.

**Folders**
- **`preview/`** — 24 small HTML specimen cards that populate the Design System tab, grouped Colors / Type / Spacing / Components / Brand. (`card.css` is their shared framing.)
- **`assets/`** — brand/logo references; `assets/README.md` documents where to obtain the official logos and national emblem (not vendored — see Caveats).
- **`ui_kits/government-website/`** — high-fidelity, interactive recreation of a UAE federal entity website + UAE Pass service portal (Home → Catalogue → Service detail → Login → Dashboard). See its own `README.md`.

**Not included / by design**
- Icon files — the system uses **Phosphor Icons** loaded from CDN; nothing to vendor.
- Slide templates — none were provided by the source, so none were created.
- Official logos / national emblem — sourced externally; placeholders are used and clearly flagged.
