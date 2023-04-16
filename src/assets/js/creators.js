function createServers(data) {
  const serversElement = document.getElementById("serverList");
  console.log(data);
  serversElement.innerHTML = DmsElement;
  data.forEach((serverData) => {
    // Create the server element
    const serverElement = document.createElement("a");
    serverElement.title = serverData.name;

    serverElement.classList.add("server");

    // Set the name of the server
    const nameElement = document.createElement("p");
    nameElement.textContent = serverData.name;
    serverElement.appendChild(nameElement);

    // Set the icon of the server
    const iconElement = document.createElement("img");
    iconElement.src = `https://cdn.discordapp.com/icons/${serverData.id}/${serverData.icon}.png?size=96`;
    iconElement.alt = serverData.name.substring(0, 10);
    serverElement.appendChild(iconElement);

    // Add the server element to the servers element
    serversElement.appendChild(serverElement);

    serverElement.onclick = () => {
      goToServer(serverData.id, serverElement);
    };
  });
}

function createChannels(channels) {
  const container = document.getElementById("channelsContainer");
  container.innerHTML = "";
  channels.sort((a, b) => {
    if (!a.name || !b.name) {
      if (!a.recipients || !b.recipients) {
        return 0;
      } else {
        const aUsernames = a.recipients.map((recipient) => recipient.username);
        const bUsernames = b.recipients.map((recipient) => recipient.username);
        return aUsernames.join(", ").toLowerCase().localeCompare(bUsernames.join(", ").toLowerCase());
      }
    } else {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }
  });
  
  console.log(channels);
  channels.forEach((channel) => {
    if (channel.type === 0) {
      const channelElem = document.createElement("div");
      channelElem.classList.add("channel");
      channelElem.title = channel.name;
      channelElem.onclick = () => {
        goToChannel(channel.id, channel.name, channelElem);
      };

      channelElem.setAttribute("data-channel-id", channel.id);

      const iconElem = document.createElement("div");
      iconElem.classList.add("channel-icon");
      iconElem.textContent = "# ";

      const nameElem = document.createElement("div");
      // if(canUserSeeChannel(channel,UserInfo)){
      //   nameElem.style.color = "var(--text-m)";
      // }
      nameElem.classList.add("channel-name");

      nameElem.textContent = channel.name;

      channelElem.appendChild(iconElem);
      channelElem.appendChild(nameElem);

      container.appendChild(channelElem);
    } else if (channel.type === 1 || channel.type === 3) {
      const channelElem = document.createElement("div");
      channelElem.classList.add("channel");
      channelElem.onclick = () => {
        goToDm(channel.id, channelElem);
      };
      let channelName = channel.name
        ? channel.name
        : channel.recipients.map((recipient) => recipient.username).join(", ");
      channelElem.title = channelName;

      iconElem = document.createElement("img");

      if (channel.type === 3) {
        const channelIcon = channel.icon
          ? `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.webp?size=32`
          : "./assets/icons/group-chat.svg";
        iconElem.src = channelIcon;
      } else {
        iconElem.src = `https://cdn.discordapp.com/avatars/${channel.recipients[0].id}/${channel.recipients[0].avatar}.webp?size=32`;
        iconElem.onerror = () => {
          iconElem.src = "./assets/icons/default-discord.svg";
        };
      }
      iconElem.classList.add("channel-icon");
      iconElem.height = 50;
      iconElem.width = 50;

      const nameElem = document.createElement("div");
      nameElem.classList.add("channel-name");
      nameElem.textContent = channelName;

      channelElem.appendChild(iconElem);
      channelElem.appendChild(nameElem);

      container.appendChild(channelElem);
    }
  });
}

