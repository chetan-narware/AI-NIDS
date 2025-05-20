# packet_producer.py
import scapy.all as scapy
from kafka import KafkaProducer
import json
import time

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def packet_handler(pkt):
    if pkt.haslayer(scapy.TCP):
        packet_data = {
            "timestamp": time.time(),
            "src": pkt[scapy.IP].src,
            "dst": pkt[scapy.IP].dst,
            "sport": pkt[scapy.TCP].sport,
            "dport": pkt[scapy.TCP].dport,
            "protocol": "TCP",
            "length": len(pkt),
            "flags": pkt[scapy.TCP].sprintf("%TCP.flags%")
        }
        producer.send('packets', packet_data)
        print(f"Sent packet: {packet_data}")

def main():
    print("Starting packet capture...")
    scapy.sniff(prn=packet_handler, store=0, filter="tcp")

if __name__ == "__main__":
    main()
