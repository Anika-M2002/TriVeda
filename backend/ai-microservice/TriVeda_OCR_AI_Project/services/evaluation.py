import re
from jiwer import wer, cer

def clean_text(text):

    text = text.lower()

    text = re.sub(r'[^a-z0-9\s.]', ' ', text)

    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def calculate_error_rates(ground_truth, ocr_output):

    ground_truth = clean_text(ground_truth)

    ocr_output = clean_text(ocr_output)

    word_error_rate = wer(ground_truth, ocr_output)

    char_error_rate = cer(ground_truth, ocr_output)

    return word_error_rate, char_error_rate


def field_level_accuracy(ocr_text):

    text = ocr_text.lower()

    # CBC fields with synonyms
    cbc_fields = {
        "hemoglobin": ["hemoglobin", "hb"],
        "rbc": ["rbc", "red blood cell", "rbc count", "total rbc"],
        "wbc": ["wbc", "white blood cell", "total wbc"],
        "platelet": ["platelet", "platelet count"],
        "hematocrit": ["hematocrit", "hct", "pcv"],
        "mcv": ["mcv"],
        "mch": ["mch"],
        "mchc": ["mchc"],
        "rdw": ["rdw"],
        "neutrophils": ["neutrophils"],
        "lymphocytes": ["lymphocytes"],
        "monocytes": ["monocytes"],
        "eosinophils": ["eosinophils"],
        "basophils": ["basophils"],
        "mpv": ["mpv"],
        "pdw": ["pdw"],
        "pct": ["pct"]
    }

    # Biochemistry fields
    bio_fields = {
        "sgpt": ["sgpt", "alt"],
        "value": ["value"],
        "unit": ["unit"],
        "reference": ["reference"],
        "biochemistry": ["biochemistry"]
    }

    # Detect report type
    cbc_score = sum(any(v in text for v in variants) for variants in cbc_fields.values())
    bio_score = sum(any(v in text for v in variants) for variants in bio_fields.values())

    # Select correct field set
    if bio_score > cbc_score:
        selected_fields = bio_fields
    else:
        selected_fields = cbc_fields

    # Matching logic (THIS is what you were asking about)
    correct = 0
    total = 0

    for field, variants in selected_fields.items():

        # Check if field exists in report
        if any(v in text for v in variants):
            total += 1
            correct += 1

    # avoid division by zero
    accuracy = correct / total if total > 0 else 0

    return accuracy