import csv
import io
from typing import List, Dict, Any
import structlog

logger = structlog.get_logger()

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def parse_text_content(content: bytes, filename: str) -> str:
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        return content.decode("latin-1")

def parse_csv_content(content: bytes) -> str:
    output = io.StringIO()
    try:
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded = content.decode("latin-1")
        
    reader = csv.reader(io.StringIO(decoded))
    for row in reader:
        output.write(" | ".join(row) + "\n")
    return output.getvalue()

def extract_file_content(content: bytes, filename: str) -> str:
    ext = filename.split(".")[-1].lower()
    if ext == "csv":
        return parse_csv_content(content)
    elif ext in ["txt", "log"]:
        return parse_text_content(content, filename)
    else:
        # docx, pdf, media files processed via mock/structured placeholders in early lifecycle phase
        logger.info("Extracting fallback binary metadata wrapper", filename=filename)
        return f"Metadata content index for parsed resource: {filename}. Raw size: {len(content)} bytes."
