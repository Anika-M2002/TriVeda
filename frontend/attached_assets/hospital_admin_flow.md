# Hospital Admin Flow

## Flow C — Hospital Admin: Integration & Reporting

**Goal:** Hospital uses the product across multiple doctors and links to EHR.

### Screens / Steps

1.  **Admin portal — clinic overview, users, subscriptions**

2.  **User roles — invite staff, assign doctors, nursing staff**

3.  **Export / Integrate**
    *   Export patient data (CSV), or API keys for EHR integration

4.  **Reports**
    *   Clinic-level compliance, top non-compliant cohorts, average chart generation time

### Acceptance Criteria

*   **Given** admin rights, **When** admin requests export, **Then** a CSV with patient compliance and last 90-day logs is downloadable.
*   **Given** an API key, **When** the hospital pushes patient demographics, **Then** system associates or creates patient records with unique id mapping.

### Edge Cases

*   Data governance restrictions: must honor hospital data-retention policies (ability to soft-delete / anonymize).
