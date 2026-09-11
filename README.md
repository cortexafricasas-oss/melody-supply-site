# Melody Supply — website

Vite + React. English, US/international market. Audience: dollar store operators.

- `studio/` (in the parent folder) holds the brief, art direction, storyboard,
  credit log, the fact registry and every review round.
- Every displayed figure comes from `src/facts.json`. Never hard-code a number:
  run `check_facts.py` before deploying.
- Deployed by GitHub Actions to GitHub Pages. Set `base` in `vite.config.ts`
  to match the repository name, or leave `/` for a root domain.

## Develop

```bash
npm install
npm run dev
npm run build && npm run preview
```
