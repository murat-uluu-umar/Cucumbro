var calendarItems = document.getElementById("items");
var calendarTitle = document.getElementById("calendar_title");
var forwardBtn = document.getElementById("forward_btn");
var backwardBtn = document.getElementById("backward_btn");
var overallGraphCanvas = document.getElementById("overall_graph");
var resetZoomBtn = document.getElementById("reset_zoom");
var exportCSVBtn = document.getElementById("export_database");
var polarChartCanvas = document.getElementById("polar_chart");
var dayData = document.getElementById("day-data");
var dayTotalData = document.getElementById("overall-day-score");
var dtpChartCanvas = document.getElementById("dtp_chart");

var calendar = null;
var database = null;
var overallGraph = null;
var overallChart = null;
var polarChart = null;
var polarChartInstance = null;
var dayGraph = null;
var dtpChart = null;
var dtpChartInstance = null;

var palette = palette("cb-PuOr", 8).map(function (hex) {
  return "#" + hex;
});

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

function intiCalendar() {
  calendar = new Calendar();
  initHandlers();
}

function initOverallGraph(data) {
  overallGraph = new OverallGraph();
  var dataSets = [];
  var paletteN = palette;
  Object.keys(data).forEach((element, idx) => {
    var item = {
      label: element,
      data: Object.values(data)[idx],
      tension: 0.1,
      backgroundColor: paletteN[dataSets.length % paletteN.length],
      borderColor: paletteN[dataSets.length % paletteN.length],
    };
    dataSets.push(item);
  });
  Chart.defaults.color = "yellowgreen";
  Chart.defaults.font.family = "pixel_font";
  overallChart = new Chart(
    overallGraphCanvas,
    overallGraph.getConfig(dataSets)
  );
}

function initDayStats() {
  polarChart = new PolarChart(database);
  dayGraph = new DayGraph(database);
  dtpChart = new DtpChart(database);
  dtpChartInstance = new Chart(dtpChartCanvas, dtpChart.getConfig());
  polarChartInstance = new Chart(polarChartCanvas, polarChart.getConfig());
  polarChart.onUpdate = (config) => {
    polarChartInstance.destroy();
    polarChartInstance = new Chart(polarChartCanvas, config);
  };
  dayGraph.onUpdate = function (data) {
    updateDayScore(data);
  };
  dtpChart.onUpdate = function (config) {
    dtpChartInstance.destroy();
    dtpChartInstance = new Chart(dtpChartCanvas, config);
  };
}

function initDataBase() {
  if (!indexedDB) {
    window.alert(
      "Database could not be found in this browser!\nYou cannot use thi feature!"
    );
    window.close();
  }
  database = new DataBase();
  database.openDataBase((store) => {
    var allRecords = store.getAll();
    allRecords.onsuccess = function (event) {
      initOverallGraph(database.loadData(event.target.result));
      calendar.initHightlightDays(event.target.result);
      updateCalendar();
    };
  });
}

function updateCalendar() {
  calendarItems.innerHTML = "";
  calendarTitle.innerHTML = calendar.getTitle();
  calendar.getDays().forEach((day) => {
    calendarItems.appendChild(createDay(day, calendar.selected));
  });
}

window.onload = () => {
  intiCalendar();
  initDataBase();
  initDayStats();
};

function initHandlers() {
  forwardBtn.onclick = () => {
    calendar.forward();
    updateCalendar();
  };
  backwardBtn.onclick = () => {
    calendar.backward();
    updateCalendar();
  };
  resetZoomBtn.onclick = () => {
    overallChart.resetZoom();
  };
  calendar.onSelected = (idx) => {
    polarChart.update(idx.toLocaleDateString(), palette);
    dayGraph.update(idx.toLocaleDateString(), palette);
    console.log(idx);
  };
  exportCSVBtn.onclick = () => {
    if (confirm("Data will be exported as CSV")) exportCsv();
  };
  document.getElementById("export_json").onclick = () => {
    if (confirm("Data will be exported as JSON")) exportJson();
  };
  document.getElementById("import_json").onchange = (event) => {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      if (
        confirm(
          "Firstly your data will be vanished, and after imported. Are you sure?"
        )
      )
        importJson(reader.result);
    };
  };
  document.getElementById("clear_data").onclick = () => {
    if (
      prompt(
        "Data will be exposed to genocide! \n Are you sure: Yes/no",
        "no"
      ).toLowerCase() === "yes"
    )
      clearDataBase();
  };
}

function createDay(day, selected) {
  var label = document.createElement("label");
  if (typeof day !== "string") {
    if (selected)
      label.id = selected.getTime() !== day.getTime() ? "day" : "day-selected";
    else label.id = "day";
    if (calendar.hightlighted[day.toLocaleDateString()])
      label.className = "hightlighted";
    label.innerHTML = day.getDate();
    label.addEventListener("click", function (event) {
      calendar.select(event.target.innerHTML - 1);
      updateCalendar();
    });
  }
  return label;
}

