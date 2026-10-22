---
name: ship-pr
description: Branch from main, verify, and open a pull request with Dave as the only author. Use when committing or opening a PR.
---

# Ship a PR

1. `git fetch origin main` and branch from that tip.
2. Author and committer: Dave Emanuel Lima `<99727483+DeybLims@users.noreply.github.com>`. No Co-authored-by, Cursor, or other trailers. If a hook adds one, recommit with `git -c core.hooksPath=/dev/null` and those env vars. Do not change git config.
3. Verify: `npm run lint`, `npm run typecheck`, `npm run build`. For UI, run `npm run mobile-check` and look at light and dark.
4. Do not commit `.env*`, secrets, demo credentials, or `scripts/.resume-build.mjs`.
5. Push and open the PR against `main`.
