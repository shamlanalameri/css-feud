# Remove background

_Started 2026-07-15 08:37 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Create a complete, working, responsive web game called **“CSS Feud”**, inspired"
Project currently has 1 file(s)
Current date is now July 15, 2026
</system-info>

<attached aesthetic_system_instructions>
A design system or theme is attached to this project. That attachment already answers the visual-style question: apply it. Do NOT ask the user which visual style to use — no questions about vibe, colors or palette directions (including color-swatch svg-options questions), typography, mood, or art direction, and skip the "divergent visuals" question from the question-asking tips; offer divergent visual directions only if the user themselves asks for alternatives. Treat the attachment as the confirmed starting point and product context — the "confirm the starting point" tip is already satisfied, so do not ask the user to confirm or re-pick it. If you use the questions_v2 tool, set show_design_system_picker to false so the visual-direction picker this app can append to the form is not shown on top of the attached design system. Spend your questions on everything else you need: audience, purpose, content, structure, scope, interactions, tone of copy.
</attached aesthetic_system_instructions>

<attached_files>
- uploads/CSS Fued.png
</attached_files>

<pasted_text name="Pasted text (535 lines)">
Create a complete, working, responsive web game called **“CSS Feud”**, inspired by Family Feud but redesigned for an internal employee competition.

Do not create only a visual mock-up. Build a functional game using HTML, CSS, and JavaScript.

## Technical Structure

Create the game as one complete file named:

`index.html`

Use different URL modes within the same HTML file:

* `?mode=admin` — admin setup and host controls
* `?mode=game` — main game screen displayed to employees
* `?mode=survey` — employee survey page
* `?mode=buzzer&amp;team=1` — Team 1 buzzer
* `?mode=buzzer&amp;team=2` — Team 2 buzzer

Use:

* Vanilla HTML, CSS, and JavaScript
* Firebase Realtime Database for live multi-device syncing
* Firebase Anonymous Authentication if required
* A QR-code JavaScript library
* LocalStorage as a backup/demo mode when Firebase has not yet been configured

Include a clearly marked Firebase configuration section near the top of the JavaScript so I can easily paste my Firebase project details.

The game must work across multiple phones and laptops when hosted online.

## Core Game Idea

This is not a traditional Family Feud game with a previously completed survey.

For every question:

1. The admin starts the question.
2. A QR code appears on the main screen.
3. Employees scan the QR code using their phones.
4. Employees submit their answers anonymously.
5. Submitted answers must not appear publicly while the survey is open.
6. The admin can see how many people have responded.
7. The admin closes the survey.
8. The system analyses and groups the submitted answers.
9. The admin reviews, merges, edits, deletes, and approves the answer groups.
10. The approved answers automatically become the CSS Feud answer board.
11. The teams then press their buzzers.
12. The team that buzzes first answers first.
13. Teams continue answering until the board is cleared or the admin ends the round.

## Teams

The game has:

* Two teams
* Five players per team

The admin must be able to enter:

* Team 1 name
* Team 2 name
* Five player names for Team 1
* Five player names for Team 2
* Optional team colours
* Optional team logos

Display the team names, player names, current scores, and current turn clearly on the game screen.

## Admin Login

Create a password-protected admin portal.

Default password:

`1234`

Place the password in a clearly marked configuration variable so it can be changed later.

For this internal prototype, a simple front-end password is acceptable. Do not display the password anywhere on the public game screen.

## Admin Setup Portal

The admin setup area must allow the admin to:

* Create a new game
* Edit the game title
* Add team names
* Add five player names per team
* Select the number of questions
* Add questions
* Edit questions
* Delete questions
* Reorder questions
* Duplicate a question
* Save the game
* Reset the entire game
* Resume a previously saved game

For each question, allow the admin to enter:

* Question text
* Optional category
* Optional image
* Optional time limit
* Maximum number of answers to show on the board
* Optional pre-approved answers
* Optional judge notes

Example questions:

* What is Fouzia’s favourite colour?
* What is Ali’s favourite football team?
* What is the first thing employees do when they arrive at the office?
* Name something employees always forget before a meeting.
* What is the most popular lunch order in the office?

## Main Game Screen

Design the main game screen for a laptop connected to a large display.

It must include:

* CSS Feud title
* Current question number
* Current question
* Team names
* Team scores
* Current team turn
* Answer board
* Survey response counter
* QR code area
* Buzzer status
* Round points
* Game progress
* Full-screen button

The main game screen must never show admin buttons or confidential survey results.

