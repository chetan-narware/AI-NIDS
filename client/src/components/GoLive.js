import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoLive = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [charts, setCharts] = useState({});

  const modelNames = ['decision_tree', 'logistic_regression', 'random_forest', 'xgboost', 'bert'];
  const mlModels = modelNames.filter((model) => model !== 'bert');
  const bertModel = 'bert';

  const handleStartClick = async () => {
    try {
      const response = await fetch('/start_all', { method: 'POST' });
      const data = await response.json();
      if (data.status === 'started_all') setStatus('Pipelines started!');
    } catch {
      setStatus('Error starting pipelines');
    }
  };

  const handleStopClick = async () => {
    try {
      const response = await fetch('/stop_all', { method: 'POST' });
      const data = await response.json();
      if (data.status === 'stopped_all') setStatus('Pipelines stopped!');
    } catch {
      setStatus('Error stopping pipelines');
    }
  };

  const fetchAllCharts = async () => {
    try {
      const chartData = {};
      for (const model of modelNames) {
        const response = await fetch(`/chart/${model}`);
        const blob = await response.blob();
        chartData[model] = URL.createObjectURL(blob);
      }
      setCharts(chartData);
    } catch {
      console.error('Error fetching charts');
    }
  };

  useEffect(() => {
    fetchAllCharts();
    const intervalId = setInterval(fetchAllCharts, 5000);
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
    padding: '15px',
    borderRadius: '10px',
  };

  return (
    <div style={pageStyle}>
      <h1 className="text-center mb-5">Real-Time Network Intrusion Detection</h1>

      <div className="d-flex justify-content-center mb-5">
        <button onClick={handleStartClick} className="btn btn-lg btn-primary mx-2">
          Start Pipelines
        </button>
        <button onClick={handleStopClick} className="btn btn-lg btn-danger mx-2">
          Stop Pipelines
        </button>
      </div>

      {status && <p className="text-center mb-5">{status}</p>}

      <div className="text-center mb-5">
        <h3>Live Model Predictions</h3>
      </div>

      <div className="row mb-5">
        <div className="col-md-8">
          <div style={cardStyle}>
            <h4 className="text-center mb-3">Traditional ML Models</h4>
           <p> 
            <strong>Label Info:</strong> 0 → BENIGN, 1 → Bot, 2 → DDoS, 3 → DoS-GoldenEye, 4 → DoS-Hulk, 5 → DoS-Slowhttptest, 6 → DoS-slowloris, 7 → FTP-Patator, 8 → Heartbleed, 9 → Infiltration, 10 → PortScan, 11 → SSH-Patator, 12 → Web-Attack-BruteForce, 13 → Web-Attack-SqlInjection, 14 → Web-Attack-XSS
          </p>

            <div className="row">
              {mlModels.map((model) => (
                <div key={model} className="col-md-6 mb-4">
                  <h5>{model.replace('_', ' ').toUpperCase()}</h5>
                  {charts[model] ? (
                    <img src={charts[model]} alt={`${model} chart`} className="img-fluid" />
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div style={cardStyle}>
            <h4 className="text-center mb-3">BERT Model</h4>
            <p><strong>Label Info:</strong> 0 → Benign, 1 → Attack</p>
            <div className="text-center">
              {charts[bertModel] ? (
                <img src={charts[bertModel]} alt={`${bertModel} chart`} className="img-fluid" />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate('/logs')}
        >
          Go to Logs
        </button>
      </div>
    </div>
  );
};

export default GoLive;
