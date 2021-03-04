function request(e, t, n, o) {
    const i = new XMLHttpRequest();
    (i.onreadystatechange = function() {
        4 == this.readyState && 200 == this.status ?
            o("success", this) :
            4 == this.readyState && 500 == this.status && o("error", this);
    }),
    (i.onerror = function(e) {
        0 == e.currentTarget.status && o("econn");
    }),
    i.open(e, t, !0), !1 !== n ?
        (i.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
            ),
            i.send(n)) :
        i.send();
}

function Auth(e = "") {
    const t = this;
    (this.BASE_URL = e),
    (this.authBt = document.getElementById("auth-bt")),
    (this.login = document.getElementById("login")),
    (this.pass = document.getElementById("pass")),
    (this.authBt.onclick = function() {
        let e = t.login.value,
            n = t.pass.value;
        if (!e || !n) return alert("Отсутствует логин или пароль");
        request(
            "POST",
            t.BASE_URL + "/auth",
            `login=${e}&pass=${n}`,
            function(e, n) {
                if ("success" == e)
                    return (
                        alert(
                            "Авторизация успешна и будет действительна в течение 30 дней"
                        ),
                        "" === t.BASE_URL ?
                        (window.location.href = "/") :
                        Rocky.setWorkspaceTo("performances")
                    );
                "error" != e ||
                    alert("Ошибка авторизации, проверьте введённые Вами данные");
            }
        );
    });
}

function Authenticate(e = "") {
    const t = this;
    (this.BASE_URL = e),
    (this.login = document.getElementById("login")),
    (this.pass1 = document.getElementById("pass1")),
    (this.pass2 = document.getElementById("pass2")),
    (this.authenBt = document.getElementById("authenticate-bt")),
    (this.login.onclick = function() {
        t.login.style.borderColor = "transparent";
    }),
    (this.pass1.onclick = function() {
        t.pass1.style.borderColor = "transparent";
    }),
    (this.pass2.onclick = function() {
        t.pass2.style.borderColor = "transparent";
    }),
    (this.authenBt.onclick = function() {
        if (!t.login.value)
            return (
                alert('Поле "Логин" пусто. Придумайте себе логин, чтобы продолжить.'),
                (t.login.style.borderColor = "#f26a6a")
            );
        if (!t.pass1.value)
            return (
                alert(
                    'Поле "Пароль" пусто. Придумайте себе пароль, чтобы продолжить.'
                ),
                (t.pass1.style.borderColor = "#f26a6a")
            );
        if (!t.pass2.value)
            return (
                alert(
                    'Поле "Пароль повторно" пусто. Введите пароль повторно, чтобы продолжить.'
                ),
                (t.pass2.style.borderColor = "#f26a6a")
            );
        let e = t.login.value,
            n = t.pass1.value,
            o = t.pass2.value,
            i = `login=${e}&pass1=${n}&pass2=${o}`;
        if (n !== o) return alert("Введённые Вами пароли не совпадают");
        request("POST", t.BASE_URL + "/authenticate", i, function(e, n) {
            if ("success" == e)
                return (
                    alert(
                        "Аутентификация успешна, сейчас вы будете перенаправлены на страницу логина"
                    ),
                    "" === t.BASE_URL ?
                    (window.location.href = "/auth") :
                    Rocky.setWorkspaceTo("login")
                );
            "error" != e ||
                alert("Ошибка аутентификации, проверьте поля для ввода.");
        });
    });
}

function updateBreadcrump() {
    const e = document.getElementById("bread-crump"),
        t = window.location.pathname;
    e.textContent = {
        "/": "Главная",
        "/materials": "Материалы",
        "/performances": "Спектакли",
    }[t];
}

