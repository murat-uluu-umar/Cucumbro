const START = "START";
const STOPWATCH = "STOPWATCH";
const COUNTDOWN = "COUNTDOWN";

var startPanel = document.getElementById("start");
var stopwatchPanel = document.getElementById("stopwatch");
var countdownPanel = document.getElementById("countdown");

// start
var startBtn = document.getElementById("startBtn");
var newTaskInput = document.getElementById("new_task_input");
var tasksDataList = document.getElementById("tasks");

// stopwatch
var restBtn = document.getElementById("restBtn");
var divertBtn = document.getElementById("divertBtn");
var stopwatchClock = document.getElementById("stopwatch_clock");
var stopwatchText = document.getElementById("stopwatch_text");

// countdown
var skipBtn = document.getElementById("skip_btn");

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
              var hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );
              var minutesMills = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
              );
              var secondsMills = Math.floor((distance % (1000 * 60)) / 1000);
              document.getElementById("stopwatch_text").innerHTML = `${digits(
                hours
              )}:${digits(minutesMills)}:${digits(secondsMills)}`;
            }
          });
      }, 1000);
  },
  end: () => {
    stopwatch.stop();
    chrome.runtime.sendMessage({ msg: "stopwatchEnd" });
    document.getElementById("stopwatch_text").innerHTML = "00:00:00";
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
      stopwatchDigitsText: document.getElementById("stopwatch_text").innerHTML,
    });
  },
  loadDigitsText() {
    chrome.storage.sync.get(["stopwatchDigitsText"]).then((result) => {
      document.getElementById("stopwatch_text").innerHTML =
        result.stopwatchDigitsText;
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
    }, countdown.delay);
  },
  end: (change = true) => {
    if (this.interval !== null) {
      clearInterval(this.interval);
      interval = null;
      if (change) changeState(START);
    }
  },
};

window.onload = () => {
  updatePanel();
};

window.onblur = () => {
  stopwatch.saveDigitsText();
};

function updatePanel() {
  document.getElementById("stats_btn").onclick = () => {
    window.open("../UserStatistics/Views/statistics.html", "_blank").focus();
  };
  chrome.storage.sync.get(["state"]).then((result) => {
    hideAll();
    switch (result.state) {
      case START:
        initTasksDataList();
        countdown.end(false);
        startPanel.style.display = "block";
        startBtn.onclick = () => {
          addNewTask();
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
        divertSwitchHandler();
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
  document.getElementById("countdown_text").innerHTML = `${digits(
    time.hours
  )}:${digits(time.minutes)}:${digits(time.seconds)}`;
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

function divertSwitchHandler() {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.msg == "divertSwitched") {
      if (request.value && stopwatch.interval !== null) stopwatch.stop();
      else if (!request.value) stopwatch.update();
      divertBtn.innerHTML = request.value
        ? '<i class="fas fa-play fa-xs"></i> Resume'
        : '<i class="fas fa-pause fa-xs"></i> Divert';
      stopwatchClock.className = request.value
        ? "stopwatch_paused"
        : "stopwatch";
      stopwatchText.className = request.value
        ? "stopwatch_text_paused"
        : "stopwatch_text";
      restBtn.disabled = request.value ? true : false;
    }
  });
}

function divert() {
  chrome.runtime.sendMessage({ msg: "divert", value: true });
}

function updateDivertBtn() {
  chrome.runtime.sendMessage({ msg: "divert", value: false }, () => {
    chrome.storage.sync.get(["divert"]).then((result) => {
      if (!result.divert) stopwatch.update();
      divertBtn.innerHTML = result.divert
        ? '<i class="fas fa-play fa-xs"></i> Resume'
        : '<i class="fas fa-pause fa-xs"></i> Divert';
      stopwatchClock.className = result.divert
        ? "stopwatch_paused"
        : "stopwatch";
      stopwatchText.className = result.divert
        ? "stopwatch_text_paused"
        : "stopwatch_text";
      restBtn.disabled = result.divert ? true : false;
    });
  });
}

function initTasksDataList() {
  tasksDataList.innerHTML = "";
  newTaskInput.value = "";
  chrome.storage.local.get(["tasks"]).then((result) => {
    if (result.tasks) {
      result.tasks.forEach((elem) => {
        tasksDataList.innerHTML += `<option value='${elem}'/>`;
      });
    } else chrome.storage.local.set({ tasks: [] });
  });
}

function addNewTask() {
  chrome.storage.local.set({ subject: newTaskInput.value });
  if (newTaskInput.value !== "") {
    chrome.storage.local.get(["tasks"]).then((result) => {
      var tasks = result.tasks;
      tasks.push(newTaskInput.value);
      tasks = [...new Set(tasks)];
      chrome.storage.local.set({ tasks: tasks });
    });
  }
}
