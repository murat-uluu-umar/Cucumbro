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

// countdown
var cmins = document.getElementById("mins");
var cseconds = document.getElementById("secs");
var skipBtn = document.getElementById("skipBtn");

// objects

const stopwatch = {
  delay: 1000,
  interval: null,
  update: () => {
    interval = setInterval(() => {
      chrome.runtime.sendMessage({ msg: "stopwatchTick" }, (time) => {
        mins.innerHTML = digits(Math.floor(time / 60));
        seconds.innerHTML = digits(time % 60);
      });
    }, this.delay);
  },
  end: () => {
    if (this.interval !== null) {
      clearInterval(this.interval);
      chrome.runtime.sendMessage({ msg: "stopwatchEnd" }, (time) => {});
    }
  },
};

const countdown = {
  delay: 3000,
  interval: null,
  update: () => {
    interval = setInterval(() => {
      chrome.runtime.sendMessage(
        { msg: "countdownInit", value: updateDigits },
        (time) => {}
      );
    }, this.delay);
  },
  end: () => {
    if (this.interval !== null) {
      clearInterval(this.interval);
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
        restBtn.onclick = () => {
          stopwatch.end();
          changeState(COUNTDOWN);
        };
        break;
      case COUNTDOWN:
        countdownPanel.style.display = "block";
        countdown.update();
        tickHandler()
        countdownEndHandler();
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
  await chrome.runtime.sendMessage(
    { msg: "setState", value: state },
    (response) => {}
  );
  updatePanel();
}

function countdownEndHandler() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.msg === "countdownEnd") countdown.end();
  });
}

function tickHandler() {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == 'tick')
      updateDigits(request.value)
  });
}
