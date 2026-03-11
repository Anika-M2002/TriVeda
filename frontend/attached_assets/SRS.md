# Software Requirements Specification (SRS) for Innoveda

## 1. Introduction

### 1.1 Purpose
The purpose of this software is to provide Ayurvedic dietitians and practitioners with a cloud-based, comprehensive platform to create, manage, and track patient-specific diet plans. Unlike existing nutrition software, this platform integrates Ayurvedic principles (Rasa, Virya, Vipaka, Dosha balancing) alongside modern nutritional data, improving accuracy, efficiency, and adherence.

### 1.2 Scope
- **Platform**: Web-based, cloud-hosted, with responsive support for mobile/tablet browsers.
- **Users**: Ayurvedic dietitians, doctors, and their patients.
- **Functionalities**:
    - Patient management and history tracking.
    - Automated diet chart generation based on Ayurvedic principles.
    - Detailed nutrient and Ayurvedic property analysis.
    - Recipe-based diet planning and management.
    - Reporting and potential integration with HIS/EHR systems.
- **Compliance**: Ensure data security and privacy in line with standards like HIPAA/NDHM.

### 1.3 Definitions, Acronyms, and Abbreviations
- **Rasa**: The six tastes (sweet, sour, salty, bitter, pungent, astringent).
- **Virya**: The energetic potency of food (heating or cooling).
- **Vipaka**: The post-digestive effect of food.
- **Dosha**: The fundamental Ayurvedic body-mind constitution (Vata, Pitta, Kapha).
- **Prakriti**: An individual's unique, natural constitution of Doshas.
- **HIS**: Hospital Information System.
- **EHR**: Electronic Health Record.
- **HIPAA**: Health Insurance Portability and Accountability Act.
- **NDHM**: National Digital Health Mission (India).

## 2. Overall Description

### 2.1 Product Perspective
This product is a standalone, cloud-based platform accessible via a web browser. It is designed to function independently but will include an API to allow for future integration with existing Hospital Information Systems (HIS) or Electronic Health Records (EHR). Its multi-device support ensures accessibility from desktops, tablets, and mobile phones.

### 2.2 Product Functions

#### Patient Management
- Create, update, and archive patient profiles.
- Store patient demographics, Prakriti analysis results, dietary habits, bowel movements, water intake, and relevant medical history.

#### Food Database Management
- A comprehensive database of food items with standard nutritional information (calories, macros, micros).
- Each food item will be tagged with its Ayurvedic properties (Rasa, Virya, Vipaka, effect on Doshas).
- Ability for practitioners to add new foods and create custom recipes.

#### Diet Chart Generation
- Automatically generate diet plans based on patient profile, season, and specific Dosha imbalances.
- Allow manual adjustments to the generated plans to accommodate patient preferences, allergies, or other restrictions.

#### Recipe-Based Nutrient Analysis
- Calculate total nutritional values for a meal or a day based on the recipes included.
- Calculate the overall Ayurvedic attributes of a meal (e.g., net effect on a particular Dosha).

#### Reporting & Export
- Generate printable and digital (PDF) diet charts.
- Export diet plans and patient progress reports to formats like PDF or Excel.
- Option to share diet charts directly via email.

#### Integration & Data Security
- A secure API (RESTful) for connecting with HIS/EHR systems.
- End-to-end encryption for all patient data.
- Role-based access control (RBAC) to manage permissions for different user types.

