import { utils } from "../utils/consts"

var interval
var stopwatch = Stopwatch()
var mins = document.getElementById('tens')
var secs = document.getElementById('seconds')

window.onload = () => {
  
  chrome.runtime.sendMessage({ request: "setState", value : utils.STOPWATCH }, (response))
  .then({ request: "getStopwatchTime" }, (response) => {
    stopwatch.setTime(response);
  });

  interval = setInterval(tick, stopwatch.delay);
}

window.onclose = () => {
    clearInterval(interval)
    chrome.runtime.sendMessage({ request: "setStopwatchTime", value: stopwatch.getTime()}, (response) => {});
}

function tick() {
    stopwatch.tick()
    mins.textContent = stopwatch.getTime() / 60
    secs.textContent = stopwatch.getTime() % 60
}