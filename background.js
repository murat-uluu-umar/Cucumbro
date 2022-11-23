const START = 'START'
const STOPWATCH = 'STOPWATCH'
const COUNTDOWN = 'COUNTDOWN'

var stopwatch_date = Date()
var countdown_date = Date()

var state = START

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === 'getState')
            sendResponse(state)
    }
  )