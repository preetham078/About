# Portfolio Website (Static)

This is a small, modern portfolio static site built with HTML, CSS and JavaScript.

Features:
- Dark theme with optional light mode
- Responsive layout for mobile and desktop
- Projects grid with cards
- Add new projects via form (stored in `localStorage`)
- Search projects by name/description
- Filter projects by technology tags
- Fetch GitHub repositories for a username (bonus)

Run locally (VS Code):
1. Open this folder in VS Code.
2. Install the Live Server extension and click "Go Live" (recommended), or run a static server:

```bash
# Using npm http-server (if you have Node):
npx http-server . -c-1

# Or Python 3:
python3 -m http.server 5500
```

3. Open `http://127.0.0.1:5500` (or the URL Live Server provides).

Notes:
- Projects are saved to browser `localStorage` under key `portfolio-projects-v1`.
- Theme preference saved under `portfolio-theme-v1`.
- To fetch GitHub repos, enter a username and click "Fetch Repos". Public repositories are added if not already present.

Files:
- [index.html](index.html)
- [css/styles.css](css/styles.css)
- [js/app.js](js/app.js)

Customize the content (your name, intro) inside `index.html`.
