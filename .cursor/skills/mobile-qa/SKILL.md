---
name: mobile-qa
description: Check the homepage for horizontal overflow on phone viewports. Use after layout, CSS, or calendar changes, or when the user mentions mobile width.
---

# Mobile QA

Start the app (`npm run dev` or `npm run start`), then:

```bash
MOBILE_CHECK_URL=http://127.0.0.1:3000 npm run mobile-check
```

`scripts/mobile-check.mjs` opens Playwright’s iPhone 13 and Pixel 7 presets (touch, mobile) and asserts `document.documentElement.scrollWidth <= innerWidth` in light and dark. It scrolls projects, notes, the record, and the footer, and mounts a 52-week calendar when GitHub data is absent. Set `CHROME_PATH` if Chrome is not on the default path. A failure means some element is widening the layout viewport.
