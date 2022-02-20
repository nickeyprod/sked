class iCal {
    constructor() {
        this.today = new Date(Date.now());
        this.intId = null;
        this.nowOnStage = document.getElementById("now-on-stage");
        this.divScroll = document.getElementById("div-scroll"); 
        window.onload = () => {
            this.startPreloader();
            this.startUpdatingStageEvents();
            // this.startScrolling();
        }
    }

    startUpdatingStageEvents() {
        this.updateStageEvent();
        setInterval(() => {
            this.updateStageEvent();
        }, 60000);
    }

    async updateStageEvent() {
        const allEvents = await this.getCalEvents();
        const currMonthEvents = this.getCurrMonthEvents(allEvents);    
        const todayEvents = this.getTodayEvents(currMonthEvents);
        const currEvent = this.getCurrEvent(todayEvents);
        this.setEvent(currEvent);
    }

    async getCalEvents() {
        const resp = await request("/api/ical/stage", "GET");
        if (resp.status !== 200) {
            clearInterval(this.intId);
            this.nowOnStage.textContent = "Нет данных";
        }
        const data = await resp.json();
        const evts = data.evts;
        return evts;
    }

    getCurrYearEvents(events) {
        const today = new Date(Date.now());
        const year = today.getFullYear();
        const month = today.getMonth();
        const currYearEvents = [];

        for (let key in events) {

            const calDataStart = new Date(events[key].start);

            if (calDataStart.getFullYear() == year) {
                currYearEvents.push(events[key]);
            }
        }
        return currYearEvents;
    }

    getCurrMonthEvents(events) {
        const today = new Date(Date.now());
        const year = today.getFullYear();
        const month = today.getMonth();
        const currMonthEvents = [];

        for (let key in events) {

            const calDataStart = new Date(events[key].start);

            if (calDataStart.getFullYear() == year && calDataStart.getMonth() == month) {
                currMonthEvents.push(events[key]);
            }
        }
        return currMonthEvents;
    }

    getTodayEvents(events) {
        const todayEvents = [];

        for(let i = 0; i < events.length; i++) {
            if (new Date(events[i].start).getDate() == this.today.getDate()) {
                todayEvents.push(events[i]);
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