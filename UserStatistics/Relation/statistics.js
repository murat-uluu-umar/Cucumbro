var calendarItems = document.getElementById("items");
var calendarTitle = document.getElementById("calendar_title");
var forwardBtn = document.getElementById("forward_btn");
var backwardBtn = document.getElementById("backward_btn");
var overallGraphCanvas = document.getElementById("overall_graph");
var resetZoomBtn = document.getElementById("reset_zoom");
var polarChartCanvas = document.getElementById("polar_chart");
var dayData = document.getElementById("day-data");
var dayTotalData = document.getElementById("overall-day-score");
var dtpChartCanvas = document.getElementById("dtp_chart")

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
  Object.keys(data["task"]).forEach((element, idx) => {
    var item = {
      label: element,
      data: Object.values(data.task)[idx],
      tension: 0.1,
      backgroundColor: palette,
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
  dtpChartInstance = new Chart(dtpChartCanvas, dtpChart.getConfig())
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
  }
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
  };
}

function createDay(day, selected) {
  var label = document.createElement("label");
  if (typeof day !== "string") {
    if (selected)
      label.id = selected.getTime() !== day.getTime() ? "day" : "day-selected";
    else label.id = "day";
    if (calendar.hightlighted[day.toLocaleDateString()]) label.className = "hightlighted";
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
  data.data.forEach((item) => {
    dayData.innerHTML += getScoreItem(item);
  });
  dayTotalData.innerHTML = getTotalScore(data.total);
  dtpChart.update(data.total)
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
