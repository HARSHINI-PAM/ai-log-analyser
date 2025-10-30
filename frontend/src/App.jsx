import React from 'react';
import LogAnalyzer from './components/LogAnalyzer.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white max-w-xl w-full rounded shadow-lg p-8">
        <h1 className="text-2xl mb-4 font-bold">AI Log Root Cause</h1>
        <LogAnalyzer />
      </div>
    </div>
  );
}

export default App;
