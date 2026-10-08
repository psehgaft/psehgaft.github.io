# Heber Romero Téllez — Public Portfolio

Personal site: https://psehgaft.github.io/

## Design and features

- Hacker theme with green terminal accents and an optional amber expedition theme.
- Responsive, original SVG mountain/route illustration; no stock photography presented as personal photos.
- Profile, selected projects, conference sessions, blog, Instagram, community mentions, and social links.
- Searchable snapshot of public repositories: 620 personal repositories and 23 Open Industries repositories, collected on October 8, 2026. Includes forks and is not a count of original projects.
- Local navigation terminal: `help`, `whoami`, `proyectos`, `redes`, `charlas`, `explorar`, `clear`. Input is rendered as text and never executed.
- No build tools, trackers, remote font dependencies, or third-party scripts.

## Local preview

Run from the repository root:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/. An HTTP server is required for the repository JSON catalog; opening the HTML as a `file://` URL does not load it reliably.

## Publishing

Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

Merge the portfolio PR to update the published site.

## Editing

- `index.html`: profile, curated projects, talks, mentions, blog and social links.
- `assets/style.css`: responsive layout and themes.
- `assets/app.js`: terminal navigation, theme persistence, search and pagination.
- `assets/repositories.json`: public repository snapshot. Update manually when needed; it does not synchronize automatically.
- `SOURCES.md`: content provenance and verification limits.

Only add repositories whose current visibility is public. Recheck the snapshot before updates; remove entries when repositories become private or are deleted. Links to social platforms can require a login or stop working over time.
