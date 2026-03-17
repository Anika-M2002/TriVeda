import cv2
import pytesseract
import numpy as np
import fitz
from PIL import Image

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def preprocess_image(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # increase resolution
    gray = cv2.resize(gray, None, fx=2.5, fy=2.5, interpolation=cv2.INTER_CUBIC)

    # remove noise but keep edges
    gray = cv2.bilateralFilter(gray, 9, 75, 75)

    # adaptive threshold for medical reports
    thresh = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        2
    )

    # morphological sharpening
    kernel = np.ones((1,1), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    return thresh


def extract_text_from_image(image):

    config = r'--oem 3 --psm 6 -l eng'

    text = pytesseract.image_to_string(image, config=config)

    return text


def process_pdf(file_path):

    pdf = fitz.open(file_path)

    extracted_text = ""

    for page in pdf:

        # FIRST try direct text extraction
        text = page.get_text()

        if text.strip():  
            extracted_text += text
            continue

        # If page has no text layer → run OCR
        mat = fitz.Matrix(4,4)

        pix = page.get_pixmap(matrix=mat)

        img = Image.frombytes("RGB",[pix.width,pix.height],pix.samples)

        image = np.array(img)

        processed = preprocess_image(image)

        page_text = extract_text_from_image(processed)

        extracted_text += page_text

    return extracted_text

def process_image(file_path):

    image = cv2.imread(file_path)

    processed = preprocess_image(image)

    text = extract_text_from_image(processed)

    return text


# MAIN FUNCTION
def extract_text(file_path):

    if file_path.lower().endswith(".pdf"):

        return process_pdf(file_path)

    else:

        return process_image(file_path)
    
def extract_ground_truth_from_pdf(file_path):

    pdf = fitz.open(file_path)

    true_text = ""

    for page in pdf:

        page_text = page.get_text()

        true_text += page_text

    return true_text