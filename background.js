const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

const PLAY = "⏰";
const PAUSE = "||";
const REST = "☕";
const NONE = "";

var state = START;

var words = [
  "Do your best!",
  "Easy come, easy go",
  "Just do it!",
  "Okay! Let's go!",
  "No time to die!",
  "We're leaving at dawn...",
];

// notificaton
function notification() {
  chrome.notifications.create("countdownEnd", {
    iconUrl: "Resources/Icon/clock2.png",
    title: "Warptimer",
    message: words[Math.floor(Math.random() * words.length)],
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
const ALARM = "countdown";
function countdownInit() {
  chrome.alarms.get(ALARM, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(ALARM, { delayInMinutes: restTime / 60 });
      setBadge(REST, [227, 181, 73, 1]);
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
  setBadge(NONE, [227, 181, 73, 1]);
  notification();
  chrome.windows.create({url: "popup.html", type: "panel"});
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

//badge
function setBadge(text, color) {
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: color });
}

function sound() {
  console.log(chrome.runtime.getURL("Resources/Sounds/3.mp3"));
  var url = "Resources/Sounds/3.mp3";
  var audio =
    new Audio(url) || false;
  if (audio) {
    audio.play();
  }
}
