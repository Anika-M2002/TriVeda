# Triveda Ayurvedic Diet Management Platform - Design Guidelines

## Design Approach: Healthcare System-Based
**Selected Framework**: Fluent Design System with healthcare-specific adaptations
**Justification**: Professional medical interface requiring trust, clarity, and government-grade aesthetics for healthcare practitioners

## Core Design Elements

### A. Color Palette
**Primary Colors**:
- Light mode: 142 69% 58% (sage green - Ayurvedic healing)
- Dark mode: 142 45% 35% (deeper sage)

**Secondary Colors**:
- Light mode: 35 25% 95% (warm neutral backgrounds)
- Dark mode: 220 15% 12% (dark professional)

**Accent Colors**: 
- Success: 120 60% 50% (natural green for positive actions)
- Warning: 45 85% 55% (warm amber for attention)
- Error: 0 65% 55% (muted red for alerts)

### B. Typography
**Primary Font**: Inter (Google Fonts) - excellent readability for medical data
**Secondary Font**: Merriweather (Google Fonts) - for Ayurvedic content and philosophy sections
**Scale**: 
- Headers: 24px, 20px, 18px (font-medium to font-semibold)
- Body: 16px, 14px (font-normal)
- Captions: 12px (font-light)

### C. Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)
**Grid**: 12-column responsive grid with consistent 6-unit gutters
**Containers**: Max-width containers with 4-unit padding for readability

### D. Component Library

**Navigation**:
- Role-based sidebar navigation with clear hierarchy
- Breadcrumb navigation for complex workflows
- Tab-based navigation for patient data sections

**Forms**:
- Multi-step forms for patient registration and Prakriti assessment
- Grouped form sections with clear labels and validation
- Toggle switches for dietary preferences and restrictions

**Data Displays**:
- Card-based layouts for patient profiles and diet charts
- Data tables with sorting and filtering for food database
- Progress indicators for patient journey tracking
- Charts for nutritional analysis (donut charts for macro breakdown)

**Overlays**:
- Modal dialogs for diet chart approval workflows
- Slide-over panels for detailed patient information
- Toast notifications for system feedback

### E. Healthcare-Specific Design Patterns

**Dashboard Layout**:
- Clean, spacious layouts with ample whitespace
- Card-based information architecture
- Color-coded status indicators (subtle, not alarming)

**Professional Aesthetics**:
- Minimal shadows and subtle borders
- Conservative border radius (4px-6px)
- Professional photography for Ayurvedic ingredients when available

**Data Visualization**:
- Accessible color schemes for charts and graphs
- Clear hierarchical typography for medical information
- Consistent iconography from Heroicons library

## Role-Specific Interface Considerations

**Doctor Interface**: 
- Efficiency-focused with quick access to patient lists
- Approval workflows with clear action buttons
- Professional color scheme emphasizing trust

**Patient Interface**:
- Welcoming, educational tone with warmer accent colors
- Simplified navigation focusing on viewing and tracking
- Educational content areas with readable typography

**Admin Interface**:
- Data-dense layouts with filtering capabilities
- System management tools with clear permissions
- Reporting dashboards with clean data visualization

## Accessibility & Responsiveness
- WCAG 2.1 AA compliance throughout
- Consistent dark mode implementation across all interfaces
- Mobile-first responsive design for patient portal
- High contrast ratios for medical data readability

This design system balances professional healthcare requirements with the holistic, natural principles of Ayurveda, creating a trustworthy platform suitable for medical practitioners and patients alike.