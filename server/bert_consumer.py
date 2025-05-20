from kafka import KafkaConsumer
import json
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import numpy as np

# Load BERT model and tokenizer
model_path = r"E:\MINI_PROJECT2-NIDS\flask-server\bert\distilbert_binary_model\content\distilbert_binary_model"
tokenizer = DistilBertTokenizer.from_pretrained(model_path)
model = DistilBertForSequenceClassification.from_pretrained(model_path)
model.eval()

# Kafka consumer
consumer = KafkaConsumer(
    'flow_features',
    bootstrap_servers='localhost:9092',  # Adjust if running in Docker
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True
)

# Same features as your ML model (should match order/keys)
common_features = [
    'Destination Port',
    'Flow Duration',
    'Total Fwd Packets',
    'Total Length of Fwd Packets',
    'Flow Bytes/s',
    'Flow Packets/s',
    'Flow IAT Mean',
    'Flow IAT Std',
    'Fwd Packet Length Max',
    'Fwd Packet Length Min',
    'Fwd Packet Length Mean',
    'Fwd Packet Length Std',
    'Min Packet Length',
    'Max Packet Length',
    'Packet Length Mean',
    'Packet Length Std',
    'Packet Length Variance',
    'FIN Flag Count',
    'SYN Flag Count',
    'ACK Flag Count'
]

def features_to_text(features_dict):
    return " ".join([f"{k}:{features_dict.get(k, 0)}" for k in common_features])


for message in consumer:
    features = message.value
    print("Received features for BERT:", features)

    try:
        # Convert features to text for BERT input
        input_text = features_to_text(features)
        
        # Tokenize and encode
        inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)
        
        # Prediction
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            pred_class = torch.argmax(probs, dim=1).item()
        
        print("BERT Predicted label:", pred_class)
    
    except Exception as e:
        print("Error in BERT consumer:", e)
