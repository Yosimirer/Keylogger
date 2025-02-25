const API_URL = 'https://localhost:5000/api';

const username = document.getElementById('username');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const dashboardPage = document.getElementById('dashboard-page');
const user = document.getElementById('user-name');
const deshboardContent = document.getElementById('dashboard-content');
const search = document.getElementById('search');
const computersTable = document.getElementById('table');

document.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        checkLogin();
    });
});


function checkLogin() {
    const username = localStorage.getItem('username');
    if (username === 'admin' && password === '1234') {
        dashboardPage.style.display = 'block';
        loginForm.style.display = 'none';
        user.innerText = username; 
    } else {
        alert('שם משתמש או סיסמה שגויים');
    }   
}


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
    computers.push(data);
    updateComputersList();

}

async function removeComputer(ip) {
    const response = await fetch(`${API_URL}/computers/${ip}`, {
        method: 'POST'
    });

    computers = response.json();
    updateComputersList();
    }


async function updateComputersList() {
    const response = await fetch(`${API_URL}/computers`);
    computers = await response.json();
    computersTable.innerHTML = '';
    computers.forEach(computer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.ip}</td>
            <td>${computer.status}</td>
            <td>${computer.lastActivity}</td>
            <td>
                <button onclick="removeComputer(${computer.id})">מחק</button>
                <button onclick="showMonitoring(${computer.id})">מעקב</button>
            </td>
        `;
        computersTable.appendChild(tr);
    });
}

async function showMonitoring(id) {
    const response = await fetch(`${API_URL}/computers/${id}`);
    const computer = await response.json();
    deshboardContent.innerHTML = `
        <h2>${computer.name}</h2>
        <p>IP: ${computer.ip}</p>
        <p>סטטוס: ${computer.status}</p>
        <p>פעילות אחרונה: ${computer.lastActivity}</p>
    `;
}

function searchComputers() {
    const searchValue = search.value;
    const filteredComputers = computers.filter(computer => {
        return computer.name.includes(searchValue) || computer.ip.includes(searchValue);
    });

    computersTable.innerHTML = '';
    filteredComputers.forEach(computer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${computer.name}</td>
            <td>${computer.ip}</td>
            <td>${computer.status}</td>
            <td>${computer.lastActivity}</td>
            <td>
                <button onclick="removeComputer(${computer.id})">מחק</button>
                <button onclick="showMonitoring(${computer.id})">מעקב</button>
            </td>
        `;
        computersTable.appendChild(tr);
    });
}





































document.addEventListener('DOMContentLoaded',() => {
    document.getElementById("login-form").addEventListener('submit',(event) => {
        event.preventDefault();

      

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (username === "admin" && password === '1234') {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'block';
            showPage("dashboard");
        } else {
            alert('שם משתמש או הסיסמה שגויים');
    }

    });
});

// הוספת מחשב



// עדכון רשימת מחשבים
function updateComputersList() {
    const cbody = document.getElementById('computers-list')
    cbody.innerHTML = ''

    computers.forEach(computer => {
        const tr = document.createElement('tr')
        tr.innerHTML = 
        `<td>${computer.name}</td>  
        <td>${computer.ip}</td> 
        <td>${computer.status}</td> 
        <td>${computer.lastActivity}</td>
        <td>
        <button onclick="removeComputer(${computer.id})">מחק</button>
        <button onclick="showMonitoring(${computer.id})">מעקב</button>
        </td>`
    ;
        cbody.appendChild(tr)   
        
    });

}    


