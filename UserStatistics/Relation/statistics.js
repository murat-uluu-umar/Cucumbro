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
    window.alert(
      "Database could not be found in this browser!\nYou cannot use thi feature!"
    );
    window.close();
  }
  database = new DataBase();
  database.openDataBase((store) => {
    var subj = [
      "Art",
      "Math",
      "English",
      "Programming",
      "Social Engineering",
      "Finacial Grammar",
      "Literature",
    ];
    for (let i = 0; i < subj.length; i++) {
      for (let j = 0; j < 4; j++) {
        store.put({
          day: i,
          amount: { start: i + Math.random * j, end:i + Math.random *Math.random * j+1 },
          type: "task",
          subject: Math.floor(Math.random * subj.length),
        });
      }
    }
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
