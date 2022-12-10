const DATABASE = "WarptimeDB";
const DAYSDATA = "DAYSDATA";
const SUBJECTS = "SUBJECTS";
const VERSION = 2;

var calendarItems = document.getElementById("items");
var calendarTitle = document.getElementById("calendar_title");
var forwardBtn = document.getElementById("forward_btn");
var backwardBtn = document.getElementById("backward_btn");
var calendar = null;
var database = null;

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

function intiCalendar() {
  calendar = new Calendar();
  updateCalendar();
  initHandlers();
}

function initDataBase() {
  if (!indexedDB) {
    window.alert("IndexedDB could not be found in this browser!");
    window.close();
  }
  database = new DataBase();
  database.openDataBase(DATABASE, DAYSDATA, VERSION, (store) => {
    store.put({
      day: new Date(),
      amount: { start: new Date(), end: new Date() },
      type: "task",
      subject: "English",
    });
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
  initDataBase();
  intiCalendar();
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
}

function createDay(day, selected) {
  var label = document.createElement("label");
  if (typeof day !== "string") {
    if (selected)
      label.id = selected.getTime() !== day.getTime() ? "day" : "day-selected";
    else label.id = "day";
    label.innerHTML = day.getDate();
    label.addEventListener("click", function (event) {
      calendar.select(event.target.innerHTML - 1);
      updateCalendar();
    });
  }
  return label;
}

// const ctx = document.getElementById("myChart");

// new Chart(ctx, config);

// Chart.defaults.color = "blanchedalmond";
// Chart.defaults.font.family = "pixel_font";
