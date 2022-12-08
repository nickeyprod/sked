class Performance {
  constructor(e = "", edit = "false") {

    this.edit = edit;
    this.pointsData = { leftSide: {}, rightSide: {} };

    this.totalPointsNum = 0;
    this.addPerfBtn = document.getElementById("add-performance-btn");
    this.preloader = document.getElementById("preloader");
    this.searchInpt = document.getElementById("search-perfs");
    this.backgroundModal = document.getElementById("background-modal");
    this.closeAddPerf = document.getElementById("close-adding-perf");
    this.savePerfBtn = document.getElementById("save-perf-btn");
    this.perfName = document.getElementById("perf-name");
    this.perfType = document.getElementById("perf-type");
    this.perfUrl = document.getElementById("perf-pic-url");
    this.perfActs = document.getElementById("perf-acts");
    this.perfPoints = document.getElementById("perf-points");
    this.perfNotes = document.getElementById("perf-notes");
    this.addActBtn = document.getElementById("add-act");
    this.searchResults = document.getElementById("search-results");
    this.closeCardPerf = document.getElementById("close-card-perf");
    this.backgroundCard = document.getElementById("card-back");
    this.addPointsBtn = document.getElementById("add-points");
    this.addRightPointBtn = document.getElementById("add-right-pt-btn");
    this.addLeftPointBtn = document.getElementById("add-left-pt-btn");
    this.backgroundPoints = document.getElementById("points-back");
    this.closeEditPointsBtn = document.getElementById("close-points-perf");
    this.userPointsBack = document.getElementById("user-points-back");
    this.closeUserPoints = document.getElementById("close-user-points");
    this.cardPerfName = document.getElementById("card-perf-name");
    this.cardPerfImg = document.getElementById("card-perf-img");
    this.cardPerfType = document.getElementById("card-perf-type");
    this.cardPerfActs = document.getElementById("card-perf-acts");
    this.cardPerfPoints = document.getElementById("card-perf-points");
    this.cardPerfNotes = document.getElementById("card-perf-notes");
    this.totalPointsSpan = document.getElementById("total-points-num");

    if (this.edit === "true") {
      this.addPerfBtn.onclick = () => {
        this.backgroundModal.style.display = "block";
      };

      this.closeAddPerf.onclick = () => {
        this.backgroundModal.style.display = "none";
      };

      this.savePerfBtn.onclick = () => {
        this.save(!1, "create");
      };

      this.perfName.onclick = () => {
        this.perfName.style.borderColor = "initial";
      };

      this.perfType.onclick = () => {
        this.perfType.style.borderColor = "initial";
      };

      this.addActBtn.onclick = () => {
        this.addAct();
      };

      this.addRightPointBtn.onclick = () => {
        this.addPoint("right");
      };

      this.addLeftPointBtn.onclick = () => {
        this.addPoint("left");
      };
    }

    this.closeEditPointsBtn.onclick = () => {
      this.saveEditingPoints();
    };

    this.addPointsBtn.onclick = () => {
      this.backgroundPoints.style.display = "block";
      window.scrollTo(0, 0);
    };

    this.closeCardPerf.onclick = () => {
      this.savePerfBtn.onclick = () => {
        this.save(!1, "create");
      };
      this.backgroundCard.style.display = "none";
    };

    this.closeUserPoints.onclick = () => {
      this.userPointsBack.style.display = "none";
    };

    this.searchInpt.oninput = () => {
      if (this.searchInpt.value && this.searchInpt.value != "") {
        this.clearDomElement(this.searchResults, async () => {

          if (/^\s*$/.test(this.searchInpt.value)) {
            this.fillSearchResults([]);
          }
          else {

            const query = {
              query: this.searchInpt.value
            }

            this.preloader.style.display = "block";

            const resp = await request("/perf-search", "POST", query);
            print(resp)
            print("=====")
            if (resp.statusText == "OK") {
              const data = await resp.json();
              this.fillSearchResults(data.perfs);
              this.preloader.style.display = "none";
            } else {
              if (resp === "error")
                return this.preloader.style.display = "none";
              if (resp == "econn") {
                this.preloader.style.display = "none";
                const div = document.createElement("div");
                div.setAttribute("class", "perf-name-found nothing-found");
                div.textContent = "Проверьте интернет соединение";
                if (!this.searchResults.childNodes[0]) {
                  this.searchResults.appendChild(div);
                }
              }
            }
          }
        })
      }
      else {
        setTimeout(() => {
          this.clearDomElement(this.searchResults, () => { });
        }, 100);
      }
    };

  }


  getActsEnding = num => {
    let actsNum = 1 == num ? num + " акт" : num > 1 && num < 5 ? num + " акта" : num + "актов";
    return actsNum;
  };

  showPerformanceCard = () => {
    this.backgroundCard.style.display = "block";
    window.scrollTo(0, 0);
  };

  showUsualPointsTable = () => {
    this.userPointsBack.style.display = "block";
    window.scrollTo(0, 0);
  };

  clearDomElement = (element, cb) => {
    while (element.firstChild) {
      element.firstChild.remove();
    }
    return cb();
  };

  fillCardPerformanceActs = (perfType, acts) => {
    if (perfType === "ballet") {
      this.cardPerfType.textContent = `Балет, ${this.getActsEnding(acts.length)}`;
    } else if (perfType === "opera") {
      this.cardPerfType.textContent = `Опера, ${this.getActsEnding(acts.length)}`;
    }

    this.clearDomElement(this.cardPerfActs, () => {
      for (let i = 0; i < acts.length; i++) {
        let div = document.createElement("div"),
          s1 = document.createElement("span"),
          s2 = document.createElement("span");

        div.setAttribute("class", "act-line");
        s1.textContent = `${i + 1} Акт:`;
        s2.textContent = `${acts[i]}`;
        div.appendChild(s1);
        div.appendChild(s2);
        this.cardPerfActs.appendChild(div);
      }
    });
  };

  fillCardPerformancePoints = (points) => {

    if (points) {

      if (this.cardPerfPoints.childNodes.length == 2) {
        this.cardPerfPoints.childNodes[1].remove()
      }
      else if (this.cardPerfPoints.childNodes.length == 3) {
        this.cardPerfPoints.childNodes[1].remove();
        this.cardPerfPoints.childNodes[1].remove()
      }

      const p = document.createElement("p");
      p.setAttribute("class", "total-points-usr");
      p.textContent = `Всего: ${this.countPointsNum(points)} шт.`;
      this.cardPerfPoints.appendChild(p),
        this.fillUserPointsTable(points);

      const btn = document.createElement("button");
      btn.setAttribute("class", "showPoints-btn");
      btn.textContent = "Просмотр";
      btn.onclick = () => {
        this.userPointsBack.style.height = this.backgroundCard.offsetHeight + "px";
        this.showUsualPointsTable();
      }
      this.cardPerfPoints.appendChild(btn);

    } else if (this.cardPerfPoints.childNodes.length == 3) {
      this.cardPerfPoints.childNodes[1].remove();
      this.cardPerfPoints.childNodes[1].remove();
      const i = document.createElement("i");
      i.textContent = "– Отсутствуют";
      this.cardPerfPoints.appendChild(i);
    }
  };

  fillPerformanceCard = (perf) => {

    this.cardPerfName.textContent = perf.name;

    if (perf.imgUrl) {
      this.cardPerfImg.src = window.location.origin + "/static/imgs/performance-imgs/" + perf.imgUrl;
      this.cardPerfImg.style.display = "inline-block";
    } else {
      this.cardPerfImg.src = window.location.origin + "/static/imgs/performance-imgs/no-photo.png";
      this.cardPerfImg.style.display = "inline-block";
    }

    this.fillCardPerformanceActs(perf.type, perf.acts);
    this.fillCardPerformancePoints(perf.points);

    if (perf.notes != "") {
      this.cardPerfNotes.innerHTML = perf.notes;
    } else {
      this.cardPerfNotes.textContent = "– Отсутствуют";
    }

    if (this.edit === "true") {
      let btn = document.createElement("button");
      btn.setAttribute("class", "edit-btn");
      btn.textContent = "Редактировать";
      btn.onclick = () => {
        this.openEdit(perf);
      };

      let delBtn = document.createElement("button");
      delBtn.setAttribute("class", "rm-perf-btn");
      delBtn.textContent = "Удалить";
      delBtn.onclick = () => {
        if (confirm(`Вы действительно хотите удалить спектакль "${perf.name}" из базы?`)) {
          this.save(perf._id, "remove");
        }
      };

      if (this.cardPerfName.parentElement.childNodes.length == 4) {
        this.cardPerfName.parentElement.appendChild(btn);
        this.cardPerfName.parentElement.appendChild(delBtn)
      } else {
        this.cardPerfName.parentElement.childNodes[4].remove();
        this.cardPerfName.parentElement.childNodes[4].remove();
        this.cardPerfName.parentElement.appendChild(btn);
        this.cardPerfName.parentElement.appendChild(delBtn);
      }
    }

    this.savePerfBtn.onclick = () => {
      this.save(perf._id, "update");
    };
  };

  fillSearchResults = results => {
    if (results.length == 0) {
      const div = document.createElement("div");
      div.setAttribute("class", "perf-name-found nothing-found");
      div.textContent = "Ничего не найдено";
      if (!this.searchResults.childNodes[0]) {
        this.searchResults.appendChild(div);
      }
    } else
      for (let i = 0; i < results.length; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "perf-name-found");
        div.textContent = results[i].name;

        div.onclick = () => {
          this.fillPerformanceCard(results[i]);
          this.showPerformanceCard();
        };
        for (let b = 0; b < this.searchResults.childNodes.length; b++) {
          if (this.searchResults.childNodes[b].textContent == div.textContent) {
            return;
          }
        }
        this.searchResults.appendChild(div);

      }
  };


  openEdit = perf => {
    // e = perf;
    this.pointsData = perf.points;
    this.backgroundCard.style.display = "none";
    this.backgroundModal.style.display = "block";
    this.perfName.value = perf.name;
    this.perfType.value = perf.type;
    this.perfUrl.value = perf.imgUrl;

    if (perf.acts.length > 0) {
      // let t, o, i, s, l;
      let actLine, sp1, inpt, sp2, btn;

      this.perfActs.innerHTML = "";
      for (let i = 0; i < perf.acts.length; i++) {
        actLine = document.createElement("div");
        actLine.setAttribute("class", "act-line");
        sp1 = document.createElement("span");
        sp1.setAttribute("class", "perf-act");
        sp1.textContent = i + 1 + ":";
        actLine.appendChild(sp1);
        inpt = document.createElement("input");
        inpt.setAttribute("class", "act-time");
        inpt.setAttribute("type", "text");
        inpt.setAttribute("placeholder", "1ч 15мин");
        inpt.value = perf.acts[i];
        actLine.appendChild(inpt);

        if (i == 0) {
          btn = document.createElement("button");
          btn.setAttribute("class", "add-mini-btn");
          btn.textContent = "+";
          btn.onclick = () => {
            this.addAct();
          }
          actLine.appendChild(btn)
        } else {
          sp2 = document.createElement("span");
          sp2.setAttribute("class", "del-act-btn");
          sp2.textContent = "X";
          sp2.onclick = e => {
            e.target.parentElement.remove();
          };
          actLine.appendChild(sp2);
          // em = document.createElement("button");
          // sp1.setAttribute("class", "perf-act");
        }
        this.perfActs.appendChild(actLine);
      }

      this.fillEditCardPointsDiv(perf.points);
      this.fillPointsEditModal(perf.points);
      this.perfNotes.value = perf.notes;
      this.savePerfBtn.textContent = "Сохранить изменения";
      this.savePerfBtn.onclick = () => {
        this.save(perf._id, "update");
      };
    }
  };

  fillEditCardPointsDiv = points => {
    // e = points
    if (points) {
      this.perfPoints.childNodes[0].remove();
      this.perfPoints.childNodes[0].remove();
      let span = document.createElement("span"); // t
      span.setAttribute("class", "points-number");
      span.textContent = this.countPointsNum(points) + " шт.";
      let span2 = document.createElement("span"); // o
      span2.setAttribute("class", "showPoints-btn");
      span2.textContent = "Редактор";
      span2.onclick = () => {
        this.fillPointsEditModal(points);
        this.backgroundPoints.style.height = this.backgroundModal.offsetHeight + "px";
        this.backgroundPoints.style.display = "block";
        window.scrollTo(0, 0);
      };
      this.perfPoints.appendChild(span),
        this.perfPoints.appendChild(span2);
    }
  };

  isEmpty = obj => {
    for (var prop in obj)
      if (obj.hasOwnProperty(prop)) return false;
    return JSON.stringify(obj) === JSON.stringify({});
  };

  fillPointsEditModal = (points = {}) => {
    // e = points

    // let t, o, i, s, l, a = document.getElementById("left-table").firstChild,
    // d = document.getElementById("right-table").firstChild;
    let trLeft, trRight, td1, td2, td3;

    const leftTableFirstChild = document.getElementById("left-table").firstChild;
    const rightTableFirstChild = document.getElementById("right-table").firstChild;

    while (leftTableFirstChild.childNodes.length > 1) {
      leftTableFirstChild.childNodes[1].remove();
    }
    while (rightTableFirstChild.childNodes.length > 1) {
      rightTableFirstChild.childNodes[1].remove();
    }

    this.totalPointsNum = this.countPointsNum(points);

    document.getElementById("total-points-num").textContent = this.countPointsNum(points) + " шт.";

    for (const leftPoint in points.leftSide) {
      if (this.isEmpty(points.leftSide[leftPoint])) continue;
      // let d, r, c
      let input, sp, input2;
      trLeft = document.createElement("tr");
      trLeft.setAttribute("class", "left-point-rope");
      trLeft.appendChild(document.createElement("td"));
      td1 = document.createElement("td");
      td2 = document.createElement("td");
      td3 = document.createElement("td");
      input = document.createElement("input");
      input.setAttribute("type", "number");
      input.setAttribute("class", "lines");
      input.value = points.leftSide[leftPoint].stalls.split("/")[0];
      sp = document.createElement("span");
      sp.textContent = "/";
      input2 = document.createElement("input");
      input2.setAttribute("type", "number");
      input2.setAttribute("class", "lines");
      input2.value = points.leftSide[leftPoint].stalls.split("/")[1];
      td1.appendChild(input);
      td1.appendChild(sp);
      td1.appendChild(input2);
      let input3 = document.createElement("input");
      input3.setAttribute("type", "number");
      input3.setAttribute("class", "meters");
      input3.value = points.leftSide[leftPoint].meters;
      td2.appendChild(input3);
      let input4 = document.createElement("input");
      input4.setAttribute("type", "number");
      input4.setAttribute("class", "machine");
      input4.value = points.leftSide[leftPoint].machine;
      td3.appendChild(input4);
      let delSpan = document.createElement("span");
      delSpan.setAttribute("class", "del-point-rope");
      delSpan.textContent = "X";
      delSpan.onclick = e => {
        if (confirm("Удалить эту точку подвеса?")) {
          e.target.parentElement.parentElement.remove();
          this.totalPointsNum--;
          this.totalPointsSpan.textContent = this.totalPointsNum + " шт.";
        }
      };

      td3.appendChild(delSpan);
      trLeft.appendChild(td1);
      trLeft.appendChild(td2);
      trLeft.appendChild(td3);
      leftTableFirstChild.appendChild(trLeft);
    }

    for (const rightPoint in points.rightSide) {
      
      if (this.isEmpty(points.rightSide[rightPoint])) continue;
      // let a, r, c;
      let input, sp, input2;
      trRight = document.createElement("tr");
      trRight.setAttribute("class", "right-point-rope");
      trRight.appendChild(document.createElement("td"));
      td1 = document.createElement("td");
      td2 = document.createElement("td");
      td3 = document.createElement("td");
      input = document.createElement("input");
      input.setAttribute("type", "number");
      input.setAttribute("class", "lines");
      input.value = points.rightSide[rightPoint].stalls.split("/")[0];
      sp = document.createElement("span");
      sp.thenextContent = "/";
      input2 = document.createElement("input");
      input2.setAttribute("type", "number");
      input2.setAttribute("class", "lines");
      input2.value = points.rightSide[rightPoint].stalls.split("/")[1];
      td1.appendChild(input);
      td1.appendChild(sp);
      td1.appendChild(input2);

      let input3 = document.createElement("input");
      input3.setAttribute("type", "number");
      input3.setAttribute("class", "meters");
      input3.value = points.rightSide[rightPoint].meters;
      td2.appendChild(input3);

      let input4 = document.createElement("input");
      input4.setAttribute("type", "number");
      input4.setAttribute("class", "machine");
      input4.value = points.rightSide[rightPoint].machine;
      td3.appendChild(input4);

      let delSpan = document.createElement("span");
      delSpan.setAttribute("class", "del-point-rope");
      delSpan.textContent = "X";
      delSpan.onclick = e => {
        if (confirm("Удалить эту точку подвеса?")) {
          e.target.parentElement.parentElement.remove();
          this.totalPointsNum--;
          this.totalPointsSpan.textContent = this.totalPointsNum + " шт.";
        }
      }
      td3.appendChild(delSpan);
      trRight.appendChild(td1);
      trRight.appendChild(td2);
      trRight.appendChild(td3);
      rightTableFirstChild.appendChild(trRight);
    }
  };

  countPointsNum = points => {
    let num = 0;
    if (!points) return 0;
    for (let key in points.leftSide) {
      if (!this.isEmpty(points.leftSide[key])) {
        num++;
      }
    }
    for (let key in points.rightSide) {
      if (!this.isEmpty(points.rightSide[key])) {
        num++;
      }
    }
    return num;
  };

  fillUserPointsTable = points => {
    // e = points
    // let t-tr, o, i-td1, s-td2, l-td3,
    let trLeft, trRight, td1, td2, td3;
    // a = document.getElementById("left-usr-table").firstChild,
    // d = document.getElementById("right-usr-table").firstChild;

    let leftTableFirstChild = document.getElementById("left-usr-table").firstChild;
    let rightTableFirstChild = document.getElementById("right-usr-table").firstChild;

    while (leftTableFirstChild.childNodes.length > 1) leftTableFirstChild.childNodes[1].remove();
    while (rightTableFirstChild.childNodes.length > 1) rightTableFirstChild.childNodes[1].remove();

    document.getElementById("total-user-points").textContent = this.countPointsNum(points) + " шт.";

    // n - point
    for (const leftPoint in points.leftSide) {
      trLeft = document.createElement("tr");
      trLeft.appendChild(document.createElement("td"));
      td1 = document.createElement("td");
      td2 = document.createElement("td");
      td3 = document.createElement("td");
      td1.textContent = points.leftSide[leftPoint].stalls;
      trLeft.appendChild(td1);
      td2.textContent = points.leftSide[leftPoint].meters;
      trLeft.appendChild(td2);
      td3.textContent = points.leftSide[leftPoint].machine;
      trLeft.appendChild(td3);
      leftTableFirstChild.appendChild(trLeft);
    }
    for (const rightPoint in points.rightSide) {
      trRight = document.createElement("tr");
      trRight.appendChild(document.createElement("td"));
      td1 = document.createElement("td");
      td2 = document.createElement("td");
      td3 = document.createElement("td");
      td1.textContent = points.rightSide[rightPoint].stalls;
      trRight.appendChild(td1);
      td2.textContent = points.rightSide[rightPoint].meters;
      trRight.appendChild(td2);
      td3.textContent = points.rightSide[rightPoint].machine;
      trRight.appendChild(td3);
      rightTableFirstChild.appendChild(trRight);
    }
  };

  saveEditingPoints = () => {
    const left = document.getElementsByClassName("left-point-rope"); // e
    const right = document.getElementsByClassName("right-point-rope"); // t

    this.pointsData = { leftSide: {}, rightSide: {} };

    if (left.length != 0 || right.length != 0) {
      for (let t = 0; t < left.length; t++) {
        this.pointsData.leftSide["point" + (t + 1)] = {};
        for (let o = 1; o < left[t].childNodes.length; o++)
          if (o == 1) {
            let first = left[t].childNodes[o].firstChild, // i
              last = left[t].childNodes[o].lastChild; // s
            if (!first.value) {
              ;
              first.parentElement.style.backgroundColor = "red";
              first.onclick = () => {
                first.parentElement.style.backgroundColor = "initial";
              }
              alert("Пустые поля недопустимы, заполните либо удалите пустые точки подвеса");
              return;
            }
            if (!last.value) {
              last.parentElement.style.backgroundColor = "red";
              last.onclick = () => {
                last.parentElement.style.backgroundColor = "initial";
              }
              alert("Пустые поля недопустимы, заполните либо удалите пустые точки подвеса");
              return;
            }
            this.pointsData.leftSide["point" + (t + 1)].stalls = first.value + "/" + last.value;
          } else if (o == 2) {
            if (!left[t].childNodes[o].firstChild.value) {
              left[t].childNodes[o].firstChild.parentElement.style.backgroundColor = "red";
              left[t].childNodes[o].firstChild.onclick = () => {
                left[t].childNodes[o].firstChild.parentElement.style.backgroundColor = "initial";
              }
              alert("Пустые поля недопустимы, заполните либо удалите пустые точки подвеса");
              return;
            }
            this.pointsData.leftSide["point" + (t + 1)].meters = left[t].childNodes[o].firstChild.value;
          } else if (o == 3) {
            this.pointsData.leftSide["point" + (t + 1)].machine = left[t].childNodes[o].firstChild.value;
          }
      }

      for (let e = 0; e < right.length; e++) {
        this.pointsData.rightSide["point" + (e + 1)] = {};

        for (let o = 1; o < right[e].childNodes.length; o++) {
          if (o == 1) {
            let first = right[e].childNodes[o].firstChild, // i
              last = right[e].childNodes[o].lastChild; // s
            if (!first.value) {
              first.parentElement.style.backgroundColor = "red";
              first.onclick = () => {
                first.parentElement.style.backgroundColor = "initial";
              };
              alert("Пустые поля недопустимы, заполните либо удалите пустые точки подвеса");
              return;
            }
            if (!last.value) {
              last.parentElement.style.backgroundColor = "red";
              last.onclick = () => {
                last.parentElement.style.backgroundColor = "initial";
              };
              alert("Пустые поля недопустимы, заполните либо удалите пустые точки подвеса");
              return;
            }
            this.pointsData.rightSide["point" + (e + 1)].stalls = first.value + "/" + last.value;
          } else if (o == 2) {
            if (!right[e].childNodes[o].firstChild.value) {
              right[e].childNodes[o].firstChild.parentElement.style.backgroundColor = "red";
              right[e].childNodes[o].firstChild.onclick = () => {
                right[e].childNodes[o].firstChild.parentElement.style.backgroundColor = "initial";
              }
              alert("Пустые поля недопустимы, заполните либо удалите пустые точки подвеса");
              return;
            }
            this.pointsData.rightSide["point" + (e + 1)].meters = right[e].childNodes[o].firstChild.value;
          } else if (o == 3) {
            this.pointsData.rightSide["point" + (e + 1)].machine = right[e].childNodes[o].firstChild.value;
          }
        }
      }
      this.fillEditCardPointsDiv(this.pointsData);
      this.backgroundPoints.style.display = "none";
    } else {
      this.backgroundPoints.style.display = "none";
    }
  };

  addAct = () => {
    let num = this.perfActs.childNodes.length + 1, // t
      div = document.createElement("div"), // o
      sp = document.createElement("span"), // i
      inpt = document.createElement("input"), // s
      sp2 = document.createElement("span"); // l

    div.setAttribute("class", "act-line");
    sp.setAttribute("class", "perf-act");
    sp.setAttribute("id", "perf-act" + num);
    sp.textContent = num + ":";
    inpt.setAttribute("type", "text");
    inpt.setAttribute("class", "act-time");
    inpt.setAttribute("id", "act-time" + num);
    inpt.setAttribute("placeholder", "1ч 15мин");
    sp2.setAttribute("id", "del-act-btn" + num);
    sp2.setAttribute("class", "del-act-btn");
    sp2.textContent = "X";
    sp2.onclick = () => {
      sp2.parentElement.remove();
    };
    div.appendChild(sp);
    div.appendChild(inpt);
    div.appendChild(sp2);
    this.perfActs.insertBefore(div, this.perfActs.childNodes[e]);
  };

  checkActs = () => {
    let childLen = this.perfActs.childNodes.length, //e
      children = this.perfActs.childNodes; //t
    for (let i = 0; i < childLen; i++) { // n
      if (!children[i].childNodes[1].value) {
        children[i].childNodes[1].style.borderColor = "red"
        children[i].childNodes[1].onclick = () => {
          return children[i].childNodes[1].style.borderColor = "initial";
        }
        return false;
      }
    }
    return true;
  };

  inputsValid = () => {
    if (!this.perfName.value) {
      this.perfName.style.borderColor = "red"
      return false;
    } else if (!this.perfType.value) {
      this.perfType.style.borderColor = "red"
      return false;
    } else if (!this.checkActs()) {
      this.perfActs.borderColor = "red";
      return false;
    }
    return true;
  };

  save = async (perfId, action) => { // e , t
    if ("update" === action || "create" === action) {
      if (this.inputsValid()) {
        let perfName = this.perfName.value, //o
          perfType = this.perfType.value, // i
          perfUrl = this.perfUrl.value, // s
          acts = [], // l
          perfNotes = this.perfNotes.value; // a


        for (let e = 0; e < this.perfActs.childNodes.length; e++) {
          if (this.perfActs.childNodes[e].childNodes[1].value.includes(",")) {
            return this.perfActs.childNodes[e].childNodes[1].style.borderColor = "red";
          }
          acts.push(this.perfActs.childNodes[e].childNodes[1].value);
        }
        if (perfId && action === "update") {
          // let query = `name=${perfName}&type=${perfType}&imgUrl=${perfUrl}&acts=${acts}&points=${JSON.stringify()}&notes=${perfNotes}&perfId=${perfId}&action=${action}`;
          let data = {
            name: perfName,
            type: perfType,
            imgUrl: perfUrl,
            acts: acts,
            points: this.pointsData,
            notes: perfNotes,
            perfId: perfId,
            action: action
          }

          const resp = await request("/performances", "POST", data);

          if (resp.statusText == "OK") {
            alert("Спектакль обновлен успешно");
            this.backgroundModal.style.display = "none";
            window.location.reload();
            return;
          } else {
            alert("Ошибка во время сохранения");
            return;
          }

        } else if (!perfId && action == "create") {
          let data = {
            name: perfName,
            type: perfType,
            imgUrl: perfUrl,
            acts: acts,
            points: this.pointsData,
            notes: perfNotes,
            perfId: perfId,
            action: action
          }

          const resp = await request("/performances", "POST", data);
          if (resp.statusText == "OK") {
            alert("Новый спектакль успешно добавлен");
            window.location.reload();
          }
          else {
            alert("Ошибка во время создания");
            return;
          }
        }
      }
    } else if (action === "remove") {
      let dt = {
        perfId: perfId,
        action: action
      }
      let resp = await request("/performances", "POST", dt);
      if (resp.statusText == "OK") {
        alert("Спектакль успешно удалён");
        window.location.reload();
        return;
      }
      else {
        alert("Ошибка удаления");
        return;
      };
    }
  };

  addPoint = point => {
    // e - point
    // t-tr, o-sp

    const tr = document.createElement("tr");
    const sp = document.createElement("span");

    sp.textContent = "/";

    for (let i = 0; i < 4; i++) {
      let td = document.createElement("td");

      if (i == 1) {
        for (let b = 0; b < 2; b++) {
          let inpt = document.createElement("input");
          inpt.setAttribute("type", "number");
          inpt.setAttribute("class", "lines");
          if (b == 1) {
            td.appendChild(sp);
          }
          td.appendChild(inpt);
        }
      }

      else if (i == 2) {
        let inpt = document.createElement("input");
        inpt.setAttribute("type", "number");
        inpt.setAttribute("class", "meters");
        td.appendChild(inpt);
      } else if (i == 3) {
        // e-inpt, t -sp
        let inpt = document.createElement("input");
        let sp = document.createElement("span");
        sp.textContent = "X";
        sp.setAttribute("class", "del-point-rope");
        sp.onclick = e => {
          if (confirm("Удалить эту точку подвеса?")) {
            e.target.parentElement.parentElement.remove();
            this.totalPointsNum--;
            this.totalPointsSpan.textContent = this.totalPointsNum + " шт.";
          }
        }
        inpt.setAttribute("type", "number");
        inpt.setAttribute("class", "machine");
        td.appendChild(inpt);
        td.appendChild(sp);
      }
      tr.appendChild(td);
    }
    tr.setAttribute("class", point + "-point-rope");
    document.getElementById(point + "-table").appendChild(tr);
    this.totalPointsNum++;
    this.totalPointsSpan.textContent = this.totalPointsNum + " шт.";
  };
}
