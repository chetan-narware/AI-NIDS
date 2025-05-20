import React from 'react';

const About = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        margin: 0,
        padding: '2rem',
        backgroundColor: '#000',
        color: '#fff',
        overflowY: 'auto',
      }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold text-center mb-4">🛡️ About the Intrusion Detection System (IDS)</h1>

        <p className="lead text-center mb-5">
          This Intrusion Detection System (IDS) is an advanced, real-time cybersecurity application built to detect and classify network attacks using cutting-edge machine learning and deep learning technologies. The system is designed with modular components and real-time capabilities to provide a robust solution for monitoring and securing network traffic.
        </p>

        <p>
          The application supports both traditional machine learning models and a deep learning NLP-based approach. Machine learning models such as Decision Tree, Random Forest, XGBoost, and Logistic Regression are used to classify flow-based network features, while a fine-tuned DistilBERT model enables payload-level inspection of text data for more intelligent attack detection.
        </p>

        <p>
          Packet capturing is achieved through Scapy, which extracts TCP packets directly from the network. These packets are processed into flows and passed through a feature extraction pipeline that computes statistics like inter-arrival times, flow durations, and flag counts. This data is then routed through Kafka topics for classification by either the ML or BERT-based consumer modules.
        </p>

        <p>
          Kafka plays a central role in orchestrating the real-time communication between the system's components. The architecture includes a multi-threaded packet producer, a processing consumer for feature extraction, and two parallel consumers—one for ML inference and another for BERT inference. Each component publishes logs, which are accessible in real-time, allowing administrators to monitor system behavior and performance.
        </p>

        <p>
          MongoDB is used to store raw packet data, flow-level features, and model predictions. Meanwhile, Firebase Firestore is employed to archive attacks for easy visualization and reporting. The system automatically generates pie charts and classification reports to visualize class distributions and performance metrics such as precision, recall, and F1-score.
        </p>

        <p>
          The application exposes RESTful APIs that enable users to start and stop different components of the system and access real-time logs. With Cross-Origin Resource Sharing (CORS) enabled, the backend supports integration with external front-end platforms or dashboards. This makes the system adaptable to a wide range of deployment environments, from local machines to cloud-based infrastructures.
        </p>

        <p>
          Built using Flask, Apache Kafka, MongoDB, and Firestore, this IDS leverages Scikit-learn, PyTorch, and the Hugging Face Transformers library to deliver intelligent classification and secure network monitoring. The dark-themed UI, supported by React and Bootstrap, offers an interactive interface where users can control the IDS pipeline and view meaningful visualizations with ease.
        </p>

        <p className="mt-5 text-center lead">
          In summary, this Intrusion Detection System is a scalable, modular, and intelligent solution for real-time cybersecurity operations, combining machine learning, deep learning, and distributed systems to keep networks secure.
        </p>
      </div>
    </div>
  );
};

export default About;
