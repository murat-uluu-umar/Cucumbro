var calendarItems = document.getElementById("items");
var calendarTitle = document.getElementById("calendar_title");
var forwardBtn = document.getElementById("forward_btn");
var backwardBtn = document.getElementById("backward_btn");
var calendar = null;

function intiCalendar() {
  calendar = new Calendar();
  updateCalendar();
  initHandlers();
}

function updateCalendar() {
  calendarItems.innerHTML = "";
  calendarTitle.innerHTML = calendar.getTitle();
  calendar.getDays().forEach((day) => {
    calendarItems.appendChild(createDay(day, calendar.selected))
  });
}

window.onload = () => {
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
  if (typeof day !== "string"){
    if (selected)
      label.id = selected.getTime() !== day.getTime() ? "day" : "day-selected"
    else label.id = "day";
      label.innerHTML = day.getDate();
    label.addEventListener("click", function (event) {
      calendar.select(event.target.innerHTML - 1);
      updateCalendar();
    });
  }
  return label;
}

function onDayClicked(elem) {
  
}