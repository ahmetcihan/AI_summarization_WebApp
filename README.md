# MP3 to Text & Summary App

## Description

This is a simple web application built with Python and Flask that allows users to upload an MP3 audio file. The application then uses OpenAI's Whisper model to transcribe the audio to text and OpenAI's GPT-3.5 model to generate a concise summary of the transcription. Users can view the transcription and summary, listen to the original audio, and download both the transcription and summary as text files.

## Features

* **MP3 Upload:** Simple drag-and-drop or file selection interface for uploading MP3 files (up to 25MB)[cite: 1].
* **Audio Transcription:** Utilizes OpenAI's `whisper-1` model for accurate speech-to-text conversion.
* **Content Summarization:** Leverages OpenAI's `gpt-3.5-turbo` model to create concise summaries of the transcribed text.
* **Web Interface:** User-friendly interface to upload files and view results[cite: 1].
* **Downloadable Results:** Option to download the full transcription and the summary as separate `.txt` files.
* **Audio Playback:** Play the uploaded audio directly in the results page.

## Tech Stack

* **Backend:** Python, Flask
* **AI Services:** OpenAI API (Whisper for transcription, GPT-3.5 for summarization)
* **Frontend:** HTML

## File Structure
.
├── static/
│   └── uploads/      # Stores uploaded MP3s, generated .txt transcriptions & summaries
├── templates/
│   ├── index.html    # Main upload page
│   └── result.html   # Page to display results
├── app.py            # Main Flask application logic
├── requirements.txt  # Python dependencies
├── .env              # Environment variables (contains OpenAI API Key - you need to paste your API key)
└── README.md         # This file

## Setup & Installation

1.  **Prerequisites:**
    * Python 3.x installed
    * `pip` (Python package installer)

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/ahmetcihan/AI_summarization_WebApp.git
    cd AI_summarization_WebApp
    ```

3.  **Create and Activate a Virtual Environment (Recommended):**
    ```bash
    # Windows
    python -m venv venv
    source venv/Scripts/activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    This will install Flask, OpenAI, and python-dotenv.

5.  **Set Up Environment Variables:**
    * Create a file named `.env` in the root directory of the project.
    * Add your OpenAI API key to the `.env` file:
        ```
        OPENAI_API_KEY='your_openai_api_key_here'
        ```
    *

6.  **Run the Application:**
    ```bash
    python app.py
    ```
    The application will be accessible at `http://127.0.0.1:5000` (or the address provided in the terminal).

## Usage

1.  Open your web browser and navigate to the application's URL (e.g., `http://127.0.0.1:5000`).
2.  Drag and drop an MP3 file onto the designated area or click "Choose File" to select an MP3 file from your computer[cite: 1].
3.  Click the "Process Audio" button[cite: 1].
4.  Wait for the application to upload the file, transcribe the audio, and generate the summary. A progress indicator will be shown[cite: 1].
5.  Once processed, you will be redirected to the results page where you can:
    * Listen to the uploaded audio.
    * Read the full transcription.
    * Read the generated summary.
    * Download the transcription as a `.txt` file.
    * Download the summary as a `.txt` file.
    * Click "Process Another File" to return to the upload page.

## Configuration

* **OpenAI API Key:** The application requires a valid OpenAI API key, which must be set in the `.env` file.
* **Upload Folder:** Uploaded files and generated text files are stored in the `static/uploads/` directory.
* **Allowed File Types:** Currently, only `.mp3` files are accepted.
* **Max File Size:** The maximum upload size is set to 25MB in `app.py`.
* **Secret Key:** A Flask secret key is set in `app.py`. You should change `"your_secret_key"` to a strong, unique random string for production environments.
