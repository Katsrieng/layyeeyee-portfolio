# Lay Yee Yee Portfolio — Design Specification

## 1. Project Goal

Build a modern, elegant, aesthetic, highly interactive portfolio website for **Lay Yee Yee**, a graphic design student.

The website must present her projects professionally while preserving the visual personality already established in her PowerPoint portfolio.

The website should feel like a curated digital graphic-design portfolio rather than a generic developer portfolio or template.

Primary qualities:

- Modern
- Elegant
- Editorial
- Aesthetic
- Professional
- Highly animated
- Visually expressive
- Responsive
- Easy to navigate

Motion should be a major part of the experience, but animation must support the work rather than distract from it.

---

# 2. Technology

Use:

- HTML5
- CSS3
- Vanilla JavaScript
- GSAP
- GSAP ScrollTrigger

Do not use:

- React
- Vue
- Angular
- Bootstrap
- Tailwind
- heavy frontend frameworks

The site should remain simple enough for a beginner to understand and maintain.

---

# 3. Portfolio Identity

The website belongs to:

**Lay Yee Yee**

Do not use `Ye.Studio` as the website brand.

Ye.Studio is one of Lay Yee Yee's portfolio projects.

Main website logo/text:

**LAY YEE YEE**

Desktop navigation:

`LAY YEE YEE                PROJECTS   ABOUT   CONTACT`

Clicking `LAY YEE YEE` returns to the homepage.

Mobile navigation:

`LAY YEE YEE       MENU`

MENU opens an animated fullscreen navigation overlay.

---

# 4. Main Pages

The site must contain:

```text
index.html
projects.html
about.html
contact.html
```

Project case-study pages live inside:

```text
projects/
```

Current case studies:

```text
shxplorer.html
school-website.html
ye-studio.html
lovento.html
unnegotiable.html
moonlight.html
bobo.html
digbys.html
prime-academy.html
poster-designs.html
```

Photography should primarily be presented as an interactive gallery rather than a traditional case-study page.

---

# 5. Source Material

The existing PowerPoint portfolio is the primary source for:

- project imagery
- mockups
- branding
- project titles
- project descriptions
- biography
- experience
- education
- skills
- software knowledge
- overall visual direction

Do not replace existing project work with stock photography or invented designs.

Do not invent project descriptions unless placeholder text is clearly marked.

Her current portfolio describes her interests around branding, illustration, UX/UI and visual communication, which should remain visible in the website's positioning.

---

# 6. Asset Rules

Use the files already organized under:

```text
assets/
```

Expected folders include:

```text
profile/
shxplorer/
school-website/
ye-studio/
lovento/
unnegotiable/
moonlight/
bobo/
digbys/
prime-academy/
poster-designs/
photography/
```

Do not:

- download random stock images
- create fake project mockups
- replace her artwork
- rename brands
- alter the meaning of her projects

Codex should inspect each asset directory before choosing images for a section.

Use appropriate `alt` text for meaningful images.

Decorative images may use empty alt text.

---

# 7. Global Visual Direction

The website should feel like:

**Editorial graphic design × personal portfolio × interactive digital exhibition**

Avoid a generic corporate website appearance.

Use:

- large typography
- strong hierarchy
- negative space
- asymmetric compositions
- controlled overlaps
- full-bleed imagery
- editorial image cropping
- project-specific visual systems
- thin rules / lines
- occasional asterisk/star motifs
- subtle layering

Avoid:

- excessive rounded cards
- glassmorphism everywhere
- neon gradients
- generic SaaS layouts
- excessive drop shadows
- identical project cards
- repetitive fade-up animation everywhere
- excessive pill-shaped buttons

---

# 8. Master Color Direction

Use the existing PowerPoint as the palette reference.

Working global colors:

```css
--cream: #F5F0E8;
--soft-white: #FCFBF8;
--brown: #A67C5B;
--blue: #47799A;
--black: #171717;
--burgundy: #96001F;
```

These are working website approximations and can be refined visually.

Primary site palette:

- cream
- soft white
- near black
- warm brown
- muted blue

Burgundy/red is an accent rather than the dominant global color.

Individual projects may temporarily introduce their own palettes.

---

# 9. Project-Specific Visual Identity

Each major case study may have its own styling while maintaining consistent navigation and spacing.

## Shxplorer

Visual mood:

- clean
- modern
- digital
- black / white / dark red

Animation:

