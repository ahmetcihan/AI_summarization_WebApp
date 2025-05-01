import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [transcription, setTranscription] = useState('(Transcription will appear here)');
  const [summary, setSummary] = useState('(Summary will appear here)');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      // Dosyayı frontend’de oynatmak için
      setUploadedFile(URL.createObjectURL(file));

      // Backend’e dosyayı yükle
      const formData = new FormData();
      formData.append('audio', file);

      try {
        // 1. /upload endpoint’ine dosya yükle
        const uploadResponse = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Upload failed');
        }
        console.log('Upload successful:', uploadData);

        // 2. /transcribe endpoint’ine filename gönder
        const transcribeResponse = await fetch('http://localhost:5000/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: uploadData.filename }),
        });
        const transcribeData = await transcribeResponse.json();
        if (!transcribeResponse.ok) {
          throw new Error(transcribeData.error || 'Transcription failed');
        }
        setTranscription(transcribeData.transcription);

        // 3. /summarize endpoint’ine transcription gönder
        const summarizeResponse = await fetch('http://localhost:5000/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcription: transcribeData.transcription }),
        });
        const summarizeData = await summarizeResponse.json();
        if (!summarizeResponse.ok) {
          throw new Error(summarizeData.error || 'Summarization failed');
        }
        setSummary(summarizeData.summary);
      } catch (error) {
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please upload an audio file');
    }
  };

  return (
    <div className="App">
      <h1>AI Summarization Web App</h1>
      <AudioRecorder />
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      {uploadedFile && (
        <div>
          <h3>Uploaded Audio</h3>
          <audio src={uploadedFile} controls />
        </div>
      )}
      <div>
        <h2>Transcription</h2>
        <p>{transcription}</p>
      </div>
      <div>
        <h2>Summary</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default App;