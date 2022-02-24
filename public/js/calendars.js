class Calendars {
    constructor() {
        this.stageEvTime = document.getElementById("stage-ev-time");
        this.stageEvMsg = document.getElementById("stage-ev-msg");

        this.tehEvTime = document.getElementById("teh-ev-time");
        this.tehEvMsg = document.getElementById("teh-ev-msg");

        this.loadEvTime = document.getElementById("load-ev-time");
        this.loadEvMsg = document.getElementById("load-ev-msg");

        this.stagePreloader = document.getElementById("stage-preloader");
        this.tehPreloader = document.getElementById("teh-preloader");
        this.loadPreloader = document.getElementById("load-preloader");


        this.stageEvURL = "/api/ical/stage";
        this.tehEvURL = "/api/ical/teh-job";
        this.loadEvURL = "/api/ical/load";

        window.onload = () => {
            this.startUpdatingStageEvents();
        };
    }

    startUpdatingStageEvents() {
        this.updateAllEvents();
        setInterval(() => {
            this.updateAllEvents();
        }, 60000);
    }

    showPreloader(type) {
        if (type == "stage") {
            this.stagePreloader.style.display = "block";
        } else if (type == "tech") {
            this.tehPreloader.style.display = "block";
        } else if (type == "load") {
            this.loadPreloader.style.display = "block";
        }
    }

    hidePreloader(type) {
        if (type == "stage") {
            this.stagePreloader.style.display = "none";
        } else if (type == "tech") {
            this.tehPreloader.style.display = "none";
        } else if (type == "load") {
            this.loadPreloader.style.display = "none";
        }
    }

    // "/api/ical/stage"
    async getCalEvents(url) {
        const resp = await request(url, "GET");
        if (resp.status !== 200) {
            console.error("Error uploading calendar events");
        }
        const data = await resp.json();
        return data.evts;
    }

    getTodayEvents(evts, todayDate) {
        const todayEvents = [];

        for (let key in evts) {
            const evStart = new Date(evts[key].start);
            if (evStart.getFullYear() == todayDate.getFullYear() && evStart.getMonth() == todayDate.getMonth() && evStart.getDate() == todayDate.getDate()) {
                todayEvents.push(evts[key]);
            }
        }
        return todayEvents;
    }

    getCurrentEvent(evts, todayDate) {

        for (let i = 0; i < evts.length; i++) {
            const evStart = new Date(evts[i].start).getTime();
            const evEnd = new Date(evts[i].end).getTime();
            const currTime = todayDate.getTime();

            if (evStart < currTime && evEnd > currTime) {
                return evts[i];
            }
        }
        return false;
    }

    getNextEvent(evts, todayDate) {
        // Detect next event
        let todayPlusHour = todayDate.getTime();
        for (let b = 0; b < 5; b++) {
            todayPlusHour += 1000 * 60 * 60;

            for (let i = 0; i < evts.length; i++) {
                const evStart = new Date(evts[i].start).getTime();
                const evEnd = new Date(evts[i].end).getTime();

                if (evStart < todayPlusHour && evEnd > todayPlusHour) {
                    return evts[i];
                }

            }
        }
    }

    async updateAllEvents() {
        this.showPreloader("stage");
        const allStageEvents = await this.getCalEvents(this.stageEvURL);
        this.showPreloader("tech");
        const allTehEvents = await this.getCalEvents(this.tehEvURL);
        this.showPreloader("load");
        const allLoadEvents = await this.getCalEvents(this.loadEvURL);

        const noData = { summary: "Нет данных" };
        const todayDate = new Date(Date.now());

        const todayStageEvents = this.getTodayEvents(allStageEvents, todayDate);
        const currStageEvent = this.getCurrentEvent(todayStageEvents, todayDate);
        if (!currStageEvent) {
            const nextStageEvent = this.getNextEvent(todayStageEvents, todayDate);
            // console.log("Next stage: ", nextStageEvent);
            this.setEvent(nextStageEvent ? nextStageEvent : noData, todayDate)
        }
        this.setEvent(currStageEvent ? currStageEvent : noData, todayDate, "stage");
        this.hidePreloader("stage");

        const todayTehEvents = this.getTodayEvents(allTehEvents, todayDate);
        const currTehEvent = this.getCurrentEvent(todayTehEvents, todayDate);
        if (!currTehEvent) {
            const nextTehEvent = this.getNextEvent(todayTehEvents, todayDate);
            // console.log("Next teh: ", nextTehEvent);
            this.setEvent(nextTehEvent ? nextTehEvent : noData, todayDate)
        }
        this.setEvent(currTehEvent ? currTehEvent : noData, todayDate, "tech");
        this.hidePreloader("tech");

        const todayLoadEvents = this.getTodayEvents(allLoadEvents, todayDate);
        const currLoadEvent = this.getCurrentEvent(todayLoadEvents, todayDate);
        if (!currLoadEvent) {
            const nextLoadEvent = this.getNextEvent(todayLoadEvents, todayDate);
            // console.log("Next load: ", nextLoadEvent);
            this.setEvent(nextLoadEvent ? nextLoadEvent : noData, todayDate)
        }
        this.setEvent(currLoadEvent ? currLoadEvent : noData, todayDate, "load");
        this.hidePreloader("load");

    }

    setEvent(evt, todayDate, evType) {
        if (evType == "stage") {
            this.stageEvMsg.textContent = evt.summary;
        } else if (evType == "tech") {
            this.tehEvMsg.textContent = evt.summary;
        } else if (evType == "load") {
            this.loadEvMsg.textContent = evt.summary;
        }

        if (evt.start != undefined && evt.end != undefined) {
            if (new Date(evt.start).getTime() > todayDate.getTime()) {
                if (evType == "stage") {
                    this.stageEvTime.textContent = "Далее: " + this.getRusTime(evt.start) + " - " + this.getRusTime(evt.end)
                } else if (evType == "tech") {
                    this.tehEvTime.textContent = "Далее: " + this.getRusTime(evStart) + " - " + this.getRusTime(evEnd);
                } else if (evType == "load") {
                    this.loadEvTime.textContent = "Далее: " + this.getRusTime(evStart) + " - " + this.getRusTime(evEnd);;
                }
            } else {
                if (evType == "stage") {
                    this.stageEvTime.textContent = "Сейчас: " + this.getRusTime(evt.start) + " - " + this.getRusTime(evt.end);
                } else if (evType == "tech") {
                    this.tehEvTime.textContent = "Сейчас: " + this.getRusTime(evStart) + " - " + this.getRusTime(evEnd);
                } else if (evType == "load") {
                    this.loadEvTime.textContent = "Сейчас: " + this.getRusTime(evStart) + " - " + this.getRusTime(evEnd);
                }
            }

        } else {
            if (evType == "stage") {
                this.stageEvTime.textContent = "Сейчас: ";
            } else if (evType == "tech") {
                this.tehEvTime.textContent = "Сейчас: ";
            } else if (evType == "load") {
                this.loadEvTime.textContent = "Сейчас: ";
            }
        }
    }

    getRusTime(time) {
        time = new Date(time);
        let timeStr = time.getHours();
        let minutes = time.getMinutes();
        if (minutes.toString().length == 1) {
            minutes = minutes.toString() + "0";
        }
        timeStr += ":" + minutes;
        return timeStr;
    }
}