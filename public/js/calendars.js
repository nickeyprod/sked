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
            this.updateAllEvents();
        };
    }

    showTehPreloader() {
        this.tehPreloader.style.display = "block";
    }

    showStagePreloader() {
        this.stagePreloader.style.display = "block";
    }

    showLoadPreloader() {
        this.loadPreloader.style.display = "block";
    }

    hideTehPreloader() {
        this.tehPreloader.style.display = "none";
    }

    hideLoadPreloader() {
        this.loadPreloader.style.display = "none";
    }

    hideStagePreloader() {
        this.stagePreloader.style.display = "none";

    }

    // "/api/ical/stage"
    async getCalEvents(url) {
        const resp = await request(url, "GET");
        if (resp.status !== 200) {
            console.error("Error uploading calendar events");
        }
        const data = await resp.json();
        const evts = data.evts;
        return evts;
    }

    getTodayEvents(events) {

        const todayDate = new Date(Date.now());
        const today = todayDate.getDate();
        const month = todayDate.getMonth();
        const year = todayDate.getFullYear();
        const todayEvents = [];
        

        for(let key in events) {
            const evStart = new Date(events[key].start);
            if (evStart.getFullYear() == year && evStart.getMonth() == month && evStart.getDate() == today) {
                todayEvents.push(events[key]);
            }
        }
        return todayEvents;
    }

    getCurrentEvent(evts) {
        const today = new Date(Date.now());

        for (let i = 0; i < evts.length; i++) {
            const evStart = new Date(evts[i].start).getTime();
            const evEnd = new Date(evts[i].end).getTime();
            const currTime = today.getTime();

            if (evStart < currTime && evEnd > currTime) {
                return evts[i];
            }
        }
        return {summary: "Нет данных"};
    }

    async updateAllEvents() {
        this.showStagePreloader();
        const allStageEvents = await this.getCalEvents(this.stageEvURL);
        this.showTehPreloader();
        const allTehEvents = await this.getCalEvents(this.tehEvURL);
        this.showLoadPreloader();
        const allLoadEvents = await this.getCalEvents(this.loadEvURL);

        const todayStageEvents = this.getTodayEvents(allStageEvents);
        const currStageEvent = this.getCurrentEvent(todayStageEvents);
        this.setStageEvent(currStageEvent);
        this.hideStagePreloader();

        const todayTehEvents = this.getTodayEvents(allTehEvents);
        const currTehEvent = this.getCurrentEvent(todayTehEvents);
        this.setTehEvent(currTehEvent);
        this.hideTehPreloader();

        const todayLoadEvents = this.getTodayEvents(allLoadEvents);
        const currLoadEvent = this.getCurrentEvent(todayLoadEvents);
        this.setLoadEvent(currLoadEvent);
        this.hideLoadPreloader();
        
    }

    setStageEvent(evt) {
        this.stageEvMsg.textContent = evt.summary;
        if (evt.start != undefined && evt.end != undefined) {
            this.stageEvTime.textContent = "Сейчас: " + this.getRusTime(evt.start) + " - " + this.getRusTime(evt.end);
        } else {
            this.stageEvTime.textContent = "Сейчас: ";
        }
    }

    setTehEvent(evt) {
        this.tehEvMsg.textContent = evt.summary;
        if (evt.start != undefined && evt.end != undefined) {
            this.tehEvTime.textContent = "Сейчас: " + this.getRusTime(evt.start) + " - " + this.getRusTime(evt.end);
        } else {
            this.tehEvTime.textContent = "Сейчас: ";
        }
    }

    setLoadEvent(evt) {
        this.loadEvMsg.textContent = evt.summary;
        if (evt.start != undefined && evt.end != undefined) {
            this.loadEvTime.textContent = "Сейчас: " + this.getRusTime(evt.start) + " - " + this.getRusTime(evt.end);
        } else {
            this.loadEvTime.textContent = "Сейчас: ";
        }
    }

    getRusTime(time) {
        time = new Date(time);
        let timeStr = time.getHours();
        let minutes = time.getMinutes();
        if ( minutes.toString().length == 1) {
            minutes = minutes.toString() + "0";
        }
        timeStr += ":" + minutes;
        return timeStr;
    }
}