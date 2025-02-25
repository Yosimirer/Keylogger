from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users = {"admin": "1234"}

computers = []


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
    new_computer = {
        "name": data.get('name'),
        "ip": data.get('ip'),
        "status": "offline",
        "lastActivity": "dont"
    }
    computers.append(new_computer)
    return jsonify(new_computer)


@app.route('/api/computers/<int:computer_id>', methods=['DELETE'])
def remove_computer(computer_ip):
    global computers
    computers = [computer for computer in computers if computer['ip'] != computer_ip]
    return jsonify({"success": True})


@app.route('/api/computers/<int:computer_id>', methods=['GET'])
def get_computer(computer_id):
    computer = next((c for c in computers if c['id'] == computer_id), None)
    if computer:
        return jsonify(computer)
    return jsonify({"error": "מחשב לא נמצא"}), 404


if __name__ == '__main__':
    app.run(debug=True)
