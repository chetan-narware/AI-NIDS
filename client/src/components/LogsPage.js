import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogsPage = () => {
  const navigate = useNavigate();

  const logSources = [
    'packet_producer',
    'processing_consumer',
    'ml_consumer',
    'bert_consumer',
  ];

  const [logs, setLogs] = useState({});

  const fetchLogs = async () => {
    const newLogs = {};
    for (const name of logSources) {
      try {
        const response = await fetch(`/logs/${name}`);
        const data = await response.json();
        // data.logs is an array of strings or undefined
        newLogs[name] = data.logs || ['No logs available'];
      } catch {
        newLogs[name] = ['Error fetching logs'];
      }
    }
    setLogs(newLogs);
  };

  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: 'black',
    color: 'white',
    padding: '30px',
  };

  const cardStyle = {
    backgroundColor: '#1e1e1e',
    padding: '20px',
    borderRadius: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    marginBottom: '20px',
  };

  return (
    <div style={pageStyle}>
      <h1 className="text-center mb-4">Live Component Logs</h1>

      <div className="mb-4 text-center">
        <button className="btn btn-outline-light" onClick={() => navigate('/golive')}>
          Back to Dashboard
        </button>
      </div>

      <div className="row">
        {logSources.map((name) => (
          <div key={name} className="col-md-6">
            <div style={cardStyle}>
              <h5 className="text-center mb-3">{name.replace('_', ' ').toUpperCase()}</h5>
              {/* Render each log line separately */}
              {logs[name] ? (
                logs[name].map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))
              ) : (
                'Loading...'
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsPage;
