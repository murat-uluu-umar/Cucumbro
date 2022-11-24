const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

var stopwatch_date = Date();
var countdown_date = Date();

var state = START;

// notificaton
function notification() {
  console.log("Do your job!");
}

// stopwatch
var stopwatchDelay = 30;
var interval = null;
var delay = 1000;
var restTime = 0;

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
      chrome.runtime.sendMessage({ msg: "tick", value: result }, (response) => {});
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
    case "stopwatchTick":
      if (interval === null) {
        interval = setInterval(() => {
          stopwatchDelay++;
        }, delay);
      }
      sendResponse(stopwatchDelay);
      break;
    case "stopwatchEnd":
      if (interval !== null) clearInterval(interval);
      restTime = stopwatchDelay / 3;
      console.log(restTime);
      console.log(stopwatchDelay);
      stopwatchDelay = 0;
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
