var messageText = document.getElementById("message");
var statsBtn = document.getElementById("statsBtn");
var statsText = document.getElementById("statsText");

var words = [
  "Do your best!",
  "Easy come, easy go",
  "Just do it!",
  "Okay! Let's go!",
  "No time to die!",
  "We're leaving at dawn...",
  "Your Time Has Come",
];

window.onload = () => {
  window.moveTo(screen.width / 2 - 350 / 2, screen.height / 2 - 250 / 2);
  sound();

  messageText.innerHTML = randomText();
  statsBtn.onclick = () => {
    window.open("../UserStatistics/Views/statistics.html", '_blank').focus(); 
    window.close();
  }
};

function sound() {
  var url = chrome.runtime.getURL(
    "../Resources/Sounds/" + Math.floor(1 + Math.random() * 3) + ".mp3"
  );
  var audio = new Audio(url) || false;
  if (audio) {
    audio.play();
  }
}

function randomText() {
  return words[Math.floor(Math.random() * words.length)];
}
