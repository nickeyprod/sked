class Authorisate {

  constructor() {
    this.authBtn = document.getElementById("auth-bt");
    this.loginInpt = document.getElementById("login");
    this.passInpt = document.getElementById("pass");

    this.authBtn.onclick = () => {
      this.authorise();
    };
  }


  async authorise() {

    if (!this.loginInpt.value || !this.passInpt.value) {
      return alert("Отсутствует логин или пароль");
    }

    const authData = {
      login: this.loginInpt.value,
      pass: this.passInpt.value
    }

    const resp = await request("/auth", "POST", authData);
    var message;
    if (resp.statusText && resp.statusText != "") {
      message = resp.statusText
    } else {
      message = resp.headers.get("statusmessage")
    }

    if (message == "Check login and password") {
      alert("Неверный логин или пароль");
      return;
    } else if (message == "Authorised") {
      alert("Авторизация успешна и будет действительна в течение 30 дней");
      window.location.href = "/performances";
      return;
    } else {
      alert("Произошла ошибка во время авторизации");
      return;
    }

  }
}