function createMessages(messages) {
  messageContainer.innerHTML =
    "<span style='position:relative;left:40%;transform:translateX(-50%);color:var(--text-m)'>I cant load more then this</span>";

  let lastMessageAuthorId = null;
  let lastMessageAuthorUsername = null;
  let lastMessageContainer = null;
  let lastMessageTime = null;
  let lastContentContainer = null;

  for (const message of messages) {
    if (
      message.content == "" &&
      !message.embeds.length &&
      !message.attachments.length
    ) {
      continue;
    }

    // Check if this message has the same author as the last message
    lastMessageTime = !lastMessageTime? 60:lastMessageTime;

    const sameAuthorAsLastMessage =
      lastMessageAuthorId !== null &&
      lastMessageAuthorId !== null &&
      message.author.id === lastMessageAuthorId &&
      message.author.username === lastMessageAuthorUsername;

    if (!sameAuthorAsLastMessage || lastMessageTime > 60) {
      // Create a div element to hold the message
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      messageDiv.setAttribute("data-author-id", message.author.id);

      const messageContentDiv = document.createElement("div");
      messageContentDiv.classList.add("message-content");

      // Create an img element for the user avatar
      const avatarImg = document.createElement("img");
      avatarImg.src = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`;
      avatarImg.alt = `${message.author.username}'s avatar`;
      avatarImg.classList.add("avatar");

      avatarImg.addEventListener("mousedown", function (event) {
        messageMenu(event, messageDiv, "author");
      });

      // Create a span element for the message date
      const dateSpan = document.createElement("h3");
      dateSpan.innerHTML = `${message.author.username}  <span>${timeDifference(
        new Date().valueOf(),
        new Date(message.timestamp).getTime()
      )}</span>`;
      dateSpan.classList.add("message-head");
      dateSpan.setAttribute("data-message-timestamp", message.timestamp);

      // Create a p element for the message content
      const contentP = document.createElement("p");
      contentP.innerHTML = parseMessageContent(message.content);
      contentP.setAttribute("data-author-id", message.author.id);

      // Add the avatar, date, and content elements to the message div
      messageDiv.appendChild(avatarImg);
      messageDiv.appendChild(messageContentDiv);
      messageContentDiv.appendChild(dateSpan);
      messageContentDiv.appendChild(contentP);

      // Add the message div to the message container
      messageContainer.appendChild(messageDiv);

      contentP.addEventListener("mousedown", function (event) {
        messageMenu(event, contentP, "content");
      });

      lastMessageAuthorId = message.author.id;
      lastContentContainer = messageContentDiv;
      lastMessageAuthorUsername = message.author.username;
      lastMessageContainer = messageDiv;
      lastMessageTime = new Date(message.timestamp).getTime() / 1000;

      if (message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          createAttachment(attachment);
        }
      }

      /// EMBEDS

      for (const embed of message.embeds) {
        embedParser(embed, messageContentDiv);
      }
    } else {
      const messageContentDiv =
        lastMessageContainer.querySelector(".message-content");

      // Create a p element for the message content
      const contentP = document.createElement("p");
      contentP.innerHTML = parseMessageContent(message.content);
      contentP.setAttribute("data-author-id", message.author.id);

      for (const embed of message.embeds) {
        embedParser(embed, messageContentDiv);
      }

      // Add the date and content elements to the message div
      messageContentDiv.appendChild(contentP);
      lastMessageAuthorId = message.author.id;
      lastMessageAuthorUsername = message.author.username;

      contentP.addEventListener("mousedown", function (event) {
        messageMenu(event, contentP, "content");
      });

      if (message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          createAttachment(attachment);
        }
      }
    }
  }

  // Scroll to the bottom of the message container
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function createAttachment(attachment) {
  const filename = attachment.filename.toLowerCase();
  if (
    filename.endsWith(".png") ||
    filename.endsWith(".jpg") ||
    filename.endsWith(".webm") ||
    filename.endsWith(".jpeg")
  ) {
    const image = document.createElement("img");
    image.classList.add("message-attachment");
    image.classList.add("image");
    image.alt = attachment.filename;
    image.src = attachment.url;
    image.width = attachment.width;
    image.height = attachment.height;
    messageContainer.appendChild(image);
    image.addEventListener("click",()=>{
      fullImage(image);
    })
  } else if (
    filename.endsWith(".mp4") ||
    filename.endsWith(".mov") ||
    filename.endsWith(".mkv")
  ) {
    const videoHolder = document.createElement("div");
    const videoTimelineHolder = document.createElement("div");
    const videoTimeline = document.createElement("div");
    const videoTimelineOverlay = document.createElement("div");
    const videoPlayEl = document.createElement("div");
    const videoMaximize = document.createElement("div");
    const video = document.createElement("video");

    videoTimelineHolder.classList.add("video-timeline-holder");
    videoTimeline.classList.add("video-timeline");
    videoTimelineOverlay.classList.add("video-timeline-overlay");
    videoHolder.classList.add("message-attachment");
    videoPlayEl.classList.add("video-play");
    videoMaximize.classList.add("video-maximize");
    video.classList.add("video");

    let videoAspectRatio = attachment.width / attachment.height;
    video.src = attachment.url;
    if (attachment.width > 500) {
      video.width = 450;
      video.height = 450 / videoAspectRatio;
    } else {
      video.width = attachment.width;
      video.height = attachment.height;
    }

    messageContainer.appendChild(videoHolder);
    videoHolder.appendChild(videoPlayEl);
    videoHolder.appendChild(videoMaximize);
    videoHolder.appendChild(video);
    videoHolder.appendChild(videoTimelineHolder);
    videoTimelineHolder.appendChild(videoTimeline);
    videoTimelineHolder.appendChild(videoTimelineOverlay);

    videoPlayEl.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        videoPlayEl.style.opacity = 0;
      } else {
        video.pause();
        videoPlayEl.style.opacity = 1;
      }
    });
    videoMaximize.addEventListener("click",() => {
      fullVideo(video);
    })
    video.addEventListener("timeupdate", () => {
      const duration = video.duration;
      const currentTime = video.currentTime;
      const percentage = (currentTime / duration) * 100;
      videoTimeline.style.width = percentage + "%";
    });
    videoTimelineOverlay.addEventListener("mousedown", (event) => {
      const totalWidth = videoTimelineOverlay.offsetWidth;
      const position =
        event.clientX - document.getElementById("center").offsetLeft - 34;
      const percentage = position / totalWidth;
      const newTime = percentage * video.duration;
      video.currentTime = newTime;
    });
  } else {
    let link = document.createElement("a");
    link.classList.add("message-attachment");
    link.classList.add("file-attachment");
    link.href = attachment.url;
    link.target = "_blank";
    link.textContent = attachment.filename;
    messageContainer.appendChild(link);
  }
}

