import React, { useRef, useState } from 'react';
import axios from 'axios';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOW_EXTS = ['.log', '.txt', '.json'];

function getLines(str, max = 10) {
  return str.split('\n').slice(0, max).join('\n');
}

export default function LogAnalyzer() {
  const [logs, setLogs] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState(null); // {name, size}
  const fileInput = useRef();

  const acceptStr = ALLOW_EXTS.join(',');

  const onFileChange = e => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setLogs('');
      setFileInfo(null);
      setError(`File too large (max 2MB). Your file: ${(file.size/1024/1024).toFixed(2)}MB`);
      return;
    }
    if (!ALLOW_EXTS.some(ext => file.name.endsWith(ext))) {
      setError('Unsupported file type. Allowed: .log, .txt, .json');
      setFileInfo(null);
      setLogs('');
      return;
    }
    setFileInfo({ name: file.name, size: file.size });
    const reader = new window.FileReader();
    reader.onload = (ev) => {
      setLogs(ev.target.result);
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setFileInfo(null);
    setLogs('');
    fileInput.current.value = '';
    setError('');
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');
    setLoading(true);
    try {
      const logArr = logs.split('\n').map(l => l.trim()).filter(Boolean);
      const payload = { logs: logArr };
      const res = await axios.post('http://localhost:8000/analyze', payload);
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'API Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submitForm} className="flex flex-col gap-4 w-full max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-semibold mb-1">Upload Log File</label>
            <input
              ref={fileInput}
              type="file"
              accept={acceptStr}
              onChange={onFileChange}
              className="block w-full text-xs border rounded p-2 cursor-pointer file:mr-2 file:py-1 file:px-2 file:border-0 file:bg-blue-100 file:text-blue-700 file:rounded mb-1"
            />
            {fileInfo && (
              <div className="flex items-center text-xs mt-1 gap-2">
                <span className="bg-gray-100 px-2 py-[2px] rounded font-mono">
                  {fileInfo.name} ({(fileInfo.size/1024).toFixed(1)} KB)
                </span>
                <button type="button" onClick={removeFile} className="text-xs text-red-500 hover:underline ml-1">Remove</button>
              </div>
            )}
          </div>
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold mb-1">Paste Logs</label>
            <textarea
              className="w-full border rounded p-2 h-32 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={logs}
              onChange={e => setLogs(e.target.value)}
              placeholder="Paste or upload log lines here..."
              required
              spellCheck="false"
              style={{resize:'vertical'}}
            />
          </div>
        </div>
        {fileInfo && logs && (
          <div className="mt-0 mb-2 bg-gray-50 border text-xs rounded p-2 font-mono text-gray-600">
            <span className="font-semibold text-gray-800">Preview:</span>
            <pre className="overflow-x-auto whitespace-pre-wrap mt-1">{getLines(logs)}</pre>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:bg-blue-300 flex items-center justify-center gap-2"
          disabled={loading || !logs.trim()}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white mr-1" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Analyze Logs
        </button>
      </form>
      {error && (
        <div className="text-red-600 font-medium text-center bg-red-50 border border-red-100 rounded p-2 mt-1">{error}</div>
      )}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border rounded">
          <div className="font-semibold">Root Cause: <span className="text-blue-600">{result.root_cause_category}</span></div>
          <div className="mt-1">Confidence: <span className="font-semibold">{(result.confidence*100).toFixed(2)}%</span></div>
          <div className="mt-2 text-xs text-gray-500">Features: {JSON.stringify(result.features)}</div>
        </div>
      )}
    </div>
  );
}
