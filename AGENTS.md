# Campaign Landing Page Standards

## Goal
Build production-ready campaign landing pages with agency-quality design, clear conversion paths, smooth interactions, and reliable performance.

## Working principles
- Inspect the existing project before changing code.
- Preserve working functionality unless the task explicitly requests a change.
- Make changes directly in the project. Do not stop at recommendations.
- Prefer simple, maintainable solutions over unnecessary frameworks or dependencies.
- Reuse existing components, styles, tokens, and assets.
- Keep content easy for a marketing team to update.
- Never claim completion until the changed experience has been checked.

## Performance targets
- Aim for Lighthouse Performance, Accessibility, Best Practices, and SEO scores of 90 or above where practical.
- Target LCP under 2.5 seconds, INP under 200 ms, and CLS under 0.1.
- For WebGL, target 60 FPS on capable desktop devices and at least 30 FPS on mid-range mobile devices.

## Quality gate
Before finishing, run available build, lint, type-check, and test commands; check responsive layouts, accessibility, performance, console output, and key interactions.
