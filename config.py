from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")