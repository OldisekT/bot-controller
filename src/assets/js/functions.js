function goToServer(serverId, iconElement) {
  document.getElementById("channelsContainer").innerHTML = loadingElInn;
  isInDms = false;
  if (document.querySelector(".active-server")) {
    document
      .querySelector(".active-server")
      .classList.remove("active-server");
  }
  iconElement.classList.add("active-server");
  topLeftEl.innerText = iconElement.title;

  commandEl.innerHTML = `fetchChannels ${serverId}`;
}

function goToDms(iconElement) {
  isInDms = true;
  if (document.querySelector(".active-server")) {
    document
      .querySelector(".active-server")
      .classList.remove("active-server");
  }

  iconElement.classList.add("active-server");
  document.getElementById("channelsContainer").innerHTML = loadingElInn;
  commandEl.innerHTML = `goToDms`;
  topLeftEl.innerText = "Direct Messages";
}

function goToChannel(channelId,channelName, channelElem) {
  document.getElementById("messagesContainer").innerHTML = loadingElInn;
  if (document.querySelector(".active-channel")) {
    document
      .querySelector(".active-channel")
      .classList.remove("active-channel");
  }
  channelElem.classList.add("active-channel");

  commandEl.innerHTML = `goToChannel ${channelId}`;
  document.getElementById("channelName").innerText = channelName;
  currentChannel = channelId;
}

function goToDm(dmId, channelElem) {
  document.getElementById("messagesContainer").innerHTML = loadingElInn;
  commandEl.innerHTML = `goToDm ${dmId}`;

  document.getElementById("channelName").innerText = channelElem.innerText;
  currentChannel = dmId;
}

function contactUser(userId) {
  document.getElementById("messagesContainer").innerHTML = loadingElInn;
  document.getElementById("channelName").innerText = "User " + userId;
  commandEl.innerHTML = `createDm ${userId}`;
}

function loadMessages(channelId, channelElem) {
  commandEl.innerHTML = `goToChannel ${channelId}`;
}

function toggleRaw(buttonEl) {
  buttonEl.classList.toggle("raw-active");
  useRawMessage = !useRawMessage;
}

function sendMessage(event, channelId, messageEl) {
  if (currentChannel != null) {
    if (event.keyCode == 13) {
      let message = messageEl.value;
      messageEl.value = "";
      if (useRawMessage) {
        commandEl.innerHTML =
          "sendRawMessage " +
          JSON.stringify({
            id: channelId,
            message: message,
          });
      } else {
        commandEl.innerHTML =
          "sendMessage " +
          JSON.stringify({
            id: channelId,
            message: message,
          });
      }
    }
  }
}

function logOut() {
  commandEl.innerHTML = "logOut";
}
