class iCal {
    constructor() {

        this.intId = null;
        this.nowOnStage = document.getElementById("now-on-stage");
        this.nowOrNext = document.getElementById("now-or-next");

        window.onload = () => {
            this.startPreloader();
            this.startUpdatingStageEvents();
        }
    }

    startUpdatingStageEvents() {
        this.updateStageEvent();
        setInterval(() => {
            this.updateStageEvent();
        }, 120000);
    }

    async updateStageEvent() {
        const allEvents = await this.getCalEvents();
        const todayDate = new Date(Date.now());
        const todayEvents = this.getTodayEvents(allEvents, todayDate);
        const currEvent = this.getCurrEvent(todayEvents, todayDate);
        const noData = { summary: "Нет данных" };

        if (!currEvent) {
            const nextEvent = this.getNextEvent(todayEvents, todayDate);
            console.log("Next: ", nextEvent);
            this.setEvent(nextEvent ? nextEvent : noData, todayDate)
        }
        this.setEvent(currEvent ? currEvent : noData, todayDate);
    }

    async getCalEvents() {
        const resp = await request("/api/ical/stage", "GET");
        if (resp.status !== 200) {
            clearInterval(this.intId);
            this.nowOnStage.textContent = "? error ?";
        }
        const data = await resp.json();
        return data.evts;
    }

    getTodayEvents(evts, todayDate) {
        const todayEvts = [];

        for (let key in evts) {
            const evStartDate = new Date(evts[key].start);
            if (evStartDate.getFullYear() == todayDate.getFullYear() && evStartDate.getMonth() == todayDate.getMonth() && evStartDate.getDate() == todayDate.getDate()) {
                todayEvts.push(evts[key]);
            }
        }

        return todayEvts;
    }

    getCurrEvent(todayEvents, todayDate) {
        for (let i = 0; i < todayEvents.length; i++) {
            const evStart = new Date(todayEvents[i].start).getTime();
            const evEnd = new Date(todayEvents[i].end).getTime();
            const currTime = todayDate.getTime();

            if (evStart < currTime && evEnd > currTime) {
                return todayEvents[i];
            }
        }

        return false;
    }

    getNextEvent(todayEvents, todayDate) {
        let datePlusHour = todayDate.getTime();

        for (let b = 0; b < 5; b++) {
            datePlusHour += 1000 * 60 * 60;
            for (let i = 0; i < todayEvents.length; i++) {
                const evStart = new Date(todayEvents[i].start).getTime();
                const evEnd = new Date(todayEvents[i].end).getTime();

                console.log(evStart < datePlusHour);

                if (evStart < datePlusHour && evEnd > datePlusHour) {
                    return todayEvents[i];
                }

            }
        }
    }

    getRusTime(time) {
        time = new Date(time);
        return `${time.getHours()}:${time.getMinutes().toString().length == 1 ? time.getMinutes().toString() + "0" : time.getMinutes()}`;
    }

    setEvent(evt, todayDate) {
        
        clearInterval(this.intId);

        if (evt && (evt.summary != "Нет данных")) {
            if (new Date(evt.start).getTime() > todayDate.getTime()) {
                this.nowOrNext.textContent = "Далее на сцене:";
            } else {
                this.nowOrNext.textContent = "Сейчас на сцене:";
            }
            const time = "C " + this.getRusTime(evt.start) + " до " + this.getRusTime(evt.end);
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
        }, 400);
    }
}