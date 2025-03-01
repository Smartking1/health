from gtts import gTTS
import os

def text_to_speech(text, language):
    tts = gTTS(text=text, lang=language)
    audio_file = "static/audio/output.mp3"
    tts.save(audio_file)
    return audio_file