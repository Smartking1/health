from flask import Blueprint, render_template, request, jsonify
from app.utils.speech_to_text import transcribe_audio
from app.utils.translation import translate_text
from app.utils.audio_playback import text_to_speech
import os

bp = Blueprint('main', __name__)

@bp.route("/")
def index():
    return render_template("index.html")

@bp.route("/transcribe", methods=["POST"])
def transcribe():
    audio_file = request.files["audio"]
    transcript = transcribe_audio(audio_file)
    return jsonify({"transcript": transcript})

@bp.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text")
    target_language = data.get("target_language")
    translated_text = translate_text(text, target_language)
    return jsonify({"translated_text": translated_text})

@bp.route("/speak", methods=["POST"])
def speak():
    data = request.json
    text = data.get("text")
    language = data.get("language")
    audio_file = text_to_speech(text, language)
    return jsonify({"audio_file": audio_file})