from gtts import gTTS
import os
import time

def text_to_speech(text, language):
    try:
        print(f"Text-to-speech request: Language: {language}, Text: {text}")
        
        # Map language codes to gtts language codes if needed
        language_map = {
            'es': 'es',
            'fr': 'fr',
            'de': 'de'
            # Add more mappings as needed
        }
        
        # Get the appropriate language code for gtts
        tts_lang = language_map.get(language, language)
        
        # Create a gTTS object
        tts = gTTS(text=text, lang=tts_lang, slow=False)
        
        # Create the directories if they don't exist
        static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'static')
        audio_dir = os.path.join(static_dir, 'audio')
        os.makedirs(audio_dir, exist_ok=True)
        
        # Use a timestamp to create a unique filename
        timestamp = int(time.time())
        filename = f'speech_{timestamp}.mp3'
        
        # Define the path for saving the audio file
        audio_file_path = os.path.join(audio_dir, filename)
        
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
        print(f"Error in text_to_speech: {str(e)}")
        raise