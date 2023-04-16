function goToServer(serverId, iconElement) {
  document.getElementById("channelsContainer").innerHTML = loadingElInn;
  isInDms = false;
  if (document.querySelector(".active-server")) {
    document.querySelector(".active-server").classList.remove("active-server");
  }
  iconElement.classList.add("active-server");
  topLeftEl.innerText = iconElement.title;

  commandEl.innerHTML = `fetchChannels ${serverId}`;
}

function goToDms(iconElement) {
  isInDms = true;
  if (document.querySelector(".active-server")) {
    document.querySelector(".active-server").classList.remove("active-server");
  }

  iconElement.classList.add("active-server");
  document.getElementById("channelsContainer").innerHTML = loadingElInn;
  commandEl.innerHTML = `goToDms`;
  topLeftEl.innerText = "Direct Messages";
}

function goToChannel(channelId, channelName, channelElem) {
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

function deleteMessage(channelId, messageId){
  commandEl.innerHTML = `deleteMessage ${channelId} ${messageId}`;
  console.log(commandEl.innerHTML);
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

//   CHANGERS

function fullImage(image) {
  const fullImageHolder = document.createElement("div");
  const fullImageEl = document.createElement("img");
  fullImageHolder.classList.add("full-image-holder");
  fullImageEl.classList.add("full-image");
  fullImageEl.src = image.src;
  fullImageEl.alt = image.alt;
  fullImageHolder.appendChild(fullImageEl);
  document.body.appendChild(fullImageHolder);
  setTimeout(() => {
    fullImageHolder.addEventListener("click", (e) => {
      if (e.target != fullImageEl) {
        fullImageHolder.remove();
      }
    });
  }, 20);
}

function fullVideo(video) {
  const videoHolder = document.createElement("div");
  const videoHolder2 = document.createElement("div");
  const videoEl = document.createElement("video");
  const videoTimelineHolder = document.createElement("div");
  const videoTimeline = document.createElement("div");
  const videoTimelineOverlay = document.createElement("div");
  const videoPlayEl = document.createElement("div");

  videoTimelineHolder.classList.add("video-timeline-holder");
  videoTimeline.classList.add("video-timeline");
  videoTimelineOverlay.classList.add("video-timeline-overlay");
  videoPlayEl.classList.add("video-play");

  video.pause();

  videoPlayEl.addEventListener("click", () => {
    if (videoEl.paused) {
      videoEl.play();
      videoPlayEl.style.opacity = 0;
    } else {
      videoEl.pause();
      videoPlayEl.style.opacity = 1;
    }
  });
  video.addEventListener("pause", () => {
    videoPlayEl.style.opacity = 1;
  })

  videoEl.addEventListener("timeupdate", () => {
    const duration = videoEl.duration;
    const currentTime = videoEl.currentTime;
    const percentage = (currentTime / duration) * 100;
    videoTimeline.style.width = percentage + "%";
    video.currentTime = videoEl.currentTime;
  });
  videoTimelineOverlay.addEventListener("mousedown", (event) => {
    const totalWidth = videoTimelineOverlay.offsetWidth;
    const position =
      event.clientX - videoHolder2.offsetLeft;
    const percentage = position / totalWidth;
    const newTime = percentage * videoEl.duration;
    videoEl.currentTime = newTime;
  });

  videoHolder.classList.add("full-video-holder");
  videoEl.classList.add("full-video");
  videoEl.src = video.src;
  videoEl.currentTime = video.currentTime;

  videoHolder2.style.position = "relative";

  videoHolder2.appendChild(videoEl);
  document.body.appendChild(videoHolder);
  videoHolder2.appendChild(videoPlayEl);
  videoHolder2.appendChild(videoTimelineHolder);
  videoHolder.appendChild(videoHolder2);
  videoTimelineHolder.appendChild(videoTimeline);
  videoTimelineHolder.appendChild(videoTimelineOverlay);

  setTimeout(() => {
    videoHolder.addEventListener("click", (e) => {
      if (
        e.target != videoEl &&
        e.target != videoPlayEl &&
        e.target != videoTimelineOverlay
      ) {
        videoHolder.remove();
      }
    });
  }, 20);
}

function showRawData(data) {
  const dataHolder = document.createElement("div");
  dataHolder.classList.add("data-raw-holder");

  const codeBlock = document.createElement("code");
  const preBlock = document.createElement("pre");

  codeBlock.appendChild(preBlock);
  dataHolder.appendChild(codeBlock);
  document.body.appendChild(dataHolder);

  const formattedData = JSON.stringify(JSON.parse(data), null, 2);
  preBlock.textContent = formattedData;

  setTimeout(() => {
    document.addEventListener("click", (e) => {
      if (e.target != codeBlock && e.target != preBlock) {
        dataHolder.remove();
      }
    });
  }, 20);
}

function copyUrlToClipboard(url) {
  const inputEl = document.createElement("input");
  inputEl.setAttribute("type", "text");
  inputEl.setAttribute("value", url);
  document.body.appendChild(inputEl);
  inputEl.select();
  document.execCommand("copy");
  document.body.removeChild(inputEl);
}

function copyImage(imageUrl) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);
    canvas.toBlob(blob => {
      const clipboardItem = new ClipboardItem({'image/png': blob});
      navigator.clipboard.write([clipboardItem]).then(() => {
        console.log("Image copied to clipboard");
      }, (err) => {
        console.error("Failed to copy image to clipboard", err);
      });
    }, 'image/png', 1);
  };
  img.src = imageUrl;
}
