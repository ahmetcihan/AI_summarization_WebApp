import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(URL.createObjectURL(file));
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
        <p>(Transcription will appear here)</p>
      </div>
      <div>
        <h2>Summary</h2>
        <p>(Summary will appear here)</p>
      </div>
    </div>
  );
}

export default App;