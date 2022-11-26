const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

var state = START;

// notificaton
function notification() {
  chrome.notifications.create("countdownEnd", {
    iconUrl: "Resources/Icon/clock2.png",
    title: "Cucumbro!",
    message: "Return to your job",
    type: "basic",
  });
}

// stopwatch
var stopwatchDelay = 0;
var interval = null;
var delay = 1000;
var restTime = 0;
var is_divert = false;

function stopwatchStart() {
  if (interval == null) {
    interval = setInterval(() => {
      stopwatchDelay++;
      chrome.runtime.sendMessage({
        msg: "stopwatchTick",
        value: stopwatchDelay,
      });
    }, delay);
  }
}

function stopwatchPause() {
  if (interval != null) clearInterval(interval);
  interval = null;
}

function stopwatchEnd() {
  stopwatchPause();
  restTime = stopwatchDelay / 3;
  stopwatchDelay = 0;
  is_divert = false;
}

// countdown
const ALARM = "countdown";
function countdownInit() {
  chrome.alarms.get(ALARM, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARM, { delayInMinutes: restTime / 60 });
    } else {
      var distance = alarm.scheduledTime - new Date().getTime();
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      result = { minutes: minutes, seconds: seconds };
      chrome.runtime.sendMessage({ msg: "tick", value: result });
    }
  });
}

function countdownEnd() {
  restTime = 0;
  chrome.runtime.sendMessage({ msg: "countdownEnd" });
  chrome.alarms.clearAll();
  notification();
}

// message handler
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.msg) {
    case "getState":
      sendResponse(state);
      break;
    case "setState":
      state = request.value;
      break;
    case "stopwatchStart":
      if (is_divert)
        chrome.runtime.sendMessage({
          msg: "stopwatchTick",
          value: stopwatchDelay,
        });
      else stopwatchStart();
      break;
    case "stopwatchEnd":
      stopwatchEnd();
      break;
    case "countdownInit":
      countdownInit(request.value);
      break;
    case "divert":
      if (request.value) divert();
      sendResponse(is_divert);
      break;
    case "skipCountdown":
      countdownEnd();
      break;
  }
});

// alarm
chrome.alarms.onAlarm.addListener(() => {
  countdownEnd();
});

// divert
function divert() {
  is_divert = is_divert ? false : true;
  if (is_divert) stopwatchPause();
  else stopwatchStart();
}
