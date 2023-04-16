function parseMessageContent(content) {
  const htmlContent = content
    .replace(/```(.+?)```/gs, "<pre><code>$1</code></pre>") // code blocks
    .replace(/`(.*?)`/gs, "<code>$1</code>") // inline code
    .replace(/~~(.+?)~~/gs, "<del>$1</del>") // strikethrough
    .replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>") // bold
    .replace(
      /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    ) // links
    .replace(/\*(.+?)\*/gs, "<em>$1</em>") // italic
    .replace(/__(.+?)__/gs, "<u>$1</u>") // underline
    .replace(/<@!?(\d+)>/g, '<span class="mention-span">@$1</span>') // mentions
    .replace(/<@&(\d+)>/g, '<span class="role-span">@$1</span>') // role mentions
    .replace(/<#(\d+)>/g, '<span class="channel-span">#$1</span>') // channel mentions
    .replace(
      /<a?:\w+:(\d+)>/g,
      '<img class="emoji" src="https://cdn.discordapp.com/emojis/$1.gif" />'
    ); // emojis
  return htmlContent;
}
function parseMessageEmbeds(content) {
  const htmlContent = content
    .replace(/```(.+?)```/gs, "<pre><code>$1</code></pre>") // code blocks
    .replace(/`(.*?)`/gs, "<code>$1</code>") // inline code
    .replace(/~~(.+?)~~/gs, "<del>$1</del>") // strikethrough
    .replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>") // bold
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    ) // links
    .replace(/\*(.+?)\*/gs, "<em>$1</em>") // italic
    .replace(/__(.+?)__/gs, "<u>$1</u>") // underline
    .replace(/<@!?(\d+)>/g, '<span class="mention-span">@$1</span>') // mentions
    .replace(/<#(\d+)>/g, '<span class="channel-span">#$1</span>') // channel mentions
    .replace(
      /<a?:\w+:(\d+)>/g,
      '<img class="emoji" src="https://cdn.discordapp.com/emojis/$1.gif" />'
    ); // emojis
  return htmlContent;
}

function timeDifference(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

function embedParser(embed, messageContentDiv) {
  const embedContainerDiv = document.createElement("div");
  embedContainerDiv.classList.add("embed-container");

  if (embed.thumbnail) {
    const embedThumbnailImg = document.createElement("img");
    embedThumbnailImg.classList.add("embed-thumbnail");
    embedThumbnailImg.src = embed.thumbnail.url;
    embedThumbnailImg.width = 80;
    embedContainerDiv.appendChild(embedThumbnailImg);
    embedThumbnailImg.onclick = () => {
      fullImage(embedThumbnailImg);
    };
  }

  if (embed.author) {
    // Create a div element for the embed author
    const embedAuthorDiv = document.createElement("div");
    embedAuthorDiv.classList.add("embed-author");

    // Create an img element for the author icon
    const authorIconImg = document.createElement("img");
    authorIconImg.src = embed.author.icon_url;
    authorIconImg.alt = `${embed.author.name}'s icon`;
    authorIconImg.classList.add("author-icon");

    // Create a span element for the author name
    const authorNameSpan = document.createElement("span");
    authorNameSpan.innerText = embed.author.name;
    authorNameSpan.classList.add("author-name");

    // Add the author icon and name to the author div
    embedAuthorDiv.appendChild(authorIconImg);
    embedAuthorDiv.appendChild(authorNameSpan);

    // Add the author div to the embed container
    embedContainerDiv.appendChild(embedAuthorDiv);
  }

  const embedTitleDiv = document.createElement("div");
  embedTitleDiv.classList.add("embed-title");

  if (embed.title) {
    const embedTitle = document.createElement("h3");
    embedTitle.textContent = embed.title;
    embedTitleDiv.appendChild(embedTitle);
  }

  embedContainerDiv.appendChild(embedTitleDiv);

  if (embed.description) {
    const embedDescriptionDiv = document.createElement("div");
    embedDescriptionDiv.classList.add("embed-description");
    embedDescriptionDiv.innerHTML = parseMessageEmbeds(embed.description);
    embedContainerDiv.appendChild(embedDescriptionDiv);
  }

  if (embed.fields && embed.fields.length > 0) {
    for (const field of embed.fields) {
      let fieldContainer = document.createElement("div");
      fieldContainer.classList.add("embed-field-container");
      field.inline ? fieldContainer.classList.add("embed-field-inline") : "";

      let fieldName = document.createElement("h4");
      fieldName.innerHTML = parseMessageEmbeds(field.name);

      let fieldValue = document.createElement("span");
      fieldValue.innerHTML = parseMessageEmbeds(field.value);

      // Add the field name and value elements to the field container
      fieldContainer.appendChild(fieldName);
      fieldContainer.appendChild(fieldValue);

      // Add the field container to the embed container
      embedContainerDiv.appendChild(fieldContainer);
    }
  }

  // Create a div element for the embed body
  const embedBodyDiv = document.createElement("div");
  embedBodyDiv.classList.add("embed-body");

  if (embed.image) {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("embed-image-container");
    const image = document.createElement("img");
    image.src = embed.image.url;
    imageContainer.appendChild(image);
    embedContainerDiv.appendChild(imageContainer);
  }

  if (embed.video) {
    if (embed.video.url.startsWith("https://www.youtube.com/embed/")) {
      const youtubeEmbed = document.createElement("iframe");
      youtubeEmbed.src = embed.video.url;
      youtubeEmbed.setAttribute("frameborder", 0);
      youtubeEmbed.classList.add("video");
      embedContainerDiv.appendChild(youtubeEmbed);
    } else {
      const videoHolder = document.createElement("div");
      const videoTimelineHolder = document.createElement("div");
      const videoTimeline = document.createElement("div");
      const videoTimelineOverlay = document.createElement("div");
      const videoMaximize = document.createElement("div");
      const videoPlayEl = document.createElement("div");
      const video = document.createElement("video");

      videoTimelineHolder.classList.add("video-timeline-holder");
      videoTimeline.classList.add("video-timeline");
      videoTimelineOverlay.classList.add("video-timeline-overlay");
      videoHolder.classList.add("embed-video");
      videoMaximize.classList.add("video-maximize");
      videoPlayEl.classList.add("video-play");
      video.classList.add("video");

      let videoAspectRatio = embed.video.width / embed.video.height;
      video.src = embed.video.url;
      if (embed.video.width > 500) {
        video.width = 450;
        video.height = 450 / videoAspectRatio;
      } else {
        video.width = embed.video.width;
        video.height = embed.video.height;
      }

      embedContainerDiv.appendChild(videoHolder);
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
      videoMaximize.addEventListener("click", () => {
        fullVideo(video);
      });
      video.addEventListener("timeupdate", () => {
        const duration = video.duration;
        const currentTime = video.currentTime;
        const percentage = (currentTime / duration) * 100;
        videoTimeline.style.width = percentage + "%";
      });
      videoTimelineOverlay.addEventListener("mousedown", (event) => {
        const totalWidth = videoTimelineOverlay.offsetWidth;
        const position =
          event.clientX - document.getElementById("center").offsetLeft - 70;
        const percentage = position / totalWidth;
        const newTime = percentage * video.duration;
        video.currentTime = newTime;
      });
    }
  }

  // Check if the embed has a footer
  if (embed.footer && embed.footer.text) {
    // Create a div element for the embed footer
    const embedFooterDiv = document.createElement("div");
    embedFooterDiv.classList.add("embed-footer");

    const embedFooterImg = document.createElement("img");
    embedFooterImg.src = embed.footer.icon_url;
    embedFooterImg.width = 10;

    // Create a span element for the footer text
    const footerTextSpan = document.createElement("span");
    footerTextSpan.innerHTML = parseMessageContent(embed.footer.text);
    footerTextSpan.classList.add("embed-footer-text");

    // Add the footer text to the embed footer
    embedFooterDiv.appendChild(embedFooterImg);
    embedFooterDiv.appendChild(footerTextSpan);

    // Add the embed footer to the embed body
    embedBodyDiv.appendChild(embedFooterDiv);
  }

  // Add the embed body to the embed container
  embedContainerDiv.appendChild(embedBodyDiv);

  if (embed.color) {
    // Removing this sometimes just breaks it idk why
    embedContainerDiv.style.borderLeft = `5px solid #${
      embed.color.toString(16).padStart(6, "0") || "fff"
    }`;
  }

  // Add the embed container to the message content div
  messageContentDiv.appendChild(embedContainerDiv);
}
