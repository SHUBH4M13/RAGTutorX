from ingestion.pdf_loader import extract_text_from_pdf


if __name__ == "__main__":
    pdf_path = "data/sampledata.pdf"

    pages = extract_text_from_pdf(pdf_path)

    print(f"Total pages with extracted text: {len(pages)}")

    for page in pages[:5]:
        print(f"\n--- Page {page['page_number']} ---")
        print(page["text"][:500])
