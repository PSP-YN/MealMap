# MealMap data methodology

## Purpose
MealMap is a lightweight decision-support tool for comparing the affordability and selected nutrition attributes of meals available to students. It uses descriptive statistics and transparent arithmetic; it does not claim to use artificial intelligence or machine learning.

## Data provenance
MealMap intentionally starts with an empty dataset. It does not preload invented prices, calorie counts, protein values, canteen menus, user counts or impact statistics.

Users create records from information they have actually observed or obtained from a source, such as a current canteen or restaurant menu, a bill or displayed price list, a nutrition label, a recipe calculation with stated serving size, or a reputable nutrition reference. The optional source/note field can record where a value came from. The app does not independently verify these inputs.

## Record grain
One record represents one named meal option for one serving size on one date. For a meaningful comparison, use consistent serving sizes and units. If the same dish has a different portion size or price, record it separately.

Required fields: date (YYYY-MM-DD), meal name, price in Indian rupees (INR), energy in kilocalories (kcal), and protein in grams (g). Meal category and source/note are optional.

## Metrics and formulas
Let each record i have price Pᵢ (INR), energy Kᵢ (kcal), and protein Gᵢ (g).

- Average listed price = sum(Pᵢ) / n
- Average recorded protein = sum(Gᵢ) / n
- Median listed price = middle value after sorting prices; for an even count, the mean of the two middle values
- Price range = minimum and maximum Pᵢ
- Protein affordability = Pᵢ / Gᵢ × 10, expressed as INR per 10g protein. It is undefined when Gᵢ = 0 and is omitted from value rankings.
- Affordable option = a recorded meal whose listed price is less than or equal to the user's entered budget.
- Protein-target count = number of individually affordable meal records whose recorded protein is greater than or equal to the user's optional per-meal target.

The comparison chart scales price and protein independently within the displayed records. It is a relative visual comparison, not a common-unit scale.

## Interpretation and limitations
- Protein per rupee is one narrow affordability indicator. It is not a measure of overall nutrition, healthfulness, satiety, taste, food safety or dietary suitability.
- Calories and protein depend on portion size, recipe and preparation. User-entered estimates can be inaccurate.
- A meal option is not equivalent to a complete daily diet. The budget planner compares individual meal records; it does not construct a balanced multi-meal diet.
- Prices can change by location and date. Historical records should not be treated as current offers.
- The app does not calculate population-level food insecurity, household savings, environmental benefits or food-waste reduction.
- A small or self-selected dataset may not represent all students or vendors. Avoid generalizing beyond the records collected.

## Storage and privacy
Records are stored in the browser's localStorage on the device and browser where they were entered. There is no account, remote database, analytics tracker or server-side record collection in this version. Clearing browser data may remove records. Use CSV export to make a backup before changing devices or browsers.

## CSV format
The importer accepts a header row containing required columns: date, name, price, calories, protein. Optional columns: category, note.

Header-only template (no sample observations):

    date,name,category,price,calories,protein,note