function canUserSeeChannel(channel, user) {
  // Check if the user has the MANAGE_CHANNELS permission, which always grants access to a channel
  if (user.permissions & 0x00000020) {
    return true;
  }

  // Iterate over permission overwrites to check if the user has view permissions
  for (const permission of channel.permission_overwrites) {
    // Check if the permission is for a user and if the user matches
    if (permission.type === 1 && permission.id === user.id) {
      // Check if the user is explicitly denied access
      if (permission.deny & 0x00000400) {
        return false;
      }

      // Check if the user is explicitly granted access
      if (permission.allow & 0x00000400) {
        return true;
      }
    }

    // Check if the permission is for a role that the user has
    if (permission.type === 0 && user.roles.includes(permission.id)) {
      // Check if the role is explicitly denied access
      if (permission.deny & 0x00000400) {
        return false;
      }

      // Check if the role is explicitly granted access
      if (permission.allow & 0x00000400) {
        return true;
      }
    }
  }

  // If no permission overwrites apply, check if the @everyone role has access
  for (const permission of channel.permission_overwrites) {
    if (permission.type === 0 && permission.id === channel.guild_id) {
      if (permission.deny & 0x00000400) {
        return false;
      }

      if (permission.allow & 0x00000400) {
        return true;
      }
    }
  }

  // If no permission overwrites apply and @everyone has no permissions set, default to allowing access
  return true;
}
