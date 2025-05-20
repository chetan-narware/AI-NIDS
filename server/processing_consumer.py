from kafka import KafkaConsumer, KafkaProducer
import json
import numpy as np

# Custom JSON serializer to convert NumPy types to native Python types
def json_default(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

consumer = KafkaConsumer(
    'packets',
    bootstrap_servers='host.docker.internal:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True
)

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v, default=json_default).encode('utf-8')
)

packet_buffer = {}

def compute_flow_key(pkt):
    return f"{pkt['src']}_{pkt['dst']}_{pkt['sport']}_{pkt['dport']}_{pkt['protocol']}"

def process_packet(pkt):
    key = compute_flow_key(pkt)
    if key not in packet_buffer:
        packet_buffer[key] = []
    packet_buffer[key].append(pkt)

    # When we have at least 5 packets in the flow, process the flow
    if len(packet_buffer[key]) >= 5:
        flow = packet_buffer.pop(key)
        
        # Extract timestamps, lengths, and flags from the flow
        timestamps = [p["timestamp"] for p in flow]
        lengths = [p["length"] for p in flow]
        flags = [p["flags"] for p in flow]
        
        sorted_timestamps = sorted(timestamps)
        iats = np.diff(sorted_timestamps) if len(sorted_timestamps) > 1 else [0]
        
        # Compute basic flow metrics
        duration = max(timestamps) - min(timestamps)
        total_packets = len(flow)
        total_bytes = sum(lengths)
        flow_bytes_s = total_bytes / (duration + 1e-6)
        flow_packets_s = total_packets / (duration + 1e-6)
        
        # Packet length statistics
        fwd_packet_length_max = np.max(lengths)
        fwd_packet_length_min = np.min(lengths)
        fwd_packet_length_mean = np.mean(lengths)
        fwd_packet_length_std = np.std(lengths)
        packet_length_variance = np.var(lengths)
        
        # Inter-arrival time (IAT) metrics
        iat_mean = np.mean(iats)
        iat_std = np.std(iats)
        
        # Flags count
        fin_flag_count = sum('F' in f for f in flags)
        syn_flag_count = sum('S' in f for f in flags)
        ack_flag_count = sum('A' in f for f in flags)
        
        # Use destination port from the first packet
        destination_port = flow[0]["dport"]

        # Build the feature dictionary using keys matching the training features
        features = {
            "Destination Port": destination_port,
            "Flow Duration": duration,
            "Total Fwd Packets": total_packets,
            "Total Length of Fwd Packets": total_bytes,
            "Flow Bytes/s": flow_bytes_s,
            "Flow Packets/s": flow_packets_s,
            "Flow IAT Mean": iat_mean,
            "Flow IAT Std": iat_std,
            "Fwd Packet Length Max": fwd_packet_length_max,
            "Fwd Packet Length Min": fwd_packet_length_min,
            "Fwd Packet Length Mean": fwd_packet_length_mean,
            "Fwd Packet Length Std": fwd_packet_length_std,
            "Min Packet Length": fwd_packet_length_min,
            "Max Packet Length": fwd_packet_length_max,
            "Packet Length Mean": fwd_packet_length_mean,
            "Packet Length Std": fwd_packet_length_std,
            "Packet Length Variance": packet_length_variance,
            "FIN Flag Count": fin_flag_count,
            "SYN Flag Count": syn_flag_count,
            "ACK Flag Count": ack_flag_count
        }
        
        print("Flow features:", features)
        producer.send("flow_features", features)

for message in consumer:
    packet = message.value
    process_packet(packet)
