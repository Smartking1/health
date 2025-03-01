// Speech recognition setup
let recognition;
let isRecording = false;

// Initialize speech recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            document.getElementById('speech-progress').style.display = 'flex';
            document.getElementById('start-speaking').style.display = 'none';
            document.getElementById('stop-speaking').style.display = 'inline-block';
            isRecording = true;
        };

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            document.getElementById('transcript').innerHTML = finalTranscript + '<i>' + interimTranscript + '</i>';
            document.getElementById('original').innerText = finalTranscript || interimTranscript;
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopRecording();
        };

        recognition.onend = function() {
            if (isRecording) {
                recognition.start();
            } else {
                document.getElementById('speech-progress').style.display = 'none';
                document.getElementById('start-speaking').style.display = 'inline-block';
                document.getElementById('stop-speaking').style.display = 'none';
            }
        };
    } else {
        alert('Your browser does not support Speech Recognition. Please try Chrome or Edge.');
    }
}

// Start recording
function startRecording() {
    if (recognition) {
        recognition.start();
    } else {
        initSpeechRecognition();
        recognition.start();
    }
}

// Stop recording
function stopRecording() {
    if (recognition) {
        isRecording = false;
        recognition.stop();
    }
}

// Translation function with enhanced debugging
async function translate() {
    // Get the text to translate and the target language
    const text = document.getElementById("original").innerText;
    const language = document.getElementById("language").value;
    const translationProgress = document.getElementById("translation-progress");
    
    // Enhanced debugging logs
    console.log("==== TRANSLATION DEBUG ====");
    console.log("Original element:", document.getElementById("original"));
    console.log("Original text content:", text);
    console.log("Original text length:", text.length);
    console.log("Target language:", language);
    console.log("Translation progress element:", translationProgress);
    
    // Check if text is empty
    if (!text || text.trim() === '') {
        alert("Please provide some text to translate.");
        return;
    }
    
    // Show progress spinner
    translationProgress.style.display = "flex";
    
    const payload = { text, target_language: language };
    console.log("Sending translation request payload:", payload);
    
    try {
        // Send the request to the /translate endpoint
        const response = await fetch("/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        console.log("Raw response:", response);
        console.log("Response status:", response.status);
        console.log("Response OK:", response.ok);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Log the response from the backend
        const data = await response.json();
        console.log("Parsed response data:", data);
        
        // Handle errors in the response
        if (data.error) {
            console.error("Server returned error:", data.error);
            alert(data.error);
        } else {
            console.log("Translated text:", data.translated_text);
            // Display the translated text
            document.getElementById("translated").innerText = data.translated_text;
            console.log("Updated translated element:", document.getElementById("translated"));
        }
    } catch (error) {
        // Handle network or other errors
        console.error("Translation error:", error);
        alert("An error occurred during translation. Please try again.");
    } finally {
        // Hide progress spinner
        translationProgress.style.display = "none";
        console.log("==== TRANSLATION DEBUG END ====");
    }
}

// Text-to-speech function
async function speak() {
    const text = document.getElementById("translated").innerText;
    const language = document.getElementById("language").value;
    const audioProgress = document.getElementById("audio-progress");
    
    // Check if there's text to speak
    if (!text || text.trim() === '') {
        alert("There is no translated text to speak.");
        return;
    }
    
    // Show progress spinner
    audioProgress.style.display = "flex";
    
    try {
        console.log("==== SPEAK DEBUG ====");
        console.log("Text to speak:", text);
        console.log("Language:", language);
        
        const response = await fetch("/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, language })
        });
        
        console.log("Raw response:", response);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Parsed response data:", data);
        console.log("Audio file path:", data.audio_file);
        
        // Add a unique timestamp to prevent caching
        const timestamp = new Date().getTime();
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = `${data.audio_file}?t=${timestamp}`;
        
        console.log("Setting audio player source to:", audioPlayer.src);
        
        // Add event listeners for debugging
        audioPlayer.addEventListener('error', function(e) {
            console.error("Audio player error:", e);
        });
        
        audioPlayer.addEventListener('loadeddata', function() {
            console.log("Audio loaded successfully");
        });
        
        // Play the audio
        audioPlayer.load();  // Force reload
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio play error:", error);
            });
        }
    } catch (error) {
        console.error("Text-to-speech error:", error);
        alert("An error occurred while generating speech. Please try again.");
    } finally {
        // Hide progress spinner
        audioProgress.style.display = "none";
        console.log("==== SPEAK DEBUG END ====");
    }
}
// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize speech recognition
    initSpeechRecognition();
    
    // Add event listeners for buttons
    document.getElementById('start-speaking').addEventListener('click', startRecording);
    document.getElementById('stop-speaking').addEventListener('click', stopRecording);
    
    // Add event listener for translate button
    document.getElementById('translateBtn').addEventListener('click', translate);
    
    // Add event listener for speak button
    document.getElementById('speakBtn').addEventListener('click', speak);
});