function Notes(e = "") {
    const t = this;
    this.BASE_URL = e;
    const n = document.getElementById("publish-btn"),
        o = document.getElementById("close-new-note"),
        i = document.getElementById("new-note-btn"),
        s = document.getElementById("new-note-background"),
        l = document.getElementById("user-message"),
        a = document.getElementById("last-notes"),
        d = document.getElementById("sort-by");
    (this.skip = 0),
    (this.limit = 10),
    (this.initialize = () => {
        (d.onchange = (e) => {
            t.upload10Notes(e.target.value).then((e) => {
                (a.innerHTML = ""), t.fillNotes(e);
            });
        }),
        (i.onclick = () => {
            t.openWriteNewNote();
        }),
        (n.onclick = () => {
            this.publishNote()
                .then((e) => {
                    if ("Published" == e.statusText)
                        return (
                            alert("Сообщение опубликовано"), window.location.reload()
                        );
                })
                .catch((e) => {
                    alert("Ошибка отправки запроса");
                });
        }),
        (o.onclick = () => {
            s.style.display = "none";
        }),
        (this.fillNotes = (e) => {
            e = e.notes;
            for (let t = 0; t < e.length; t++) {
                let n = document.createElement("div");
                n.setAttribute("class", "note");
                let o = document.createElement("div");
                o.setAttribute("class", "user-info");
                let i = document.createElement("span");
                i.setAttribute("class", "username"),
                    (i.textContent = e[t].user.username),
                    o.appendChild(i),
                    n.appendChild(o);
                let s = document.createElement("div");
                s.setAttribute("class", "user-message");
                let l = document.createElement("p");
                (l.textContent = e[t].text), s.appendChild(l), n.appendChild(s);
                let d = document.createElement("div");
                d.setAttribute("class", "actions");
                let r = document.createElement("span");
                r.setAttribute("class", "note-date"), d.appendChild(r);
                let c = document.createElement("div");
                c.setAttribute("class", "hands");
                let u = document.createElement("div");
                u.setAttribute("class", "handup");
                let p = document.createElement("div");
                p.setAttribute("class", "handown");
                let m = document.createElement("img");
                m.setAttribute("class", "hand-up"),
                    m.setAttribute("src", "static/imgs/handup.svg");
                let h = document.createElement("div");
                h.setAttribute("class", "handup-num"),
                    (h.textContent = e[t].votes.likedBy.length),
                    u.appendChild(m),
                    u.appendChild(h);
                let f = document.createElement("img");
                f.setAttribute("class", "hand-down"),
                    f.setAttribute("src", "static/imgs/handown.svg");
                let g = document.createElement("div");
                g.setAttribute("class", "handown-num"),
                    (g.textContent = e[t].votes.dislikedBy.length),
                    p.appendChild(f),
                    p.appendChild(g),
                    c.appendChild(u),
                    c.appendChild(p),
                    d.appendChild(c),
                    n.appendChild(d),
                    a.appendChild(n),
                    m.addEventListener("click", (n) => {
                        this.likeNote(e[t]._id)
                            .then((e) => {
                                n.target.classList.add("anim-grow"),
                                    n.target.addEventListener("transitionend", () => {
                                        n.target.classList.remove("anim-grow");
                                    });
                                const t = e.note;
                                (n.target.nextSibling.textContent = t.votes.likedBy.length),
                                (n.target.parentElement.nextSibling.childNodes[1].textContent =
                                    t.votes.dislikedBy.length);
                            })
                            .catch((e) => console.log(e));
                    }),
                    f.addEventListener("click", (n) => {
                        this.dislikeNote(e[t]._id).then((e) => {
                            n.target.classList.add("anim-grow"),
                                n.target.addEventListener("transitionend", () => {
                                    n.target.classList.remove("anim-grow");
                                });
                            const t = e.note;
                            (n.target.nextSibling.textContent =
                                t.votes.dislikedBy.length),
                            (n.target.parentElement.previousSibling.childNodes[1].textContent =
                                t.votes.likedBy.length);
                        });
                    });
            }
        }),
        this.upload10Notes().then((e) => {
            t.fillNotes(e);
        });
    }),
    (this.likeNote = async(e) =>
        (
            await fetch(this.BASE_URL + "/notes/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ typeOfVote: "like", noteId: e }),
            })
        ).json()),
    (this.dislikeNote = async(e) =>
        (
            await fetch(this.BASE_URL + "/notes/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ typeOfVote: "dislike", noteId: e }),
            })
        ).json()),
    (this.upload10Notes = async(e = "-1") => {
        const t = await fetch(this.BASE_URL + "/notes/upload-ten?sort=" + e);
        return await t.json();
    }),
    (this.openWriteNewNote = () => {
        s.style.display = "block";
    }),
    (this.publishNote = async() => {
        if (!l.value) return alert("Вы не ввели текст заметки");
        return await fetch(this.BASE_URL + "/notes/publish-note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: l.value }),
        });
    }),
    (this.uploadLastTenNotes = () => {
        request("POST", t.BASE_URL + "/notes", "get=last10notes", (e, t) => {
            if ("success" == e);
            else if ("error" == e)
                return void alert(
                    "Ошибка запроса последних заметок, проверьте соединение или попробуйте позже"
                );
        });
    }),
    this.initialize();
}