function updateDayScore(data) {
  dayData.innerHTML = "";
  console.log(data);
  data.data.forEach((item) => {
    dayData.innerHTML += getScoreItem(item);
  });
  dayTotalData.innerHTML = getTotalScore(data.total);
  dtpChart.update(data.total);
}

function getScoreItem(item) {
  var dayScoreItem = `
  <label class="time-lable">
  <label>
      ${item.subject} ${item.amount.start} - ${item.amount.end} | ${
    item.amount.dist
  }
      <ul>
          ${item.diverts
            .map(
              (el) =>
                (el = `<li>divert: ${el.start}-${el.end} | ${el.dist}</li>`)
            )
            .join("")}
      </ul>
      Rest: ${item.rest.start} - ${item.rest.end} | ${item.rest.dist}
  </label>
  </label>`;
  return dayScoreItem;
}

function getTotalScore(total) {
  var timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  return `
  <li>Task: ${new Date(total.task + timeZoneOffset).toLocaleTimeString()}</li> 
  <li>Rest: ${new Date(total.rest + timeZoneOffset).toLocaleTimeString()}</li> 
  <li>Divert: ${new Date(
    total.divert + timeZoneOffset
  ).toLocaleTimeString()}</li> `;
}

function exportCsv() {
  database.openDataBase((store) => {
    var allRecords = store.index("Tasks").getAll(["task"]);
    var data = "Day,";
    var subjects = {};
    allRecords.onsuccess = function (event) {
      var orderedData = {};
      var sbIter = 0;
      if (Object.values(event.target.result).length == 0) {
        alert("There is no data to export!");
        return;
      }
      event.target.result.forEach((item) => {
        if (typeof subjects[item.subject] !== "number") {
          subjects[item.subject] = sbIter;
          sbIter++;
        }
        orderedData[item.day] =
          typeof orderedData[item.day] !== "object"
            ? {}
            : orderedData[item.day];
        orderedData[item.day][subjects[item.subject]] =
          typeof orderedData[item.day][subjects[item.subject]] !== "number"
            ? 0
            : orderedData[item.day][subjects[item.subject]];
        var o = orderedData[item.day][subjects[item.subject]];
        o = o + getExcelDate(item.amount.dist);
        orderedData[item.day][subjects[item.subject]] = o;
      });
      data += Object.keys(subjects).join(",") + ",";
      Object.keys(orderedData).forEach((day) => {
        var line = day + ",";
        Object.values(subjects).forEach((subject) => {
          var subj =
            typeof orderedData[day][subject] === "number"
              ? orderedData[day][subject]
              : 0;
          line += subj + ",";
        });
        data += "\n" + line;
      });
      downloadFile(data, "WarptimerDB", "text/csv");
    };
  });
}

function downloadFile(data, fileName, type) {
  var pom = document.createElement("a");
  var blob = new Blob([data], { type: `${type};charset=utf-8;` });
  var url = URL.createObjectURL(blob);
  pom.href = url;
  pom.setAttribute("download", fileName);
  pom.click();
}

function getExcelDate(milliseconds) {
  var date = new Date(milliseconds);
  return (
    25569.0 +
    (date.getTime() - date.getTimezoneOffset() * 60 * 1000) /
      (1000 * 60 * 60 * 24)
  );
}

function exportJson() {
  database.openDataBase(
    (store) => {},
    (idb) => {
      exportToJsonString(idb, function (err, jsonString) {
        if (err) {
          console.error(err);
        } else {
          var obj = JSON.parse(jsonString);
          if (obj["DAYSDATA"].length == 0) {
            alert("There is no data to export!");
            return;
          }
          downloadFile(jsonString, "WarptimerDB", "application/json");
          window.location.reload();
        }
      });
    }
  );
}

function importJson(jsonString) {
  database.openDataBase(
    (store) => {},
    (idb) => {
      clearDatabase(idb, function (err) {
        if (!err) {
          var obj = JSON.parse(jsonString);
          if (obj["DAYSDATA"].length == 0) {
            alert("There is no data to export!");
            return;
          }
          importFromJsonString(idb, jsonString, function (err) {
            if (!err) {
              alert("Successfully imported!");
              window.location.reload();
            }
          });
        }
      });
    }
  );
}

function clearDataBase() {
  database.openDataBase(
    (store) => {},
    (idb) => {
      clearDatabase(idb, function (err) {
        if (!err) {
          alert("Successfully cleared!");
          window.location.reload();
        }
      });
    }
  );
}
