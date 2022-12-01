const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

const PLAY = "⏰";
const PAUSE = "||";
const REST = "☕";
const NONE = "";

const PAUSEWIN = "PAUSEWIN";

var state = START;
chrome.storage.sync.get(["state"]).then((result) => {
  if (result.state != undefined) state = result.state;
  else {
    state = START;
    chrome.storage.sync.set({ state: START });
  }
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
var restTime = 0;
var is_divert = false;

function stopwatchStart() {
  chrome.storage.sync.get(["scheduledTime"]).then((result) => {
    if (result.scheduledTime === undefined)
      chrome.storage.sync.set({ scheduledTime: new Date().getTime() });
  });
  chrome.notifications.clear(PAUSEWIN);
  setBadge(PLAY, [120, 39, 179, 1]);
}

function stopwatchPause() {
  chrome.storage.sync.get(["divertStartTime"]).then((result) => {
    if (result.divertStartTime === undefined)
      chrome.storage.sync.set({ divetStartTime: new Date().getTime() });
  });
  setBadge(PAUSE, [120, 39, 179, 1]);
}

function stopwatchEnd() {
  stopwatchPause();
  chrome.storage.sync
    .get(["divertSummTime", "scheduledTime"])
    .then((result) => {
      distance = result.scheduledTime - result.divertSummTime;
      restTime = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      chrome.storage.sync.set({ scheduledTime: undefined });
      chrome.storage.sync.set({ divertSummTime: undefined });
      chrome.notifications.clear(PAUSEWIN);
      is_divert = false;
    });
}

// countdown
var ringed = false;
const ALARM = "countdown";
function countdownInit() {
  chrome.alarms.get(ALARM, (alarm) => {
    if (alarm == undefined) {
      if (ringed == false) {
        chrome.alarms.create(ALARM, { delayInMinutes: restTime });
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
  chrome.storage.sync.set({ state: START });
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
  if (is_divert) stopwatchPause(), pauseWindow();
  else stopwatchStart();
  if (is_divert == false) {
    chrome.storage.sync.get(["divertStartTime"]).then((result) => {
      if (result.divertStartTime !== undefined) {
        var divertEndTime = new Date(
          new Date().getTime() - result.divertStartTime
        );
        chrome.storage.sync.get(["divertSummTime"]).then((result) => {
          if (result.divertSummTime === undefined)
            chrome.storage.sync.set({ divertSummTime: divertEndTime });
          else
            chrome.storage.sync.set({
              divertSummTime: new Date(result.divertSummTime + divertEndTime),
            });
        });
        chrome.storage.sync.set({ divertStartTime: undefined });
      }
    });
  }
}

function pauseWindow() {
  chrome.notifications.create(PAUSEWIN, {
    iconUrl: "Resources/Icon/clock.png",
    title: "Warptimer",
    type: "basic",
    message: "Warptimer paused!",
    priority: 2,
    requireInteraction: true,
  });
}

chrome.notifications.onClosed.addListener((id, byUser) => {
  if (id === PAUSEWIN && byUser) pauseWindow();
});

//badge
function setBadge(text, color) {
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: color });
}
