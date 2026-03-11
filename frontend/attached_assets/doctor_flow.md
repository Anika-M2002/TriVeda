# Doctor Flow

## Flow A — Doctor: Onboard → Create diet chart → Share → Monitor

**Goal:** Doctor produces a high-quality, personalized diet chart and starts monitoring compliance.

### Screens / Steps

1.  **Sign up / Onboard (Clinic registration)**
    *   **Screens:** Signup (email/phone) → Clinic info (name, license no, languages supported) → Role setup (Primary doctor, staff invite)
    *   **Data:** name, clinic_id, verification docs (optional)
    *   **Validation:** phone/email verified

2.  **Doctor Home / Patient list**
    *   **Shows:** active patients, flagged patients, “Create new patient” CTA

3.  **New Patient intake**
    *   **Screens:** Basic demographics (name, age, gender), medical history (checkboxes), Prakriti assessment link
    *   **Data:** PatientID, contact, preferred language, baseline vitals

4.  **Prakriti Assessment (Quick)**
    *   10–15 question guided digital form (defaults + tooltips)
    *   **Output:** PrakritiProfile (Vata/Pitta/Kapha blend scores), AgniScore, SeasonalSensitivity

5.  **Generate Diet Chart**
    *   **Button:** “Auto-generate diet chart”
    *   **Input:** PrakritiProfile + allergies + preferences + current symptoms + desired goals
    *   **Output:** Draft DietChart with daily meals, portion guidance, rationale (Ayurvedic + nutritional)
    *   **UI:** side-by-side “AI suggestion” + “Edit” panel

6.  **Edit & Approve**
    *   Doctor edits items, adds notes, local food substitutions, regional language verification

7.  **Share with Patient**
    *   **Delivery options:** app push / WhatsApp / SMS link / PDF download
    *   Patient receives chart in selected language

8.  **Monitoring Dashboard**
    *   **Shows:** Compliance score (last 7/30 days), recent logs, flagged non-compliant patients
    *   **Alerts:** Low compliance, symptom escalation

### Acceptance Criteria (example)

*   **Given** a completed Prakriti assessment and patient preferences, **When** the doctor clicks “Generate”, **Then** the system returns a draft diet chart with at least 3 meals/day + rationale, within functional SLA (target metric: generated chart in under X seconds — a performance metric, not a delivery promise).
*   **Given** a generated chart, **When** the doctor edits and approves, **Then** the patient receives a localized chart via chosen channel within 10 seconds.
