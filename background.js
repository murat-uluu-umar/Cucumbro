

var stopwatch_time = 0;
var state = 'start'
try {
  window.onload = () => {
    window.location.href = state + '.html'
  }
} catch (error) {
  console.log(error)
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.request) {
    case 'getStopwatchTime':
      sendResponse(stopwatch_time);
      break;
    case 'setStopwatchTime':
      stopwatch_time = request.value;
      break;
    case 'setState':
      state = request.value
  }
});