Use large, readable typography suitable for employees viewing the screen from a distance.

## Live Employee Survey

When the admin clicks **Start Question**:

* Display the question on the main game screen.
* Generate a QR code linked to the survey page.
* Display a short join code below the QR code.
* Show the number of submitted responses live.
* Do not show the answers themselves.
* Show a message such as: “Scan the QR code and submit your answer.”

On the employee survey page:

* Show the CSS Feud logo or title.
* Show the current question.
* Provide one clear answer field.
* Include a Submit Answer button.
* Show a confirmation after submission.
* Prevent repeated submissions from the same device for the same question where possible.
* Allow anonymous participation by default.
* Do not show other employees’ answers.
* Do not show the developing answer board.
* Automatically disable submissions when the admin closes the survey.

Include a clear survey status:

* Survey not started
* Survey open
* Answer submitted
* Survey closed
* Waiting for next question

## Creating the Answer Board

When the admin closes the survey, open a private answer-review screen.

Automatically:

* Remove extra spaces.
* Ignore capitalisation.
* Group identical answers.
* Group simple spelling variations.
* Suggest possible duplicate or similar answers.
* Count how many employees submitted each answer.
* Sort answers from most common to least common.

The admin must be able to:

* Merge two or more answer groups
* Separate answers that were grouped incorrectly
* Rename an answer
* Correct spelling
* Delete irrelevant answers
* Add a missing answer manually
* Change the number of points
* Select which answers appear on the board
* Reorder the answers
* Hide low-frequency answers
* Approve the final board

By default, each answer’s points should equal the number of employees who submitted it.

For example:

* Blue — 18 points
* Green — 11 points
* Black — 7 points
* Red — 4 points

The admin can manually adjust these points before or during the round.

Only publish the answer board after the admin clicks **Approve and Create Board**.

## Answer Board Design

The board should show covered answer slots such as:

1. Hidden answer
2. Hidden answer
3. Hidden answer
4. Hidden answer
5. Hidden answer

When the admin reveals an answer, animate the card flipping or sliding open to show:

* Answer text
* Survey points

Revealed answers must remain visible for the rest of the round.

Include buttons in the admin portal for:

* Reveal selected answer
* Reveal all answers
* Hide an answer again
* Edit answer
* Add answer
* Remove answer
* Change answer points

## Buzzer System

After the answer board is approved, the admin clicks **Open Buzzers**.

Provide two ways to buzz:

### Main-screen buzzers

* Team 1 buzzer button
* Team 2 buzzer button

### Separate mobile buzzer pages

Generate a separate QR code or link for each team:

* Team 1 buzzer page
* Team 2 buzzer page

Each buzzer page should contain one very large button using the team’s name and colour.

Buzzer rules:

* The first valid buzzer press wins.
* Immediately lock both buzzers.
* Display the winning team prominently.
* Play a buzzer sound.
* Show the exact order and time of the buzzer presses privately to the admin.
* Allow the admin to reset or reopen the buzzers.
* Ignore duplicate presses after the buzzer has locked.

Also include keyboard shortcuts:

* `1` for Team 1
* `2` for Team 2
* `B` to reset buzzers

## Turn and Answer Rules

Use the following simplified game rules:

1. The team that buzzes first gains the first turn.
2. One player from that team gives an answer verbally.
3. The judge checks the admin portal.
4. If the answer matches an answer on the board:

   * The judge reveals it.
   * The answer’s points are awarded to that team.
   * The same team continues.
   * Highlight the next player on that team.
5. If the answer is incorrect or not accepted:

   * Show a wrong-answer animation and sound.
   * Immediately transfer the turn to the other team.
6. Teams continue swapping turns whenever an answer is wrong.
7. There is no traditional three-strike rule.
8. The round continues until:

   * All answers have been revealed, or
   * The admin clicks End Round.

Automatically rotate through the five player names on each team, while allowing the admin to select a different player manually.

## Judge Controls

The judge must have full control from the admin portal.

Include controls to:

* Mark an answer correct
* Mark an answer incorrect
* Reveal an existing board answer
* Award answer points
* Give custom bonus points
* Deduct points
* Transfer the turn
* Select the current player
* Add an accepted answer that was not in the survey
* Enter a new answer and point value during the round
* Award points for a semantically correct answer
* Edit team scores
* Undo the last action
* Redo an action
* Pause the round
* End the round
* Skip a question
* Reveal all remaining answers

This is important because an answer may be correct even if no employee submitted it during the survey.

