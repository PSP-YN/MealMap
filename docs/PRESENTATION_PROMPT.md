# Copy-ready prompt for the INNOVATE presentation

Replace the website placeholder with the verified production URL after deployment. Attach screenshots from the real deployed website if the presentation tool supports reference images.

---

Create a polished, competition-ready five-slide presentation for the INNOVATE online competition.

## Presenter and team details
- **Presenter:** Putta Shankar Prasad Y N
- **Team name:** CHAKRAVYUHA
- **Project:** MealMap
- **Project title:** MealMap — Student Food Affordability & Nutrition Analytics
- **Live prototype:** https://mealmap-ochre.vercel.app
- **Source repository:** https://github.com/PSP-YN/WasteWise

## Project summary
MealMap is a simple, working web application that helps students compare meal affordability with selected serving-level nutrition information. Users enter real meal records containing date, meal name, price in INR, calories in kcal, and protein in grams. The website calculates descriptive statistics, visualizes price-versus-protein comparisons, identifies the lowest listed price and highest recorded protein, calculates INR per 10g protein where applicable, and filters meal options against a user-entered budget.

The project uses HTML, CSS and vanilla JavaScript, browser localStorage, CSV import/export and client-side calculations. It uses statistics and data analytics, not AI or machine learning. It does not ship with fake, synthetic or preloaded sample observations. All displayed analytical values must come from genuine records entered by the presenter or collected from verifiable sources.

## Required slide structure

### Slide 1 — The problem
Title: "Choosing an affordable meal should be an informed decision."
Explain the student problem: meal choices are often compared by price alone, while comparable serving-level nutrition information may be scattered or difficult to assess. Identify students, hostel residents and people managing a limited food budget as intended users. Use no unsupported statistics. Make the problem concrete and concise.

### Slide 2 — The solution: MealMap
Show the user journey:
1. Record a meal using a real menu price and nutrition source.
2. Compare meal price and recorded protein/calories.
3. Set a budget and inspect affordable recorded options.
Explain the value: one simple view of affordability and selected nutrition information, with transparent calculations.

### Slide 3 — Data analytics and methodology
Show the formulas:
- Average price = sum of listed meal prices / number of records.
- Average protein = sum of recorded protein / number of records.
- Protein affordability = price / protein × 10 (INR per 10g protein).
- Budget filter = recorded meal price ≤ user-entered budget.
Mention median price, minimum/maximum price and price-versus-protein visualization. State that protein affordability is only one comparison measure, not a complete nutrition score. Do not describe the project as AI/ML.

### Slide 4 — Working prototype
Use genuine screenshots of the deployed MealMap application. Show the meal-entry form, analytics cards/chart, records table and budget planner. Use actual records collected by the presenter only. Do not fabricate screenshot values or invent users, usage, results or impact. Include a clearly visible live website link:
[INSERT VERIFIED VERCEL PRODUCTION URL]

### Slide 5 — Impact, feasibility and next steps
Explain practical value: help students compare known meal options, support more informed budget decisions, and provide a simple template for student groups or canteens to maintain dated meal information. Explain current scope honestly: local browser storage, manually entered data, no verified institution-wide dataset yet. Next steps may include a real campus pilot, vendor menu updates, optional shared data storage and broader nutrition-source validation. End with the team and presenter details.

## Visual direction
- 16:9 widescreen, clean editorial/data-analytics style.
- Palette: deep leafy green, warm cream, muted sage, tomato red/coral and a restrained turmeric/mustard accent.
- No blue or purple. No gradients. No generic AI brain, robot or glowing circuit imagery.
- Use high-quality food photography sparingly and real product screenshots prominently.
- Use clear charts, large readable numbers and generous whitespace.
- Professional typography, consistent spacing and restrained iconography.
- Keep text concise; use one key message per slide.
- Charts must be based only on the real evidence supplied with the prompt.
- Add a small footer: "MealMap · CHAKRAVYUHA · INNOVATE".

## Accuracy and integrity constraints
- Do not invent survey results, market size, food-waste numbers, student counts, savings percentages, nutrition values or pilot outcomes.
- If a real statistic is added, cite the source on the slide.
- Clearly label any calculation as an example only if it is genuinely based on a disclosed example dataset; the preferred deck should use the presenter's actual collected records.
- Do not claim MealMap diagnoses nutritional deficiencies, recommends medical diets or measures complete dietary quality.
- Do not claim the current app uses AI or machine learning.
- Do not claim data is shared across users: records are currently stored locally in the browser.
- Do not call the prototype production-validated beyond the tests actually completed.

Deliver a visually cohesive five-slide deck and concise speaker notes suitable for a five-minute finale presentation.
