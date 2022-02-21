class Repertuar {
  constructor() {
    this.rollLine = document.getElementById("event-container");
    this.todaySquare = document.getElementById(`${new Date(Date.now()).getMonth()}-${new Date(Date.now()).getDate()}`);
    this.target = this.todaySquare.offsetLeft - 200;

    window.onload = () => {
      this.startAnimatingScroll();
    };
  }

  startAnimatingScroll() {
    let speed = 10;
    let d = 1;
    let id = setInterval(() => {
      if (this.rollLine.scrollLeft < this.target) {
        d++;
        this.rollLine.scrollLeft += 500 + (speed*d);
      } else {
        clearInterval(id);
      }
    }, 50);
  }
}