- interface mockup movement
- smooth image reveals
- subtle horizontal motion
- device/image parallax

The PowerPoint presents Shxplorer as a Cambodian bag brand whose interface was designed to feel simple, approachable and easy to navigate.

---

## School Website

Visual mood:

- clean
- structured
- professional
- education-focused

Animation:

- browser-window transitions
- vertical page reveals
- interface panels entering in sequence

---

## Ye.Studio

This is a project, not the portfolio brand.

Visual mood:

- minimal
- personal
- refined
- burgundy
- cream
- strong whitespace

Animation:

- large logo movement
- slow parallax
- elegant typography reveals
- branding applications entering sequentially

---

## Lovento

Visual mood:

- warm
- romantic
- elegant
- editorial

Use its existing:

- burgundy
- pink
- cream
- orange/warm tones

Animation:

- floating package mockups
- slow image movement
- layered scrolling
- elegant serif typography reveals

---

## Unnegotiable

Visual mood:

- streetwear
- bold
- gritty
- youthful

Palette:

- black
- white
- red

Animation:

- sharper typography reveals
- faster transitions
- cutout image movement
- layered text
- more energetic scroll behavior

---

## Her & Her Moonlight

Visual mood:

- editorial
- reflective
- typographic
- expressive

Animation ideas:

- horizontal page sequence
- book-page movement
- oversized words crossing the viewport
- text/image counter-motion

---

## Bobo, The Lost Puppy

Visual mood:

- illustrative
- playful
- colorful
- friendly

Animation:

- subtle floating illustrations
- character/image reveals
- gentle movement

Avoid excessive bouncing or childish interface styling.

---

## Digby's

Present as a commercial graphic-design / promotional project.

Use its actual project colors and poster imagery.

---

## Prime Academy

Present as branding / visual identity / brand-guideline work.

Keep presentation structured and sophisticated.

---

## Poster Designs

Use an editorial gallery layout.

Posters should dominate the viewport rather than appear as tiny cards.

Possible interactions:

- hover enlargement
- horizontal gallery
- scroll reveal
- fullscreen preview

---

# 10. Homepage Structure

`index.html`

Sections:

## A. Intro Loader

Short animated introduction.

Possible sequence:

```text
LAY YEE YEE
GRAPHIC DESIGN PORTFOLIO
2026
```

Duration approximately:

1–1.5 seconds.

Do not create a long fake-loading experience.

---

## B. Navigation

Sticky or intelligently hidden/revealed navigation.

Desktop:

`LAY YEE YEE      PROJECTS   ABOUT   CONTACT`

---

## C. Hero

Large editorial composition.

Suggested content:

```text
PORTFOLIO / 2026

GRAPHIC
DESIGNER

LAY YEE YEE

Branding · UX/UI · Illustration
Visual Communication · Photography
```

Use the profile imagery available in `assets/profile/`.

Hero animation:

- masked title reveal
- staggered title lines
- portrait reveal
- subtle mouse parallax
- rotating graphic motif
- scroll-based depth

---

## D. Discipline Marquee

Continuous horizontal text:

```text
BRANDING ✳ UX/UI ✳ ILLUSTRATION ✳
VISUAL COMMUNICATION ✳ PHOTOGRAPHY ✳
GRAPHIC DESIGN ✳
```

Animation should respond subtly to scroll direction or speed if practical.

---

## E. Featured Projects

Feature approximately six projects prominently:

1. Shxplorer
2. Ye.Studio
3. Lovento
4. Unnegotiable
5. Her & Her Moonlight
6. Bobo, The Lost Puppy

Each project preview should have a distinct composition.

Do not use six identical cards.

Every preview links to its corresponding case-study page.

---

## F. Project Index

After the major featured projects, include a more compact list of all work.

Possible interaction:

Hovering a project name displays a preview image beside or near the cursor.

---

## G. Photography Gallery

Interactive image gallery.

Preferred concept:

horizontal-scroll gallery driven by vertical scrolling.

Alternative:

editorial masonry layout with animated image scaling.

---

## H. About Preview

Short introduction to Lay Yee Yee.

Include:

- portrait
- brief biography
- `MORE ABOUT ME →`

Link to `about.html`.

---

## I. Contact CTA

Large typography such as:

```text
LET'S CREATE
SOMETHING
TOGETHER.
```

Link to Contact.

---

## J. Footer

Include:

- Lay Yee Yee
- email
- navigation
- copyright/year
- optional social links

---

# 11. Projects Page

