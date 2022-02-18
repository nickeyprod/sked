
class Authenticate {

  constructor() {
    this.login = document.getElementById("login");
    this.pass1 = document.getElementById("pass1");
    this.pass2 = document.getElementById("pass2");
    this.authBtn = document.getElementById("authenticate-bt");

    this.login.onclick = () => {
      this.login.style.borderColor = "transparent";
    };

    this.pass1.onclick = () => {
      this.pass1.style.borderColor = "transparent";
    };

    this.pass2.onclick = () => {
      this.pass2.style.borderColor = "transparent";
    };

    this.authBtn.onclick = () => {
      this.authenticate();
    }
  }

  async authenticate () {
    if (!this.login.value) {
      alert('Поле "Логин" пусто. Придумайте себе логин, чтобы продолжить.');
      this.login.style.borderColor = "#f26a6a";
      return;
    }
    else if (!this.pass1.value) {
      alert('Поле "Пароль" пусто. Придумайте себе пароль, чтобы продолжить.');
      this.pass1.style.borderColor = "#f26a6a";
      return;
    }
    else if (!this.pass2.value) {
        alert('Поле "Пароль повторно" пусто. Введите пароль повторно, чтобы продолжить.');
        this.pass2.style.borderColor = "#f26a6a";
        return;
    }

    if (this.pass1.value !== this.pass2.value) {
      alert("Введённые Вами пароли не совпадают");
      return;
    } 

    const authData = {
      login: this.login.value,
      pass1: this.pass1.value,
      pass2: this.pass2.value,
    }
    
    const resp = await request("/authenticate", "POST", authData);
    
    if (resp.statusText == "Inconsistent data") {
      alert("Отсутсвует логин или пароль");
      return;
    } if (resp.statusText == "Duplicate") {
      alert("Такой логин уже занят, придумайте другой");
      return;
    } else if (resp.statusText == "Passwords mismatch")  {
      alert("Пароли не совпадают");
      return;
    } else if(resp.statusText == "Authenticated") {
      alert("Аутентификация успешна, сейчас вы будете перенаправлены на страницу логина");
      window.location.href = "/auth";
      return;
    }
    else {
      alert("Ошибка аутентификации");
      return;
    }
    
  };

}