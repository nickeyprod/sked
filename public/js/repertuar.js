class Repertuar {


  constructor() {
    this.rollLine = document.getElementById("event-container");
    this.day = 1000 * 60 * 60 * 24;
    this.dt = new Date(Date.now());

    for(let i=0; i < 5; i++) {
      this.todaySquare = document.getElementById(`${new Date(Date.now()).getMonth()}-${this.dt.getDate()}`);
      if (!this.todaySquare) {
        this.dt = new Date(this.dt.getTime() + this.day);
      } else {
        break
      }
    }
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
