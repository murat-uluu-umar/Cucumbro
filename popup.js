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

// countdown
var cmins = document.getElementById("mins");
var cseconds = document.getElementById("secs");
var skipBtn = document.getElementById("skipBtn");

// objects
const stopwatch = {
  update: () => {
    chrome.runtime.sendMessage({ msg: "stopwatchStart" });
    chrome.runtime.onMessage.addListener((request) => {
      if (request.msg === "stopwatchTick") {
        mins.innerHTML = digits(Math.floor(request.value / 60));
        seconds.innerHTML = digits(request.value % 60);
      }
    });
  },
  end: () => {
    chrome.runtime.sendMessage({ msg: "stopwatchEnd" });
    mins.innerHTML = "00";
    seconds.innerHTML = "00";
  },
};

const countdown = {
  delay: 3000,
  interval: null,
  update: () => {
    interval = setInterval(() => {
      chrome.runtime.sendMessage({ msg: "countdownInit", value: updateDigits });
    }, this.delay);
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

function updatePanel() {
  chrome.runtime.sendMessage({ msg: "getState" }, (response) => {
    hideAll();
    switch (response) {
      case START:
        startPanel.style.display = "block";
        startBtn.onclick = () => changeState(STOPWATCH);
        break;
      case STOPWATCH:
        stopwatchPanel.style.display = "block";
        stopwatch.update();
        updateDivertBtn();
        restBtn.onclick = () => {
          stopwatch.end();
          changeState(COUNTDOWN);
        };
        divertBtn.onclick = () => {
          divert();
        };
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
    if (request.msg === "countdownEnd") countdown.end();
  });
}

function countdownTickHandler() {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.msg == "tick") updateDigits(request.value);
  });
}

function divert() {
  chrome.runtime.sendMessage({ msg: "divert", value: true }, (is_divert) => {
    divertBtn.innerHTML = is_divert ? "Resume" : "Divert";
  });
}

function updateDivertBtn() {
  chrome.runtime.sendMessage({ msg: "divert", value: false }, (is_divert) => {
    divertBtn.innerHTML = is_divert ? "Resume" : "Divert";
  });
}