function Performance(e = "", t = "false") {
    const n = this;
    (this.BASE_URL = e),
    (this.pointsData = { leftSide: {}, rightSide: {} }),
    (this.totalPointsNum = 0),
    (this.addPerfBtn = document.getElementById("add-performance-btn")),
    (this.preloader = document.getElementById("preloader")),
    (this.searchInpt = document.getElementById("search-perfs")),
    (this.backgroundModal = document.getElementById("background-modal")),
    (this.closeAddPerf = document.getElementById("close-adding-perf")),
    (this.savePerfBtn = document.getElementById("save-perf-btn")),
    (this.perfName = document.getElementById("perf-name")),
    (this.perfType = document.getElementById("perf-type")),
    (this.perfUrl = document.getElementById("perf-pic-url")),
    (this.perfActs = document.getElementById("perf-acts")),
    (this.perfPoints = document.getElementById("perf-points")),
    (this.perfNotes = document.getElementById("perf-notes")),
    (this.addActBtn = document.getElementById("add-act")),
    (this.searchResults = document.getElementById("search-results")),
    (this.closeCardPerf = document.getElementById("close-card-perf")),
    (this.backgroundCard = document.getElementById("card-back")),
    (this.addPointsBtn = document.getElementById("add-points")),
    (this.addRightPointBtn = document.getElementById("add-right-pt-btn")),
    (this.addLeftPointBtn = document.getElementById("add-left-pt-btn")),
    (this.backgroundPoints = document.getElementById("points-back")),
    (this.closeEditPointsBtn = document.getElementById("close-points-perf")),
    (this.userPointsBack = document.getElementById("user-points-back")),
    (this.closeUserPoints = document.getElementById("close-user-points")),
    (this.cardPerfName = document.getElementById("card-perf-name")),
    (this.cardPerfImg = document.getElementById("card-perf-img")),
    (this.cardPerfType = document.getElementById("card-perf-type")),
    (this.cardPerfActs = document.getElementById("card-perf-acts")),
    (this.cardPerfPoints = document.getElementById("card-perf-points")),
    (this.cardPerfNotes = document.getElementById("card-perf-notes")),
    (this.totalPointsSpan = document.getElementById("total-points-num")),
    (this.getActsEnding = function(e) {
        let t;
        return (
            (t = 1 == e ? e + " акт" : e > 1 && e < 5 ? e + " акта" : e + "актов"),
            t
        );
    }),
    (this.showPerformanceCard = function() {
        (n.backgroundCard.style.display = "block"), window.scrollTo(0, 0);
    }),
    (this.showUsualPointsTable = function() {
        (n.userPointsBack.style.display = "block"), window.scrollTo(0, 0);
    }),
    (this.fillCardPerformanceActs = function(e, t) {
        const o = n.cardPerfType,
            i = n.cardPerfActs;
        "ballet" === e
            ?
            (o.textContent = `Балет, ${n.getActsEnding(t.length)}`) :
            "opera" === e &&
            (o.textContent = `Опера, ${n.getActsEnding(t.length)}`),
            n.clearDomElement(i, function() {
                for (let e = 0; e < t.length; e++) {
                    let n = document.createElement("div"),
                        o = document.createElement("span"),
                        s = document.createElement("span");
                    n.setAttribute("class", "act-line"),
                        (o.textContent = `${e + 1} Акт:`),
                        (s.textContent = `${t[e]}`),
                        n.appendChild(o),
                        n.appendChild(s),
                        i.appendChild(n);
                }
            });
    }),
    (this.fillCardPerformancePoints = function(e) {
        const t = n.cardPerfPoints;
        if (e) {
            2 == t.childNodes.length ?
                t.childNodes[1].remove() :
                3 == t.childNodes.length &&
                (t.childNodes[1].remove(), t.childNodes[1].remove());
            const o = document.createElement("p");
            o.setAttribute("class", "total-points-usr"),
                (o.textContent = `Всего: ${n.countPointsNum(e)} шт.`),
                t.appendChild(o),
                n.fillUserPointsTable(e);
            const i = document.createElement("button");
            i.setAttribute("class", "showPoints-btn"),
                (i.textContent = "Просмотр"),
                (i.onclick = function() {
                    let e = n.userPointsBack,
                        t = n.backgroundCard;
                    (e.style.height = t.offsetHeight + "px"), n.showUsualPointsTable();
                }),
                t.appendChild(i);
        } else if (3 == t.childNodes.length) {
            t.childNodes[1].remove(), t.childNodes[1].remove();
            const e = document.createElement("i");
            (e.textContent = "– Отсутствуют"), t.appendChild(e);
        }
    }),
    (this.fillPerformanceCard = function(e) {
        const o = n.cardPerfName,
            i = n.cardPerfImg,
            s = n.cardPerfNotes;
        if (
            ((o.textContent = e.name),
                e.imgUrl ?
                ((i.src = n.BASE_URL + "/static/imgs/performance-imgs/" + e.imgUrl),
                    (i.style.display = "inline-block")) :
                ((i.src =
                        n.BASE_URL + "/static/imgs/performance-imgs/no-photo.png"),
                    (i.style.display = "inline-block")),
                n.fillCardPerformanceActs(e.type, e.acts),
                n.fillCardPerformancePoints(e.points),
                "" != e.notes ?
                (s.innerHTML = e.notes) :
                (s.textContent = "– Отсутствуют"),
                "true" === t)
        ) {
            let t = document.createElement("button");
            t.setAttribute("class", "edit-btn"),
                (t.textContent = "Редактировать"),
                (t.onclick = function() {
                    n.openEdit(e);
                });
            let i = document.createElement("button");
            i.setAttribute("class", "rm-perf-btn"),
                (i.textContent = "Удалить"),
                (i.onclick = function() {
                    confirm(
                        `Вы действительно хотите удалить спектакль "${e.name}" из базы?`
                    ) && n.save(e._id, "remove");
                }),
                5 == o.parentElement.childNodes.length ?
                (o.parentElement.appendChild(t), o.parentElement.appendChild(i)) :
                (o.parentElement.childNodes[5].remove(),
                    o.parentElement.childNodes[5].remove(),
                    o.parentElement.appendChild(t),
                    o.parentElement.appendChild(i));
        }
        n.savePerfBtn.onclick = function() {
            n.save(e._id, "update");
        };
    }),
    (this.clearDomElement = function(e, t) {
        for (; e.firstChild;) e.firstChild.remove();
        return t();
    }),
    (this.fillSearchResults = function(e) {
        const t = n.searchResults;
        if (0 == e.length) {
            const e = document.createElement("div");
            e.setAttribute("class", "perf-name-found nothing-found"),
                (e.textContent = "Ничего не найдено"),
                t.childNodes[0] || t.appendChild(e);
        } else
            for (let o = 0; o < e.length; o++) {
                let i = document.createElement("div");
                i.setAttribute("class", "perf-name-found"),
                    (i.textContent = e[o].name),
                    (i.onclick = function() {
                        n.fillPerformanceCard(e[o]), n.showPerformanceCard();
                    });
                for (let e = 0; e < t.childNodes.length; e++)
                    if (t.childNodes[e].textContent == i.textContent) return;
                t.appendChild(i);
            }
    }),
    (this.searchInpt.oninput = function() {
        n.searchInpt.value && "" != n.searchInpt.value ?
            n.clearDomElement(n.searchResults, function() {
                const e = n.searchInpt.value;
                if (/^\s*$/.test(e)) n.fillSearchResults([]);
                else {
                    const t = `query=${e}`;
                    (n.preloader.style.display = "block"),
                    request(
                        "POST",
                        n.BASE_URL + "/perf-search",
                        t,
                        function(e, t) {
                            if ("success" === e) {
                                const e = JSON.parse(t.responseText).perfs;
                                n.fillSearchResults(e),
                                    (n.preloader.style.display = "none");
                            } else {
                                if ("error" == e)
                                    return void(n.preloader.style.display = "none");
                                if ("econn" == e) {
                                    n.preloader.style.display = "none";
                                    const e = document.createElement("div");
                                    e.setAttribute(
                                            "class",
                                            "perf-name-found nothing-found"
                                        ),
                                        (e.textContent = "Проверьте интернет соединение"),
                                        n.searchResults.childNodes[0] ||
                                        n.searchResults.appendChild(e);
                                }
                            }
                        }
                    );
                }
            }) :
            setTimeout(function() {
                n.clearDomElement(n.searchResults, function() {});
            }, 100);
    }),
    (this.openEdit = function(e) {
        if (
            ((n.pointsData = e.points),
                (n.backgroundCard.style.display = "none"),
                (n.backgroundModal.style.display = "block"),
                (this.perfName.value = e.name),
                (this.perfType.value = e.type),
                (this.perfUrl.value = e.imgUrl),
                e.acts.length > 0)
        ) {
            let t, o, i, s, l;
            this.perfActs.innerHTML = "";
            for (let a = 0; a < e.acts.length; a++)
                (t = document.createElement("actLine")),
                t.setAttribute("class", "act-line"),
                (o = document.createElement("span")),
                o.setAttribute("class", "perf-act"),
                (o.textContent = a + 1 + ":"),
                t.appendChild(o),
                (i = document.createElement("input")),
                i.setAttribute("class", "act-time"),
                i.setAttribute("type", "text"),
                i.setAttribute("placeholder", "1ч 15мин"),
                (i.value = e.acts[a]),
                t.appendChild(i),
                0 == a ?
                ((l = document.createElement("button")),
                    l.setAttribute("class", "add-mini-btn"),
                    (l.textContent = "+"),
                    (l.onclick = function() {
                        n.addAct();
                    }),
                    t.appendChild(l)) :
                ((s = document.createElement("span")),
                    s.setAttribute("class", "del-act-btn"),
                    (s.textContent = "X"),
                    (s.onclick = function(e) {
                        e.target.parentElement.remove();
                    }),
                    t.appendChild(s)),
                (em = document.createElement("button")),
                o.setAttribute("class", "perf-act"),
                this.perfActs.appendChild(t);
        }
        n.fillEditCardPointsDiv(e.points),
            n.fillPointsEditModal(e.points),
            (this.perfNotes.value = e.notes),
            (this.savePerfBtn.textContent = "Сохранить изменения"),
            (this.savePerfBtn.onclick = function() {
                n.save(e._id, "update");
            });
    }),
    (this.fillEditCardPointsDiv = function(e) {
        if (e) {
            n.perfPoints.childNodes[0].remove(),
                n.perfPoints.childNodes[0].remove();
            let t = document.createElement("span");
            t.setAttribute("class", "points-number"),
                (t.textContent = n.countPointsNum(e) + " шт.");
            let o = document.createElement("span");
            o.setAttribute("class", "showPoints-btn"),
                (o.textContent = "Редактор"),
                (o.onclick = function() {
                    n.fillPointsEditModal(e),
                        (n.backgroundPoints.style.height =
                            n.backgroundModal.offsetHeight + "px"),
                        (n.backgroundPoints.style.display = "block"),
                        window.scrollTo(0, 0);
                }),
                n.perfPoints.appendChild(t),
                n.perfPoints.appendChild(o);
        }
    }),
    (this.isEmpty = function(e) {
        for (var t in e)
            if (e.hasOwnProperty(t)) return !1;
        return JSON.stringify(e) === JSON.stringify({});
    }),
    (this.fillPointsEditModal = function(e) {
        e || (e = {});
        let t,
            o,
            i,
            s,
            l,
            a = document.getElementById("left-table").firstChild,
            d = document.getElementById("right-table").firstChild;
        for (; a.childNodes.length > 1;) a.childNodes[1].remove();
        for (; d.childNodes.length > 1;) d.childNodes[1].remove();
        (n.totalPointsNum = n.countPointsNum(e)),
        (document.getElementById("total-points-num").textContent =
            n.countPointsNum(e) + " шт.");
        for (const o in e.leftSide) {
            if (n.isEmpty(e.leftSide[o])) continue;
            let d, r, c;
            (t = document.createElement("tr")),
            t.setAttribute("class", "left-point-rope"),
                t.appendChild(document.createElement("td")),
                (i = document.createElement("td")),
                (s = document.createElement("td")),
                (l = document.createElement("td")),
                (d = document.createElement("input")),
                d.setAttribute("type", "number"),
                d.setAttribute("class", "lines"),
                (d.value = e.leftSide[o].stalls.split("/")[0]),
                (r = document.createElement("span")),
                (r.textContent = "/"),
                (c = document.createElement("input")),
                c.setAttribute("type", "number"),
                c.setAttribute("class", "lines"),
                (c.value = e.leftSide[o].stalls.split("/")[1]),
                i.appendChild(d),
                i.appendChild(r),
                i.appendChild(c);
            let u = document.createElement("input");
            u.setAttribute("type", "number"),
                u.setAttribute("class", "meters"),
                (u.value = e.leftSide[o].meters),
                s.appendChild(u);
            let p = document.createElement("input");
            p.setAttribute("type", "number"),
                p.setAttribute("class", "machine"),
                (p.value = e.leftSide[o].machine),
                l.appendChild(p);
            let m = document.createElement("span");
            m.setAttribute("class", "del-point-rope"),
                (m.textContent = "X"),
                (m.onclick = function(e) {
                    confirm("Удалить эту точку подвеса?") &&
                        (e.target.parentElement.parentElement.remove(),
                            n.totalPointsNum--,
                            (n.totalPointsSpan.textContent = n.totalPointsNum + " шт."));
                }),
                l.appendChild(m),
                t.appendChild(i),
                t.appendChild(s),
                t.appendChild(l),
                a.appendChild(t);
        }
        for (const t in e.rightSide) {
            if (n.isEmpty(e.rightSide[t])) continue;
            let a, r, c;
            (o = document.createElement("tr")),
            o.setAttribute("class", "right-point-rope"),
                o.appendChild(document.createElement("td")),
                (i = document.createElement("td")),
                (s = document.createElement("td")),
                (l = document.createElement("td")),
                (a = document.createElement("input")),
                a.setAttribute("type", "number"),
                a.setAttribute("class", "lines"),
                (a.value = e.rightSide[t].stalls.split("/")[0]),
                (r = document.createElement("span")),
                (r.textContent = "/"),
                (c = document.createElement("input")),
                c.setAttribute("type", "number"),
                c.setAttribute("class", "lines"),
                (c.value = e.rightSide[t].stalls.split("/")[1]),
                i.appendChild(a),
                i.appendChild(r),
                i.appendChild(c);
            let u = document.createElement("input");
            u.setAttribute("type", "number"),
                u.setAttribute("class", "meters"),
                (u.value = e.rightSide[t].meters),
                s.appendChild(u);
            let p = document.createElement("input");
            p.setAttribute("type", "number"),
                p.setAttribute("class", "machine"),
                (p.value = e.rightSide[t].machine),
                l.appendChild(p);
            let m = document.createElement("span");
            m.setAttribute("class", "del-point-rope"),
                (m.textContent = "X"),
                (m.onclick = function(e) {
                    confirm("Удалить эту точку подвеса?") &&
                        (e.target.parentElement.parentElement.remove(),
                            n.totalPointsNum--,
                            (n.totalPointsSpan.textContent = n.totalPointsNum + " шт."));
                }),
                l.appendChild(m),
                o.appendChild(i),
                o.appendChild(s),
                o.appendChild(l),
                d.appendChild(o);
        }
    }),
    (this.countPointsNum = function(e) {
        let t = 0;
        if (!e) return 0;
        for (key1 in e.leftSide) n.isEmpty(e.leftSide[key1]) || t++;
        for (key1 in e.rightSide) n.isEmpty(e.rightSide[key1]) || t++;
        return t;
    }),
    (this.closeUserPoints.onclick = function() {
        n.userPointsBack.style.display = "none";
    }),
    (this.fillUserPointsTable = function(e) {
        let t,
            o,
            i,
            s,
            l,
            a = document.getElementById("left-usr-table").firstChild,
            d = document.getElementById("right-usr-table").firstChild;
        for (; a.childNodes.length > 1;) a.childNodes[1].remove();
        for (; d.childNodes.length > 1;) d.childNodes[1].remove();
        document.getElementById("total-user-points").textContent =
            n.countPointsNum(e) + " шт.";
        for (const n in e.leftSide)
            (t = document.createElement("tr")),
            t.appendChild(document.createElement("td")),
            (i = document.createElement("td")),
            (s = document.createElement("td")),
            (l = document.createElement("td")),
            (i.textContent = e.leftSide[n].stalls),
            t.appendChild(i),
            (s.textContent = e.leftSide[n].meters),
            t.appendChild(s),
            (l.textContent = e.leftSide[n].machine),
            t.appendChild(l),
            a.appendChild(t);
        for (const t in e.rightSide)
            (o = document.createElement("tr")),
            o.appendChild(document.createElement("td")),
            (i = document.createElement("td")),
            (s = document.createElement("td")),
            (l = document.createElement("td")),
            (i.textContent = e.rightSide[t].stalls),
            o.appendChild(i),
            (s.textContent = e.rightSide[t].meters),
            o.appendChild(s),
            (l.textContent = e.rightSide[t].machine),
            o.appendChild(l),
            d.appendChild(o);
    }),
    (this.saveEditingPoints = function() {
        let e = document.getElementsByClassName("left-point-rope"),
            t = document.getElementsByClassName("right-point-rope");
        if (
            ((n.pointsData = { leftSide: {}, rightSide: {} }),
                0 != e.length || 0 != t.length)
        ) {
            for (let t = 0; t < e.length; t++) {
                n.pointsData.leftSide["point" + (t + 1)] = {};
                for (let o = 1; o < e[t].childNodes.length; o++)
                    if (1 == o) {
                        let i = e[t].childNodes[o].firstChild,
                            s = e[t].childNodes[o].lastChild;
                        if (!i.value)
                            return (
                                (i.parentElement.style.backgroundColor = "red"),
                                (i.onclick = function() {
                                    i.parentElement.style.backgroundColor = "initial";
                                }),
                                void alert(
                                    "Пустые поля недопустимы, заполните либо удалите пустые точки подвеса"
                                )
                            );
                        if (!s.value)
                            return (
                                (s.parentElement.style.backgroundColor = "red"),
                                (s.onclick = function() {
                                    s.parentElement.style.backgroundColor = "initial";
                                }),
                                void alert(
                                    "Пустые поля недопустимы, заполните либо удалите пустые точки подвеса"
                                )
                            );
                        n.pointsData.leftSide["point" + (t + 1)].stalls =
                            i.value + "/" + s.value;
                    } else if (2 == o) {
                    if (!e[t].childNodes[o].firstChild.value)
                        return (
                            (e[t].childNodes[
                                o
                            ].firstChild.parentElement.style.backgroundColor = "red"),
                            (e[t].childNodes[o].firstChild.onclick = function() {
                                e[t].childNodes[
                                        o
                                    ].firstChild.parentElement.style.backgroundColor =
                                    "initial";
                            }),
                            void alert(
                                "Пустые поля недопустимы, заполните либо удалите пустые точки подвеса"
                            )
                        );
                    n.pointsData.leftSide["point" + (t + 1)].meters =
                        e[t].childNodes[o].firstChild.value;
                } else
                    3 == o &&
                    (n.pointsData.leftSide["point" + (t + 1)].machine =
                        e[t].childNodes[o].firstChild.value);
            }
            for (let e = 0; e < t.length; e++) {
                n.pointsData.rightSide["point" + (e + 1)] = {};
                for (let o = 1; o < t[e].childNodes.length; o++)
                    if (1 == o) {
                        let i = t[e].childNodes[o].firstChild,
                            s = t[e].childNodes[o].lastChild;
                        if (!i.value)
                            return (
                                (i.parentElement.style.backgroundColor = "red"),
                                (i.onclick = function() {
                                    i.parentElement.style.backgroundColor = "initial";
                                }),
                                void alert(
                                    "Пустые поля недопустимы, заполните либо удалите пустые точки подвеса"
                                )
                            );
                        if (!s.value)
                            return (
                                (s.parentElement.style.backgroundColor = "red"),
                                (s.onclick = function() {
                                    s.parentElement.style.backgroundColor = "initial";
                                }),
                                void alert(
                                    "Пустые поля недопустимы, заполните либо удалите пустые точки подвеса"
                                )
                            );
                        n.pointsData.rightSide["point" + (e + 1)].stalls =
                            i.value + "/" + s.value;
                    } else if (2 == o) {
                    if (!t[e].childNodes[o].firstChild.value)
                        return (
                            (t[e].childNodes[
                                o
                            ].firstChild.parentElement.style.backgroundColor = "red"),
                            (t[e].childNodes[o].firstChild.onclick = function() {
                                t[e].childNodes[
                                        o
                                    ].firstChild.parentElement.style.backgroundColor =
                                    "initial";
                            }),
                            void alert(
                                "Пустые поля недопустимы, заполните либо удалите пустые точки подвеса"
                            )
                        );
                    n.pointsData.rightSide["point" + (e + 1)].meters =
                        t[e].childNodes[o].firstChild.value;
                } else
                    3 == o &&
                    (n.pointsData.rightSide["point" + (e + 1)].machine =
                        t[e].childNodes[o].firstChild.value);
            }
            n.fillEditCardPointsDiv(n.pointsData),
                (n.backgroundPoints.style.display = "none");
        } else n.backgroundPoints.style.display = "none";
    }),
    (this.closeEditPointsBtn.onclick = function() {
        n.saveEditingPoints();
    }),
    (this.addPointsBtn.onclick = function() {
        (n.backgroundPoints.style.display = "block"), window.scrollTo(0, 0);
    }),
    (this.closeCardPerf.onclick = function() {
        (n.savePerfBtn.onclick = function() {
            n.save(!1, "create");
        }),
        (n.backgroundCard.style.display = "none");
    }),
    "true" === t &&
        (this.addPerfBtn.onclick = function() {
            n.backgroundModal.style.display = "block";
        }),
        (this.closeAddPerf.onclick = function() {
            n.backgroundModal.style.display = "none";
        }),
        (this.savePerfBtn.onclick = function() {
            n.save(!1, "create");
        }),
        (this.perfName.onclick = function() {
            n.perfName.style.borderColor = "initial";
        }),
        (this.perfType.onclick = function() {
            n.perfType.style.borderColor = "initial";
        }),
        (this.addActBtn.onclick = function() {
            n.addAct();
        }),
        (this.addRightPointBtn.onclick = function() {
            n.addPoint("right");
        }),
        (this.addLeftPointBtn.onclick = function() {
            n.addPoint("left");
        }),
        (this.addAct = function() {
            let e = n.perfActs.childNodes.length,
                t = e + 1,
                o = document.createElement("div"),
                i = document.createElement("span"),
                s = document.createElement("input"),
                l = document.createElement("span");
            o.setAttribute("class", "act-line"),
                i.setAttribute("class", "perf-act"),
                i.setAttribute("id", "perf-act" + t),
                (i.textContent = t + ":"),
                s.setAttribute("type", "text"),
                s.setAttribute("class", "act-time"),
                s.setAttribute("id", "act-time" + t),
                s.setAttribute("placeholder", "1ч 15мин"),
                l.setAttribute("id", "del-act-btn" + t),
                l.setAttribute("class", "del-act-btn"),
                (l.textContent = "X"),
                (l.onclick = function() {
                    l.parentElement.remove();
                }),
                o.appendChild(i),
                o.appendChild(s),
                o.appendChild(l),
                n.perfActs.insertBefore(o, n.perfActs.childNodes[e]);
        }),
        (this.checkActs = function() {
            let e = n.perfActs.childNodes.length,
                t = n.perfActs.childNodes;
            for (let n = 0; n < e; n++)
                if (!t[n].childNodes[1].value)
                    return (
                        (t[n].childNodes[1].style.borderColor = "red"),
                        (t[n].childNodes[1].onclick = function() {
                            return (t[n].childNodes[1].style.borderColor = "initial");
                        }), !1
                    );
            return !0;
        }),
        (this.inputsValid = function() {
            return n.perfName.value ?
                n.perfType.value ?
                !!n.checkActs() || ((n.perfActs.borderColor = "red"), !1) :
                ((n.perfType.style.borderColor = "red"), !1) :
                ((n.perfName.style.borderColor = "red"), !1);
        }),
        (this.save = function(e, t) {
            if ("update" === t || "create" === t) {
                if (n.inputsValid()) {
                    let o = n.perfName.value,
                        i = n.perfType.value,
                        s = n.perfUrl.value,
                        l = [],
                        a = n.perfNotes.value;
                    for (let e = 0; e < n.perfActs.childNodes.length; e++) {
                        if (n.perfActs.childNodes[e].childNodes[1].value.includes(","))
                            return void(n.perfActs.childNodes[
                                e
                            ].childNodes[1].style.borderColor = "red");
                        l.push(n.perfActs.childNodes[e].childNodes[1].value);
                    }
                    if (e && "update" === t) {
                        let d = `name=${o}&type=${i}&imgUrl=${s}&acts=${l}&points=${JSON.stringify(
              n.pointsData
            )}&notes=${a}&perfId=${e}&action=${t}`;
                        request("post", n.BASE_URL + "/performances", d, function(e, t) {
                            if ("success" == e)
                                alert("Спектакль обновлен успешно"),
                                (n.backgroundModal.style.display = "none"),
                                window.location.reload();
                            else if ("err" == e) return;
                        });
                    } else if (!e && "create" == t) {
                        let e = `name=${o}&type=${i}&imgUrl=${s}&acts=${l}&points=${JSON.stringify(
              n.pointsData
            )}&notes=${a}&action=${t}`;
                        request("post", n.BASE_URL + "/performances", e, function(e, t) {
                            if ("success" == e)
                                alert("Новый спектакль успешно добавлен"),
                                (n.backgroundModal.style.display = "none"),
                                window.location.reload();
                            else if ("err" == e) return;
                        });
                    }
                }
            } else
                "remove" === t &&
                ((perfData = `perfId=${e}&action=${t}`),
                    request(
                        "post",
                        n.BASE_URL + "/performances",
                        perfData,
                        function(e, t) {
                            if ("success" == e)
                                alert("Спектакль успешно удалён"),
                                (n.backgroundModal.style.display = "none"),
                                window.location.reload();
                            else if ("err" == e) return;
                        }
                    ));
        }),
        (this.addPoint = function(e) {
            let t = document.createElement("tr"),
                o = document.createElement("span");
            o.textContent = "/";
            for (let e = 0; e < 4; e++) {
                let i = document.createElement("td");
                if (1 == e)
                    for (let e = 0; e < 2; e++) {
                        let t = document.createElement("input");
                        t.setAttribute("type", "number"),
                            t.setAttribute("class", "lines"),
                            1 == e && i.appendChild(o),
                            i.appendChild(t);
                    }
                else if (2 == e) {
                    let e = document.createElement("input");
                    e.setAttribute("type", "number"),
                        e.setAttribute("class", "meters"),
                        i.appendChild(e);
                } else if (3 == e) {
                    let e = document.createElement("input"),
                        t = document.createElement("span");
                    (t.textContent = "X"),
                    t.setAttribute("class", "del-point-rope"),
                        (t.onclick = function(e) {
                            confirm("Удалить эту точку подвеса?") &&
                                (e.target.parentElement.parentElement.remove(),
                                    n.totalPointsNum--,
                                    (n.totalPointsSpan.textContent = n.totalPointsNum + " шт."));
                        }),
                        e.setAttribute("type", "number"),
                        e.setAttribute("class", "machine"),
                        i.appendChild(e),
                        i.appendChild(t);
                }
                t.appendChild(i);
            }
            t.setAttribute("class", e + "-point-rope"),
                document.getElementById(e + "-table").appendChild(t),
                n.totalPointsNum++,
                (n.totalPointsSpan.textContent = n.totalPointsNum + " шт.");
        });
}


