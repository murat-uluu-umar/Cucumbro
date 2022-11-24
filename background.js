const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

var stopwatch_date = Date();
var countdown_date = Date();

var state = START;

// notificaton
function notification() {
  chrome.notifications.create("countdownEnd", {
    iconUrl: "Resources/Icon/pixil-frame-0 (3).png",
    title: "⏰ Cucumbro!",
    message: "Return to your job",
    type: "basic",
  });
}

// stopwatch
var stopwatchDelay = 30;
var interval = null;
var delay = 1000;
var restTime = 0;

function stopwatchStart() {
  if (interval === null) {
    interval = setInterval(() => {
      stopwatchDelay++;
      chrome.runtime.sendMessage({
        msg: "stopwatchTick",
        value: stopwatchDelay,
      });
    }, delay);
  }
}

function stopwatchEnd() {
  if (interval !== null) clearInterval(interval);
  interval = null;
  restTime = stopwatchDelay / 3;
  stopwatchDelay = 0;
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
      chrome.runtime.sendMessage(
        { msg: "tick", value: result },
        (response) => {}
      );
    }
  });
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
      stopwatchStart();
      break;
    case "stopwatchEnd":
      stopwatchEnd();
      break;
    case "countdownInit":
      countdownInit(request.value);
  }
});

// alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  restTime = 0;
  chrome.runtime.sendMessage({ msg: "countdownEnd" }, (response) => {});
  chrome.alarms.clearAll();
  notification();
});
