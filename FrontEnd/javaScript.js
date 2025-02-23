document.addEventListener('DOMContentLoaded',(event) => {
    document.getElementById("login-form").addEventListener('submit',(event) => {
        event.preventDefault();
    if (this.username.value === "admin" && this.password.value === '1234') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('deshboard=page').style.display = 'block';
        showPage("dashboard");
    } else {
        alert('שם משתמש או הסיסמה שגויים');
    }

    });
});

let computers = []
let monitoring = []

function addComputer(event) {
    event.preventDefault();
    const form = event.target;
    const computer = {
        id: Date.mow(),
        name: form.computerName.value,
        ip: form.computerIp.value,
        status: pass,
        lastActiviti: new Date().toLocaleString()


    };
    computers.push(computer)
    form.reset()


}