from tkinter import Tk
from tkinter.filedialog import askopenfilename

from services.ocr_parser import extract_text, extract_ground_truth_from_pdf
from services.evaluation import calculate_error_rates, field_level_accuracy
from services.ai_analyzer import analyze_report   # AI module


def main():

    print("\nMedical OCR System")
    print("------------------")

    # File picker
    Tk().withdraw()

    file_path = askopenfilename(
        title="Upload Medical Report",
        filetypes=[("PDF files","*.pdf"),("Images","*.png *.jpg *.jpeg")]
    )

    if not file_path:
        print("No file selected")
        return

    print("\nRunning OCR...\n")

    # OCR extraction
    ocr_output = extract_text(file_path)

    print("----- OCR OUTPUT -----\n")
    print(ocr_output)

    # Ground truth (only for PDF)
    if file_path.lower().endswith(".pdf"):

        ground_truth = extract_ground_truth_from_pdf(file_path)

        print("\nGround truth extracted automatically from PDF")

    else:
        print("\nGround truth not available for images")
        return

    # Evaluation metrics
    wer_score, cer_score = calculate_error_rates(ground_truth, ocr_output)
    field_accuracy = field_level_accuracy(ocr_output)

    print("\n----- OCR METRICS -----\n")

    print("Word Error Rate (WER):", round(wer_score * 100, 2), "%")
    print("Character Error Rate (CER):", round(cer_score * 100, 2), "%")
    print("Field-Level Accuracy:", round(field_accuracy * 100, 2), "%")

    # ===============================
    # 🔥 AI ANALYSIS SECTION
    # ===============================
    print("\n----- AI ANALYSIS -----\n")

    summary, ayurveda = analyze_report(ocr_output)

    print("Medical Summary:")
    print(summary)

    print("\nAyurveda Perspective:")
    print(ayurveda)


if __name__ == "__main__":
    main()