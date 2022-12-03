//import * as dexie from chrome.runtime.getURL("../Scripts/DexieJs/dexie");

const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

var startPanel = document.getElementById("start");
var stopwatchPanel = document.getElementById("stopwatch");
var countdownPanel = document.getElementById("countdown");

// start
var startBtn = document.getElementById("startBtn");

// stopwatch
var mins = document.getElementById("tens");
var seconds = document.getElementById("seconds");
var restBtn = document.getElementById("restBtn");
var divertBtn = document.getElementById("divertBtn");
var stopwatchClock = document.getElementById("stopwatch_clock");
var stopwatchText = document.getElementById("stopwatch_text");
var is_divert = false;

// countdown
var cmins = document.getElementById("mins");
var cseconds = document.getElementById("secs");
var skipBtn = document.getElementById("skipBtn");

// objects
const stopwatch = {
  interval: null,
  update: () => {
    if (stopwatch.interval == null)
      stopwatch.interval = setInterval(() => {
        chrome.storage.sync
          .get(["scheduledTime", "divertSummTime"])
          .then((result) => {
            if (result.scheduledTime !== undefined) {
              var distance = stopwatch.getDistance(
                result.scheduledTime,
                result.divertSummTime
              );
              var minutesMills = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
              );
              var secondsMills = Math.floor((distance % (1000 * 60)) / 1000);
              mins.innerHTML = digits(minutesMills);
              seconds.innerHTML = digits(secondsMills);
              console.log("stopwatch");
            }
          });
      }, 1000);
  },
  end: () => {
    stopwatch.stop();
    chrome.runtime.sendMessage({ msg: "stopwatchEnd" });
    mins.innerHTML = "00";
    seconds.innerHTML = "00";
  },
  stop() {
    if (stopwatch.interval !== null) {
      clearInterval(stopwatch.interval);
      stopwatch.interval = null;
    }
  },
  getDistance(scheduledTime, divertSummTime) {
    var distance =
      Date.now() -
      (typeof divertSummTime === "number" ? divertSummTime : 0) -
      scheduledTime;
    return distance;
  },
  saveDigitsText() {
    chrome.storage.sync.set({
      stopwatchDigitsText: [mins.innerHTML, seconds.innerHTML],
    });
  },
  loadDigitsText() {
    chrome.storage.sync.get(["stopwatchDigitsText"]).then((result) => {
      mins.innerHTML = result.stopwatchDigitsText[0];
      seconds.innerHTML = result.stopwatchDigitsText[1];
    });
  },
};

const countdown = {
  delay: 1000,
  interval: null,
  update: () => {
    interval = setInterval(() => {
      chrome.runtime.sendMessage({
        msg: "countdownInit",
      });
      console.log("countdown");
    }, countdown.delay);
  },
  end: () => {
    if (this.interval !== null) {
      clearInterval(this.interval);
      interval = null;
      changeState(START);
    }
  },
};

window.onload = () => {
  updatePanel();
};

window.onblur = () => {
  stopwatch.saveDigitsText();
  console.log('hello');
}

function updatePanel() {
  chrome.runtime.sendMessage({ msg: "getState" }, (response) => {
    hideAll();
    switch (response) {
      case START:
        // var db = new dexie.Dexie("Test");
        // db.version(1).stores({ food: "name, callorie" });
        // db.food
        //   .bulkPut([
        //     { name: "bana", callorie: 342 },
        //     { name: "salad", callorie: 242 },
        //   ])
        //   .then(() => {
        //     console.log(db.food.toArray());
        //   });
        countdown.end();
        startPanel.style.display = "block";
        startBtn.onclick = () => {
          changeState(STOPWATCH);
          chrome.runtime.sendMessage({ msg: "stopwatchStart" }, () => {
            stopwatch.update();
          });
        };
        break;
      case STOPWATCH:
        stopwatchPanel.style.display = "block";
        stopwatch.loadDigitsText();
        updateDivertBtn();
        restBtn.onclick = () => {
          stopwatch.end();
          changeState(COUNTDOWN);
        };
        divertBtn.onclick = () => divert();
        break;
      case COUNTDOWN:
        countdownPanel.style.display = "block";
        countdown.update();
        countdownTickHandler();
        countdownEndHandler();
        skipBtn.onclick = () => {
          chrome.runtime.sendMessage({ msg: "skipCountdown" });
        };
        break;
    }
  });
}

function hideAll() {
  startPanel.style.display = "none";
  stopwatchPanel.style.display = "none";
  countdownPanel.style.display = "none";
}

function digits(num) {
  num = num.toString();
  while (num.length < 2) num = "0" + num;
  return num;
}

function updateDigits(time) {
  cmins.innerHTML = digits(time.minutes);
  cseconds.innerHTML = digits(time.seconds);
}

async function changeState(state) {
  await chrome.runtime.sendMessage({ msg: "setState", value: state });
  updatePanel();
}

function countdownEndHandler() {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.msg === "countdownEnd") updatePanel();
  });
}

function countdownTickHandler() {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.msg == "tick") updateDigits(request.value);
  });
}

function divert() {
  chrome.runtime.sendMessage({ msg: "divert", value: true }, (is_divert) => {
    if (is_divert && stopwatch.interval !== null) stopwatch.stop();
    else if (!is_divert) stopwatch.update();
    divertBtn.innerHTML = is_divert
      ? '<i class="fas fa-play fa-xs"></i> Resume'
      : '<i class="fas fa-pause fa-xs"></i> Divert';
    stopwatchClock.className = is_divert ? "stopwatch_paused" : "stopwatch";
    stopwatchText.className = is_divert
      ? "stopwatch_text_paused"
      : "stopwatch_text";
  });
}

function updateDivertBtn() {
  chrome.runtime.sendMessage({ msg: "divert", value: false }, (is_divert) => {
    if (!is_divert) stopwatch.update();
    divertBtn.innerHTML = is_divert
      ? '<i class="fas fa-play fa-xs"></i> Resume'
      : '<i class="fas fa-pause fa-xs"></i> Divert';
    stopwatchClock.className = is_divert ? "stopwatch_paused" : "stopwatch";
    stopwatchText.className = is_divert
      ? "stopwatch_text_paused"
      : "stopwatch_text";
  });
}