`projects.html`

Page heading:

**PROJECTS**

Include category navigation:

```text
ALL
UX/UI
BRANDING
PACKAGING
GRAPHIC DESIGN
EDITORIAL
ILLUSTRATION
PHOTOGRAPHY
```

Display all projects.

Favor editorial layouts or an interactive project list over standard card grids.

Possible desktop behavior:

Project names appear as large rows.

Hovering shows an image preview.

Clicking opens the project case study.

---

# 12. About Page

`about.html`

Use content from the existing portfolio.

Current material includes:

- Graphic Design education
- Limkokwing University
- internship experience
- freelance experience
- branding
- UX/UI
- illustration
- photography
- visual communication
- software/tools

Suggested sections:

```text
ABOUT
Portrait
Biography

EDUCATION
EXPERIENCE

DISCIPLINES
TOOLS

DOWNLOAD CV
```

The page should remain visually expressive rather than looking like a résumé webpage.

Animation:

- large ABOUT title
- portrait parallax
- timeline reveals
- staggered skill/tool appearance

---

# 13. Contact Page

`contact.html`

Primary statement:

```text
LET'S CREATE
SOMETHING
TOGETHER.
```

Show email prominently.

The PowerPoint provides:

`Layyeeyee7@gmail.com`

Additional social links should only be added when actual URLs/usernames are supplied.

Possible contact form:

- Name
- Email
- Message
- Submit

Do not fake a working backend.

If no form backend exists, either omit the form initially or clearly implement an email/contact-link workflow.

---

# 14. Case Study Structure

Each project page should generally include:

```text
Navigation

PROJECT TITLE
Category / Year / Role

Hero image or animated visual

Overview

Concept

Design process / visual development

Large imagery

Mockups / applications

Final outcome

Next Project

Footer
```

Not every project needs exactly the same section count.

Content determines layout.

---

# 15. Animation System

Animation is a major requirement.

Use GSAP and ScrollTrigger.

Required motion categories:

### Entrance
- typography masks
- image reveals
- navigation entrance

### Scroll
- parallax
- pinned sections
- staggered reveals
- horizontal sequences
- scale changes
- image/typography counter-motion

### Continuous
- marquees
- subtle rotating identity symbols

### Hover
- image zoom
- typography movement
- project preview images
- arrow/link motion

### Navigation
- animated fullscreen mobile menu
- smooth page-entry experience where practical

Do not animate every element just because animation is available.

Motion should create hierarchy, rhythm and personality.

---

# 16. Accessibility

Support:

```css
@media (prefers-reduced-motion: reduce)
```

Reduce or disable nonessential motion.

Maintain readable contrast.

Navigation must remain usable by keyboard.

Interactive elements require visible focus states.

Use semantic HTML.

---

# 17. Responsive Design

Must support:

- large desktop
- normal laptop
- tablet
- mobile

Suggested breakpoints:

```css
1200px
992px
768px
480px
```

Do not simply shrink desktop layouts.

Mobile should receive redesigned compositions where necessary.

Navigation becomes fullscreen MENU.

Large typography must use responsive sizing such as `clamp()`.

---

# 18. Performance

Animations must remain smooth.

Use:

- transform
- opacity
- GSAP-optimized properties

Avoid excessive layout-triggering animations.

Images should use suitable dimensions.

Use lazy loading below the fold where appropriate.

Avoid loading every large image immediately.

---

# 19. Code Organization

Global styles:

```text
css/reset.css
css/style.css
css/responsive.css
css/animations.css
```

JavaScript:

```text
js/main.js
js/animations.js
js/project-effects.js
js/transitions.js
```

Keep JavaScript modular.

Do not place the entire website logic inside one enormous file.

---

# 20. Content Integrity

Never silently invent:

- employment history
- client relationships
- awards
- dates
- project roles
- social-media accounts
- project outcomes
- statistics

Use only material provided by Lay Yee Yee or clearly marked placeholders.

---

# 21. Definition of Done

The project is complete when:

- Home works
- Projects works
- About works
- Contact works
- every case-study page works
- navigation is consistent
- all internal links work
- no broken images exist
- desktop is polished
- tablet is polished
- mobile is polished
- GSAP animations run smoothly
- reduced-motion mode works
- all projects use the correct assets
- no stock replacement imagery is present
- no placeholder text remains unless intentionally requested
- browser console has no significant errors
- site can run locally as a static website
- site is ready to deploy to static hosting