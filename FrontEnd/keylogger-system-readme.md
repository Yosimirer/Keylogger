# CyberControl Keylogger System

## Overview
CyberControl is a monitoring system designed to track and record keystrokes on target computers and send them to a central server. The system consists of client-side components for keystroke logging and a server-side dashboard for monitoring and reviewing the collected data.

## System Components

### Client-Side Components
The client-side of the application runs on the target machines and captures keystrokes:

1. **Ikeylogger.py**
   - Contains abstract base classes that define the interfaces for the keylogging functionality
   - Includes `IKeyLogger` for keyboard activity monitoring and `IWriter` for data output

2. **KeyloggerService.py**
   - Implements the `IKeyLogger` interface using pynput to capture keyboard input
   - Contains a service singleton instance that can be used throughout the application

3. **FileWriter.py**
   - Implements the `IWriter` interface for storing captured keystrokes in JSON files
   - Creates files named after the machine where the keystrokes were captured

4. **networkWriter.py**
   - Implements the `IWriter` interface for sending captured keystroke data to the server via HTTP
   - Posts data to the server's API endpoint

5. **KeyLoggerManager.py**
   - Main orchestration class that coordinates the keystroke capturing and data sending
   - Handles configuration loading, encryption, and data management
   - Contains a simple buffer system for captured keys
   - Can be stopped by pressing the ESC key

### Server-Side Components
The server-side of the application provides a web interface for monitoring the captured data:

1. **server.py**
   - Flask-based server application with API endpoints for:
     - User authentication
     - Computer management (adding, removing, listing)
     - Keystroke data storage and retrieval
   - Manages a directory of captured keystroke files

2. **html-file.html**
   - Main dashboard HTML structure
   - Provides login functionality
   - Displays the list of monitored computers
   - Contains forms for adding new computers
   - Provides interfaces for viewing and managing captured data

3. **keylogger.css**
   - Styling for the web interface
   - Uses a dark cybersecurity theme with accent colors
   - Includes responsive layouts for different screen sizes

4. **javaScript.js**
   - Client-side JavaScript for the web interface
   - Handles API communication with the server
   - Manages user interface interactions
   - Includes functionality for:
     - Authentication
     - Computer listing and management
     - Keystroke data viewing and decryption
     - Searching and filtering capabilities

## Key Features

### Security Features
- Simple XOR-based encryption for keystroke data
- User authentication system for the dashboard
- Secured API endpoints

### Monitoring Capabilities
- Real-time keystroke capture
- Support for special keys
- Timestamp recording
- Machine identification

### Dashboard Functions
- Computer status monitoring
- Search and filter functionality
- Data viewing and download options
- User management (partially implemented)

## Setup and Usage

### Server Setup
1. Ensure Python 3.x is installed with Flask and other dependencies
2. Run `server.py` to start the server:
   ```
   python server.py
   ```
3. The server will be accessible at http://localhost:5001

### Client Setup
1. Install required Python packages:
   ```
   pip install pynput requests
   ```
2. Configure `config.json` with the target machine's name and IP
3. Run the KeyLoggerManager:
   ```
   python KeyLoggerManager.py
   ```
4. The keylogger will run in the background and can be stopped by pressing ESC

### Dashboard Access
1. Navigate to http://localhost:5001 in a web browser
2. Login with the default credentials:
   - Username: admin
   - Password: 1234
3. Use the dashboard to monitor connected machines and view captured data

## Technical Details

### Data Flow
1. KeyloggerService captures keystrokes using pynput
2. KeyLoggerManager processes and encrypts the data
3. Data is sent to the server using NetworkWriter or stored locally using FileWriter
4. The server stores the data in JSON files organized by machine IP
5. The web dashboard retrieves and displays the data when requested

### API Endpoints
- `/api/login` - Authentication endpoint
- `/api/computers` - Computer management endpoints (GET, POST)
- `/api/computers/<ip>` - Individual computer management (GET, DELETE)
- `/api/listening/<ip>` - Keystroke data management (GET, POST)

### Frontend Architecture
- The interface uses a login page and a dashboard page
- The dashboard has a navigation menu and content area
- The monitoring interface shows computers in a table format
- Detailed views show captured keystroke data with decryption capability

## Security Notice
This system is designed for educational purposes or legitimate monitoring with proper authorization. Using this software without the consent of the users being monitored may violate privacy laws and regulations.

## Development Notes
- The system includes basic encryption but should be enhanced for production use
- User management functionality is partially implemented
- Additional features like real-time monitoring could be added