For example, if the board contains “Manchester United” but a player says “Man United,” the judge should be able to accept it.

The judge should also be able to award a custom number of points for an intelligent or valid answer not found on the survey board.

## Scoring

Maintain:

* Current round points
* Team 1 total score
* Team 2 total score
* Optional bonus points
* Manual score adjustments

When an answer is revealed and awarded, add its points directly to the answering team’s total.

Prevent the same board answer from being awarded twice unless the admin manually overrides it.

Show a private activity log containing:

* Team that answered
* Player name
* Answer selected
* Points awarded
* Manual adjustments
* Turn changes
* Time of action

## Leaderboard

After each question, show an animated round-results screen containing:

* Team rankings
* Total team points
* Round winner
* Top-scoring team
* Progress through the game

At the end of the full game, show a final leaderboard containing:

* First-place team
* Second-place team
* Final scores
* Winning team members
* Optional player contribution scores
* Celebration animation
* Confetti
* Winner sound

Include buttons for:

* View final leaderboard
* Return to game
* Download results as CSV
* Print results
* Start a new game

## Admin Dashboard Layout

Organise the admin portal into clear sections or tabs:

1. Game Setup
2. Teams and Players
3. Questions
4. Live Survey
5. Answer Review
6. Game Controls
7. Scores
8. Leaderboard
9. Activity Log
10. Settings

The admin portal should be easy to use during a live event and should not feel crowded.

Use large buttons for the most important live controls:

* Start Survey
* Close Survey
* Create Board
* Open Buzzers
* Correct
* Wrong
* Switch Team
* End Round
* Next Question

Add confirmation messages before destructive actions such as resetting the game or deleting all responses.

## Visual Style

Create a polished, energetic game-show design suitable for an internal corporate employee event.

Use:

* Deep navy background
* Bright blue highlights
* Gold or warm yellow scoring accents
* White text
* Rounded answer cards
* Subtle glow effects
* Smooth animations
* Large scoreboard typography
* Clear team-colour indicators

The design should feel exciting and professional, not childish.

Make it fully responsive for:

* Large presentation screens
* Laptops
* Tablets
* Employee mobile phones

## Sounds and Animations

Include optional sound effects for:

* Buzzer
* Correct answer
* Wrong answer
* Answer reveal
* Points awarded
* Round complete
* Final winner

Include a mute/unmute control.

Use animations for:

* QR-code entrance
* Answer-board creation
* Answer reveal
* Wrong answer
* Score increase
* Turn switching
* Leaderboard
* Confetti celebration

Do not make animations so long that they interrupt the live game.

## Data and Persistence

Save all game information, questions, answers, scores, survey responses, and game status.

The game should survive accidental page refreshes.

Include:

* Auto-save
* Manual save
* Export game data as JSON
* Import game data from JSON
* Reset current question
* Reset scores only
* Reset survey responses only
* Reset entire game

Create a unique game ID so multiple games do not mix their data.

## Security and Privacy

* Keep survey participants anonymous by default.
* Do not expose survey answers while the survey is open.
* Do not expose Firebase admin controls or configuration on the public screens.
* Sanitise user input before displaying it.
* Limit each device to one response per question where possible.
* Allow the admin to remove inappropriate responses before creating the board.

## Demo Content

Include a demo game with:

* Two sample teams
* Five sample players per team
* Three sample questions
* Sample survey responses
* A demonstration answer board

The demo data must be removable through the admin portal.

## Final Deliverable

Provide:

1. One complete `index.html` file with all HTML, CSS, and JavaScript included.
2. No missing sections and no placeholder comments such as “add code here.”
3. Clear Firebase setup instructions.
4. Clear hosting instructions for Firebase Hosting, GitHub Pages, Netlify, or another simple hosting service.
5. A working local demo mode using LocalStorage.
6. A test checklist covering:

   * Admin login
   * Team setup
   * Question creation
   * QR survey
   * Multi-device submissions
   * Answer grouping
   * Board creation
   * Buzzers
   * Turn switching
   * Manual judge points
   * Leaderboard
   * Refresh recovery

Prioritise functionality, stability, large-screen readability, and ease of use during a live employee event.

</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>

<attached-skill name="UAE Government Design System (AEGov DLS) (design system)">
[Design System] This project uses the **UAE Government Design System (AEGov DLS)** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

