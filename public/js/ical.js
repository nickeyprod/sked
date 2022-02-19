class iCal {
    constructor() {
        this.today = new Date(Date.now());
        this.intId = null;
        this.nowOnStage = document.getElementById("now-on-stage");
        this.divScroll = document.getElementById("div-scroll"); 
        window.onload = () => {
            this.startPreloader();
            this.updateStageEvent();
            // this.startScrolling();
        }
    }

    async updateStageEvent() {
        const currMonthEvents = await this.getCurrMonthEvents();
        const todayEvents = this.getTodayEvents(currMonthEvents);
        const currEvent = this.getCurrEvent(todayEvents);
        this.setEvent(currEvent);

    }

    async getCurrMonthEvents() {
        const resp = await request("/api/ical", "GET");
        if (resp.status !== 200) {
            clearInterval(this.intId);
            this.nowOnStage.textContent = "?";
        }
        const data = await resp.json();
        const evts = data.evts;
        return evts
    }

    getTodayEvents(evts) {
        const todayEvents = [];

        for(let i = 0; i < evts.length; i++) {
            if (new Date(evts[i].start).getDate() == this.today.getDate()) {
                todayEvents.push(evts[i]);
            }
        }
        return todayEvents;
    }

    getCurrEvent(todayEvents) {

        for(let i = 0; i < todayEvents.length; i++) {
            const evStart = new Date(todayEvents[i].start).getTime();
            const evEnd = new Date(todayEvents[i].end).getTime();
            const currTime = this.today.getTime();

            if (evStart < currTime && evEnd > currTime) {
                return todayEvents[i];
            }
        }

        return {summary: "Hичего"};

    }

    getRusTime(time) {
        let timeStr = time.getHours();
        let minutes = time.getMinutes();
        if ( minutes.toString().length == 1) {
            minutes = minutes.toString() + "0";
        }
        timeStr += ":" + minutes;
        return timeStr;
    }

    setEvent(evt) {
        clearInterval(this.intId);

        if (evt && (evt.summary != "Hичего")) {
            const evStart = new Date(evt.start);
            const evEnd = new Date(evt.end);
            const time = "C " + this.getRusTime(evStart) + " до " + this.getRusTime(evEnd);
            this.nowOnStage.textContent = time + " - " + evt.summary;

        } else {
            this.nowOnStage.textContent = evt.summary;
        }

    }

    startPreloader() {
        let str = ".";
        this.intId = setInterval(() => {
            str += ".";
            this.nowOnStage.textContent = str;
            if (str.length > 2) str = "";
        }, 500);
    }

    startScrolling() {
        let prevNum = 0;
        let firstTime = true;
        let scrollStep = 1;

        this.scrollInt = setInterval(() => { 
            if (firstTime) {
                this.divScroll.scrollLeft += scrollStep;
                if (this.divScroll.scrollLeft != 0) {
                    firstTime = false;
                }
            }
            else if (prevNum < this.divScroll.scrollLeft) {
                prevNum = this.divScroll.scrollLeft;
                this.divScroll.scrollLeft += scrollStep;
            } else if (prevNum == this.divScroll.scrollLeft) {
                this.divScroll.scrollLeft -= scrollStep;
            } else if (prevNum > this.divScroll.scrollLeft) {
                prevNum = this.divScroll.scrollLeft;
                this.divScroll.scrollLeft -= scrollStep;
                if (this.divScroll.scrollLeft == 0) {
                    this.divScroll.scrollLeft = scrollStep;
                }
            }
        }, 50);

    }
}