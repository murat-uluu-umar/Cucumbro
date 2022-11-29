const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

const PLAY = "⏰";
const PAUSE = "||";
const REST = "☕";
const NONE = "";

var state = START;
chrome.storage.sync.get(["state"]).then((result) => {
  if (result.state != undefined) state = result.state;
  else state = START;
});

// notificaton
function popup() {
  chrome.windows.create({
    url: "Views/congratulations.html",
    type: "popup",
    width: 400,
    height: 250,
    focused: true,
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
  setBadge(PLAY, [120, 39, 179, 1]);
}

function stopwatchPause() {
  if (interval != null) clearInterval(interval);
  interval = null;
  setBadge(PAUSE, [120, 39, 179, 1]);
}

function stopwatchEnd() {
  stopwatchPause();
  restTime = stopwatchDelay / 3;
  stopwatchDelay = 0;
  is_divert = false;
}

// countdown
var ringed = false;
const ALARM = "countdown";
function countdownInit() {
  chrome.alarms.get(ALARM, (alarm) => {
    if (alarm == undefined) {
      if (ringed == false) {
        chrome.alarms.create(ALARM, { delayInMinutes: restTime / 60 });
        setBadge(REST, [227, 181, 73, 1]);
      }
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
  state = START;
  chrome.runtime.sendMessage({ msg: "countdownEnd" });
  chrome.alarms.clearAll();
  setBadge(NONE, [227, 181, 73, 1]);
  popup();
}

// message handler
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.msg) {
    case "getState":
      sendResponse(state);
      break;
    case "setState":
      state = request.value;
      chrome.storage.sync.set({ state: state });
      break;
    case "stopwatchStart":
      ringed = false;
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
  ringed = true;
});

// divert
function divert() {
  is_divert = is_divert ? false : true;
  if (is_divert) stopwatchPause();
  else stopwatchStart();
}

//badge
function setBadge(text, color) {
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: color });
}