This project has the **UAEGovernmentDesignSystemAEGovDLS_faadc4** design system bound at `_ds/uae-government-design-system-aegov-dls-faadc44a-dc1e-49c6-8fb7-c363fc140982/`. If anything under that path is missing or fails to load, the folder name may differ — `list_files` `_ds/` and use the folder whose name ends with faadc44a-dc1e-49c6-8fb7-c363fc140982 instead, including in the <link>/<script> paths below.

**Loading the bundle is how you use this design system.** Every Design Component you build must load `_ds/uae-government-design-system-aegov-dls-faadc44a-dc1e-49c6-8fb7-c363fc140982/_ds_bundle.js` in `<helmet>` (include it in child DCs too — de-duped by URL) and compose with its components — do not recreate those components from scratch or restyle raw HTML to look like them. At the top of the template:

```html
<helmet>
  <link rel="stylesheet" href="_ds/uae-government-design-system-aegov-dls-faadc44a-dc1e-49c6-8fb7-c363fc140982/colors_and_type.css">
  <link rel="stylesheet" href="_ds/uae-government-design-system-aegov-dls-faadc44a-dc1e-49c6-8fb7-c363fc140982/preview/card.css">
  <link rel="stylesheet" href="_ds/uae-government-design-system-aegov-dls-faadc44a-dc1e-49c6-8fb7-c363fc140982/ui_kits/government-website/kit.css">
  <script src="_ds/uae-government-design-system-aegov-dls-faadc44a-dc1e-49c6-8fb7-c363fc140982/_ds_bundle.js"></script>
</helmet>
```

Then mount any component directly in the template — no logic class needed:

```html
<x-import component-from-global-scope="UAEGovernmentDesignSystemAEGovDLS_faadc4.Button" hint-size="auto,40px">Label</x-import>
```

Props are template attributes (kebab → camelCase); template children pass through as `props.children`. The linked stylesheet(s) carry the design tokens (colors, type, spacing) — style against those via `var(--*)` and the design system's classes rather than guessing values.

