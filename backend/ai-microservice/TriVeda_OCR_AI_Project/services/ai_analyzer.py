import re


def extract_values(text):

    text = text.lower()

    data = {}

    patterns = {
        "hemoglobin": r"hemoglobin.*?(\d+\.?\d*)",
        "wbc": r"wbc.*?(\d+\.?\d*)",
        "rbc": r"rbc.*?(\d+\.?\d*)",
        "platelet": r"platelet.*?(\d+\.?\d*)",
        "mcv": r"mcv.*?(\d+\.?\d*)"
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            data[key] = float(match.group(1))

    return data


def medical_summary(data):

    issues = []

    # Hemoglobin
    hb = data.get("hemoglobin")
    if hb:
        if hb < 13:
            issues.append("Low Hemoglobin (Possible Anemia)")
        elif hb > 17:
            issues.append("High Hemoglobin")

    # WBC
    wbc = data.get("wbc")
    if wbc:
        if wbc > 11000:
            issues.append("High WBC (Possible Infection)")
        elif wbc < 4000:
            issues.append("Low WBC (Weak Immunity)")

    # Platelets
    plt = data.get("platelet")
    if plt:
        if plt < 150000:
            issues.append("Low Platelet Count")
        elif plt > 450000:
            issues.append("High Platelet Count")

    if not issues:
        return "No major abnormalities detected."

    return ", ".join(issues)


def ayurveda_interpretation(summary):

    summary = summary.lower()

    if "anemia" in summary:
        return "This may indicate Pitta imbalance affecting Rakta Dhatu (blood), often linked with weakness and fatigue."

    if "infection" in summary:
        return "This may indicate aggravated Pitta and Kapha dosha, associated with inflammation and immune response."

    if "low platelet" in summary:
        return "This may indicate Vata imbalance affecting blood tissue stability."

    return "Overall dosha balance appears relatively stable."


def analyze_report(ocr_text):

    values = extract_values(ocr_text)

    summary = medical_summary(values)

    ayurveda = ayurveda_interpretation(summary)

    return summary, ayurveda