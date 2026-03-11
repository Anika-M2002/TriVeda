# Patient Flow

## Flow B — Patient: Receive chart → Log meals → Get feedback

**Goal:** Patient follows diet, logs meals, receives nudges.

### Screens / Steps

1.  **Receive chart (via app / link)**
    *   First open: Onboarding micro-tutorial (1 screen) explaining logging & reminders.

2.  **View Diet Chart**
    *   Language localized. Each meal shows foods, portions, substitutes, and “Why this is recommended” micro-copy.

3.  **Meal Logging**
    *   Quick “What did you eat?” UI: select meal slot → quick search for food (common foods + OCR or camera for advanced later) → enter portion (small/med/large) → add symptom checkbox
    *   Minimal friction: default to “took meal” with one-tap

4.  **Reminders & Nudges**
    *   Reminders configurable (morning/afternoon/evening). Push / SMS fallback.

5.  **Real-time feedback**
    *   If logged meal is off-plan, show a suggestion: alternative/digestive tip + “ask doctor” CTA

6.  **Progress / Streak**
    *   Simple progress UI: compliance % for week, streaks (gamification optional)

### Acceptance Criteria

*   **Given** a patient with an active diet chart, **When** they log a meal, **Then** the entry is visible to the doctor on their dashboard within 1 minute and increments compliance score appropriately.
*   **Given** missing network, **When** patient logs, **Then** the app queues entries and syncs on network restore.

### Edge Cases

*   Patient uses a dialect not supported → fallback language + allow family member to pick language.
*   Multiple family members log against same account → show “who logged” metadata to avoid confusion.
