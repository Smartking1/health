from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def translate_text(text, target_language):
    prompt = f"Translate the following text to {target_language}: {text}"
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-70b-8192"
    )
    return response.choices[0].message.content