#### Mobile & Web Access
- A fully responsive user interface that adapts to various screen sizes.
- Potential for offline caching of essential data (like the current day's diet chart) for patients with limited connectivity.

### 2.3 User Classes and Characteristics

| User Role           | Characteristics                                                                                             |
|---------------------|-------------------------------------------------------------------------------------------------------------|
| **Ayurvedic Dietitian** | **Primary user.** Requires detailed diet chart generation, nutrient + Ayurvedic analysis, and patient tracking. |
| **Ayurvedic Doctor**  | **Secondary user.** Approves and monitors diet plans, integrates them with overall patient treatment protocols. |
| **Patient**           | **End-user.** Views diet charts, tracks adherence, and can optionally log meals or provide feedback to the practitioner. |

## 3. Specific Requirements: Core Functionalities

### 3.1 Extensive Food Database
The software must feature a large, searchable database of over 8,000 food items, covering Indian, regional, and global cuisines. Each item must include both nutritional data (calories, macros, vitamins, minerals) and Ayurvedic attributes (Rasa – taste, Virya – heating/cooling nature, Guna – qualities like light/heavy, and their effect on Vata, Pitta, Kapha).

### 3.2 Ayurveda + Modern Nutrition Integration
The tool must classify foods based on Ayurvedic principles, showing whether a food balances or aggravates a Dosha, its digestive quality, and its impact on the patient’s constitution (Prakriti). This is in addition to standard nutritional data.

### 3.3 Automated Diet Chart Generation
Practitioners must be able to input a patient’s complete profile—including age, gender, Prakriti, symptoms, lifestyle, bowel movements, and water intake—to instantly generate a ready-to-use diet chart that is both nutritionally balanced and aligned with Ayurvedic guidelines.

### 3.4 Recipe-Based Nutrient Analysis
The tool must allow practitioners to create or modify recipes by adding ingredients and automatically calculate both the nutritional breakdown and the Ayurvedic properties (Rasa, Guna, Virya, etc.) of the resulting dish.

### 3.5 Patient Management System
The solution will serve as a practice management tool with secure storage for all patient records. This includes medical history, past diet charts, progress tracking, and automated follow-up reminders, enabling practitioners to dynamically adjust diets and monitor outcomes.

### 3.6 Reporting & Chart Sharing
The software must generate printable or digitally shareable reports and diet plans in a clean, structured format. This allows practitioners to easily deliver plans to patients via email or as a physical copy.

### 3.7 Mobile & Cloud Support
The system must be cloud-based to ensure practitioners can access patient data and manage diet plans from any location. It must also feature a mobile-friendly, responsive interface for on-the-go access.

### 3.8 Security & Compliance
Given the handling of sensitive patient data, the solution must adhere to HIPAA or equivalent local health data privacy regulations, ensuring robust data encryption, secure storage, and controlled access.

### 3.9 Integration with Hospital Systems
Ideally, the software should be designed with the capability to integrate with existing Hospital Information Systems (HIS) or Electronic Health Records (EHR) to enable automatic synchronization of patient data.

### 3.10 Core Functionality Examples

| Feature                             | Example                                                                                                                            |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Dynamic Food Database (8,000+ items)** | “Mung Dal Khichdi” is tagged as Light, Easy to Digest, Cooling, Madhura Rasa (Sweet Taste) along with its calories, protein, and carbs. |
| **Ayurveda + Modern Nutrient Integration** | Automatically calculates macros (carbs/proteins/fats) and Ayurvedic attributes (Hot/Cold, Dosha balancing properties).             |
| **Automated Diet Chart Generation**     | For a Pitta-prone patient: generates a diet plan favoring cooling foods (cucumber, milk, ghee) and avoiding heating foods (chili, fried snacks). |
| **Comprehensive Patient Profile**       | Collects Age, Gender, Prakriti, Bowel movement frequency, Sleep cycle, Water intake, Meal timings, etc., and adapts plans accordingly. |
| **Recipe-Based Nutrient Analysis**      | A doctor inputs recipe ingredients, and the software calculates total calories, nutrients, Rasa, Virya (potency), and Vipaka (post-digestive effect). |
| **Practice Management Module**          | Securely stores patient records, schedules follow-ups, maintains a history of diet modifications, and tracks progress over time.      |

## 4. Business & Growth Strategy

### 4.1 Growth Levers
- **Doctor-Centric Network Effects:** More doctors onboard → richer data on foods, symptoms, outcomes → stronger personalization engine → attracts more doctors.
- **Closed Community:** Build a closed community where Ayurvedic doctors exchange charts and anonymized patient insights to increase stickiness.
- **Patient Engagement Flywheel:** Patients log meals + symptoms → doctors see compliance → AI refines recommendations → patients get better outcomes → more word of mouth.
- **Gamification:** Layer gamification (badges, streaks, community challenges) to improve patient engagement.

### 4.2 Go-To-Market Strategy
- **Cultural Advantage:** Position as “the only nutrition platform built for India’s food culture & Ayurveda,” creating a strong market entry moat.
- **Initial Market:** Start with Tier-1 city wellness clinics.
- **Expansion:** Expand to Tier-2 Ayurvedic colleges & hospitals.
- **Trojan Horse Play:** Offer a free patient-facing app to upsell a premium doctor dashboard.
- **Integration Hack:** Partner with HealthifyMe or Practo for an Ayurveda module to gain an instant user base.
- **Influencer Hack:** Collaborate with wellness influencers (Instagram, YouTube) for credibility and adoption.

### 4.3 Revenue Experiments
- **Consumer Subscription:** Offer a subscription for advanced meal tracking and personalized plans.
- **API Licensing:** License the API to hospitals and research organizations building Ayurveda datasets.