# AI-NIDS  
### AI-Powered Real-Time Network Intrusion Detection System  
A modular full-stack cybersecurity system combining machine learning, deep learning, Kafka-based streaming, and a real-time monitoring dashboard.

---

## Overview

AI-NIDS is a production-grade Network Intrusion Detection System (NIDS) engineered to detect and classify cyberattacks in real time.  
The system captures live TCP packets, extracts flow features, streams data through Apache Kafka, and performs multi-model inference using both classical machine learning models and transformer-based deep learning.

This project demonstrates full-stack engineering, machine learning deployment, distributed systems design, and real-time visualization under a unified architecture.

---

# System Architecture
<img src="./images/system_architecture.png" alt="System Architecture"/>

The system follows a microservices-style architecture using Kafka as the central messaging backbone.

### End-to-End Data Flow

1. **Packet Producer (Flask + Scapy)**  
   - Captures TCP packets  
   - Pushes raw packets to Kafka topic `packets`  

2. **Packet Processor Consumer**  
   - Converts packets into aggregated network flows  
   - Extracts statistical flow features  
   - Publishes processed features to Kafka topic `features`  

3. **Parallel Model Consumers**  
   Independent inference services consuming from `features`:  
   - Decision Tree  
   - Random Forest  
   - Logistic Regression  
   - XGBoost  

4. **BERT Consumer (DistilBERT Model)**  
   - Performs contextual binary classification of flows  
   - Enables payload-like NLP analysis  

5. **Databases**  
   - **MongoDB** for raw packets, flows, predictions  
   - **Firestore** for real-time frontend syncing  

6. **Frontend (React)**  
   - Real-time prediction charts  
   - Live logs viewer  
   - CSV upload for batch model testing  
   - Pipeline start/stop controls  

---

# Key Features

### Real-Time IDS Pipeline
- Live packet sniffing  
- Kafka-based streaming for high throughput  
- Parallel ML/DL inference  
- Near-zero delay visualization  

### Multi-Model Attack Classification
- Decision Tree  
- Random Forest  
- Logistic Regression  
- XGBoost  
- DistilBERT (Transformer Model)  

Models run as independent services for scalability.

### Full-Stack Web Dashboard
Built with React.js:

- Real-time donut charts  
- Live system logs  
- CSV upload for offline testing  
- Dark-mode cyber dashboard  
- Live Firestore syncing  

### Storage Layer
- **MongoDB** persists raw and processed data  
- **Firestore** syncs live prediction stats to frontend  

### Scalable Microservice Architecture
Every component is container-ready:

- Packet Producer  
- Packet Processor  
- ML Consumers  
- BERT Consumer  
- Flask API  
- React Frontend  
- Kafka + Zookeeper  

Supports distributed deployment and horizontal scaling.

---

# Screenshots

### Homepage
<img src="./images/home.png" />

### Architecture Flow
<img src="./images/architecture_flow.png" />

### Live Model Predictions
<img src="./images/live_predictions.png" />

### BERT Predictions
<img src="./images/bert_predictions.png" />

### Component Logs (Live)
<img src="./images/logs.png" />

### CSV Upload & Testing
<img src="./images/csv_testing.png" />

### About Page
<img src="./images/about.png" />

---

# Backend (Flask)

### Tech Stack
- Python  
- Flask  
- Scapy  
- Apache Kafka  
- MongoDB  
- Firestore  
- PyTorch + Transformers  
- Scikit-learn, XGBoost  
- Matplotlib  

### Core Backend Responsibilities

#### Packet Producer  
- Live capture of TCP packets  
- Extracts IPs, ports, flags, size  
- Publishes to Kafka  

#### Packet Processor  
- Builds flow statistics (duration, IAT, packet sizes, flag counts, etc.)  
- Publishes feature vectors to ML pipelines  

#### ML Consumers  
- Load pre-trained `.joblib` models  
- Perform multi-class intrusion classification  
- Persist results into MongoDB  
- Push summaries to Firestore  

#### BERT Consumer  
- Fine-tuned DistilBERT for binary attack detection  
- Provides contextual analysis beyond numeric features  

#### Chart Generation  
- Backend dynamically generates donut charts via Matplotlib  

---

# Frontend (React)

### UI Modules
- Landing Page  
- Go Live Dashboard  
- Live Logs Viewer  
- CSV Upload + Testing Module  
- ML Results Visualization  

### Technologies Used
- React.js  
- Axios  
- Bootstrap  
- Custom CSS  

---

# Machine Learning Models

### Classical Machine Learning  
Trained on CICIDS2017:

- Decision Tree  
- Random Forest  
- Logistic Regression  
- XGBoost  

Stored as `.joblib` for efficient FastAPI-style inference.

### Deep Learning (DistilBERT)
- Fine-tuned transformer model  
- Binary classifier (Benign vs Attack)  
- Processes textual flow representations  
- Provides contextual intelligence missing in statistical features  

---

# Strengths of the System (Engineering Perspective)

### Distributed Real-Time Architecture
Kafka-based streaming similar to modern enterprise data pipelines.

### Fully Decoupled ML Inference Workers
Each ML model runs independently for scalability and isolation.

### Real-Time Monitoring UI
Live charts, logs, and system insights.

### Modular, Extensible Design
New models or processors can be added with zero changes to existing services.

### Production-Oriented Stack
Includes:
- Load isolation  
- Real-time sync  
- Scalable storage  
- Docker-ready services  

---

# Installation & Setup

## 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI-NIDS.git
cd AI-NIDS
2. Backend Setup
bash
Copy code
cd backend
pip install -r requirements.txt
python app.py
3. Kafka Setup
Start Zookeeper:
bash
Copy code
zookeeper-server-start.sh config/zookeeper.properties
Start Kafka:
bash
Copy code
kafka-server-start.sh config/server.properties
Create topics:
bash
Copy code
kafka-topics.sh --create --topic packets --bootstrap-server localhost:9092
kafka-topics.sh --create --topic features --bootstrap-server localhost:9092
4. Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
Folder Structure
plaintext
Copy code
AI-NIDS/
│
├── backend/
│   ├── producers/
│   ├── consumers/
│   ├── models/
│   ├── charts/
│   ├── app.py
│
├── frontend/
│   ├── src/
│   ├── public/
│
├── images/
│   ├── home.png
│   ├── logs.png
│   ├── live_predictions.png
│   ├── architecture_flow.png
│
└── README.md
---
