# Seasonal Guideline Flow (Actor-Based)

This flowchart illustrates the process of generating seasonal guidelines, with a clear separation of responsibilities between the System, Doctor, and Dataset.

```mermaid
flowchart TD
    subgraph System 🤖
        A[Detect Season & Region]
        B[Fetch Seasonal Guidelines]
    end
    subgraph Doctor 🩺
        C[Review/Adjust Guidelines (Optional)]
    end
    subgraph Dataset 🗄️
        D[Store Guidelines & Link with Patient Profile]
    end
    A --> B --> C --> D
```
