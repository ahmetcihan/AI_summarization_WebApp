import os
from flask import Flask, request, render_template, redirect, url_for, flash, send_from_directory
from openai import OpenAI
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Change this to a random string

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create upload folder if it doesn't exist
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024  # Limit upload size to 25MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp3'}

def transcribe_audio(file_path):
    try:
        with open(file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        return transcript.text
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None
        
def generate_summary(text):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant who creates concise summaries."},
                {"role": "user", "content": f"Please provide a concise summary of the following transcription: \n\n{text}"}
            ],
            max_tokens=250
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Error generating summary."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    
    file = request.files['file']
    
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        # Create a safe filename
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process the audio file
        transcription = transcribe_audio(file_path)
        
        if transcription:
            # Generate summary
            summary = generate_summary(transcription)
            
            # Save the transcription and summary to files
            base_filename = os.path.splitext(filename)[0]
            text_filename = f"{base_filename}.txt"
            summary_filename = f"{base_filename}_summary.txt"
            
            text_path = os.path.join(app.config['UPLOAD_FOLDER'], text_filename)
            summary_path = os.path.join(app.config['UPLOAD_FOLDER'], summary_filename)
            
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(transcription)
                
            with open(summary_path, 'w', encoding='utf-8') as f:
                f.write(summary)
            
            return render_template('result.html', 
                                  audio_file=filename,
                                  text_file=text_filename,
                                  summary_file=summary_filename,
                                  transcription=transcription,
                                  summary=summary)
        else:
            flash('Error processing the audio file')
            return redirect(request.url)
    else:
        flash('Allowed file type is MP3')
        return redirect(request.url)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)