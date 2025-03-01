async function transcribe() {
    const audioFile = document.getElementById("audio").files[0];
    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await fetch("/transcribe", {
        method: "POST",
        body: formData
    });
    const data = await response.json();
    document.getElementById("original").innerText = data.transcript;
}

async function translate() {
    // Get the text to translate and the target language
    const text = document.getElementById("original").innerText;
    const language = document.getElementById("language").value;
    const translationProgress = document.getElementById("translation-progress");

    // Check if text is empty
    if (!text) {
        alert("Please provide some text to translate.");
        return;
    }

    // Show progress spinner
    translationProgress.style.display = "flex";

    try {
        // Log the data being sent to the backend
        console.log("Sending translation request:", { text, target_language: language });

        // Send the request to the /translate endpoint
        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, target_language: language })
        });

        // Log the response from the backend
        const data = await response.json();
        console.log("Received translation response:", data);

        // Handle errors in the response
        if (data.error) {
            alert(data.error);
        } else {
            // Display the translated text
            document.getElementById("translated").innerText = data.translated_text;
        }
    } catch (error) {
        // Handle network or other errors
        console.error("Translation error:", error);
        alert("An error occurred during translation. Please try again.");
    } finally {
        // Hide progress spinner
        translationProgress.style.display = "none";
    }
}

async function speak() {
    const text = document.getElementById("translated").innerText;
    const language = document.getElementById("language").value;

    const response = await fetch("/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language })
    });
    const data = await response.json();
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = data.audio_file;
    audioPlayer.play();
}