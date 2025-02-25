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
// רשימת מחשבים
let computers = []
let monitoring = []
// הוספת מחשב
function addComputer(event) {
    event.preventDefault();
    const form = event.target;
    const computer = {
        id: Date.mow(),
        name: form.computerName.value,
        ip: form.computerIp.value,
        status: "offline",
        lastActivity: new Date().toLocaleString()
    };

    computers.push(computer)
    form.reset()
    updateComputersList()


}
// הסרת מחשב
function removeComputer(id){
    computers = computers.filter(computer => computer.id !== id)
    updateComputersList()
}

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


