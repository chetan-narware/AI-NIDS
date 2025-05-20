import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const navigate = useNavigate();

  const modelNames = [
    'decision_tree',
    'logistic_regression',
    'random_forest',
    'xgboost',
    'bert',
  ];

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [charts, setCharts] = useState({});
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResults(null);
    setCharts({});
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'File upload failed');
      }

      const data = await response.json();
      setResults(data.metrics);  // Corrected: backend sends "metrics"
      setCharts(data.charts);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white', padding: '30px' }}>
      <h1 className="text-center mb-5">CSV Upload & Model Testing</h1>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="form-control"
          style={{ maxWidth: '400px' }}
        />
        <button
          className="btn btn-primary mx-3"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Processing...
            </>
          ) : (
            'Upload & Test'
          )}
        </button>
      </div>

      {error && <p className="text-center text-danger mb-4">{error}</p>}

      {results && (
        <>
          <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
            <h4 className="text-center mb-3">Predictions Summary</h4>
            <p>
              <strong>Label Info (Traditional ML Models):</strong> <br />
              0 → BENIGN, 1 → Bot, 2 → DDoS, 3 → DoS-GoldenEye, 4 → DoS-Hulk, 5 → DoS-Slowhttptest, <br />
              6 → DoS-slowloris, 7 → FTP-Patator, 8 → Heartbleed, 9 → Infiltration, 10 → PortScan, <br />
              11 → SSH-Patator, 12 → Web-Attack-BruteForce, 13 → Web-Attack-SqlInjection, 14 → Web-Attack-XSS
            </p>
            <p>
              <strong>Label Info (BERT):</strong> 0 → Benign, 1 → Attack
            </p>
          </div>

          <div className="row mb-5">
            {modelNames.map((model) => (
              <div key={model} className="col-md-6 mb-4">
                <div style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px' }}>
                  <h5 className="text-center mb-3">{model.replace('_', ' ').toUpperCase()}</h5>
                  {charts[model] && (
                    <img
                      src={charts[model]}
                      alt={`${model} pie chart`}
                      className="img-fluid mb-3"
                    />
                  )}
                  {results[model] && (
                    <div>
                      <strong>Accuracy:</strong> {(results[model].accuracy * 100).toFixed(2)}%<br />
                      <strong>Precision:</strong> {formatAvg(results[model], 'precision')}<br />
                      <strong>Recall:</strong> {formatAvg(results[model], 'recall')}<br />
                      <strong>F1 Score:</strong> {formatAvg(results[model], 'f1-score')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-center">
        <button className="btn btn-outline-light" onClick={() => navigate('/golive')}>
          Back to GoLive
        </button>
      </div>
    </div>
  );
};

// Helper to format average values from classification report
function formatAvg(report, key) {
  return report['macro avg']
    ? (report['macro avg'][key] * 100).toFixed(2) + '%'
    : 'N/A';
}

export default Test;
