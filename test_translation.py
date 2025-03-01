
from app.utils.translation import translate_text

text = "Hello, how are you?"
target_language = "es"  # Spanish

translated_text = translate_text(text, target_language)
print(f"Translated text: {translated_text}")