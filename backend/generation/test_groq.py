from generation.groq_client import generate_response

if __name__ == "__main__":
    try:
        response = generate_response(
            "Explain Retrieval Augmented Generation in three simple sentences."
        )

        print("\n--- Groq LLM Response ---")
        print(response)

    except Exception as e:
        print("Groq API request failed:", str(e))