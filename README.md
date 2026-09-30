# Lay Yee Yee — portfolio

A static graphic-design portfolio built with HTML, CSS, vanilla JavaScript, GSAP and ScrollTrigger. No build or package installation is required.

Open `index.html` directly, or serve this directory with any static HTTP server. Animation libraries load from jsDelivr; without them, the content and navigation remain usable.

## Homepage foundation

- `index.html`: all homepage sections and supplied portfolio assets.
- `css/reset.css`: baseline element styling.
- `css/style.css`: palette, typography, layout and shared components.
- `css/animations.css`: interaction states, menu entrance and static motion fallback.
- `css/responsive.css`: tablet and mobile compositions.
- `js/main.js`: mobile navigation and persistent motion preference.
- `js/animations.js`: optional GSAP entrance, marquee, reveals and scroll motion.

Reduced motion follows the operating-system preference. The footer also provides a motion toggle. All source assets remain in their original folders.

Only the homepage is implemented. `projects.html`, `about.html`, `contact.html` and the existing project pages intentionally remain empty for the next phase. The older empty `work.html`, singular animation files and `js/project-effects.js` are preserved and are not loaded by the homepage.

Local browser checks and screenshots are in the ignored `.preview/` directory; they are not site dependencies or deployment files.
