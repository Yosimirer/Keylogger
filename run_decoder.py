import sys
import json
from decoding_cmd import Decoding

# בדיקה אם נמסר שם קובץ בפרמטר
if len(sys.argv) < 2:
    print("נא להכניס את שם הקובץ כפרמטר.")
    sys.exit(1)

# קבלת שם הקובץ מהפרמטר
file_name = sys.argv[1]

# קריאה לקובץ w
try:
    with open(file_name, "r") as file:
        file_data = json.load(file)

    # יצירת אובייקט של מחלקת Decoding
    decoder = Decoding()


    # קריאה לפונקציה עם הנתונים שנמצאו בקובץ
    decoded_data = decoder.reverse_ascii_xor(file_data)

    # יצירת שם קובץ חדש לפלט (כמו שם הקובץ המקורי עם סיומת חדשה)
    new_file_name = file_name + "_decoded.txt"

    # כתיבה לקובץ חדש
    with open(new_file_name, "w") as new_file:
        new_file.write(decoded_data)

    print(f"הפענוח הושלם בהצלחה. הנתונים נשמרו בקובץ: {new_file_name}")

except FileNotFoundError:
    print(f"הקובץ {file_name} לא נמצא.")