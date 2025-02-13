import json
import os

# --הגדרת מיקום שמירת הקובץ--
os.chdir(os.getcwd()+"\\data")

def json_time(time,key):
    with open(f"{time}.json", "w") as file:
        keys = []
        for k in key:
            keys.append(k)

        json.dump(keys, file)