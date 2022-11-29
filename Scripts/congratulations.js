var words = [
  "Do your best!",
  "Easy come, easy go",
  "Just do it!",
  "Okay! Let's go!",
  "No time to die!",
  "We're leaving at dawn...",
];

window.onload = () => {
  window.moveTo(screen.width / 2 - 350 / 2, screen.height / 2 - 250 / 2);
  sound()
};

function sound() {
  var url = chrome.runtime.getURL("../Resources/Sounds/3.mp3");
  var audio = new Audio(url) || false;
  if (audio) {
    audio.play();
  }
}