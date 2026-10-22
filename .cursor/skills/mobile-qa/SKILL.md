---
name: mobile-qa
description: Check the homepage for horizontal overflow on phone viewports. Use after layout, CSS, or calendar changes, or when the user mentions mobile width.
---

# Mobile QA

Start the app (`npm run dev` or `npm run start`), then:

```bash
MOBILE_CHECK_URL=http://127.0.0.1:3000 npm run mobile-check
```

`scripts/mobile-check.mjs` opens Playwright at iPhone 13, Pixel 7, 440px, and 375px (touch, mobile). It scrolls the whole page, including the calendar, architecture, and editor, then asserts `scrollWidth <= clientWidth` and `innerWidth <= clientWidth` in light and dark. Compare against `clientWidth`: on the calendar bug, `innerWidth` grows with the table and a check against `innerWidth` stays green. Set `CHROME_PATH` if Chrome is not on the default path.
