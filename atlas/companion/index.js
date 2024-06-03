import { localStorage } from "local-storage";
import * as messaging from "messaging";

const aDayHasPassed = (yesterdayMaybe) => {
  const today = new Date();
  let yesterdayForSure = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );
  return (
    yesterdayForSure.getFullYear() == yesterdayMaybe.getFullYear() &&
    yesterdayForSure.getMonth() == yesterdayMaybe.getMonth() &&
    yesterdayForSure.getDate() == yesterdayMaybe.getDate()
  );
};

const lessThanADayHasPassed = (yesterdayMaybe) => {
  const today = new Date();
  return (
    today.getFullYear() == yesterdayMaybe.getFullYear() &&
    yesterdayMaybe.getMonth() == today.getMonth() &&
    today.getDate() == yesterdayMaybe.getDate()
  );
};

messaging.peerSocket.addEventListener("open", (evt) => {
  console.log("Ready to send or receive messages");
  const storedServingsString = localStorage.getItem("storedServings");
  //{"today": number, "yesterday", number, "updated": Date}
  if (!storedServingsString) {
    console.log("the app is being opened for the first time");
    //app is being opened for the first time
    localStorage.setItem(
      "storedServings",
      JSON.stringify({
        today: 0,
        yesterday: "no data",
        updated: new Date(),
      })
    );
  } else {
    const storedServings = JSON.parse(storedServingsString);
    console.log(storedServingsString);
    if (!isNaN(storedServings.today)) {
      //the app has been opened at least once
      if (aDayHasPassed(new Date(storedServings.updated))) {
        console.log(
          "this app hasn't been launched since yesterday, so we need to update localstorage"
        );
        localStorage.setItem(
          "storedServings",
          JSON.stringify({
            updated: new Date(),
            yesterday: storedServings.today,
            today: 0,
          })
        );
      } else if (lessThanADayHasPassed(new Date(storedServings.updated))) {
        console.log(
          "less than a day has passed since this app was last opened"
        );
      } else {
        console.log("it's been 83 years...");
        localStorage.setItem(
          "storedServings",
          JSON.stringify({
            updated: new Date(),
            yesterday: "no data",
            today: 0,
          })
        );
      }
    }
  }
  const updatedStoredServings = JSON.parse(
    localStorage.getItem("storedServings")
  );

  if (updatedStoredServings) {
    messaging.peerSocket.send(updatedStoredServings);
  }
});

messaging.peerSocket.addEventListener("message", (evt) => {
  const storedServings = JSON.parse(localStorage.getItem("storedServings"));
  localStorage.setItem(
    "storedServings",
    JSON.stringify({
      ...storedServings,
      today: evt.data,
    })
  );
});