function SkedApp(e = "") {
    const t = this;
    (this.BASE_URL = e),
    (this.state = []),
    (this.needToSave = !1),
    (this.todayISODate = new Date(Date.now()));
    const n = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    (this.dayFrom = document.getElementById("day-from")),
    (this.monthFrom = document.getElementById("month-from")),
    (this.yearFrom = document.getElementById("year-from")),
    (this.dayTo = document.getElementById("day-to")),
    (this.monthTo = document.getElementById("month-to")),
    (this.yearTo = document.getElementById("year-to"));
    const o = document.getElementById("sked-main-tb"),
        i = document.getElementById("next-sked-bt"),
        s = document.getElementById("save-sked-bt"),
        l = document.getElementById("prev-sked-bt"),
        a = document.getElementById("new-sked-bt");
    (this.fillWithWorkers = function(e) {
        const n = e || t.workers;
        let i,
            s,
            l,
            a,
            d,
            r,
            c = 0;
        for (let t = 0; t < n.length; t++) {
            for (
                i = document.createElement("tr"),
                i.setAttribute("class", "table-row-worker"),
                s = document.createElement("td"),
                s.textContent = n[t].username,
                i.appendChild(s); c < 14;

            ) {
                if (
                    ((s = document.createElement("td")),
                        (l = document.createElement("select")),
                        l.setAttribute("class", "shift-choose"),
                        (a = document.createElement("option")),
                        (d = document.createElement("option")),
                        (r = document.createElement("option")),
                        (a.textContent = "–"),
                        (d.textContent = "8.30"),
                        (r.textContent = "16"),
                        l.appendChild(a),
                        l.appendChild(d),
                        l.appendChild(r),
                        e)
                )
                    for (key in e[t].shifts)
                        a.textContent == e[t].shifts[key] ?
                        a.setAttribute("selected", "true") :
                        d.textContent == e[t].shifts[key] ?
                        d.setAttribute("selected", "true") :
                        r.textContent == e[t].shifts[key] &&
                        r.setAttribute("selected", "true");
                else a.setAttribute("selected", "true");
                s.appendChild(l), i.appendChild(s), c++;
            }
            o.appendChild(i), (c = 0);
        }
    }),
    (this.saveState = function() {
        const e = [],
            n = document.getElementsByClassName("table-row-worker");
        for (let t = 0; t < n.length; t++) {
            let o = {};
            for (let e = 1; e < n[t].childNodes.length; e++)
                o[e] = n[t].childNodes[e].firstChild.value;
            let i = {};
            (i.username = n[t].firstChild.textContent), (i.shifts = o), e.push(i);
        }
        const o = `${
          t.fromISODate.getMonth() + 1
        }/${t.fromISODate.getDate()}/${t.fromISODate.getFullYear()}`,
            i = `${
          t.toISODate.getMonth() + 1
        }/${t.toISODate.getDate()}/${t.toISODate.getFullYear()}`;
        request(
            "POST",
            t.BASE_URL + "/save-sked",
            `state=${JSON.stringify(e)}&from=${o}&to=${i}`,
            function(e, t) {
                "success" == e
                    ?
                    console.log("Sked draft was saved") :
                    "error" == e &&
                    console.error("Error during saving current sked draft state");
            }
        );
    }),
    (this.fillUpperDates = function(e, n) {
        let o = new Date(e),
            i = new Date(n);
        (t.dayFrom.textContent = o.getDate()),
        (t.monthFrom.textContent = o.getMonth() + 1),
        (t.yearFrom.textContent = o.getFullYear()),
        (t.dayTo.textContent = i.getDate()),
        (t.monthTo.textContent = i.getMonth() + 1),
        (t.yearTo.textContent = i.getFullYear());
    }),
    (this.getSked = function(e, n) {
        const o = e ? `from=${e}` : `to=${n}`;
        request("POST", t.BASE_URL + "/sked", o, function(e, n) {
            if ("success" == e) {
                const e = JSON.parse(n.responseText);
                if (
                    (0 != e.prev && e.prev ?
                        (l.style.display = "block") :
                        (l.style.display = "none"),
                        (0 == e.next) | !e.next ?
                        ((i.style.display = "none"), (a.style.display = "block")) :
                        ((i.style.display = "block"), (a.style.display = "none")),
                        e.sked)
                ) {
                    const n = e.sked.data;
                    t.fillUpperDates(e.sked.from, e.sked.to),
                        t.fillTableHeader(e.sked.from, e.dates),
                        t.fillWithWorkers(n),
                        (t.fromISODate = new Date(e.sked.from)),
                        (t.toISODate = new Date(e.sked.to));
                } else
                    (a.style.display = "none"),
                    (l.style.display = "block"),
                    t.fillTableHeader(e.from, e.dates),
                    t.fillUpperDates(e.from, t.toISODate),
                    t.fillWithWorkers(),
                    (t.fromISODate = new Date(e.from));
            } else if ("error" == e) return;
        });
    }),
    (this.init = function() {
        i &&
            i.addEventListener("click", function() {
                t.saveState(), (t.needToSave = !1), t.nextSked();
            }),
            s &&
            (s.onclick = function() {
                t.saveState();
            }),
            a &&
            (a.onclick = function() {
                let e;
                if (
                    ((t.needToSave = !0),
                        confirm(
                            "Создать график с последнего числа предыдущего графика? При отмене график создастся с сегодняшнего дня."
                        ))
                )
                    e = `${
                t.toISODate.getMonth() + 1
              }/${t.toISODate.getDate()}/${t.toISODate.getFullYear()}`;
                else {
                    const t = new Date(Date.now());
                    e = `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()}`;
                }
                const n = document.getElementsByClassName("table-row-worker");
                for (; n[0];) n[0].remove();
                t.getSked(e);
            }),
            l &&
            (l.onclick = function() {
                t.saveState(), (t.needToSave = !1);
                let e = `${
              t.fromISODate.getMonth() + 1
            }/${t.fromISODate.getDate()}/${t.fromISODate.getFullYear()}`;
                const n = document.getElementsByClassName("table-row-worker");
                for (; n[0];) n[0].remove();
                t.getSked(null, e);
            }),
            t.getSked("LAST");
    }),
    (this.nextSked = function() {
        const e = document.getElementsByClassName("table-row-worker");
        for (; e[0];) e[0].remove();
        const n = `${
        t.toISODate.getMonth() + 1
      }/${t.toISODate.getDate()}/${t.toISODate.getFullYear()}`;
        t.getSked(n);
    }),
    (this.fillTableHeader = function(e, o) {
        let i = new Date(e).getDate(),
            s = new Date(e).getDay();
        const l = document.getElementsByClassName("weekdate");
        let a = !1;
        for (let e = 0; e < l.length; e++)
            for (let d = 0; d < o.length; d++)
                if (o[d].date == i) {
                    if (a) {
                        if ("next" != o[d].type) continue;
                        l[e].textContent = o[d].date + " " + n[s];
                    } else l[e].textContent = o[d].date + " " + n[s];
                    e + 1 == l.length &&
                        1 == t.needToSave &&
                        (t.toISODate = new Date(o[d].iso)),
                        "next" != o[d + 1].type || a ? i++ : ((a = !0), (i = 1)),
                        s < 6 ? s++ : (s = 0);
                    break;
                }
    });
}
//# sourceMappingURL=maps/main.min.js.map