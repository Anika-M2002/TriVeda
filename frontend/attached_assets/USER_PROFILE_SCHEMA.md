# User Profile Schema and Integration Notes

This document outlines the data schema for the user profile and provides notes on its integration within the application.

## Goal

Capture user demographic, lifestyle, and health parameters to generate personalized diet charts and predict prakriti/vikriti.

## Schema (JSON/CSV Fields)

*   **user_id** (string, required): Unique identifier.
*   **name** (string, optional): Name for doctor reference.
*   **age** (integer, required): Age of patient.
*   **gender** (enum: male, female, other, required).
*   **weight_kg** (float, required).
*   **height_cm** (float, required).
*   **bmi** (float, auto-calculated).
*   **dietary_habits** (enum: veg, non-veg, vegan, eggetarian, optional).
*   **meal_frequency_per_day** (integer, optional).
*   **bowel_movements_per_day** (integer, optional).
*   **water_intake_liters** (float, optional).
*   **prakriti_predicted** (enum: vata, pitta, kapha, dual, tridoshic, required): ML-predicted.
*   **prakriti_verified** (enum: vata, pitta, kapha, dual, tridoshic, optional): Doctor-verified.
*   **vikriti_predicted** (enum: same as above, optional).
*   **vikriti_verified** (enum: same as above, optional).
*   **health_goals** (array: weight_loss, digestion, skin, energy, etc., optional).
*   **allergies** (array of strings, optional).
*   **chronic_conditions** (array: diabetes, hypertension, etc., optional).
*   **region** (string, optional): To link with seasonal dataset.
*   **data_source** (enum: synthetic, real_verified, required): Tag to distinguish data origin.

## Integration Notes

*   **Prediction Flow:** User answers quiz → system predicts prakriti/vikriti → doctor verifies → updates dataset.
*   **Retraining:** Trigger model fine-tuning every 500+ new `real_verified` profiles.
