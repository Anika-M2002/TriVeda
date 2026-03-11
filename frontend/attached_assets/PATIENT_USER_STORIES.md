# Patient Persona User Stories

| ID | User Story | Priority | Why This Matters |
|---|---|---|---|
| P1 | As a patient, I want to receive my diet chart in my regional language so that I clearly understand what to eat. | Must-Have | Multilingual support is critical in India; improves adoption. |
| P2 | As a patient, I want to log my meals and symptoms easily so that I can share accurate data with my doctor. | Must-Have | Core engagement loop; feeds back into personalization engine. |
| P3 | As a patient, I want to reminders for meals and check-ins so that I can stay compliant with my plan. | Should-Have | Boosts adherence by 30–40%; increases NPS and outcomes. |
| P4 | As a patient, I want to get instant feedback if my logged meal is off-plan so that I can correct it in real-time. | Should-Have | Adds gamification; improves learning & habit formation. |
| P5 | As a patient, I want to share my progress with family members so that they can support me in following my diet. | Could-Have | Adds virality but can wait until after core flow is smooth. |

## Patient Onboarding Sequence Diagram

```mermaid
sequenceDiagram
    participant P as 👤 Patient
    participant S as 🤖 System
    participant M as 🧠 ML Service
    participant D as 🩺 Doctor
    participant DB as 🗄️ DB

    P->>S: Submit sign-up + quiz
    S->>S: Calculate BMI
    S->>M: POST /predict/prakriti (quiz + bmi)
    M-->>S: {prakriti, confidence, reasons}
    S->>DB: Create profile (data_source=real_raw, prakriti_predicted)
    S->>D: Notify / show prediction
    D->>S: Approve or Correct
    S->>DB: Update profile (prakriti_verified, data_source=real_verified)
    S->>S: Emit profile_verified event
```