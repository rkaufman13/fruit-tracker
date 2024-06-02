import * as document from "document";
import * as messaging from "messaging";

const incrementButton = document.getElementById("btnInc");
const decrementButton = document.getElementById("btnDec");
const countElem = document.getElementById("todayCount");
const yesterdayElem = document.getElementById("yesterdayCount");

let currServings;

messaging.peerSocket.addEventListener("message", (evt) => {
  console.log(JSON.stringify(evt.data));
  currServings = evt.data.today;
  countElem.textContent = currServings;
  const yesterdayServings = evt.data.yesterday;
  let yesterdayString;
  if (yesterdayServings == "no data") {
    yesterdayString = yesterdayServings;
  } else {
    yesterdayString = yesterdayServings + " servings";
  }
  console.log(yesterdayString);
  yesterdayElem.textContent = yesterdayString;
});

incrementButton.addEventListener("click", (evt) => {
  currServings++;
  if (currServings < 10) {
    countElem.textContent = currServings;
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(currServings);
    }
  }
});

decrementButton.addEventListener("click", () => {
  currServings--;
  if (currServings >= 0) {
    countElem.textContent = currServings;
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(currServings);
    }
  }
});
