import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGoLiveClick = () => {
    navigate('/golive');
  };

  const handleTestClick = () => {
    navigate('/test');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Vertically centers content
        flexDirection: 'column',
        overflow: 'hidden', // Prevents overflow that could cause the white line
      }}
    >
      {/* New Hero Section */}
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5 mx-4">
        <div className="col-10 col-sm-8 col-lg-6 d-flex justify-content-center">
          <img
            src="/encrypted.png" // Correct image path
            className="d-block mx-lg-auto img-fluid shadow-lg rounded-3"
            alt="Network Intrusion Detection"
            width="700"
            height="500"
            loading="lazy"
            style={{
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        </div>
        <div className="col-lg-6 text-center text-lg-start">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            Real-Time Network Intrusion Detection
          </h1>
          <p className="lead mb-4">
            AI-NIDS is a cutting-edge system designed to help you monitor and secure your network in real-time. By analyzing network packet data, our platform can identify potential threats and provide instant alerts, allowing you to take swift action to prevent security breaches. Whether you're an enterprise or a small business, AI-NIDS offers a powerful, scalable solution to safeguard your network from emerging cyber threats.
          </p>
          <div className="d-grid gap-3 d-md-flex justify-content-md-center">
            <button
              onClick={handleGoLiveClick}
              className="btn btn-primary btn-lg px-5 py-3 me-md-3 shadow-sm"
              style={{ fontSize: '1.25rem' }}
            >
              Go Live
            </button>
            <button
              onClick={handleTestClick}
              className="btn btn-primary btn-lg px-5 py-3 shadow-sm"
              style={{ fontSize: '1.25rem' }}
            >
              Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
