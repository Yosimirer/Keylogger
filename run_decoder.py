import sys
import json
from decoding_cmd import Decoding

if len(sys.argv) < 2:
    print("נא להכניס את שם הקובץ כפרמטר.")
    sys.exit(1)

file_name = sys.argv[1]

try:
    with open(file_name, "r") as file:
        file_data = json.load(file)

    decoder = Decoding()

    decoded_data = decoder.reverse_ascii_xor(file_data)

    new_file_name = file_name.rsplit(".", 1)[0] + "_decoded.txt"

    with open(new_file_name, "w") as new_file:
        for timestamp, text in decoded_data.items():
            new_file.write(f"=== {timestamp} ===\n")
            new_file.write(text + "\n\n")

    print(f"הפענוח הושלם בהצלחה. הנתונים נשמרו בקובץ: {new_file_name}")

except FileNotFoundError:
    print(f"הקובץ {file_name} לא נמצא.")
except json.JSONDecodeError:
    print(f"הקובץ {file_name} אינו בפורמט JSON תקין.")
except Exception as e:
    print(f"שגיאה בתהליך הפענוח: {str(e)}")