# MealMap — Student Food Affordability & Nutrition Analytics

**INNOVATE project by team CHAKRAVYUHA**  
**Presenter:** Putta Shankar Prasad Y N

MealMap is a lightweight web application that helps students compare the listed price of meal options with selected serving-level nutrition information. It uses transparent descriptive statistics and data visualization—not AI or machine learning.

## Live application
Production URL: https://mealmap-ochre.vercel.app

## What it does
- Records meal name, date, category, price (INR), calories (kcal), protein (g), and an optional source/note.
- Calculates average meal price, average recorded protein, median price, price range and protein affordability (INR per 10g protein).
- Visualizes price and protein comparisons.
- Generates concise insights from the user's saved records.
- Filters recorded meal options against a user-entered budget and optional per-meal protein target.
- Supports record editing/deletion, search, CSV import and CSV export.
- Persists records in the current browser using localStorage.

## No fabricated data
The app starts with an empty dataset. It does not ship with fake/sample meal prices, nutrition facts, user counts or impact statistics. All displayed metrics are calculated from meal records entered by the user. For a credible competition demo, collect current prices from a real menu and nutrition values from labels, vendor information, recipe calculations or reliable references. Record sources and serving sizes consistently.

## Run locally
No package installation or build step is required.

    python3 -m http.server 4173

Open http://localhost:4173.

Alternatively, open index.html directly in a modern browser.

## Deploy
This is a static website and can be hosted on Vercel, GitHub Pages or another static host. The Vercel project should use the repository root as its root directory and no build command; the output is the repository root.

## Data and privacy
- Records are stored locally in the browser where they were entered.
- There is no login, cloud sync, remote database, server-side collection or analytics tracker.
- Export CSV regularly to back up records or move them to another browser/device.
- Clearing browser storage can delete saved records.

## Analytics definitions
- Average price = sum of meal prices / number of records.
- Average protein = sum of recorded protein / number of records.
- Median price = median of sorted meal prices.
- Protein affordability = price / protein × 10 (INR per 10g protein), undefined for zero-protein entries.
- Budget match = a recorded meal with price less than or equal to the user's budget.

Protein affordability is one narrow comparison metric, not a complete nutrition or health score. The budget planner compares individual meal options; it does not create a complete daily diet plan.

## Project structure
- index.html — accessible application structure and page content
- styles.css — responsive visual system and layout
- app.js — local data handling, calculations, CSV workflows and interactions
- docs/DATA_METHODOLOGY.md — data provenance, formulas and limitations
- docs/DEMO_AND_SUBMISSION.md — INNOVATE demo plan and evidence checklist
- docs/PRESENTATION_PROMPT.md — copy-ready five-slide presentation prompt

## Competition demo
See [docs/DEMO_AND_SUBMISSION.md](docs/DEMO_AND_SUBMISSION.md).  
For the presentation, use [docs/PRESENTATION_PROMPT.md](docs/PRESENTATION_PROMPT.md).

## Limitations and future work
The current version is a local-first prototype. Records are not shared between users or devices. A real campus pilot would be needed before claiming measurable changes in affordability, nutrition outcomes or student behaviour. Future work could include optional shared data storage, dated vendor menu updates, source verification and a larger campus dataset.

## License
MIT
