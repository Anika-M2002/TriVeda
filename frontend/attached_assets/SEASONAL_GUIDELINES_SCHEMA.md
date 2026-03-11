# Seasonal & Regional Guidelines Dataset Schema

## Purpose

Capture Ayurvedic dietary recommendations per season, geography, and dosha type to adjust diet plans dynamically.

## Schema (JSON/CSV Fields)

*   **season_id** (string, required): Unique identifier (e.g., SHARAD-IND-NORTH).
*   **season_name** (string, required): e.g., Sharad, Varsha, Hemant.
*   **region** (string, required): Geographical area (India-North, India-South, etc.).
*   **dosha_focus** (enum: vata, pitta, kapha, all, required): Dosha most affected in this season.
*   **recommended_foods** (array of strings, required): List of recommended food items.
*   **avoided_foods** (array of strings, required): Foods to avoid.
*   **general_guidelines** (text, required): Short paragraph summarizing regimen.
*   **lifestyle_recommendations** (text, optional): e.g., exercise, yoga, sleep advice.
*   **seasonal_allergies_precautions** (text, optional): E.g., pollen season notes.
*   **data_source** (enum: synthetic, real_verified, required).

## Integration Notes

*   Dynamically adjust recipe suggestions using this dataset.
*   Filter food/recipes by season & region before final plan generation.
*   Collect feedback from doctors/patients to validate effectiveness.
