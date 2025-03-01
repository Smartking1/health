// Check if the browser supports the Web Speech API
if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition. Please use Chrome or another supported browser.");
} else {
    // Initialize the speech recognition object
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Stop after one sentence
    recognition.interimResults = false; // Only final results
    recognition.lang = "en-US"; // Set the language

    // Get DOM elements
    const startSpeakingButton = document.getElementById("start-speaking");
    const stopSpeakingButton = document.getElementById("stop-speaking");
    const speechProgress = document.getElementById("speech-progress");
    const transcriptElement = document.getElementById("transcript");
    const originalElement = document.getElementById("original");

    // Start speaking button
    startSpeakingButton.addEventListener("click", () => {
        recognition.start();
        startSpeakingButton.style.display = "none";
        stopSpeakingButton.style.display = "inline-block";
        speechProgress.style.display = "flex";
    });

    // Stop speaking button
    stopSpeakingButton.addEventListener("click", () => {
        recognition.stop();
        stopSpeakingButton.style.display = "none";
        startSpeakingButton.style.display = "inline-block";
        speechProgress.style.display = "none";
    });

    // Handle speech recognition results
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptElement.innerText = transcript;
        originalElement.innerText = transcript;
        stopSpeakingButton.style.display = "none";
        startSpeakingButton.style.display = "inline-block";
        speechProgress.style.display = "none";
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("An error occurred during speech recognition. Please try again.");
        stopSpeakingButton.style.display = "none";
        startSpeakingButton.style.display = "inline-block";
        speechProgress.style.display = "none";
    };
}

// Translate function
async function translate() {
    const text = document.getElementById("original").innerText;
    const language = document.getElementById("language").value;
    const translationProgress = document.getElementById("translation-progress");

    if (!text) {
        alert("Please provide some text to translate.");
        return;
    }

    translationProgress.style.display = "flex";

    try {
        console.log("Sending translation request:", { text, target_language: language });

        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, target_language: language })
        });

        const data = await response.json();
        console.log("Received translation response:", data);

        if (data.error) {
            alert(data.error);
        } else {
            document.getElementById("translated").innerText = data.translated_text;
        }
    } catch (error) {
        console.error("Translation error:", error);
        alert("An error occurred during translation. Please try again.");
    } finally {
        translationProgress.style.display = "none";
    }
}

// Speak function
async function speak() {
    const text = document.getElementById("translated").innerText;
    const language = document.getElementById("language").value;
    const audioProgress = document.getElementById("audio-progress");

    if (!text) {
        alert("Please translate some text first.");
        return;
    }

    audioProgress.style.display = "flex";

    try {
        console.log("Sending audio generation request:", { text, language });

        const response = await fetch("/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, language })
        });

        const data = await response.json();
        console.log("Received audio generation response:", data);

        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = data.audio_file;
        audioPlayer.play();
    } catch (error) {
        console.error("Audio playback error:", error);
        alert("An error occurred during audio playback. Please try again.");
    } finally {
        audioProgress.style.display = "none";
    }
}