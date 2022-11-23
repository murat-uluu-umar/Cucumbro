const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

var type = document.getElementById("type");
var startPanel = document.getElementById("start");
var stopwatchPanel = document.getElementById("stopwatch");
var countdownPanel = document.getElementById("countdown");

// start
var startBtn = document.getElementById("startBtn")


var stopwatch = "⏱️";

window.onload = () => {
  updatePanel();
};

function updatePanel() {
  chrome.runtime.sendMessage({ msg: "getState" }, (response) => {
    hideAll();
    switch (response) {
      case START:
        startPanel.style.display = "block";
        break;
      case STOPWATCH:
        stopwatchPanel.style.display = "block";
        break;
      case COUNTDOWN:
        countdownPanel.style.display = "block";
        break;
    }
  });
}

function hideAll() {
  startPanel.style.display = "none";
  stopwatchPanel.style.display = "none";
  countdownPanel.style.display = "none";
}