The full design-system source tree lives at `/projects/faadc44a-dc1e-49c6-8fb7-c363fc140982/` — use `list_files` / `read_file` from there for anything not under `_ds/` (layout varies by brand; don't assume folder names). Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# UAE Government Design System (AEGov DLS)

A faithful, reusable recreation of the **United Arab Emirates Government Design System** — the official design language (DLS) for federal government digital products, published and maintained by the **Telecommunications and Digital Government Regulatory Authority (TDRA)**.

This project packages the system's foundations (colour, type, iconography, voice), real brand assets, ready-to-use CSS tokens, and high-fidelity UI kit components so a design agent can produce correctly-branded UAE government interfaces, slides, and prototypes.

&gt; Built for entities operating under the UAE federal government (ministries, authorities, initiatives). The core **AEGold** palette is approved by the UAE Cabinet Office and is **mandatory and unchangeable for ministries**; authorities may swap the primary colour only.

---

## Sources

Everything here is derived from the public, open-source design system. No private/internal material was used. Reproduce the reader's access by visiting:

- **Guidelines site:** https://designsystem.gov.ae/guidelines
  - Typography — https://designsystem.gov.ae/guidelines/typography
  - Colour system — https://designsystem.gov.ae/guidelines/colour-system
  - Iconography — https://designsystem.gov.ae/guidelines/iconography
  - Content (voice &amp; tone) — https://designsystem.gov.ae/guidelines/content
  - Actions &amp; input (buttons/forms) — https://designsystem.gov.ae/guidelines/actions
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

**Voice (constant): "corporate yet approachable."** Five attributes: **Professional** (elevates facts and outcomes), **Accessible** (for all cultures, ages, backgrounds), **User-centric** (speaks the user's language), **Clear** (simple, logical point of view), **Confident** (trustworthy, straightforward). **Tone adapts** to context — an error message is short and solution-oriented; an FAQ or T&amp;C is longer and fuller.

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

**Error &amp; system messages** — be clear, meaningful, human, humble, directive, and helpful:
- ✓ "Unable to log you in. Your username/password combination does not match."
- ✓ "Please enter your email in the format: example@domain.com."
- ✓ "A file with the same name already exists. Please provide another name." (offer **Replace** / **Rename**)
- Never blame the user ("You did not enter your first name" → "Please enter your first name").

**Numbers.** Spell out at the start of a sentence ("Seventy percent…"); numerals mid-sentence ("70%…"). Commas above 3 digits (1,000 / 200,000).

**Punctuation.** Oxford/serial comma in lists of 3+. Single quotes for direct speech (double for quotes-within-quotes). Exclamation points only when truly warranted ("Welcome Maryam!" — never "!!!!"). Use "**and**", never "&amp;" (except in a brand name like Johnson &amp; Johnson). Em dash (—) for parentheticals; en dash (–) for ranges, but prefer "from Monday to Friday" over "Monday–Friday" with prepositions.

**Navigation terms.** Ministries keep navigation **formal**: "About", "Services", "Service catalogue", "Open data", "Digital participation", "Media centre", "Contact", "Frequently asked questions". Ministries must **avoid** informal equivalents ("Who we are", "What we do", "Get in touch"). Authorities/initiatives may use a semi-formal register if consistent.

**Emoji &amp; decorative unicode:** **not used.** Avoid unicode glyphs/symbols as text (screen-reader unsafe) — write "Reference number", not "Reference nº". Formatting emphasis comes from **bold** (sparingly — headings, buttons, one or two phrases per paragraph) and *italics* (terms, citations, field names — never on hyperlinks).

**Vibe in one line:** a calm, competent, plain-spoken civil servant who respects your time — never chatty, never stiff.

---

## VISUAL FOUNDATIONS

The visual motifs and rules that make a layout read as "UAE Government."

**Palette philosophy.** Two families. The **core palette = "strength"** (AEGold, AERed, AEGreen, AEBlack) — national/ministerial identity, Cabinet-approved. The **supporting palette = "softness"** (Tech Blue, Sea Blue, Camel Yellow, Desert Orange, Fuchsia, Slate) — adds a human touch for imagery, illustration, data, and iconography. **AEGold is the primary brand colour.** Critical accessibility rule: the literal brand swatch `#B68A35` (aegold-500) is **not** WCAG-safe as a background — use **`#92722A` (aegold-600)** for any coloured component background. Default text is **AEBlack-800 `#232528`** on near-white; dark sections use AEBlack-900 `#1B1D21`.

**Don't over-mix colour.** Pull from one palette; never pair clashing opposites (no AEGold-on-AERed, no AEGreen↔AEGold gradient). Functional colour is reserved: **AEGreen = success, AERed = error, Camel/Desert = warning, Tech Blue = info/links.**

**Type.** English: **Roboto** for body/base, **Inter** for headings/titles. Arabic: **Noto Kufi Arabic** (body) + **Alexandria** (headings). All Google Fonts. Scale is a **Major Third (1.333)** from a 16px base — display 76 / h1 62 / h2 48 / h3 40 / h4 32 / h5 26 / h6 20; body 30→12. Headings default to **extrabold (800)**; the 76px *display* size is used **only** at **extralight (200)** in tall hero areas (≥60% viewport height). Body line-height ≥ **1.5**; headings tighten as they grow (never below 1rem). Responsive "one-step decrease" on smaller screens.

**Layout &amp; spacing.** Content container ≈ **1240px**; text columns kept to ~**60% width (≈745px)** so line length lands in the ideal **60–100 characters**. 4px spacing rhythm (Tailwind scale). **Left-align** English content (RTL → right-align Arabic). **Never justify**, never indent paragraphs, never underline anything except hyperlinks/text-buttons. Generous white space between content blocks; reduce margins/padding responsively.

**Backgrounds.** Predominantly clean **neutral environments** (white `#FCFCFC` pages, `#F7F7F7`/Slate-50 alternating sections, AEBlack-900 dark sections). Wireframe-first: design in neutrals, then apply core colour to the few elements that matter (buttons, key highlights). **Background patterns** are allowed but constrained — only on inner-page sections (not the homepage except just above the footer), text-contrast ≥ 4.5, and the pattern no more than **8% darker** than its section background. No loud full-bleed textures behind body copy.

**Gradients.** Subtle and same-tonality only — e.g. `from-primary-400 to-primary-600` (subtle), `from-primary-50 to-primary-200` (light), `from-primary-500 to-primary-900` (dark). Cross-palette gradients are allowed only between contrasting-but-harmonious hues (Tech Blue→Sea Blue, Tech Blue→Fuchsia; **never** Green→Gold). Always contrast-checked. Gradients are accents, not the default surface — avoid the "AI purple gradient" look entirely; this is a restrained, institutional system.

**Corner radii &amp; cards.** Gently rounded, not pill-shaped containers: inputs/cards ~8–12px; **buttons are pill / fully rounded** in the reference components. Cards read as light surfaces on a neutral page — soft, low shadow or a hairline border (`#E1E3E5`), never heavy drop-shadows and never the "rounded box with a single coloured left border" cliché.

**Elevation / shadows.** Low and soft. A subtle `0 1px 2px` for resting surfaces; `0 4px 12px` for raised cards/menus; `0 12px 28px` for overlays/modals. Shadows are quiet — depth comes mostly from neutral background steps, not dramatic shadow.

**Borders &amp; dividers.** Hairlines in AEBlack-100/200 (`#E1E3E5` / `#C3C6CB`). Focus states use a visible ring (AEGold-400) — keyboard accessibility is mandatory.

**Imagery vibe.** Real photography of people, places, and services — warm, optimistic, representative of the UAE's diverse population; not cold stock. Supporting-palette colours are chosen to sit comfortably beside this imagery. Always provide descriptive ALT text.

**Motion.** Restrained and functional — gentle fades and short transitions, no bouncy/playful easing. Animation should aid comprehension (loading, state change), never decorate. (Sustainable-web-design ethos: keep it light.)

**Interaction states.** Buttons darken on hover (primary 600 → 700 → 800 on active); outline/soft buttons gain a soft tint. Use the focus ring for keyboard focus. Hit targets ≥ 44px; icon minimum 24px (20px sparingly). FABs limited to **two**, bottom-right, never obscuring content.

**Transparency &amp; blur.** Used sparingly — light scrims over hero imagery to protect text contrast, occasional frosted header on scroll. Not a glassmorphism-heavy system; clarity and contrast win over effect.

---

## ICONOGRAPHY

**Library: [Phosphor Icons](https://phosphoricons.com)** — the officially selected icon set (1,512 icons × light/regular/bold/fill/duotone = ~9,072 glyphs). Clear, minimal, consistent.

- **Delivery.** SVG is preferred (smaller, recolourable via `fill`/`stroke`). A web-font CDN is also officially supported and is what this project uses for convenience:
  ```html
  &lt;link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css"&gt;
  &lt;link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css"&gt;
  &lt;link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css"&gt;
  &lt;link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/duotone/style.css"&gt;
  &lt;!-- usage --&gt;
  &lt;i class="ph ph-magnifying-glass"&gt;&lt;/i&gt;
  &lt;i class="ph-bold ph-user"&gt;&lt;/i&gt;
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

</design-system-guide>
</attached-skill>

## Assistant

_[tool: image_metadata]_

_[tool: read_file]_

_[tool: update_todos]_

_[tool: copy_files]_

_[tool: set_project_title]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: delete_file]_

_[tool: ready_for_verification]_

Out for review. Quick-start: open the launcher → **Admin portal** (password `1234`) → Live controls → *Start survey*, then open the **Main game screen** and **Employee survey** in other tabs to rehearse the full flow — or use *Simulate 14 responses* to test grouping and the board instantly.

## User

remove background

## Assistant

_[tool: run_script]_

_[tool: view_image]_

_[tool: ready_for_verification]_

Done — the logo background is removed and it renders transparent across all screens. (The design-system loader warning is expected: the game is intentionally a single self-contained `index.html` for external hosting, with the AEGov tokens copied inline.)

## User

add a back buttom

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Added a "← Back" button (top-left) on the survey page that returns to the launcher.

_[tool: ready_for_verification]_

Done — the survey page now has a "← Back" button in the top-left that returns to the launcher.

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Done — the buzzer pages now have the "← Back" button too.

## User

make a page for the guide of the games

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Out for review — open the launcher's new **How to play** card to see the guide.

## User

ok I think am ready lets make this live

## Assistant

_[tool: present_fs_item_for_download]_

_[tool: present_fs_item_for_download]_

Download both files above, then go live in three steps:

**1. Firebase (needed for phones to sync)**
- console.firebase.google.com → create a project
- Build → Realtime Database → create (test mode) · Build → Authentication → enable Anonymous
- Project settings → add a web app → copy the config into `FIREBASE_CONFIG` near the top of the script in `index.html`

**2. Host both files** (same folder) — easiest is Netlify: drag the folder onto app.netlify.com/drop. GitHub Pages or Firebase Hosting also work.

**3. Test on the live URL** — open `?mode=admin` (password `1234` — change `ADMIN_PASSWORD` before the event), start a survey, and scan the QR with a phone.

The full walkthrough and test checklist is also in the admin portal's **Help and checklist** tab. Want me to change the admin password or anything else before you deploy?

## User

step by step I opend firebase and I created a project

## User

step by step I opend firebase and I created a project

