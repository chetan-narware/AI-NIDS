from kafka import KafkaConsumer
import json
import joblib
from pymongo import MongoClient
from datetime import datetime

# Load all models
model_paths = {
    'decision_tree': r"E:\MINI_PROJECT2-NIDS\flask-server\models\dt_model.joblib",
    'logistic_regression': r"E:\MINI_PROJECT2-NIDS\flask-server\models\lr_model.joblib",
    'random_forest': r"E:\MINI_PROJECT2-NIDS\flask-server\models\rf_model.joblib",
    'xgboost': r"E:\MINI_PROJECT2-NIDS\flask-server\models\xgb_model.joblib"
}
models = {name: joblib.load(path) for name, path in model_paths.items()}

# MongoDB setup
mongo_client = MongoClient('localhost', 27017)
db = mongo_client.NIDS
collection = db.predictions

# Kafka consumer
consumer = KafkaConsumer(
    'flow_features',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True
)

# Feature order used during training
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

# Counters
total_packets = 0
attack_packets = {
    'overall': 0,
    'decision_tree': 0,
    'logistic_regression': 0,
    'random_forest': 0,
    'xgboost': 0
}

# Consume and process messages
for message in consumer:
    features = message.value
    print("Received features:", features)

    try:
        # Build feature vector
        feature_vector = [features[feat] for feat in common_features]
        total_packets += 1

        predictions = {}
        is_attack_overall = False

        for model_name, model in models.items():
            pred = model.predict([feature_vector])[0]
            predictions[model_name] = int(pred)

            if pred == 1:
                attack_packets[model_name] += 1
                is_attack_overall = True

        if is_attack_overall:
            attack_packets['overall'] += 1

        # Save to MongoDB
        document = {
            'timestamp': datetime.utcnow(),
            'features': features,
            'predictions': predictions,
            'is_attack': is_attack_overall
        }
        collection.insert_one(document)

        # Optional: Print live stats
        print(f"\nPacket #{total_packets}")
        print(f"Predictions: {predictions}")
        print(f"Total Attacks (Overall): {attack_packets['overall']}")
        print(f"Attack Count Per Model: { {k: v for k, v in attack_packets.items() if k != 'overall'} }\n")

    except Exception as e:
        print("Error during prediction or storage:", e)
