from gtts import gTTS
import os
import time

def text_to_speech(text, language):
    try:
        # Log the request details
        print(f"Text-to-speech request: Language: {language}, Text: {text}")
        
        # Map language codes to gTTS language codes if needed
        language_map = {
            'es': 'es',  # Spanish
            'fr': 'fr',  # French
            'de': 'de',  # German
            # Add more mappings as needed
        }
        
        # Get the appropriate language code for gTTS
        tts_lang = language_map.get(language, language)
        
        # Create a gTTS object
        tts = gTTS(text=text, lang=tts_lang, slow=False)
        
        # Directly declare the path to store the audio file
        audio_dir = os.path.join("app", "static", "audio")  # Path to the audio directory
        os.makedirs(audio_dir, exist_ok=True)  # Create the directory if it doesn't exist
        
        # Use a timestamp to create a unique filename
        timestamp = int(time.time())
        filename = f'speech_{timestamp}.mp3'
        
        # Define the full path for saving the audio file
        audio_file_path = os.path.join(audio_dir, filename)
        
        # Log the file path
        print(f"Saving audio file to: {audio_file_path}")
        
        # Save the audio file
        tts.save(audio_file_path)
        
        # Verify the file was created
        if os.path.exists(audio_file_path):
            print(f"Audio file created successfully: {audio_file_path}")
            # Return the URL path (not the file system path)
            return f'/static/audio/{filename}'
        else:
            print(f"Failed to create audio file at: {audio_file_path}")
            return None
            
    except Exception as e:
        # Log any errors and re-raise the exception
        print(f"Error in text_to_speech: {str(e)}")
        raise